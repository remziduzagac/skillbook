import type { Event } from "./types";

export function finalAnswer(turn: Event): string {
  return typeof turn.final_answer === "string" ? turn.final_answer : (turn.answer ?? "");
}
// A word is a whitespace-separated token with a letter or digit, so Markdown markers add nothing.
export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length : 0;
}
// Length is a number to read, never a verdict. Turns saved before the count was recorded are counted on the fly.
export function lengthSummary(turns: Event[]): { turns: number; total: number; median: number | null } {
  const counts = turns.map(t => typeof t.final_words === "number" ? t.final_words : wordCount(finalAnswer(t)))
    .sort((a, b) => a - b);
  const mid = counts.length >> 1;
  return { turns: counts.length, total: counts.reduce((sum, n) => sum + n, 0),
    median: !counts.length ? null : counts.length % 2 ? counts[mid]! : (counts[mid - 1]! + counts[mid]!) / 2 };
}
export function currentFinal(answer: string, evidence: unknown): string {
  const turns = (evidence as Event | undefined)?.turns;
  return Array.isArray(turns) && turns.length ? finalAnswer(turns.at(-1)!) : answer;
}
