import { basename } from "node:path";
export function skill_name(set: string, rel: string): string | null {
  if (rel === "SKILL.md") return set;
  if (
    rel.startsWith("references/") &&
    rel.endsWith(".md") &&
    !rel.split("/").some((x) => ["assets", "scripts"].includes(x))
  )
    return rel.slice(11, -3).replaceAll("/", "-");
  return null;
}
export function expand_braces(text: string) {
  return text.replace(/([^\s'"{}]*)\{([^{}\s]*,[^{}\s]*)\}([^\s'"{}]*)/g, (_, a, b, c) =>
    b
      .split(",")
      .map((x: string) => a + x + c)
      .join(" "),
  );
}
export function words(text: string): string[] {
  const out: string[] = [];
  let token = "",
    quote = "",
    active = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (c === "\\" && quote !== "'") {
      if (i + 1 >= text.length) throw Error("unfinished escape");
      token += text[++i];
      active = true;
    } else if (quote) {
      if (c === quote) quote = "";
      else token += c;
      active = true;
    } else if (c === '"' || c === "'") {
      quote = c;
      active = true;
    } else if (/\s/.test(c)) {
      if (active) out.push(token);
      token = "";
      active = false;
    } else {
      token += c;
      active = true;
    }
  }
  if (quote) throw Error("unfinished quote");
  if (active) out.push(token);
  return out;
}
export function unwrap(command: string) {
  const m = command.trim().match(/^\S*(?:sh|bash|zsh)\s+-l?c\s+(['"])([\s\S]*)\1$/);
  return (m ? m[2]! : command).replace(/\s*(?:[12]?>>?\s*\/dev\/null|2>&1)(?=\s|$|[;&|)])/g, "");
}
export function reader_operands(input: string[]): string[] {
  if (!input.length) return [];
  const program = basename(input[0]!),
    args = input.slice(1);
  if (!["cat", "sed", "head", "tail", "nl", "awk", "bat"].includes(program)) return [];
  if (program === "sed") {
    const quiet = args[0] === "-n";
    if (quiet) args.shift();
    const script = args.shift();
    if (script === undefined || (quiet && !script) || !/^(?:\d+(?:,(?:\d+|\$))?p)?$/.test(script)) return [];
  } else if (program === "awk" && args.shift() !== "1") return [];
  const allowed: Record<string, string[]> = {
    cat: ["-n", "-b", "-s", "-v", "-A", "-E", "-T"],
    nl: ["-ba", "-bt", "-bn"],
    bat: ["-p", "--plain", "--paging=never"],
  };
  const operands: string[] = [];
  while (args.length) {
    const word = args.shift()!;
    if (word === "--") return [...operands, ...args];
    if (["head", "tail"].includes(program) && ["-n", "-c"].includes(word)) {
      const count = args.shift() ?? "";
      if (!/^\d+$/.test(count) || Number(count) === 0) return [];
    } else if (word.startsWith("-")) {
      if (!allowed[program]?.includes(word)) return [];
    } else operands.push(word);
  }
  return operands;
}
export const fullPath = /skills\/([a-z][a-z0-9-]*)\/(SKILL\.md|references\/[a-z0-9/_-]+\.md)/g;
export function reads_in_command(command: string, set: string): Set<string | null> {
  command = expand_braces(unwrap(command));
  if (/`|\$\(|(?<!&)&(?!&)/.test(command)) return new Set();
  command = command.split(/[;\n]/).at(-1)!;
  let steps = command.split("&&");
  if (command.includes("||"))
    steps = command
      .slice(command.lastIndexOf("||") + 2)
      .split("&&")
      .slice(1);
  command = steps.filter((s) => !/[|<>]/.test(s)).join(" && ");
  const found = new Set<string | null>();
  let cdSet: string | null = null,
    base: string | null = null;
  for (const segment of command.split(/&&|\|\||;|\||\n/).map((x) => x.trim())) {
    let tokens: string[];
    try {
      tokens = words(segment);
    } catch {
      continue;
    }
    if (!tokens.length) continue;
    if (tokens[0] === "cd") {
      const cd = segment.match(/^cd\s+['"]?[^\s'"]*?skills\/([a-z][a-z0-9-]*)((?:\/[a-z0-9_-]+)*)\/?['"]?$/);
      cdSet = cd?.[1] ?? null;
      base = cd?.[2]?.replace(/^\/+|\/+$/g, "") ?? null;
      continue;
    }
    for (const token of reader_operands(tokens)) {
      const full = [...token.matchAll(fullPath)][0];
      if (full && full.index! + full[0].length === token.length) {
        found.add(skill_name(full[1]!, full[2]!));
        continue;
      }
      if (!/^(?:(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.md|SKILL\.md)$/.test(token)) continue;
      if (cdSet !== null) found.add(skill_name(cdSet, base && token !== "SKILL.md" ? `${base}/${token}` : token));
      else if (token === "SKILL.md" || token.startsWith("references/")) found.add(skill_name(set, token));
    }
  }
  return found;
}
export function segment_effect(input: string[]): string {
  let w = input.slice();
  if (w[0] === "do") w = w.slice(1);
  if (w.join(" ") === "done" || (w[0] === "for" && w[2] === "in")) return "read";
  while (w.length && /^[A-Za-z_][A-Za-z0-9_]*=\S*$/.test(w[0]!)) w.shift();
  if (!w.length || (w[0] === "cd" && w.length <= 2)) return "read";
  const p = basename(w[0]!);
  if (
    ["rm", "mv", "cp", "mkdir", "touch", "tee", "truncate", "ln", "apply_patch"].includes(p) ||
    (p === "sed" && w.slice(1).some((x) => x.startsWith("-i")))
  )
    return "write";
  if (reader_operands(w).length || ["pwd", "ls", "true", "false", "wc", "grep", "echo", "printf"].includes(p))
    return "read";
  if (p === "rg" && !w.slice(1).some((x) => x.startsWith("--pre"))) return "read";
  if (
    p === "find" &&
    !w
      .slice(1)
      .some((x) => ["-exec", "-execdir", "-delete", "-fprint", "-fprintf", "-fls", "-ok", "-okdir"].includes(x))
  )
    return "read";
  if (p === "git" && ["status", "diff", "log", "show"].includes(w[1] ?? "") && !w.join(" ").includes("--output"))
    return "read";
  if (p === "sed" && w.slice(1).some((x) => /(^|[;}\s])w\s/.test(x))) return "unknown";
  if (["sed", "nl", "head", "tail", "cat", "awk"].includes(p)) return "read";
  return "unknown";
}
export function command_effect(command: string): string {
  command = unwrap(command);
  if (/[\n`]|\$\(/.test(command)) return "unknown";
  // Tokenize shell punctuation outside quotes, preserving program strings as one word.
  const segments: string[] = [];
  let current = "",
    quote = "";
  for (let i = 0; i < command.length; i++) {
    const c = command[i]!;
    if (c === "\\") {
      current += c + (command[++i] ?? "");
      continue;
    }
    if (quote) {
      current += c;
      if (c === quote) quote = "";
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      current += c;
      continue;
    }
    if (/[&|;<>()[\]]/.test(c)) {
      let op = c;
      while (i + 1 < command.length && /[&|;<>()]/.test(command[i + 1]!)) op += command[++i];
      if (!["&&", "||", ";", "|"].includes(op)) return "unknown";
      segments.push(current);
      current = "";
    } else current += c;
  }
  segments.push(current);
  let effects: string[];
  try {
    effects = segments.map((x) => segment_effect(words(x)));
  } catch {
    return "unknown";
  }
  return effects.includes("write") ? "write" : effects.every((x) => x === "read") ? "read" : "unknown";
}
