import { test, expect } from "bun:test";
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { checkedJudgment, FIXTURE_INSTRUCTION, judgeData, resultRubric, structuredPrompt } from "./judge-protocol";
import { fixturePayload, fixtureBatches, checkedFixtureBatch, fixtureEntries, fixtureManifest, previewEntries,
  candidateKey, loadingFixtureResults, type FixtureEntry } from "./fixture-validation";
import { rubricBatch } from "./scenario";
import { fixtureJudgeEvidence, rubricFixtureHash, rubricFixtures, validateRubricReport, type RubricBook } from "./rubric-fixtures";
import { ruleChecks, resultChecks } from "./rule-checks";
import { loadCases } from "./cases";
import { helperEvidence } from "./helpers";
import { USER_REQUEST_DELIVERY } from "./judgment-policy";
const entry = (id="one"): FixtureEntry => ({id,ref:"trace",check:"unit:1:check",expected:true,
  request:{rubric:{id:"rule",tag:"rule",criterion:"Return an answer",source_check:"requested-work"},answer:"Finished.",
    evidence:{current_turn:1,turns:[{final_answer:"Finished.",actions:[{id:"check",order:0}]}]}}});

test("fixture criteria, sources and response verification are the live protocol", async () => {
  const e=entry(), payload=fixturePayload([e]);
  const live=judgeData([e.request]);
  expect(payload.criteria[0]!.full_rule).toBe(live.criteria[0]!.full_rule);
  expect(payload.traces["trace-1"]).toEqual({answer:live.answer,evidence:live.evidence});
  const raw={id:e.id,verdict:true,reason:"looks fine"};
  expect(checkedFixtureBatch([e],{results:[raw]})[0]!.judgment.verdict).toBeNull();
  expect(checkedJudgment(e.request,raw).verdict).toBeNull();
  const cite={...raw,quote:"Finished.",parts:[{verdict:true,quote:"Finished.",deadline_action:null}]};
  expect(checkedFixtureBatch([e],{results:[cite]})[0]!.judgment.verdict).toBe(true);
  expect(checkedJudgment(e.request,{...cite,parts:undefined}).verdict).toBeNull();
  const bad={...cite,parts:[{verdict:false,action:"check"}]};
  expect(checkedJudgment(e.request,bad).verdict).toBe(false);
  const part=resultChecks().find(p=>p.skill==="understand-clarify")!;
  expect(resultRubric(part).criterion).toContain(part.source.text);
  expect(resultRubric(part).criterion).toContain(part.alternatives);
  const lean=entry();lean.request.rubric.source_check="act-rightsize-lean:rule:3";
  const criterion=fixturePayload([lean]).criteria[0]!;
  expect(criterion.source_context[0].id).toBe("act-rightsize:rule:6");
  expect(criterion.source_context[0].source.text).toContain("pending proposal");
  expect(judgeData([lean.request]).criteria[0]!.source_context).toEqual(criterion.source_context);
});
test("shared user-delivery criteria differ from guide stage returns in both live and fixture requests",()=>{
  for(const rubric of [
    {id:"scope",tag:"habit:requested-scope",criterion:"Scope"},
    {id:"outcomes",tag:"task:outcomes",criterion:"Outcome"},
    {id:"rule",tag:"rule:act:rule:3",source_check:"requested-work",criterion:"Requested work"},
  ]){
    const e=entry();e.request.rubric=rubric;
    const fixture=fixturePayload([e]).criteria[0]!,live=judgeData([e.request]).criteria[0]!;
    expect(fixture.criterion).toBe(live.criterion);
    expect(live.criterion).toContain(USER_REQUEST_DELIVERY);
    expect(rubric.criterion).not.toContain(USER_REQUEST_DELIVERY);
  }
  const e=entry(),part=resultChecks().find(p=>p.skill==="coordinate-delegate-crew")!;
  e.request.rubric=resultRubric(part);
  expect(fixturePayload([e]).criteria[0]!.criterion).not.toContain(USER_REQUEST_DELIVERY);
  e.request.rubric={id:"rule",tag:"rule:understand:rule:5",source_check:"understand:rule:5",criterion:"Choice"};
  expect(judgeData([e.request]).criteria[0]!.criterion).toBe("Choice");
});
test("shared traces are sent once and full serialized prompt limits include envelopes and instructions", () => {
  const a=entry("a"),b=entry("b");
  const payload=fixturePayload([a,b]);expect(Object.keys(payload.traces)).toHaveLength(1);
  expect(payload.criteria.map(r=>r.id)).toEqual(["a","b"]);
  const exact=structuredPrompt(FIXTURE_INSTRUCTION,fixturePayload([a])).length;
  expect(fixtureBatches([a],exact)).toHaveLength(1);
  expect(()=>fixtureBatches([a],exact-1)).toThrow("indivisible");
  const split=fixtureBatches([a,b],exact);
  expect(split).toHaveLength(2);
  expect(split.flat().map(e=>e.id)).toEqual(["a","b"]);
  for(const batch of split)expect(structuredPrompt(FIXTURE_INSTRUCTION,fixturePayload(batch)).length).toBeLessThanOrEqual(exact);
});
test("malformed batch rows cannot append a valid prefix, and reordered ids remain exact", () => {
  const a=entry("a"),b=entry("b"), accepted:any[]=[];
  try {accepted.push(...checkedFixtureBatch([a,b],{results:[{id:"a",verdict:true,reason:"first"},{id:"b",verdict:"bad",reason:"invalid"}]}));}catch{}
  expect(accepted).toEqual([]);
  const valid={results:[{id:"b",verdict:null,reason:"unknown"},{id:"a",verdict:null,reason:"unknown"}]};
  expect(checkedFixtureBatch([a,b],valid).map(r=>r.id)).toEqual(["a","b"]);
  for(const results of [[valid.results[0]],[valid.results[0],valid.results[0]],[valid.results[0],{id:"foreign",verdict:null,reason:"unknown"}]])
    expect(()=>checkedFixtureBatch([a,b],{results})).toThrow();
});
test("whole-guide checks have no semantic model call, while native access is kept outside judge evidence", async () => {
  const e=entry();e.request.rubric.source_check="route-act";
  let calls=0;
  const result=await rubricBatch(async()=>{calls++;throw Error("no semantic call for loading");},[e.request]);
  expect(calls).toBe(0);expect(result[0]!.verdict).toBeNull();
  expect(loadingFixtureResults([e])[0]!.judgment.verdict).toBeNull();
  expect(fixtureBatches([e])).toEqual([]);
});
test("fixture evidence uses native helper extraction and the live allowlist", () => {
  const c=loadCases()[0]!, book=JSON.parse(readFileSync("tests/calibration/festival-traces.json","utf8")) as RubricBook;
  const proof=fixtureJudgeEvidence("t23:correct",book,c), turn=proof.turns.at(-1)!;
  expect(turn).not.toHaveProperty("access");expect(turn).not.toHaveProperty("helper_controls");
  expect(turn).not.toHaveProperty("files_before");expect(turn).not.toHaveProperty("files_after");
  for(const a of turn.actions){expect(a).not.toHaveProperty("output");expect(a).not.toHaveProperty("extent");}
  const events=book.traces["t23:correct"]!.observation.helper_events;
  const identity=(h:any)=>({id:h.id,brief:h.brief,result:h.result,fresh:h.fresh,start:h.start?.action,end:h.end?.action});
  expect(turn.helpers.helpers.map(identity)).toEqual(helperEvidence("codex",events).helpers.map(identity));
  for(const h of turn.helpers.helpers)expect(h.start.order).toBe(turn.actions.find((a:any)=>a.id===h.start.action).order);
  expect(turn.helpers.helpers).toHaveLength(3);
  expect(turn.helpers.helpers.map((h:any)=>h.brief).join("\n")).toContain("sole writer");
});
test("active report hashes bind the scoring contract as well as book and guide sources", () => {
  const b:RubricBook={scope:"active",sources:{},traces:{},checks:[]};
  const old=new Bun.CryptoHasher("sha256").update(JSON.stringify({book:b,rules:ruleChecks(),results:resultChecks()})).digest("hex");
  expect(rubricFixtureHash(b)).not.toBe(old);
  const historical=JSON.parse(readFileSync("tests/calibration/scenario-traces.json","utf8"));
  expect(rubricFixtureHash(rubricFixtures)).toBe(new Bun.CryptoHasher("sha256").update(JSON.stringify(historical)).digest("hex"));
});

