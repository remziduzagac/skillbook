import { rubricCandidates, resolveRubricTrace, fixtureJudgeEvidence, type RubricBook } from "./rubric-fixtures";
import { resultChecks, ruleChecks } from "./rule-checks";
import { FIXTURE_INSTRUCTION, structuredPrompt, judgeCriterion, resultRubric, checkedJudgment, loadingOnly, loadingJudgment } from "./judge-protocol";
import type { Case, Event, JudgeRequest } from "./types";

export interface FixtureEntry { id: string; ref: string; check: string; expected: import("./types").Verdict; request: JudgeRequest }
export function fixtureEntries(book: RubricBook, cases: Case[] = []): FixtureEntry[] {
  const rows = [...book.checks,...book.library ?? []], parts = resultChecks();
  const evidence = new Map<string, unknown>();
  return rubricCandidates(book).map((candidate,index) => {
    const row = rows.find(r => `${r.case}:${r.turn}:${r.id}` === candidate.check)!;
    const c = cases.find(c => c.id === row.case);
    const rubric = c?.turns[row.turn - 1]?.rubric?.find(r => r.id === row.id) ??
      (book.scope === "active" && parts.find(p => p.id === row.id) ? resultRubric(parts.find(p => p.id === row.id)) :
        {id:row.id,tag:row.tag,criterion:row.criterion});
    const key = `${row.case}:${row.turn}:${candidate.ref}`;
    if (!evidence.has(key)) evidence.set(key,book.scope === "active" ? fixtureJudgeEvidence(candidate.ref,book,c) :
      // Historical snapshots retain their original, self-contained evidence contract.
      resolveRubricTrace(candidate.ref,book));
    const proof = evidence.get(key) as Event;
    return {...candidate,id:`candidate-${index+1}`,request:{rubric,answer:proof.turns.at(-1)?.final_answer ?? "",evidence:proof}};
  });
}
export function fixturePayload(entries: FixtureEntry[], rules = ruleChecks()) {
  const traces: Record<string,Event> = {}, refs = new Map<string,string>();
  const criteria: Event[] = entries.map(entry => {
    const key = JSON.stringify([entry.request.answer,entry.request.evidence]);
    if (!refs.has(key)) {const id=`trace-${refs.size+1}`;refs.set(key,id);traces[id]={answer:entry.request.answer,evidence:entry.request.evidence};}
    return {...judgeCriterion(entry.request.rubric,rules),id:entry.id,criterion_id:entry.request.rubric.id,trace_ref:refs.get(key)};
  });
  return {traces,criteria};
}
export function fixtureBatches(entries: FixtureEntry[], limit = 600_000) {
  const rules=ruleChecks();
  const batches: FixtureEntry[][] = [];
  let batch: FixtureEntry[] = [];
  const fits = (items:FixtureEntry[]) => structuredPrompt(FIXTURE_INSTRUCTION,fixturePayload(items,rules)).length <= limit;
  // One trace's criteria remain neighbours; correctness never depends on a pair sharing a call.
  const sorted = [...entries].sort((a,b) => a.ref.localeCompare(b.ref) || a.id.localeCompare(b.id));
  for (const entry of sorted) {
    if (loadingOnly(entry.request.rubric,rules)) continue;
    if (!fits([entry])) throw Error(`indivisible fixture candidate exceeds ${limit} characters: ${entry.check} ${entry.ref}`);
    if (batch.length && !fits([...batch,entry])) {batches.push(batch);batch=[];}
    batch.push(entry);
  }
  if (batch.length) batches.push(batch);
  return batches;
}
export function checkedFixtureBatch(batch: FixtureEntry[], response: Event) {
  if (!Array.isArray(response.results) || response.results.length !== batch.length ||
    new Set(response.results.map((r:Event) => r.id)).size !== batch.length) throw Error("invalid fixture judgments");
  return batch.map(entry => {
    const row = response.results.find((r:Event) => r.id === entry.id);
    const judgment = checkedJudgment(entry.request,row);
    return {id:entry.id,ref:entry.ref,check:entry.check,expected:entry.expected,judgment,matches:judgment.verdict === entry.expected};
  });
}
export function loadingFixtureResults(entries:FixtureEntry[]) {
  const rules=ruleChecks();
  return entries.filter(e => loadingOnly(e.request.rubric,rules)).map(entry => {
    const judgment=loadingJudgment(entry.request.rubric);
    return {id:entry.id,ref:entry.ref,check:entry.check,expected:entry.expected,judgment,matches:judgment.verdict === entry.expected};
  });
}

export async function runFixtureBatch(call:(instruction:string,data:unknown)=>Promise<Event>, batch:FixtureEntry[], limit=600_000) {
  const data=fixturePayload(batch);
  if (structuredPrompt(FIXTURE_INSTRUCTION,data).length>limit) throw Error("fixture request exceeds complete prompt character bound");
  return checkedFixtureBatch(batch,await call(FIXTURE_INSTRUCTION,data));
}
