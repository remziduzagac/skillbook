import { message_blocks } from "./trace";
import type { Agent, Event } from "./types";

export interface HelperEvidence {
  id: string;
  start: Event | null;
  brief: string | null;
  result: unknown | null;
  end: Event | null;
  fresh: boolean | null;
  actions: Event[] | null;
}
// A missing field is a recording limit, independently of the other claims.
export function helperEvidence(agent: Agent, events: Event[]) {
  const helpers = new Map<string, HelperEvidence>();
  const get = (id: string) => {
    if (!helpers.has(id)) helpers.set(id, { id, start: null, brief: null, result: null, end: null,
      fresh: null, actions: null });
    return helpers.get(id)!;
  };
  let controls: boolean | null = null;
  if (agent === "codex") {
    const starts = new Map<string, Event>();
    for (const [order, e] of events.entries()) {
      let item = e.item;
      if (!item || item.type !== "collab_tool_call") continue;
      controls = true;
      if (e.type === "item.started" && item.id) { starts.set(item.id, item); }
      const start = starts.get(item.id);
      item = {...start, ...item, prompt: item.prompt ?? start?.prompt,
        fork_context: item.fork_context ?? start?.fork_context};
      const call = String(item.tool ?? ""), completed = e.type === "item.completed";
      const receivers: string[] = item.receiver_thread_ids ?? [];
      if (receivers.length && item.id) helpers.delete(`unidentified:${item.id}`);
      const ids = receivers.length ? receivers : call.includes("spawn") ? [`unidentified:${item.id ?? order}`] : [];
      const successful = completed && item.status === "completed";
      for (const id of ids) {
        const h = get(String(id));
        if (call.includes("spawn")) {
          if (successful) h.start = { action: item.id ?? null, order, status: item.status };
          if (typeof item.prompt === "string") h.brief = item.prompt;
          if (typeof item.fork_context === "boolean") h.fresh = !item.fork_context;
        }
        const state = item.agents_states?.[id];
        if (state && (state.message !== undefined || state.result !== undefined))
          h.result = state.message ?? state.result;
        if (/close|end/.test(call) && successful) h.end = { action: item.id ?? null, order, status: item.status };
      }
    }
  } else {
    for (const [order, e] of events.entries()) {
      for (const b of message_blocks(e)) {
        if (b.type === "tool_use" && ["Agent", "Task"].includes(b.name)) {
          controls = true;
          const h = get(b.id), result = events.flatMap(message_blocks)
            .find(r => r.type === "tool_result" && r.tool_use_id === b.id);
          if (typeof b.input?.prompt === "string") h.brief = b.input.prompt;
          if (result && !result.is_error) {
            h.start = { action: b.id, order, status: "succeeded" };
            h.result = result.content ?? null;
            // A synchronous return establishes completion, not disposal of the helper.
          }
        }
      }
      if (e.parent_tool_use_id) {
        const h = get(e.parent_tool_use_id);
        (h.actions ??= []).push(...message_blocks(e).filter(b => b.type === "tool_use"));
      }
    }
  }
  return { controls_available: controls, helpers: [...helpers.values()] };
}