test("an actual dispatch checks the complete request before calling and stays atomic", async () => {
  const {runFixtureBatch}=await import("./fixture-validation");
  let calls=0;const e=entry();
  const call=async()=>{calls++;return {results:[{id:e.id,verdict:null,reason:"unobserved"}]};};
  await expect(runFixtureBatch(call,[e],10)).rejects.toThrow("complete prompt");expect(calls).toBe(0);
  expect((await runFixtureBatch(call,[e]))[0]!.judgment.verdict).toBeNull();expect(calls).toBe(1);
});
test("a batch retries a busy judge a bounded number of times and never retries other failures", async () => {
  const {runFixtureBatch,FIXTURE_RETRY_POLICY}=await import("./fixture-validation");
  const e=entry(),busy=Error("scenario model failed (exit 1): Selected model is at capacity. Please try a different model.");
  const flaky=(failures:number,error=busy)=>{let calls=0;return {count:()=>calls,call:async()=>{
    if(++calls<=failures)throw error;return {results:[{id:e.id,verdict:null,reason:"unobserved"}]};}};};
  const retries:unknown[]=[],wait=async()=>{};
  const once=flaky(1);
  expect((await runFixtureBatch(once.call,[e],undefined,{onRetry:r=>retries.push(r),wait}))[0]!.judgment.verdict).toBeNull();
  expect(once.count()).toBe(2);expect(retries).toHaveLength(1);
  const always=flaky(99);
  await expect(runFixtureBatch(always.call,[e],undefined,{wait})).rejects.toThrow("at capacity");
  expect(always.count()).toBe(FIXTURE_RETRY_POLICY.max_attempts);
  const denied=flaky(1,Error("scenario model failed (exit 1): authentication failed"));
  await expect(runFixtureBatch(denied.call,[e],undefined,{wait})).rejects.toThrow("authentication");
  expect(denied.count()).toBe(1);
});
test("explicit unknown expectations survive the structural gate without being called semantic passes", () => {
  const b=JSON.parse(readFileSync("tests/calibration/festival-traces.json","utf8")) as RubricBook;
  const c=loadCases(), entries=fixtureEntries(b,c), direct=loadingFixtureResults(entries);
  expect(direct.length).toBeGreaterThan(0);
  expect(direct.every(r=>r.expected===null && r.matches)).toBe(true);
  expect(b.scope).toBe("active");
});

