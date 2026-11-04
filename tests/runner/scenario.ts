import { JUDGE_INSTRUCTION, structuredPrompt, judgeData, checkedBatch, loadingOnly, loadingJudgment } from "./judge-protocol";
import { chapterAt } from "./chapters";
import { ruleChecks } from "./rule-checks";
import { MARKER, cached } from "./paths";
import { currentFinal } from "./answers";
import { JUDGING_RULES } from "./judgment-policy";
import { agentCommand } from "./agents";
import { runTurn } from "./process";
import { parse_events, turn_parts, action_evidence, redact } from "./trace";
import { cost } from "./cost";
import type { Case, Event, JudgeRequest, JudgeResult } from "./types";

export const SCENARIO_MODEL = "gpt-6.1-sol";
export type StructuredCall = (instruction: string, data: unknown) => Promise<any>;

// A fresh process gets evidence as data and no prior judge or tested-agent session.
export function structuredCall(
  work: string,
  env: NodeJS.ProcessEnv,
  timeout: number,
  groups: number[],
  account: (amount: number | null) => void,
  driver: typeof runTurn = runTurn,
): StructuredCall {
  return async (instruction, data) => {
    const prompt = structuredPrompt(instruction, data);
    const command = agentCommand("codex", SCENARIO_MODEL, "-", 0);
    command[command.indexOf("workspace-write")] = "read-only";
    // A timeout owns one call, while the outer run still tracks every process for cleanup.
    const callGroups: number[] = [], push = callGroups.push.bind(callGroups);
    callGroups.push = (...pids: number[]) => { groups.push(...pids); return push(...pids); };
    const callEnv = { ...env, [MARKER]: `${env[MARKER] ?? "judge"}-${crypto.randomUUID()}` };
    let ran: Awaited<ReturnType<typeof runTurn>>;
    try { ran = await driver(command, work, callEnv, timeout, callGroups, prompt); }
    catch (error) { account(null); throw error; }
    const events = parse_events(ran.stdout);
    account(cost("codex", SCENARIO_MODEL, [events]));
    if (ran.status !== 0) {
      const errors = events.filter(e => e.type === "error" || e.type === "turn.failed")
        .map(e => e.message ?? e.error?.message ?? e.error ?? "").join("; ");
      throw Error(`scenario model failed (exit ${ran.status ?? "timeout"}): ` +
        redact(ran.stderr || errors || "no diagnostic output").slice(-400));
    }
    if (action_evidence("codex", events).length) throw Error("scenario model used tools");
    const [answer] = turn_parts("codex", events);
    return JSON.parse(answer.trim().replace(/^```json\s*|\s*```$/g, ""));
  };
}

export async function simulate(call: StructuredCall, c: Case, index: number, history: Event[], sources: Record<string, string> = {}) {
  const result = await call(
    'Play the user. Return {"message":string,"steered":boolean}. Start from the current fixed message; ' +
    "keep its purpose and the script's turn count and order. Change only what the actual agent reply needs. " +
    "Answer questions using only the facts sheet and description. Steer back when needed without mentioning a test. " +
    "Add no facts, requests or approvals beyond the description and facts. If it already fits, send it unchanged.",
    { goal: c.goal, user: c.user ? { description: c.user.description, facts: c.user.facts } : undefined, script: c.turns.flatMap((t, i) => {
      const chapter = chapterAt(c, index + 1);
      return !chapter || chapterAt(c, i + 1)?.number === chapter.number ? [{ prompt: t.prompt, purpose: t.purpose }] : [];
    }), index: c.chapters ? index + 1 - chapterAt(c, index + 1)!.start_turn : index,
      turn: index + 1, sources,
      history: history.map(t => ({ scripted_message: t.scripted_message, sent_message: t.sent_message,
        answer: t.answer ?? t.final_answer })),
    },
  );
  if (typeof result.message !== "string" || !result.message.trim() || typeof result.steered !== "boolean")
    throw Error("invalid simulated user response");
  return result as { message: string; steered: boolean };
}

export async function fit(call: StructuredCall, reply: string, next: string) {
  const result = await call(
    'Return {"off_script":boolean|null,"reason":string}. Does the next fixed user message fit after this reply? ' +
    "Mark true if it leaves a question unanswered or assumes a materially different conversation. " +
    "Mark false if it makes sense after the reply. Use null when evidence is insufficient.", { reply, next },
  );
  if (![true, false, null].includes(result.off_script) || typeof result.reason !== "string" || !result.reason.trim())
    throw Error("invalid fit judgment");
  return result as { off_script: boolean | null; reason: string };
}

export async function rubricJudge(call: StructuredCall, request: JudgeRequest): Promise<JudgeResult> {
  const result = await call(
    'Judge the criterion. Return {"verdict":boolean|null|"not reached","reason":string}. ' +
    JUDGING_RULES, { ...request, answer: currentFinal(request.answer, request.evidence) },
  );
  if (![true, false, null, "not reached"].includes(result.verdict) || typeof result.reason !== "string" || !result.reason.trim())
    throw Error("invalid rubric judgment");
  return { ...result, id: request.rubric.id, tag: request.rubric.tag };
}

export function judgeEvidence(turns: Event[], sources: Record<string, string> = {}, selected?: string[]) {
  const keys = ["scripted_message", "sent_message", "final_answer", "between_tools", "actions", "file_diffs",
    "trace_complete", "agents_started", "agents_unseen", "reads", "changes", "files", "paths_present", "fresh_session", "helpers", "turn", "chapter"];
  const chapter = turns.at(-1)?.chapter;
  const visible = chapter === undefined ? turns : turns.filter(t => t.chapter === chapter);
  const changed = new Set(Object.keys(visible.at(-1)?.file_diffs ?? {}));
  const wanted = (path: string) => !cached(path) && (selected === undefined || changed.has(path) ||
    selected.some(p => p.endsWith("/") ? path.startsWith(p) : path === p));
  const keep = (files: Record<string, unknown>) => Object.fromEntries(Object.entries(files).filter(([p]) => wanted(p)));
  const listed = (changes: unknown) => Array.isArray(changes) ?
    changes.filter(c => typeof c !== "string" || !cached(c.slice(c.indexOf(" ") + 1))) : changes;
  return { sources: keep(sources), current_turn: turns.at(-1)?.turn ?? turns.length, progress_role: "unscored evidence", turns: visible.map(t => Object.fromEntries(keys.filter(k => k in t).map(k =>
    [k, ["files", "file_diffs"].includes(k) ? keep(t[k]) : k === "changes" ? listed(t[k]) : t[k]]))) };
}

export async function rubricBatch(call: StructuredCall, requests: JudgeRequest[]): Promise<JudgeResult[]> {
  if (!requests.length) return [];
  if (requests.some(r => r.answer !== requests[0]!.answer ||
    JSON.stringify(r.evidence) !== JSON.stringify(requests[0]!.evidence)))
    throw Error("rubric batches need the same answer and evidence");
  const rules = ruleChecks();
  const active = requests.filter(r => !loadingOnly(r.rubric,rules));
  const checked = active.length ? checkedBatch(active, await call(JUDGE_INSTRUCTION, judgeData(active))) : [];
  return requests.map(request => loadingOnly(request.rubric,rules) ? loadingJudgment(request.rubric) :
    checked.find(r => r.id === request.rubric.id)!);
}
