import { readFileSync } from "node:fs";
import { skillFiles } from "./inventory";
import { command_effect, fullPath, skill_name } from "./shell";
import { shellAccesses } from "./access-shell";
import type { Agent, Event } from "./types";
import type { CodexRetention } from "./codex-retention";

export const READER_VERSION = "access-3";
export const frozenSkills = () => Object.fromEntries(skillFiles().map(([name, path]) => [name, readFileSync(path, "utf8")]));
export interface Access {
  skill: string; file: string; tool: string; call: string; turn: number;
  start: number; result: number | null; success: boolean | null; call_success?: boolean | null;
  operation: "read" | "search" | "load" | "unknown"; extent: "whole" | "partial" | "unknown";
  truncated: boolean; timing: "before" | "after" | "unknown" | "no change";
  evidence: string; reader: string; reason?: string;
}
export interface AccessTurn {
  turn: number; records: Access[]; complete: boolean; prior_whole?: string[]; first_attempt: number | null;
  change_confirmed: boolean; change_unknown: boolean; reader: string;
  first_opaque?: number | null; session?: string; boundaries?: number[];
  retention?: "observable" | "unknown"; retention_reason?: string;
  retention_evidence?: CodexRetention; context_boundary_unknown?: boolean;
  reused_whole?: { skill: string; turn: number }[];
}
function text(value: any): string {
  return typeof value === "string" ? value : Array.isArray(value) ? value.map(x => x.text ?? "").join("\n") : "";
}
function delivered(output: string, source: string) {
  // Native Read/View and numbered shell output. Never use endpoints as proof of the middle.
  const plain = output.replace(/^\s*\d+(?:\t|→|\|) ?/gm, "").replace(/\r/g, "");
  return !!source.trim() && plain.includes(source.replace(/\r/g, "").trimEnd());
}
function contextBoundary(e: Event) {
  return ["context.compacted", "session.resumed", "thread.resumed"].includes(e.type) ||
    e.type === "system" && ["compact_boundary", "resume"].includes(e.subtype);
}
export function accessTurn(agent: Agent, events: Event[], turn = 1, sources = frozenSkills(), complete = true): AccessTurn {
  const coverage = new Map<string, Set<number>>();
  const records: Access[] = [], calls = new Map<string, { tool: string; input: any; start: number }>();
  const boundaries: number[] = [];
  let attempt: number | null = null, confirmed = false, opaque: number | null = null;
  const change = (tool: string, input: any, order: number, success: boolean | null) => {
    const effect = ["Write", "Edit", "MultiEdit", "NotebookEdit", "file_change"].includes(tool) ? "write" :
      ["Bash", "command_execution"].includes(tool) ? command_effect(input.command ?? "") : "read";
    if (effect === "write") { attempt ??= order; confirmed ||= success === true; }
    if (effect === "unknown") opaque ??= order;
  };
  const record = (id: string, tool: string, input: any, start: number, result: number | null,
    output: string, success: boolean | null) => {
    const command = input.command ?? "", path = input.file_path ?? input.path ?? "";
    const attributed = shellAccesses(command);
    const nativeSkills = [...path.matchAll(fullPath)].map(m => skill_name(m[1]!, m[2]!));
    nativeSkills.push(skill_name("essentials", path));
    const names = new Map<string, string>();
    for (const m of `${path} ${command}`.matchAll(fullPath)) {
      const name = skill_name(m[1]!, m[2]!); if (name) names.set(name, m[0]);
    }
    for (const read of attributed) names.set(read.skill, read.file);
    if (tool === "Skill") names.set(String(input.skill ?? "").split(":").at(-1)!, "Skill delivery");
    // Keep delivered but unattributed text visible without claiming a supported read.
    for (const [name, source] of Object.entries(sources)) if (delivered(output, source)) names.set(name, names.get(name) ?? name);
    for (const [skill, file] of names) {
      const truncated = /(?:output truncated|truncated output|tokens truncated|… truncated)/i.test(output);
      const matching = attributed.filter(a => a.skill === skill), operations = new Set(matching.map(a => a.operation));
      // A successful && chain proves its full-file reader ran; searches cannot erase that delivery.
      const independentRead = success === true && matching.some(a => a.operation === "read" && a.whole_file);
      const operation = ["Grep", "Glob"].includes(tool) ? "search" : tool === "Skill" ? "load" :
        ["Read", "View"].includes(tool) && nativeSkills.includes(skill) ? "read" :
        operations.size === 1 ? matching[0]!.operation : independentRead ? "read" : "unknown";
      let rangesWhole = false;
      if (success && !truncated && operation === "read" && sources[skill]) {
        const from = matching.length === 1 ? matching[0]!.from : input.offset;
        const count = matching.length === 1 ? matching[0]!.count : input.limit;
        if (Number.isInteger(from) && from > 0 && Number.isInteger(count) && count > 0 && names.size === 1) {
          const lines = sources[skill]!.trimEnd().split("\n"), slice = lines.slice(from - 1, from - 1 + count);
          if (slice.length && delivered(output, slice.join("\n"))) {
            const covered = coverage.get(skill) ?? new Set<number>();
            slice.forEach((_, i) => covered.add(from - 1 + i)); coverage.set(skill, covered);
            rangesWhole = lines.every((_, i) => covered.has(i));
          }
        }
      }
      const whole = rangesWhole || ["read", "load"].includes(operation) && result !== null && !truncated && delivered(output, sources[skill] ?? "");
      const extent = whole ? "whole" : output && success === true && ["read", "search"].includes(operation) ? "partial" : "unknown";
      records.push({ skill, file, tool, call: id, turn, start, result, success: whole ? true : success, call_success: success, operation, extent, truncated,
        timing: "unknown", evidence: `turn:${turn}/event:${result ?? start}/call:${id}`, reader: READER_VERSION,
        ...(!whole ? { reason: success !== true ? "missing or failed delivery" : operation === "search" ? "search is not a read" :
          truncated ? "truncated delivery" : operation === "unknown" ? "unsupported delivery attribution" : "complete frozen text not established" } : {}) });
    }
  };
  for (const [order, e] of events.entries()) {
    if (contextBoundary(e)) { boundaries.push(order); coverage.clear(); }
    if (agent === "codex" && ["item.started", "item.completed"].includes(e.type)) {
      const item = e.item ?? {}, id = String(item.id ?? `event-${order}`);
      if (item.type === "command_execution" || item.type === "file_change") {
        const done = e.type === "item.completed";
        const ok = done ? item.type === "file_change" ? item.status === "completed" : item.exit_code === 0 : null;
        change(item.type, item, order, ok);
        if (!done) calls.set(id, { tool: item.type, input: item, start: order });
        else { const call = calls.get(id); record(id, item.type, item, call?.start ?? order, order, item.aggregated_output ?? "", ok); calls.delete(id); }
      }
    }
    if (agent === "claude" && !e.parent_tool_use_id) for (const b of e.message?.content ?? []) {
      if (b.type === "tool_use") { calls.set(b.id, { tool: b.name, input: b.input ?? {}, start: order }); change(b.name, b.input ?? {}, order, null); }
      if (b.type === "tool_result") {
        const call = calls.get(b.tool_use_id); if (!call) continue;
        const ok = !b.is_error; change(call.tool, call.input, call.start, ok);
        record(b.tool_use_id, call.tool, call.input, call.start, order, text(b.content), ok); calls.delete(b.tool_use_id);
      }
    }
  }
  for (const [id, call] of calls) record(id, call.tool, call.input, call.start, null, "", null);
  for (const r of records) r.timing = r.result === null ? "unknown" :
    opaque !== null && (attempt === null || opaque < attempt) ? r.result < opaque ? "before" : "unknown" :
    attempt === null ? "no change" : r.result < attempt ? "before" : "after";
  return { turn, records, complete, first_attempt: attempt, first_opaque: opaque, boundaries,
    retention: agent === "claude" ? "observable" : "unknown",
    retention_reason: agent === "codex" ? "Codex exec JSON does not establish absence of context compaction." :
      "Claude system compact_boundary events are supported; native reader validation remains pending.",
    change_confirmed: confirmed, change_unknown: opaque !== null, reader: READER_VERSION };
}

export function retainAccess(access: AccessTurn, session: string | undefined, history: Event[], fresh = false): AccessTurn {
  const previous = history.at(-1), old = previous?.access as AccessTurn | undefined;
  if (fresh || !old || !previous || session && previous.session && session !== previous.session) return { ...access, session, prior_whole: [], reused_whole: [] };
  const candidates = [...new Set([...(old.prior_whole ?? []), ...(old.reused_whole ?? []).map(r => r.skill),
    ...old.records.filter(r => r.extent === "whole").map(r => r.skill)])];
  const lastBoundary = Math.max(-1, ...(old.boundaries ?? []));
  const remaining = [...(lastBoundary < 0 ? old.reused_whole ?? [] : []),
    ...old.records.filter(r => r.extent === "whole" && r.result !== null && r.result > lastBoundary).map(r => ({ skill: r.skill, turn: r.turn }))];
  const proved = !!session && session === previous.session && old.complete && access.complete &&
    old.retention === "observable" && access.retention === "observable" && !access.boundaries?.length;
  return { ...access, session, prior_whole: candidates, reused_whole: proved ? remaining : [] };
}
