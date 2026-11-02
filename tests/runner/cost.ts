import type { Agent, Event } from "./types";
export const DEFAULT_MODELS = { claude: "haiku", codex: "gpt-6-luna" };
// USD per 1M tokens: input, cached input, output (Standard rates; not billing totals).
// Sol verified 2026-10-29: https://developers.openai.com/api/docs/models/gpt-6.1-sol
export const CODEX_PRICES: Record<string, [number, number, number]> = {
  "gpt-6-luna": [0.1, 0.01, 0.5],
  "gpt-6.1-sol": [2, 0.1, 10],
};
export interface CostContext { fresh: boolean; expectedSession?: string }
interface Counter { session?: string; values: number[] }
function counter(agent: Agent, events: Event[]): Counter | undefined {
  const main = events.filter(e => !e.parent_tool_use_id);
  const sessions = [...new Set(main.map(e => agent === "claude" ? e.session_id :
    e.type === "thread.started" ? e.thread_id : undefined).filter(s => typeof s === "string" && s))];
  if (sessions.length > 1) return;
  const results = main.filter(e => e.type === (agent === "claude" ? "result" : "turn.completed"));
  if (results.length !== 1) return;
  const result = results[0]!;
  if (agent === "claude") {
    const value = result.total_cost_usd;
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 ||
      value === 0 && result.subtype === "error_during_execution") return;
    return {session:sessions[0],values:[value]};
  }
  const u = result.usage;
  if (!u || typeof u !== "object") return;
  const values = [u.input_tokens,u.cached_input_tokens ?? 0,u.output_tokens];
  if (values.some(n => !Number.isSafeInteger(n) || n < 0) || values[1] > values[0]) return;
  return {session:sessions[0],values};
}

// Both supported CLIs expose cumulative session/thread counters, including on resume.
// Claude's root total already includes helper spending. Do not add child result totals.
export class CostTracker {
  private previous?: Counter;
  private started = false;
  constructor(private agent: Agent, private model: string) {}
  next(events: Event[], context: CostContext = {fresh:!this.started}): number | null {
    const before = context.fresh ? undefined : this.previous, current = counter(this.agent,events);
    this.started = true;
    // A missing result breaks the baseline. A later valid result can establish the next baseline,
    // but cannot allocate spend across the missing turn.
    this.previous = current;
    if (!current || !context.fresh && (!before?.session || !current.session || before.session !== current.session ||
      context.expectedSession !== undefined && current.session !== context.expectedSession)) return null;
    const delta = current.values.map((n,i) => n - (before?.values[i] ?? 0));
    if (delta.some(n => n < 0)) return null;
    if (this.agent === "claude") return delta[0]!;
    const prices = CODEX_PRICES[this.model];
    if (!prices || delta[1]! > delta[0]!) return null;
    return ((delta[0]! - delta[1]!) * prices[0] + delta[1]! * prices[1] + delta[2]! * prices[2]) / 1e6;
  }
}

// A complete history starts fresh; later fresh sessions require explicit saved boundaries.
// A single fresh auxiliary query uses the same path, with no inherited counter to subtract.
export function cost(agent: Agent, model: string, events: Event[][], contexts?: CostContext[]): number | null {
  if (!events.length) return null;
  const tracker = new CostTracker(agent,model);
  let total = 0, unknown = false;
  for (const [i,turn] of events.entries()) {
    const amount = tracker.next(turn,contexts?.[i] ?? {fresh:i === 0});
    unknown ||= amount === null;
    total += amount ?? 0;
  }
  return unknown ? null : total;
}
