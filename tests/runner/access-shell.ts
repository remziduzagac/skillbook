import { basename, posix } from "node:path";
import { expand_braces, fullPath, reader_operands, skill_name, unwrap, words } from "./shell";

export interface ShellAccess {
  skill: string; file: string; operation: "read" | "search" | "unknown";
  from?: number; count?: number; whole_file?: boolean;
}
// Split only shell operators outside quotes. Substitutions and opaque wrappers stay unsupported.
function segments(command: string): string[] {
  const parts: string[] = [];
  let quote = "", part = "";
  for (let i = 0; i < command.length; i++) {
    const c = command[i]!;
    if (c === "\\") { part += c + (command[++i] ?? ""); continue; }
    if (quote) { part += c; if (c === quote) quote = ""; continue; }
    if (c === "'" || c === '"') { quote = c; part += c; continue; }
    if (/[;&|\n]/.test(c)) { if (part.trim()) parts.push(part); part = ""; }
    else part += c;
  }
  if (part.trim()) parts.push(part);
  return parts;
}
function executable(tokens: string[]) {
  const w = tokens.slice();
  while (/^[A-Za-z_][A-Za-z0-9_]*=/.test(w[0] ?? "")) w.shift();
  if (basename(w[0] ?? "") === "env") {
    w.shift();
    while (w.length) {
      if (["-u", "--unset"].includes(w[0]!)) { w.splice(0, 2); continue; }
      if (["-i", "--ignore-environment", "--"].includes(w[0]!) ||
        /^[A-Za-z_][A-Za-z0-9_]*=/.test(w[0]!)) { w.shift(); continue; }
      break;
    }
  }
  return w;
}
function searchOperands(program: string, args: string[]) {
  const paths: string[] = [];
  let pattern = args.some(w => ["--files", "-e", "--regexp", "-f", "--file"].includes(w) || /^-[ef].+/.test(w));
  const values = new Set(["-e", "--regexp", "-f", "--file", "-g", "--glob", "--iglob", "-A", "-B", "-C",
    "--after-context", "--before-context", "--context", "-m", "--max-count", "--color", "--type", "-t", "-T"]);
  let options = true;
  for (let i = 0; i < args.length; i++) {
    const word = args[i]!;
    if (options && word === "--") { options = false; continue; }
    if (options && values.has(word)) { i++; continue; }
    if (options && word.startsWith("-")) continue;
    if (!pattern && ["rg", "grep"].includes(program)) { pattern = true; continue; }
    paths.push(word);
  }
  return paths;
}
export function shellAccesses(command: string, set = "essentials"): ShellAccess[] {
  const sequential = !/[;|<>\n]|(?<!&)&(?!&)/.test(command);
  command = expand_braces(unwrap(command));
  if (/`|\$\(|[<>]/.test(command)) return [];
  const result: ShellAccess[] = [];
  let cwd = "";
  for (const segment of segments(command)) {
    let w: string[];
    try { w = executable(words(segment)); } catch { continue; }
    const program = basename(w[0] ?? "");
    if (program === "cd") { cwd = posix.normalize(posix.join(cwd, w[1] ?? "")); continue; }
    const search = ["rg", "grep"].includes(program);
    const operands = search ? searchOperands(program, w.slice(1)) : reader_operands(w);
    for (const operand of operands) {
      const file = operand.startsWith("/") ? operand : posix.join(cwd, operand);
      const match = [...file.matchAll(fullPath)].find(m => m.index! + m[0].length === file.length);
      const name = match ? skill_name(match[1]!, match[2]!) : skill_name(set, file);
      if (!name) continue;
      const range = program === "sed" ? w.join(" ").match(/sed -n (\d+),(\d+)p/) : null;
      const fullReader = ["nl", "awk", "bat"].includes(program) || program === "cat" &&
        w.slice(1).every(word => !word.startsWith("-") || ["--", "-n", "-b"].includes(word)) ||
        program === "sed" && (w[1] === "" || w[1] === "-n" && w[2] === "1,$p");
      result.push({ skill: name, file, operation: search ? "search" : "read",
        ...(range ? { from: Number(range[1]), count: Number(range[2]) - Number(range[1]) + 1 } : {}),
        whole_file: sequential && fullReader });
    }
  }
  return result;
}
