import historicalBook from "../calibration/scenario-traces.json";
import { judgeEvidence } from "./scenario";
import { action_evidence } from "./trace";
import { helperEvidence } from "./helpers";
import { fixtureDiffs } from "./files";
import { chapterAt } from "./chapters";
import { readFileSync } from "node:fs";
import { ruleChecks, resultChecks } from "./rule-checks";
import type { Case, Event } from "./types";

export interface RubricBook {
  scope?: "historical" | "active";
  sources: Record<string, Record<string, string>>;
  chapter_sources?: Record<string, Record<string, string>>;
  traces: Record<string, Event>;
  library?: RubricBook["checks"];
  checks: { case: string; turn: number; id: string; tag: string; criterion: string;
    positive: string; negative: string; alternatives?: string[]; expectations?: Record<string, import("./types").Verdict> }[];
}
// This immutable book is historical evidence; it has no dependency on executable cases.
export const rubricFixtures: RubricBook = historicalBook;
export function rubricTrace(ref: string, book: RubricBook = rubricFixtures, seen = new Set<string>()): Event {
  const trace = book.traces[ref];
  if (!trace) throw Error("missing rubric trace " + ref);
  if (seen.has(ref)) throw Error("cyclic rubric trace " + ref);
  seen.add(ref);
  if (!trace.base) return trace;
  const base = rubricTrace(trace.base, book, seen);
  return { ...base, observation: { ...base.observation, ...trace.observation } };
}
export function resolveRubricTrace(ref: string, book: RubricBook = rubricFixtures, selected?: string[]) {
  const trace = rubricTrace(ref, book);
  const sources = trace.chapter === undefined ? book.sources[trace.case] : book.chapter_sources?.[`${trace.case}:${trace.chapter}`];
  if (!sources) throw Error("missing rubric sources: " + trace.case);
  let files = { ...sources };
  const turns = [...(trace.prior ?? []), ref].map((key: string) => {
    const row = rubricTrace(key, book);
    if (row.case !== trace.case || row.chapter !== trace.chapter) throw Error("trace history crosses case or chapter");
    const observation = structuredClone(row.observation), before = { ...files };
    Object.assign(files, observation.files_changed);
    for (const removed of observation.files_removed ?? []) delete files[removed];
    // Live action records hold no command output, so active judging sees the same shape here.
    if (book.scope === "active") observation.actions = observation.actions?.map(({ output, ...action }: Event) => action);
    return { ...observation, files_before: before, files_after: { ...files } };
  });
  if (selected === undefined) return { sources, turns };
  const changed = new Set<string>([...Object.keys(turns.at(-1)?.files_changed ?? {}), ...(turns.at(-1)?.files_removed ?? [])]);
  const wanted = (p: string) => changed.has(p) || selected.some(s => s.endsWith("/") ? p.startsWith(s) : p === s);
  const keep = (files: Record<string, string>) => Object.fromEntries(Object.entries(files).filter(([p]) => wanted(p)));
  return { sources: keep(sources), turns: turns.map(t => ({ ...t, files_before: keep(t.files_before),
    files_after: keep(t.files_after), files_changed: keep(t.files_changed ?? {}) })) };
}
// Produce exactly the evidence view used by live scoring; author-only assertions are not evidence.
export function fixtureJudgeEvidence(ref: string, book: RubricBook, c?: Case) {
  const resolved = resolveRubricTrace(ref, book);
  let events: Event[] = [];
  const turns = resolved.turns.map((t: Event) => {
    const recorded = [
      ...(t.actions ?? []).map((a:Event) => ({type:a.phase ?? "item.completed",order:a.order ?? 0,
        item:{...a,type:a.tool,tool:a.call ?? a.tool}})),
      ...(t.helper_events ?? []).map((e:Event,i:number) => ({...e,order:e.order ?? 1000+i})),
    ].sort((a,b) => a.order-b.order);
    events.push(...recorded);
    const actions = action_evidence("codex",recorded).map(action => ({...action,order:recorded.findIndex(e =>
      e.type === action.phase && e.item?.id === action.id)}));
    return {scripted_message:t.scripted_message, sent_message:t.sent_message, final_answer:t.final_answer,
      between_tools:t.between_tools ?? [], actions,
      files:t.files_after, file_diffs:fixtureDiffs(t.files_before,t.files_after),
      changes:Object.keys({...t.files_before,...t.files_after}).filter(p => t.files_before[p] !== t.files_after[p])
        .map(p => `${!(p in t.files_after) ? "removed" : p in t.files_before ? "changed" : "added"} ${p}`),
      trace_complete:t.trace_complete, helpers:helperEvidence("codex",events),
      turn:t.turn, chapter:t.chapter};
  });
  const turn = turns.at(-1)?.turn;
  return judgeEvidence(turns,resolved.sources,c?.turns[turn - 1]?.judge_files);
}
export function validateRubricFixtures(book: RubricBook = rubricFixtures, cases?: Case[]) {
  if (book.scope === "active" && !cases) throw Error("active rubric validation requires current cases");
  const expected = cases ? new Map<string, { tag: string; criterion: string }>(cases.flatMap(c => c.turns.flatMap((t, i) =>
    (t.rubric ?? []).map(r => [`${c.id}:${i + 1}:${r.id}`, r] as const)))) : undefined;
  if (!book.checks.length) throw Error("rubric book has no checks");
  if (book.library) {
    if (!expected) throw Error("library validation requires current cases");
    for (const part of resultChecks().filter(p => !p.exclusion)) {
      const row = book.library.find(r => r.id === part.id);
      if (!row || !cases!.some(c => c.id === row.case)) throw Error("library has uncovered result checks: " + part.id);
      expected.set(`${row.case}:${row.turn}:${row.id}`, {tag: `result:${part.skill}`, criterion: part.expected});
    }
    const keys = new Set(cases!.flatMap(c => c.turns.flatMap(t => (t.rubric ?? []).map(r => r.source_check))));
    for (const rule of ruleChecks()) if (!keys.has(rule.key)) throw Error("library has uncovered rule checks: " + rule.id);
  }
  if (cases?.some(c => c.chapters) && !book.library) throw Error("chaptered active books need library validation");
  const seen = new Set<string>();
  for (const row of [...book.checks, ...(book.library ?? [])]) {
    const key = `${row.case}:${row.turn}:${row.id}`, criterion = expected?.get(key);
    if (seen.has(key) || !row.tag?.trim() || !row.criterion?.trim() ||
      expected && (!criterion || criterion.tag !== row.tag || criterion.criterion !== row.criterion))
      throw Error("rubric fixture does not match current criterion: " + key);
    seen.add(key);
    const refs = [row.positive, ...(row.alternatives ?? []), row.negative];
    for (const [ref, verdict] of Object.entries(row.expectations ?? {}))
      if (!refs.includes(ref) || ![true,false,null,"not reached"].includes(verdict)) throw Error("invalid trace expectation");
    if (new Set(refs).size !== refs.length) throw Error("rubric needs distinct correct/alternative/wrong traces");
    for (const ref of refs) {
      const trace = rubricTrace(ref, book);
      if (trace.case !== row.case) throw Error("rubric trace belongs to another case");
      const current=cases?.find(c=>c.id===row.case);
      if (book.scope==="active" && current &&
        trace.chapter!==chapterAt(current,trace.observation.turn ?? row.turn)?.number)
        throw Error("rubric trace does not match the current chapter: " + ref);
      resolveRubricTrace(ref, book);
    }
  }
  if (expected && seen.size !== expected.size) throw Error("rubric fixtures have uncovered checks");
  return seen.size;
}
export function activeRubricBook(path: string | undefined, cases: Case[]) {
  if (!path) throw Error("active scoring needs --rubric-book FILE; historical validation cannot enable active scoring");
  const book = JSON.parse(readFileSync(path, "utf8")) as RubricBook;
  if (book.scope !== "active") throw Error("active scoring requires an active rubric book");
  validateRubricFixtures(book, cases);
  return book;
}
export function rubricFixtureHash(book: RubricBook = rubricFixtures) {
  // Active judgments expire on semantic definition drift as well as trace/criterion drift.
  const contract = book.scope === "active" ? ["judge-protocol.ts","fixture-validation.ts","rubric-fixtures.ts","chapters.ts","scenario.ts","trace.ts","legacy-reads.ts","access.ts","helpers.ts","measurement.ts","measure-turn.ts","rule-outcomes.ts","rule-checks.ts","run.ts","judgment-policy.ts","../check-rubric-fixtures.ts"]
    .map(file => [file,readFileSync(new URL(file,import.meta.url),"utf8")]) : undefined;
  const data = book.scope === "active" ? { book, rules: ruleChecks(), results: resultChecks(), contract } : book;
  return new Bun.CryptoHasher("sha256").update(JSON.stringify(data)).digest("hex");
}
export function rubricCandidates(book: RubricBook = rubricFixtures) {
  return [...book.checks, ...(book.library ?? [])].flatMap(row => [
    { ref: row.positive, expected: true },
    ...(row.alternatives ?? []).map(ref => ({ ref, expected: true })),
    { ref: row.negative, expected: false },
  ].map(candidate => ({ ...candidate, expected: row.expectations && candidate.ref in row.expectations ? row.expectations[candidate.ref]! : candidate.expected, check: `${row.case}:${row.turn}:${row.id}` })));
}
export const JUDGE_REPEATABILITY = {
  revision: "94fd856", changed: 3, compared: 239, rate: 3 / 239,
};
function gateRows(report: Event, candidates: ReturnType<typeof rubricCandidates>, book: RubricBook, hash: string) {
  const active = book.scope === "active";
  const key = (row: Event) => `${row.check}:${active ? row.ref : row.expected}`;
  const expected = new Map(candidates.map(c => [key(c),c]));
  if (report.model !== "gpt-6.1-sol" || report.fixture_hash !== hash ||
    !Array.isArray(report.results) || report.results.length !== expected.size ||
    report.expected_judgments !== undefined && report.expected_judgments !== expected.size)
    throw Error("rubric validation is incomplete or stale");
  const seen = new Map<string,Event>();
  for (const row of report.results) {
    const id=key(row), candidate=expected.get(id);
    if (!candidate || seen.has(id) || row.error || row.expected !== candidate.expected ||
      !row.judgment || ![true,false,null,"not reached"].includes(row.judgment.verdict))
      throw Error("rubric correct/wrong trace validation is incomplete or invalid");
    seen.set(id,row);
  }
  return new Map(candidates.map(c => [`${c.check}@${c.ref}`,seen.get(key(c))!]));
}
export function rubricMisses(report: Event, book: RubricBook = rubricFixtures) {
  if (!report || report.mode !== "full" || report.scoring_authorized === false)
    throw Error("reruns require a full report, never a preview or combined report");
  const candidates=rubricCandidates(book), rows=gateRows(report,candidates,book,rubricFixtureHash(book));
  return candidates.filter(c => rows.get(`${c.check}@${c.ref}`)!.judgment.verdict !== c.expected);
}
function gateReruns(reruns: Event[], misses: ReturnType<typeof rubricCandidates>, book: RubricBook, hash: string) {
  if (!Array.isArray(reruns) || reruns.length !== 2) throw Error("each miss needs two reruns on the same contract");
  return reruns.map((rerun:Event,index:number) => {
    if (!rerun || rerun.mode !== "rerun" || rerun.round !== index+1) throw Error("invalid or duplicated rerun round");
    return gateRows(rerun,misses,book,hash);
  });
}
function gateAnalysis(report: Event, book: RubricBook) {
  if (report.mode === "preview" || report.scoring_authorized === false)
    throw Error("preview reports cannot authorize scoring");
  if (report.mode !== undefined && !["full","combined"].includes(report.mode))
    throw Error("only a full or combined report can authorize scoring");
  const candidates=rubricCandidates(book), hash=rubricFixtureHash(book);
  const rows=gateRows(report,candidates,book,hash);
  const misses=candidates.filter(c => rows.get(`${c.check}@${c.ref}`)!.judgment.verdict !== c.expected);
  const noise: Event[]=[];
  if (report.mode === "combined") {
    const repeats=gateReruns(report.reruns,misses,book,hash);
    for (const c of misses) {
      const key=`${c.check}@${c.ref}`, verdicts=repeats.map(r => r.get(key)!.judgment.verdict);
      if (verdicts.some(v => v !== c.expected)) throw Error("a miss repeated in a rerun; rubric validation did not pass");
      noise.push({check:c.check,ref:c.ref,expected:c.expected,initial:rows.get(key)!.judgment.verdict,reruns:verdicts});
    }
  } else if (misses.length) throw Error("rubric correct/wrong trace validation did not pass");
  return {validated:candidates.length,fixture_hash:hash,noise_candidates:noise,flip_rate:{...JUDGE_REPEATABILITY}};
}
export function combineRubricReports(full: Event, reruns: Event[], book: RubricBook = rubricFixtures) {
  rubricMisses(full,book);
  const report={...full,mode:"combined",reruns};
  // Keep incomplete or repeated misses reportable; only validation decides whether scoring is allowed.
  let noise_candidates: Event[]=[];
  if (reruns.length === 2) {
    const misses=rubricMisses(full,book), hash=rubricFixtureHash(book);
    try {
      const rows=gateReruns(reruns,misses,book,hash);
      noise_candidates=misses.filter(c => rows.every(r=>r.get(`${c.check}@${c.ref}`)!.judgment.verdict===c.expected))
        .map(c=>({check:c.check,ref:c.ref,expected:c.expected,
          initial:full.results.find((r:Event)=>r.check===c.check && r.expected===c.expected && (book.scope!=="active" || r.ref===c.ref))!.judgment.verdict,
          reruns:rows.map(r=>r.get(`${c.check}@${c.ref}`)!.judgment.verdict)}));
    } catch { /* Failed or incomplete rounds remain visible and block the gate. */ }
  }
  const noiseKeys=new Set(noise_candidates.map(c=>`${c.check}@${c.ref}`));
  const combined={...report,noise_candidates,flip_rate:{...JUDGE_REPEATABILITY},
    blocking_candidates:rubricMisses(full,book).filter(c=>!noiseKeys.has(`${c.check}@${c.ref}`))};
  let gate_passed=false,gate_error:string|undefined;
  try {validateRubricReport(combined,book);gate_passed=true;} catch (error) {gate_error=String(error);}
  return {...combined,gate_passed,...(gate_error ? {gate_error} : {})};
}
export function validateRubricReport(report: Event, book: RubricBook = rubricFixtures) {
  const analysis=gateAnalysis(report,book);
  if (report.mode === "combined") {
    const noise=report.noise_candidates,keys=Array.isArray(noise) ? noise.map((c:Event)=>`${c.check}@${c.ref}`) : [];
    const retained=Array.isArray(noise) && noise.length===analysis.noise_candidates.length &&
      new Set(keys).size===keys.length && analysis.noise_candidates.every(c=>noise.some((row:Event)=>
        row.check===c.check && row.ref===c.ref && row.expected===c.expected && row.initial===c.initial &&
        Array.isArray(row.reruns) && row.reruns.length===2 && row.reruns.every((v:unknown)=>v===c.expected)));
    const rate=report.flip_rate,expected=analysis.flip_rate;
    if (!retained || !rate || rate.revision!==expected.revision || rate.changed!==expected.changed ||
      rate.compared!==expected.compared || rate.rate!==expected.rate)
      throw Error("combined report must retain its noise candidates and measured flip rate");
  }
  return analysis.validated;
}
export function rubricValidationSummary(report: Event, book: RubricBook = rubricFixtures) {
  validateRubricReport(report,book);
  return gateAnalysis(report,book);
}
