import { names_skill } from "./checks";
import type { Event } from "./types";
export interface ProgressFinding {
  turn: number;
  text: string;
  flags: string[];
  scored: false;
}
// Review aids only. They never produce pass/fail verdicts or enter pooled scores.
export function progressFindings(turns: Event[]): ProgressFinding[] {
  return turns.flatMap((turn, index) => (turn.between_tools ?? []).flatMap((text: string) => {
    const flags: string[] = [];
    if (text.length > 200 || text.trim().split(/\s+/).length > 40) flags.push("long");
    if (names_skill(text)) flags.push("internal-skill");
    if (/\b(?:do|handle|check|fix|sort out)\s+(?:it|things|stuff|the thing)\b|\bas (?:above|before)\b/i.test(text))
      flags.push("unclear-reference");
    return flags.length ? [{ turn: index + 1, text, flags, scored: false as const }] : [];
  }));
}
