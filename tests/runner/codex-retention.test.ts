import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import fixture from "../fixtures/access/codex-retention.json";
import { accessTurn, frozenSkills, retainAccess } from "./access";
import { codexRetention, inspectCodexRetention, withCodexRetention } from "./codex-retention";
import { availableText } from "./measurement";
import { runOne } from "./run";
import { normalize } from "./cases";
import { parseArgs } from "./cli";
import { measurementReport } from "./measurement-report";
import type { Event } from "./types";

const session = fixture.session, sources = { respond: "# respond\nwhole text\n" };
const encode = (rows: Event[]) =>
  Buffer.from(rows.map((e, ordinal) => JSON.stringify({ ...e, ordinal })).join("\n") + "\n");
const firstData = encode(fixture.first), bothData = encode([...fixture.first, ...fixture.next]);
const firstProof = () => codexRetention(firstData, session, 1, "First answer");
const read = () => withCodexRetention(accessTurn("codex", [{ type: "item.completed", item: {
  id: "read", type: "command_execution", command: "cat /sandbox/skills/essentials/references/respond.md",
  aggregated_output: sources.respond, exit_code: 0 } }], 1, sources), firstProof());

test("native checkpoints establish ordinary Codex reuse without model calls", () => {
  const proof = codexRetention(bothData, session, 2, "Second answer", firstProof());
  expect(proof).toMatchObject({ status: "intact", completed_turns: 2, records: 8, cli_version: "0.163.0" });
  const first = retainAccess(read(), session, []);
  const next = retainAccess(withCodexRetention(accessTurn("codex", [], 2, sources), proof),
    session, [{ session, access: first }]);
  expect(availableText(next, "respond", 0)).toEqual({ availability: "opened", reused: true });
  expect(next.reused_whole).toEqual([{ skill: "respond", turn: 1 }]);
  const fresh = retainAccess(next, session, [{ session, access: first }], true);
  expect(availableText(fresh, "respond", 0).availability).toBe("not opened");
});

test("compaction and rollback leave prior text unknown, even with the same session id", () => {
  const first = read();
  for (const boundary of [fixture.compaction,
    { type: "event_msg", payload: { type: "thread_rolled_back", num_turns: 1 } },
    { type: "response_item", payload: { type: "context_compaction" } },
    { type: "event_msg", payload: { type: "session_resumed" } }]) {
    const proof = codexRetention(encode([...fixture.first, boundary, ...fixture.next]),
      session, 2, "Second answer", firstProof());
    expect(proof.status).toBe("boundary");
    const access = retainAccess(withCodexRetention(accessTurn("codex", [], 2, sources), proof),
      session, [{ session, access: first }]);
    expect(availableText(access, "respond", 0).availability).toBe("unknown");
    expect(access.reused_whole).toEqual([]);
  }
});

test("truncated, gapped, changed, mismatched and unsupported native records cannot prove reuse", () => {
  const rows = [...fixture.first, ...fixture.next];
  const malformed = Buffer.from(bothData.toString().replace('"ordinal":3', '"ordinal":4'));
  const unknowns = [
    codexRetention(bothData.subarray(0, -1), session, 2, "Second answer", firstProof()),
    codexRetention(Buffer.from("{bad json}\n"), session, 2, "Second answer"),
    codexRetention(Buffer.from("null\n"), session, 2, "Second answer"),
    codexRetention(malformed, session, 2, "Second answer", firstProof()),
    codexRetention(encode(rows.filter((_, i) => i !== 3)), session, 2, "Second answer", firstProof()),
    codexRetention(bothData, "different-session", 2, "Second answer"),
    codexRetention(bothData, session, 1, "Second answer"),
    codexRetention(bothData, session, 2, "Stale answer", firstProof()),
    codexRetention(encode([...rows, { type: "future_history_update", payload: {} }]), session, 2, "Second answer"),
    codexRetention(encode(rows.map((e, i) => i ? e : { ...e, payload: { ...e.payload, cli_version: "future" } })),
      session, 2, "Second answer"),
    codexRetention(encode(rows.slice(0, -1)), session, 2, "Second answer", firstProof()),
  ];
  for (const proof of unknowns) {
    expect(proof.status).toBe("unknown");
    const access = retainAccess(withCodexRetention(accessTurn("codex", [], 2, sources), proof),
      session, [{ session, access: read() }]);
    expect(availableText(access, "respond", 0).availability).toBe("unknown");
  }
  const fork = rows.map((e, i) => i ? e : { ...e, payload: { ...e.payload, forked_from_id: "parent" } });
  expect(codexRetention(encode(fork), session, 2, "Second answer").status).toBe("boundary");
});

