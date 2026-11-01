// Compatibility only: these assertions do not establish measured delivery.
import { readFileSync } from "node:fs";
import { skillFiles } from "./inventory";
import { fullPath, reads_in_command, skill_name } from "./shell";
import type { Agent, Event } from "./types";
import { message_blocks } from "./trace";
const ends = Object.fromEntries(
  skillFiles().flatMap(([name, path]) => {
    const lines = readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((x) => x.trimEnd())
      .filter((x) => x.trim());
    const heading = lines.find((x) => x.startsWith("# "));
    return heading ? [[name, [heading, lines.at(-1)!]]] : [];
  }),
);
export function skills_printed(output: string, endpoints: Record<string, string[]> = ends) {
  const lines = new Set(output.split(/\r?\n/).map((x) => x.trimEnd()));
  return new Set(
    Object.entries(endpoints)
      .filter(([, e]) => e.every((x) => lines.has(x)))
      .map(([n]) => n),
  );
}
export function skills_read(agent: Agent, events: Event[][], _home: unknown, set: string, endpoints: Record<string, string[]> = ends) {
  const found = new Set<string | null>(),
    all = events.flat(),
    succeeded = new Set(),
    outputs: Record<string, string> = {};
  for (const e of all)
    if (agent === "claude" && e.type === "user")
      for (const b of message_blocks(e))
        if (b.type === "tool_result" && !b.is_error) {
          succeeded.add(b.tool_use_id);
          outputs[b.tool_use_id] =
            typeof b.content === "string" ? b.content : (b.content ?? []).map((x: Event) => x.text ?? "").join("\n");
        }
  for (const e of all) {
    if (agent === "claude" && e.type === "assistant")
      for (const b of message_blocks(e)) {
        if (b.type !== "tool_use" || !succeeded.has(b.id)) continue;
        if (b.name === "Skill") found.add((b.input?.skill ?? "").split(":").at(-1));
        else if (b.name === "Bash") {
          for (const n of reads_in_command(b.input?.command ?? "", set)) found.add(n);
          for (const n of skills_printed(outputs[b.id] ?? "", endpoints)) found.add(n);
        } else if (["Read", "View"].includes(b.name))
          for (const m of JSON.stringify(b.input).matchAll(fullPath)) found.add(skill_name(m[1]!, m[2]!));
      }
    if (agent === "codex" && e.type === "item.completed" && e.item?.type === "command_execution") {
      if (e.item.exit_code === 0) for (const n of reads_in_command(e.item.command ?? "", set)) found.add(n);
      for (const n of skills_printed(e.item.aggregated_output ?? "", endpoints)) found.add(n);
    }
  }
  found.delete(null);
  found.delete("");
  return new Set([...found] as string[]);
}