test("source aggregation matches the final live opportunity, including part-only evidence", async () => {
  const {accessTurn}=await import("./access"), {measuredOpportunities}=await import("./measure-turn"), {opportunity}=await import("./measurement");
  const e=entry();
  (e.request.evidence as any).turns[0].actions.push({id:"second",order:1});
  for(const row of [
    {verdict:true,reason:"part proof",parts:[{verdict:true,action:"check"}]},
    {verdict:true,reason:"several checks",parts:[{verdict:true,action:["check","second"]}]},
    {verdict:null,reason:"part failure",parts:[{verdict:false,action:"check"}]},
    {verdict:true,reason:"no parts",quote:"Finished."},
    {verdict:false,reason:"supported overall failure",quote:"Finished.",parts:[{verdict:true,action:"check"}]},
  ]) {
    const judgment=checkedJudgment(e.request,row);
    const turn={final_answer:e.request.answer,actions:[{id:"check",order:0},{id:"second",order:1}],judgments:[judgment]};
    const run={case:"unit",agent:"codex",model:"test",run:1,user_mode:"fixed",condition:"installed",skill_sources:{}};
    const live=measuredOpportunities(run,turn,[e.request.rubric],accessTurn("codex",[],1,{})).find(o=>o.id==="act:rule:3")!;
    expect(judgment.verdict).toBe(opportunity(live.parts).verdict);
    expect(live.parts.every(p=>p.evidence===undefined || typeof p.evidence==="string")).toBe(true);
  }
});