test("retention discovery stays inside the throwaway home and rejects missing or symlinked logs", () => {
  const root = mkdtempSync(join(tmpdir(), "codex-retention-"));
  try {
    const folder = join(root, ".codex/sessions/2026/10/28");
    expect(inspectCodexRetention(root, session, 1, "First answer").status).toBe("unknown");
    mkdirSync(folder, { recursive: true });
    const path = join(folder, `rollout-example-${session}.jsonl`);
    writeFileSync(path, firstData);
    const proof = inspectCodexRetention(root, session, 1, "First answer");
    expect(proof.status).toBe("intact");
    expect(proof.file).toBe(`.codex/sessions/2026/10/28/rollout-example-${session}.jsonl`);
    expect(inspectCodexRetention(root, "../outside", 1, "First answer").status).toBe("unknown");
    rmSync(path);
    writeFileSync(join(root, "other.jsonl"), firstData);
    symlinkSync(join(root, "other.jsonl"), path);
    expect(inspectCodexRetention(root, session, 1, "First answer").status).toBe("unknown");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("runOne retains Codex reuse evidence before cleanup, with compaction and missing-log controls", async () => {
  const out = mkdtempSync(join(tmpdir(), "codex-retention-run-"));
  try {
    const c = normalize({ fixture: "tiny-weather", turns: [{ prompt: "First" }, { prompt: "Second" }] },
      "essentials/retention");
    const options = { ...parseArgs(["--agents", "codex"]), keep: true };
    const source = frozenSkills().respond!;
    for (const mode of ["intact", "compacted", "missing"] as const) {
      let turn = 0, home = "";
      const result = await runOne(c, "codex", "gpt-6.1-sol", 1, options, out, 1, async (_cmd, _work, env) => {
        turn++; home = env.CODEX_HOME!;
        const answer = turn === 1 ? "First answer" : "Second answer";
        const rows = turn === 1 ? fixture.first : [...fixture.first,
          ...(mode === "compacted" ? [fixture.compaction] : []), ...fixture.next];
        if (mode !== "missing") {
          mkdirSync(join(home, "sessions/2026/10/28"), { recursive: true });
          writeFileSync(join(home, `sessions/2026/10/28/rollout-example-${session}.jsonl`),
            encode(rows.map(e => e.type === "response_item" ?
              { ...e, payload: { ...e.payload, output: source } } : e)));
        }
        const events: Event[] = [{ type: "thread.started", thread_id: session }, { type: "turn.started" }];
        if (turn === 1) events.push({ type: "item.completed", item: { id: "read", type: "command_execution",
          command: "cat /sandbox/skills/essentials/references/respond.md", aggregated_output: source, exit_code: 0 } });
        events.push({ type: "item.completed", item: { id: "final", type: "agent_message", text: answer } },
          { type: "turn.completed", usage: { input_tokens: 1, output_tokens: 1 } });
        return { stdout: events.map(e => JSON.stringify(e)).join("\n"), stderr: "", status: 0,
          left: [], left_why: null, tmp: null, tmp_paths: [] };
      });
      expect(result.error).toBeNull();
      const expected = mode === "intact" ? "intact" : mode === "compacted" ? "boundary" : "unknown";
      expect(result.turns[1].access.retention_evidence.status).toBe(expected);
      expect(availableText(result.turns[1].access, "respond", 0)).toEqual({
        availability: mode === "intact" ? "opened" : "unknown", reused: mode === "intact" });
      expect(measurementReport([result]).loading_counts["codex/gpt-6.1-sol/installed/respond"]!.reused)
        .toBe(mode === "intact" ? 1 : 0);
      expect(() => readFileSync(join(home, "config.toml"))).toThrow();
      const saved = JSON.stringify(result.turns.map((t: Event) => t.access.retention_evidence));
      expect(saved).not.toContain("last_agent_message");
      expect(saved).not.toContain("creator_account_id");
      expect(saved).not.toContain("whole text");
    }
  } finally { rmSync(out, { recursive: true, force: true }); }
});
