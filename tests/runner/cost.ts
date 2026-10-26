import type { Agent, Event } from "./types";
export const DEFAULT_MODELS = { claude: "haiku", codex: "gpt-6-luna" };
export const CODEX_PRICES: Record<string, [number, number, number]> = { "gpt-6-luna": [0.1, 0.01, 0.5] };
export function cost(agent: Agent, model: string, events: Event[][]): number | null {
  let total = 0,
    seen = false;
  for (const e of events.flat()) {
    if (agent === "claude" && e.type === "result") {
      const value = e.total_cost_usd;
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
      total += value;
      seen = true;
    }
    if (agent === "codex" && e.type === "turn.completed") {
      seen = true;
      const p = CODEX_PRICES[model],
        u = e.usage;
      if (!p || !u || typeof u !== "object") return null;
      const counts = [u.input_tokens, u.output_tokens, u.cached_input_tokens ?? 0];
      if (counts.some((n) => !Number.isInteger(n) || n < 0) || counts[2] > counts[0]) return null;
      total += ((counts[0] - counts[2]) * p[0] + counts[2] * p[1] + counts[1] * p[2]) / 1e6;
    }
  }
  return seen ? total : null;
}
