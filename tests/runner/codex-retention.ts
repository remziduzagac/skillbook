import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { homedir } from "node:os";
import type { AccessTurn } from "./access";
import type { Event } from "./types";

export interface CodexRetention {
  reader: "codex-retention-1"; status: "intact" | "boundary" | "unknown"; reason: string;
  session?: string; file?: string; cli_version?: string; records?: number; completed_turns?: number;
  evidence?: { metadata: number; starts: number[]; completions: number[]; through: number };
  checkpoint?: { bytes: number; sha256: string };
}
const digest = (data: Buffer) => createHash("sha256").update(data).digest("hex");
const kinds = new Set(["session_meta", "response_item", "event_msg", "world_state", "turn_context",
  "token_usage_record"]);
const messages = new Set(["task_started", "task_complete", "item_started", "item_completed", "token_count",
  "thread_settings_applied", "exec_command_begin", "exec_command_end"]);
const responses = new Set(["message", "reasoning", "function_call", "function_call_output", "custom_tool_call",
  "custom_tool_call_output"]);

// Version 0.163.0 persists compaction checkpoints and replays response items on resume.
// See the pinned upstream sources linked in tests/checks/README.md. Unknown formats fail closed.
export function codexRetention(data: Buffer, session: string, turns: number, answer: string,
  previous?: CodexRetention): CodexRetention {
  const base: CodexRetention = { reader: "codex-retention-1", status: "unknown", session,
    reason: "Incomplete rollout." };
  if (!data.length || data.at(-1) !== 10) return base;
  let rows: Event[];
  try { rows = data.toString("utf8").trimEnd().split("\n").map(line => JSON.parse(line)); }
  catch { return { ...base, reason: "Malformed rollout JSON." }; }
  if (rows.some(e => !e || typeof e !== "object" || !e.payload || typeof e.payload !== "object"))
    return { ...base, reason: "Malformed rollout record." };
  const meta = rows[0]?.payload;
  if (rows[0]?.type !== "session_meta" || meta?.id !== session || meta.session_id && meta.session_id !== session)
    return { ...base, reason: "Rollout session does not match the exec record." };
  base.cli_version = meta.cli_version;
  base.records = rows.length;
  if (meta.cli_version !== "0.163.0" || meta.source !== "exec")
    return { ...base, reason: "Unsupported native rollout version or source." };
  if (meta.forked_from_id || meta.forked_from_thread_id || meta.parent_thread_id || meta.history_base)
    return { ...base, status: "boundary", reason: "Forked or inherited native history." };
  if (rows.some(e => e.type === "compacted" || ["compaction", "context_compaction"].includes(e.payload?.type) ||
    ["context_compacted", "thread_rolled_back", "session_resumed", "thread_resumed"].includes(e.payload?.type)))
    return { ...base, status: "boundary", reason: "Native compaction, rollback or resume boundary." };
  if (rows.some((e, i) => e.ordinal !== i || !kinds.has(e.type) || i > 0 && e.type === "session_meta" ||
    e.type === "event_msg" && !messages.has(e.payload?.type) ||
    e.type === "response_item" && !responses.has(e.payload?.type)))
    return { ...base, reason: "Rollout has an ordinal gap or unsupported record." };
  const starts = rows.filter(e => e.type === "event_msg" && e.payload.type === "task_started");
  const ends = rows.filter(e => e.type === "event_msg" && e.payload.type === "task_complete");
  base.completed_turns = ends.length;
  base.evidence = { metadata: 0, starts: starts.map(e => e.ordinal), completions: ends.map(e => e.ordinal),
    through: rows.length - 1 };
  if (starts.length !== turns || ends.length !== turns || rows.at(-1) !== ends.at(-1) ||
    ends.at(-1)?.payload.last_agent_message !== answer ||
    starts.some((e, i) => !e.payload.turn_id || e.payload.turn_id !== ends[i]?.payload.turn_id ||
      e.ordinal >= ends[i]?.ordinal || i > 0 && e.ordinal <= ends[i - 1]?.ordinal))
    return { ...base, reason: "Native turn boundaries or final answer do not match the completed exec turns." };
  if (previous && (previous.status !== "intact" || !previous.checkpoint ||
    previous.checkpoint.bytes >= data.length ||
    digest(data.subarray(0, previous.checkpoint.bytes)) !== previous.checkpoint.sha256))
    return { ...base, reason: "Previous native checkpoint is missing or its prefix changed." };
  return { ...base, status: "intact", reason: "Complete ordered native history with no context boundary.",
    checkpoint: { bytes: data.length, sha256: digest(data) } };
}

// Only walk the runner's throwaway home; never discover sessions through the real agent home.
export function inspectCodexRetention(home: string, session: string | undefined, turns: number, answer: string,
  previous?: CodexRetention): CodexRetention {
  const unknown: CodexRetention = { reader: "codex-retention-1", status: "unknown", session,
    reason: "Native rollout unavailable." };
  if (!session || !/^[A-Za-z0-9-]+$/.test(session) || resolve(home) === resolve(homedir())) return unknown;
  const root = join(home, ".codex", "sessions");
  const files: string[] = [];
  const walk = (folder: string, depth: number) => {
    if (depth > 4 || lstatSync(folder).isSymbolicLink()) return;
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) walk(path, depth + 1);
      else if (entry.isFile() && entry.name.startsWith("rollout-") && entry.name.endsWith(`-${session}.jsonl`))
        files.push(path);
    }
  };
  try {
    if (lstatSync(home).isSymbolicLink() || lstatSync(join(home, ".codex")).isSymbolicLink()) return unknown;
    walk(root, 0);
    if (files.length !== 1) return unknown;
    const stat = lstatSync(files[0]!);
    if (stat.nlink !== 1) return unknown;
    return { ...codexRetention(readFileSync(files[0]!), session, turns, answer, previous),
      file: relative(home, files[0]!) };
  } catch { return unknown; }
}

export function withCodexRetention(access: AccessTurn, evidence: CodexRetention): AccessTurn {
  return { ...access, retention: evidence.status === "intact" ? "observable" : "unknown",
    retention_reason: evidence.reason, retention_evidence: evidence,
    ...(evidence.status === "boundary" ? { context_boundary_unknown: true } : {}) };
}
