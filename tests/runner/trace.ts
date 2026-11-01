import { command_effect } from "./shell";
import type { Agent, Event } from "./types";
export function parse_events(stdout: string): Event[] {
  return stdout.split(/\r?\n/).flatMap((line) => {
    if (!line.startsWith("{")) return [];
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  });
}
export function redact(text: string) {
  return text
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "(email)")
    .replace(/[A-Za-z0-9_\-]{32,}/g, "(token)");
}
export function message_blocks(event: Event): Event[] {
  return Array.isArray(event.message?.content)
    ? event.message.content.filter((x: unknown) => x && typeof x === "object")
    : [];
}
// Legacy assertions are deliberately excluded from measurement attribution.
export { skills_read, skills_printed } from "./legacy-reads";
export function agents_started(agent: Agent, events: Event[][]) {
  const all = events.flat();
  if (agent === "claude") {
    const failed = new Set(),
      answered = new Set();
    for (const e of all)
      for (const b of message_blocks(e))
        if (b.type === "tool_result") {
          answered.add(b.tool_use_id);
          if (b.is_error) failed.add(b.tool_use_id);
        }
    return all
      .filter((e) => e.type === "assistant" && !e.parent_tool_use_id)
      .reduce(
        (n, e) =>
          n +
          message_blocks(e).filter(
            (b) =>
              b.type === "tool_use" && ["Agent", "Task"].includes(b.name) && answered.has(b.id) && !failed.has(b.id),
          ).length,
        0,
      );
  }
  return all.filter(e => e.type === "item.completed" && e.item?.type === "collab_tool_call" &&
    e.item.status === "completed" && String(e.item.tool ?? "").includes("spawn")).length;
}
export function agents_unseen(agent: Agent, events: Event[][], unexplained = false) {
  return agent === "codex" && (unexplained || events.flat().some((e) => e.item?.type === "collab_tool_call"));
}
export const TARGET_KEYS = ["command", "file_path", "path", "pattern", "url"];
export function action_evidence(agent: Agent, events: Event[]) {
  const actions: Event[] = [],
    outcomes: Record<string, string> = {};
  if (agent === "claude")
    for (const e of events)
      for (const b of message_blocks(e))
        if (b.type === "tool_result") outcomes[b.tool_use_id] = b.is_error ? "failed" : "succeeded";
  for (const e of events) {
    if (agent === "claude" && e.type === "assistant") {
      for (const b of message_blocks(e))
        if (b.type === "tool_use") {
          const action: Event = { tool: b.name, id: b.id ?? null, status: outcomes[b.id] ?? "unknown" };
          for (const k of TARGET_KEYS) if (k in (b.input ?? {})) action[k] = b.input[k];
          if (["Agent", "Task"].includes(b.name)) action.input = b.input ?? null;
          actions.push(action);
        }
    } else if (agent === "codex" && ["item.started", "item.completed"].includes(e.type)) {
      const item = e.item ?? {};
      if (["agent_message", "reasoning"].includes(item.type)) continue;
      const action: Event = { ...(item.id ? { id: item.id } : {}), tool: item.type ?? null, phase: e.type };
      if (item.type === "collab_tool_call") {
        for (const k of ["receiver_thread_ids", "sender_thread_id", "agents_states", "status", "prompt", "fork_context"]) if (k in item) action[k] = item[k];
        action.call = item.tool ?? null;
      } else for (const k of ["command", "exit_code", "changes", "server", "tool"]) if (k in item) action[k] = item[k];
      actions.push(action);
    }
  }
  return actions;
}
export function text_before_change(agent: Agent, events: Event[][]): [string, boolean, string] {
  const said: string[] = [];
  const answer = (changed = false, unknown = ""): [string, boolean, string] => [said.join("\n\n"), changed, unknown];
  for (const e of events.flat()) {
    if (agent === "claude" && e.type === "assistant")
      for (const b of message_blocks(e)) {
        if (b.type === "text") said.push(b.text ?? "");
        else if (b.type === "tool_use") {
          if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(b.name)) return answer(true);
          if (b.name === "Bash") {
            const cmd = b.input?.command ?? "",
              effect = command_effect(cmd);
            if (effect !== "read")
              return answer(
                effect === "write",
                effect === "unknown" ? "command " + cmd.split(/\s+/).join(" ").trim().slice(0, 80) : "",
              );
          } else if (
            ![
              "Read",
              "View",
              "Skill",
              "Grep",
              "Glob",
              "LS",
              "TodoWrite",
              "WebSearch",
              "WebFetch",
              "ToolSearch",
            ].includes(b.name)
          )
            return answer(false, `tool ${b.name}`);
        }
      }
    if (agent === "codex" && ["item.started", "item.completed"].includes(e.type)) {
      const item = e.item ?? {};
      if (e.type === "item.completed" && item.type === "agent_message") said.push(item.text ?? "");
      else if (item.type === "file_change") return answer(true);
      else if (item.type === "command_execution") {
        const cmd = item.command ?? "",
          effect = command_effect(cmd);
        if (effect !== "read")
          return answer(
            effect === "write",
            effect === "unknown" ? "command " + cmd.split(/\s+/).join(" ").trim().slice(0, 80) : "",
          );
      } else if (!["agent_message", "reasoning", "todo_list", "web_search", "error"].includes(item.type))
        return answer(false, `item ${item.type ?? "None"}`);
    }
  }
  return answer();
}
export function turn_texts(agent: Agent, events: Event[]): [string, boolean][] {
  const texts: [string, boolean][] = [];
  for (const e of events) {
    if (agent === "claude" && e.type === "assistant" && !e.parent_tool_use_id)
      for (const b of message_blocks(e)) {
        if (b.type === "text" && b.text) texts.push([b.text, false]);
        else if (b.type === "tool_use") for (const t of texts) t[1] = true;
      }
    if (agent === "codex" && ["item.started", "item.completed"].includes(e.type)) {
      const item = e.item ?? {};
      if (item.type === "agent_message") {
        if (e.type === "item.completed" && item.text) texts.push([item.text, false]);
      } else if (item.type !== "reasoning") for (const t of texts) t[1] = true;
    }
  }
  return texts;
}
export const turn_answer = (a: Agent, e: Event[]) =>
  turn_texts(a, e)
    .map((t) => t[0])
    .join("\n\n");
export const turn_parts = (a: Agent, e: Event[]) => {
  const texts = turn_texts(a, e);
  return [
    texts
      .filter((t) => !t[1])
      .map((t) => t[0])
      .join("\n\n"),
    texts.filter((t) => t[1]).map((t) => t[0]),
  ] as [string, string[]];
};
export function sessionId(agent: Agent, events: Event[]): string | undefined {
  for (const e of events) {
    if (agent === "claude" && e.session_id) return e.session_id;
    if (agent === "codex" && e.type === "thread.started") return e.thread_id;
  }
  return undefined;
}
