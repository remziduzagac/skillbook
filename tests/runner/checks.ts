import { finalAnswer } from "./answers";
import { readFileSync, existsSync, statSync, realpathSync, readdirSync } from "node:fs";
import { join, resolve, relative, posix } from "node:path";
import { tmpdir } from "node:os";
import { matches, regex } from "./regex";
import { skillFiles, walk } from "./inventory";
import { REPO, FIXTURES } from "./paths";
import type { Checks, Observation, Verdict } from "./types";
const words = new Set<string>(),
  parents = new Set<string>();
for (const [name, path] of skillFiles())
  if (path.startsWith(join(REPO, "skills") + "/")) {
    const named = [name, ...[...readFileSync(path, "utf8").matchAll(/`([a-z][a-z0-9-]*)` skill/g)].map((x) => x[1]!)];
    for (const n of named) {
      for (const part of n.split("-")) words.add(part);
      if (n.includes("-")) parents.add(n.split("-")[0]!);
    }
  }
const names = [...words].sort((a, b) => b.length - a.length || a.localeCompare(b)).join("|"),
  parent = [...parents].sort().join("|") || "(?!)";
const rare = "guardrails|rightsize|stakes|clarify",
  quote = "[`'\"’]?",
  verbs = "needs?|needed|loads?|loaded|loading|reads?|reading|uses?|used|using|follows?|followed|following";
const talk = regex(
  [
    `\\b(?:${parent})-[a-z]`,
    `\\b(?:${names})${quote}(?:\\s+|-)skills?\\b`,
    "`[a-z][\\w-]*`\\s+skills?\\b",
    "\\b(?:referenced|loaded)\\s+(?:\\S+\\s+)?skills?\\b",
    `\\b(?:essentials|${rare})${quote}\\s+(?:references?|guidance|instructions)\\b|\\bessentials${quote}\\s+set\\b`,
    `\\b(?:${verbs})\\s+(?:the\\s+)?${quote}(?:${rare})\\b`,
    `\\b(?:${verbs})\\s+(?:the\\s+)?(?:${quote}[\\w-]+${quote}` +
      `(?:,\\s*|\\s+and\\s+)){1,3}${quote}(?:guardrails|rightsize|clarify)\\b`,
    "\\b(?:loads?|loaded|loading)\\s+(?:the\\s+)?(?:required\\s+)?essentials\\b",
    `\\bSKILL\\.md\\b|\\breferences/[\\w./-]*\\.md\\b|\\b(?:${parent})(?:/[\\w-]+)*\\.md\\b|\\bskills/[a-z][\\w-]*/`,
  ].join("|"),
);
const essentials = /(?:the\s+)?[`'"’]?essentials[`'"’]?(?:\s+skill)?/gi;
export function names_skill(answer: string, agent?: string | null) {
  if (regex(essentials.source + "\\s+rules?\\b").test(answer)) return true;
  if (agent === "codex") {
    const lines = answer.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!,
        rest = line.replace(essentials, "");
      if (
        line.length <= 200 &&
        regex(
          "\\b(load|loading|use|using|read|reading|follow|following|apply|applying|open|opening)" +
            "\\b[^.\\n]{0,40}\\bessentials\\b",
        ).test(line) &&
        !/\b(because|since|so that|requires?|says|forbids?|prohibits?|allows?|must)\b/i.test(line) &&
        !talk.test(rest)
      ) {
        lines.splice(i, 1);
        answer = lines.join("\n");
        break;
      }
    }
  }
  return talk.test(answer);
}
export const written = (changes: string[]) =>
  changes.filter((c) => c.startsWith("changed ") || c.startsWith("added ")).map((c) => c.slice(c.indexOf(" ") + 1));
