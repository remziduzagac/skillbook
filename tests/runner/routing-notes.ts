import { message_blocks, redact } from "./trace";
import type { Agent, Event } from "./types";
import type { Opportunity } from "./measurement";

export const CODEX_REASONING_SUMMARY = "auto";
export interface RoutingNote {
  source: "reasoning" | "thinking" | "progress"; order: number; block?: number;
  text: string | null; redacted?: boolean; reason?: string;
}

// These notes are retained for diagnostics only; scoring and judge evidence never consume them.
export function collectRoutingNotes(agent: Agent, events: Event[]): RoutingNote[] {
  const notes: RoutingNote[] = [];
  let toolAhead = false;
  const add = (source: RoutingNote["source"], text: unknown, order: number, block?: number) => {
    if (typeof text === "string" && text.trim()) {
      const safe = redact(text);
      notes.push({ source, order, ...(block === undefined ? {} : { block }), text: safe,
        ...(safe !== text ? { redacted: true } : {}) });
    }
  };
  for (let order = events.length - 1; order >= 0; order--) {
    const event = events[order]!;
    if (agent === "codex" && ["item.started", "item.completed"].includes(event.type)) {
      const item = event.item ?? {};
      if (item.type === "reasoning" && event.type === "item.completed") add("reasoning", item.text, order);
      else if (item.type === "agent_message" && event.type === "item.completed" && toolAhead)
        add("progress", item.text, order);
      else if (!["reasoning", "agent_message", "error"].includes(item.type)) toolAhead = true;
    }
    if (agent === "claude" && event.type === "assistant" && !event.parent_tool_use_id) {
      const blocks = message_blocks(event);
      for (let block = blocks.length - 1; block >= 0; block--) {
        const value = blocks[block]!;
        if (value.type === "tool_use") toolAhead = true;
        else if (value.type === "thinking") add("thinking", value.thinking ?? value.text, order, block);
        else if (value.type === "redacted_thinking") notes.push({ source: "thinking", order, block,
          text: null, redacted: true, reason: "Thinking redacted by the harness." });
        else if (value.type === "text" && toolAhead) add("progress", value.text, order, block);
      }
    }
  }
  return notes.sort((a, b) => a.order - b.order || (a.block ?? 0) - (b.block ?? 0));
}

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const named = (text: string, name: string) =>
  new RegExp(`(^|[^A-Za-z0-9_-])${escaped(name)}(?=$|[^A-Za-z0-9_/-])`, "i").test(text);
const normalize = (text: string) => text.toLowerCase().replace(/[`*_]/g, "")
  .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
function mention(text: string, row: Pick<Opportunity, "id" | "skill">, rule: string) {
  if (named(text, row.id)) return "rule id";
  const file = row.skill === "essentials" ? "skills/essentials/SKILL.md" :
    `references/${row.skill.replaceAll("-", "/")}.md`;
  const basename = file.split("/").at(-1)!;
  if (named(text, file) || basename !== "SKILL.md" && named(text, basename)) return "file";
  const skill = escaped(row.skill);
  if (row.skill.includes("-") ? named(text, row.skill) :
    new RegExp(`[\x60"']${skill}[\x60"']|\\bskill\\s+${skill}(?=$|[^A-Za-z0-9_/-])|` +
      `\\b${skill}\\s+skill\\b`, "i").test(text) ||
    new RegExp(`\\b(?:read(?:ing)?|load(?:ing|ed)?|us(?:e|ing)|consider(?:ing|ed)?|skip(?:ping|ped)?)` +
      `\\s+(?:the\\s+)?${skill}(?=$|[^A-Za-z0-9_/-])`, "i").test(text)) return "skill";
  const labels = [...rule.matchAll(/\*\*([^*]+)\*\*/g)].map(match => match[1]!);
  if (!labels.length) labels.push(rule.split("\n")[0] ?? "");
  for (const label of labels) {
    const words = normalize(label).split(/\s+/), width = Math.min(5, words.length);
    if (width >= 4) for (let i = 0; i <= words.length - width; i++)
      if ((" " + normalize(text) + " ").includes(" " + words.slice(i, i + width).join(" ") + " "))
        return "rule phrase";
  }
  return null;
}

export function consideredNotes(notes: RoutingNote[], row: Pick<Opportunity, "id" | "skill" | "deadline" | "parts">,
  rule = "") {
  const deadline = row.parts.some(p => p.deadline_known === false) ? null :
    row.deadline === null ? null : row.deadline ?? Math.min(...row.parts.map(p => p.deadline));
  const known = deadline !== null && Number.isFinite(deadline);
  type Quote = RoutingNote & { text: string; matched_by: string };
  const quotes: Quote[] = [], late_quotes: Quote[] = [], unplaced_quotes: Quote[] = [];
  for (const note of notes) for (const text of note.text?.split(/\r?\n/) ?? []) {
    const matched_by = mention(text, row, rule);
    if (!matched_by) continue;
    const quote = { ...note, text, matched_by };
    if (!known || note.order === deadline && note.block !== undefined) unplaced_quotes.push(quote);
    else if (note.order < deadline!) quotes.push(quote);
    else late_quotes.push(quote);
  }
  const thinking = notes.some(n => n.source !== "progress" && !!n.text?.trim());
  return { considered: quotes.length ? "considered" : thinking ? "not mentioned" : "no thinking available",
    quotes, late_quotes, unplaced_quotes, deadline: known ? deadline : null,
    reason: unplaced_quotes.length && !quotes.length ? "Deadline or block order cannot establish an earlier mention." :
      quotes.length ? "A recorded mention is a hint, not proof of a decision, execution or loading." :
      thinking ? "No matched name, file or literal rule phrase before the deadline; summaries are partial." :
        "No readable thinking was recorded; progress messages alone establish no absence." };
}