test("several action citations survive shared verification, with the original response retained", async () => {
  const e=entry();
  (e.request.evidence as any).turns[0].actions.push({id:"second",order:1});
  expect(checkedJudgment(e.request,{verdict:true,reason:"quote only",quote:"Finished.",action:null,
    parts:[{verdict:true,quote:"Finished.",action:null}]}).verdict).toBe(true);
  for (const action of [["check","second"],"check; second"]) {
    const raw={id:e.id,verdict:true,reason:"Both checks are recorded",action,
      parts:[{verdict:true,action,deadline_action:null}]};
    const judged=checkedJudgment(e.request,raw);
    expect(judged.verdict).toBe(true);
    expect(checkedFixtureBatch([e],{results:[raw]})[0]!.judgment).toEqual(judged);
    expect((await rubricBatch(async()=>({results:[{...raw,id:e.request.rubric.id}]}),[e.request]))[0]!.verdict).toBe(true);
    expect(judged.raw).toEqual(raw);expect(judged.raw).not.toBe(raw);
  }
  for (const action of [["check","invented"],"check; invented",["check",""]]) {
    const raw={verdict:true,reason:"bad reference",quote:"Finished.",action,
      parts:[{verdict:true,quote:"Finished.",action}]};
    const judged=checkedJudgment(e.request,raw);
    expect(judged.verdict).toBeNull();
    expect((judged as any).parts[0].verdict).toBeNull();
    expect(judged.raw?.verdict).toBe(true);expect(judged.raw?.parts[0].verdict).toBe(true);
    expect(raw.parts[0]!.verdict).toBe(true);
  }
});

test("preview selects stable names, prior misses and changed trace requests or expectations", () => {
  const old=[entry("a"),entry("b"),entry("c"),entry("d")];
  old.forEach(e=>e.ref=e.id);
  const report={candidates:fixtureManifest(old),results:old.map(e=>({...e,matches:e.id!=="b"}))};
  const current=structuredClone(old);
  current[2]!.request.answer="Different trace";
  current[3]!.expected=null;
  expect(previewEntries(current,[old[0]!],report).map(e=>e.id)).toEqual(["a","b","c","d"]);
  expect(previewEntries(current,[],{results:report.results},old).map(e=>e.id)).toEqual(["b","c","d"]);
  expect(previewEntries(current,[old[0]!,old[0]!]).map(candidateKey)).toEqual([candidateKey(old[0]!)]);
  expect(()=>previewEntries(current,[],{results:report.results})).toThrow("--baseline-book");
  expect(()=>previewEntries(current,[{check:"absent",ref:"absent"}])).toThrow("unknown preview");
  expect(()=>previewEntries(current)).toThrow("no candidates");
  expect(previewEntries(current,[],{...report,results:[{error:"failed",candidates:[old[0]]}]}).map(e=>e.id))
    .toEqual(["a","c","d"]);
});

test("even a complete matching preview can never open the scoring gate", () => {
  const results=fixtureEntries(rubricFixtures).map(e=>({check:e.check,ref:e.ref,
    expected:e.expected,judgment:{verdict:e.expected}}));
  const complete={model:"gpt-6.1-sol",fixture_hash:rubricFixtureHash(),results};
  expect(validateRubricReport(complete)).toBe(results.length);
  expect(()=>validateRubricReport({...complete,mode:"preview"})).toThrow("cannot authorize");
  expect(()=>validateRubricReport({...complete,scoring_authorized:false})).toThrow("cannot authorize");
});

test("preview CLI writes an exact account-free plan and rejects invalid selection before dispatch", () => {
  const root=mkdtempSync(join(tmpdir(),"rubric-preview-"));
  try {
    const output=join(root,"plan.json"), names=join(root,"candidates.json");
    const first=fixtureEntries(rubricFixtures)[0]!;
    writeFileSync(names,JSON.stringify([{check:first.check,ref:first.ref}]));
    const args=["tests/check-rubric-fixtures.ts",output,"--historical","--dry-run","--candidates",names];
    const run=spawnSync(process.execPath,[...args,"--preview"],{encoding:"utf8"});
    expect(run.status,run.stderr).toBe(0);
    const plan=JSON.parse(readFileSync(output,"utf8"));
    expect(plan).toMatchObject({mode:"preview",scoring_authorized:false,expected_judgments:1,model_calls:0,results:[]});
    expect(plan.candidates.map(candidateKey)).toEqual([candidateKey(first)]);
    expect(run.stdout).toContain("no model calls");
    expect(spawnSync(process.execPath,args,{encoding:"utf8"}).stderr).toContain("require --preview");
    writeFileSync(names,JSON.stringify([{check:"typo",ref:"typo"}]));
    const bad=spawnSync(process.execPath,[...args,"--preview"],{encoding:"utf8"});
    expect(bad.status).not.toBe(0);expect(bad.stderr).toContain("unknown preview candidate");
  } finally {rmSync(root,{recursive:true,force:true});}
},30000);