export function named_paths(answer: string, cap = 200): string[] {
  const found: string[] = [],
    roots = [tmpdir(), "/tmp", "/var/tmp"].map((x) => resolve(x));
  for (const name of new Set(
    [...answer.matchAll(/(?<![\w.~$/-])\/[\w.@%+-]+(?:\/[\w.@%+-]+)*\/?/g)].map((m) => m[0].replace(/[.,:;]+$/, "")),
  )) {
    try {
      const real = realpathSync(name);
      if (!roots.some((root) => real !== root && !relative(root, real).startsWith("..")) || !existsSync(name)) continue;
      const dir = statSync(name).isDirectory();
      found.push(name.replace(/\/$/, "") + (dir ? "/" : ""));
      function below(folder: string): boolean {
        for (const entry of readdirSync(folder, { withFileTypes: true })) {
          if (found.length >= cap) return false;
          const child = join(folder, entry.name);
          found.push(child + (entry.isDirectory() ? "/" : ""));
          if (entry.isDirectory() && !below(child)) return false;
        }
        return true;
      }
      if (dir && !below(name)) return found;
    } catch {
      continue;
    }
  }
  return found;
}
export function check(
  checks: Checks,
  result: Partial<Observation>,
  fixture?: string | null,
  tmp: string[] | null = null,
): Record<string, Verdict> {
  const out: Record<string, Verdict> = {},
    delta = result.changes ?? [],
    answer = result.answer ?? "",
    paths = written(delta);
  for (const n of checks.reads ?? []) out[`reads ${n}`] = (result.reads ?? []).includes(n);
  for (const n of checks.reads_not ?? [])
    out[`no supported read observed for ${n}`] = !(result.reads ?? []).includes(n);
  if (checks.no_changes) out["no changes"] = !delta.length;
  for (const p of checks.unchanged ?? []) out[`unchanged ${p}`] = !delta.some((c) => c.slice(c.indexOf(" ") + 1) === p);
  for (const p of checks.absent ?? []) out[`absent ${p}`] = result.paths_present?.[p] == null ? null : !result.paths_present[p];
  for (const p of checks.removed ?? []) out[`removed ${p}`] = delta.includes(`removed ${p}`);
  for (const p of checks.changed ?? []) out[`changed ${p}`] = paths.includes(p);
  const stated = checks.states_before_change;
  if (stated) {
    const before = result.before_change ?? "",
      said = before.trim().length >= 80;
    for (const [name, found] of [
      ["text before its first change", said],
      ...(Array.isArray(stated) ? stated : []).map((p) => [
        `text before its first change has /${p}/`,
        said && matches(p, before),
      ]),
    ] as [string, boolean][])
      out[name] = !result.changed_files || found ? true : result.sequencing_unknown ? null : false;
  }
  if (checks.only_changed?.length) {
    const allowed = [...checks.only_changed].sort();
    out[`nothing changed but ${allowed.join(", ")}`] = delta.every((c) =>
      allowed.includes(c.slice(c.indexOf(" ") + 1)),
    );
  }
  for (const [p, patterns] of Object.entries(checks.file_contains ?? {}))
    for (const pattern of patterns) out[`${p} keeps /${pattern}/`] = matches(pattern, result.files?.[p] ?? "");
  for (const p of checks.shorter ?? []) {
    const text = result.files?.[p],
      original = result.baseline_files ? result.baseline_files[p] :
        fixture ? readFileSync(join(FIXTURES, fixture, p), "utf8") : undefined;
    out[`${p} shorter`] = text == null || original == null ? null : text.length < original.length;
  }
  const baseline = (p: string): string | undefined => {
    if (result.baseline_files) return result.baseline_files[p];
    try { return fixture ? readFileSync(join(FIXTURES, fixture, p), "utf8") : undefined; }
    catch { return undefined; }
  };
  const availableFile = (p: string) => result.files?.[p] != null &&
    !/^\((?:content withheld:|binary file,|symlink to )/.test(result.files[p]!);
  const missingFile = (p: string) => result.project_snapshot && !(p in result.project_snapshot) ? false : null;
  for (const [p, limit] of Object.entries(checks.words_under ?? {})) {
    const text = availableFile(p) ? result.files![p] : null;
    out[`${p} has fewer than ${limit} words`] = text == null ? missingFile(p) :
      (text.trim() ? text.trim().split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length : 0) < limit;
  }
  for (const [p, replacement] of Object.entries(checks.only_replacement ?? {})) {
    const before = baseline(p), after = result.files?.[p];
    out[`${p} changes only ${JSON.stringify(replacement.from)} to ${JSON.stringify(replacement.to)}`] =
      before == null || !availableFile(p) ? missingFile(p) : before.includes(replacement.from) &&
        before !== after && after === before.split(replacement.from).join(replacement.to);
  }
  for (const folder of checks.unchanged_under ?? []) {
    const prefix = folder.replace(/\/$/, "") + "/";
    const before = result.baseline_snapshot, after = result.project_snapshot;
    out[`every file under ${folder} unchanged`] = !before || !after ? null :
      Object.keys(before).some(p => p.startsWith(prefix)) && [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(p => p.startsWith(prefix))
        .every(p => before[p] === after[p]);
  }
  for (const [index, spec] of Object.entries(checks.index_links ?? {})) {
    const folder = typeof spec === "string" ? spec : spec.folder;
    const key = `${index} links reach every page under ${folder}`;
    const candidates = index === "*" ? paths.filter(p => /\.md$/i.test(p)) : [index];
    if (!result.project_snapshot || index === "*" && !result.changes) { out[key] = null; continue; }
    const verdicts = candidates.map((index): Verdict => {
      const text = availableFile(index) ? result.files![index] : null, snapshot = result.project_snapshot;
      const prefix = folder.replace(/\/$/, "") + "/";
      if (text == null) return missingFile(index);
      if (typeof spec !== "string" && !(spec.contains ?? []).every(pattern => matches(pattern,text))) return false;
      const markdown = text.replace(/<!--[\s\S]*?-->/g, "")
        .replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*$/gm, "")
        .replace(/(`+)[^`]*?\1/g, "");
      const references = new Map([...markdown.matchAll(/^\s{0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?/gm)]
        .map(m => [m[1]!.toLowerCase(), m[2]!]));
      const body = markdown.replace(/!\[[^\]]*\](?:\([^)]*\)|\[[^\]]*\])?/g, "")
        .replace(/^\s{0,3}\[[^\]]+\]:[^\n]*$/gm, "")
        .replace(/^(?: {4}|\t)[^\n]*$/gm, "");
      const destinations = [...body.matchAll(/(?<!!)\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\)/g)]
        .map(m => m[1]!);
      for (const m of body.matchAll(/(?<!!)\[([^\]]+)\](?:\[([^\]]*)\])?(?!\()/g)) {
        const ref = references.get((m[2] || m[1]!).toLowerCase());
        if (ref) destinations.push(ref);
      }
      const reached = new Set(destinations.flatMap(href => {
        if (/^(?:[a-z]+:|\/)/i.test(href)) return [];
        try { return [posix.normalize(posix.join(posix.dirname(index), decodeURIComponent(href.split(/[?#]/)[0]!)))]; }
        catch { return []; }
      }));
      const pages = Object.keys(snapshot).filter(p => p.startsWith(prefix) && p !== index && /\.md$/i.test(p));
      return pages.length > 0 && pages.every(p => reached.has(p));
    });
    out[key] = verdicts.includes(true) ? true : verdicts.includes(null) ? null : false;
  }
  for (const p of checks.keeps_lines ?? []) {
    const before = baseline(p), after = result.files?.[p];
    let position = 0;
    const lines = after?.split("\n") ?? [];
    out[`${p} keeps its earlier lines`] = before == null || !availableFile(p) ? missingFile(p) :
      before.replace(/\n$/, "").split("\n").every(line => {
        const found = lines.indexOf(line, position); position = found + 1; return found >= 0;
      });
  }
  for (const [folder, patterns] of Object.entries(checks.folder_contains ?? {})) {
    const texts = Object.entries(result.files ?? {}).filter(([p]) => p.startsWith(folder.replace(/\/$/, "") + "/"));
    for (const pattern of patterns) out[`pages under ${folder} contain /${pattern}/`] = !result.files ? null :
      texts.some(([, value]) => matches(pattern, value ?? ""));
  }
  for (const [folder, least] of Object.entries(checks.written_under ?? {}))
    out[`at least ${least} files written under ${folder}`] = paths.filter((p) => p.startsWith(folder)).length >= least;
  for (const [folder, patterns] of Object.entries(checks.folder_lacks ?? {}))
    for (const p of patterns)
      out[`files written under ${folder} lack /${p}/`] = !Object.entries(result.files ?? {}).some(
        ([path, text]) => path.startsWith(folder) && matches(p, text ?? ""),
      );
  if (checks.nothing_left_running)
    out["nothing left running"] = result.left_running == null ? null : result.left_running.length === 0;
  for (const p of checks.tmp_has ?? []) {
    const key = `temporary folder has /${p}/`;
    out[key] = tmp === null ? result.tmp_checks?.[key] ?? null : tmp.some((x) => matches(p, x));
  }
  for (const p of checks.tmp_lacks ?? []) {
    const key = `temporary folder lacks /${p}/`;
    out[key] = tmp === null ? result.tmp_checks?.[key] ?? null : !tmp.some((x) => matches(p, x));
  }
  for (const p of checks.answer_contains ?? []) out[`answer has /${p}/`] = matches(p, answer);
  for (const p of checks.answer_not_contains ?? []) out[`answer lacks /${p}/`] = !matches(p, answer);
  if (checks.names_no_skill) out["answer names no skill or skill file"] = result.turns?.length ?
    result.turns.every((turn: Observation) => !names_skill(finalAnswer(turn), typeof turn.final_answer === "string" ? undefined : result.agent)) : !names_skill(finalAnswer(result), typeof result.final_answer === "string" ? undefined : result.agent);
  for (const p of checks.agent_started_or_answer ?? [])
    out[`an agent was started, or the answer has /${p}/`] =
      result.agents_started || matches(p, answer) ? true : result.agents_unseen ? null : false;
  for (const p of checks.answer_path_has ?? [])
    out[`a temporary path the answer names holds /${p}/`] = named_paths(answer).some((x) => matches(p, x));
  for (const p of checks.actions_lack ?? [])
    out[`no action matches /${p}/`] = !(result.targets ?? []).some((x) => matches(p, x));
  return out;
}
