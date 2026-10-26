import type { Event } from "./types";

export function finalAnswer(turn: Event): string {
  return typeof turn.final_answer === "string" ? turn.final_answer : (turn.answer ?? "");
}
export function currentFinal(answer: string, evidence: unknown): string {
  const turns = (evidence as Event | undefined)?.turns;
  return Array.isArray(turns) && turns.length ? finalAnswer(turns.at(-1)!) : answer;
}
