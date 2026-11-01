import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { checkedJudgment, FIXTURE_INSTRUCTION, judgeData, resultRubric, structuredPrompt } from "./judge-protocol";
import { fixturePayload, fixtureBatches, checkedFixtureBatch, fixtureEntries, loadingFixtureResults, type FixtureEntry } from "./fixture-validation";
import { rubricBatch } from "./scenario";
import { fixtureJudgeEvidence, rubricFixtureHash, rubricFixtures, type RubricBook } from "./rubric-fixtures";
import { ruleChecks, resultChecks } from "./rule-checks";
import { loadCases } from "./cases";
import { helperEvidence } from "./helpers";
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
  const proof=fixtureJudgeEvidence("t23:alternative",book,c), turn=proof.turns.at(-1)!;
  expect(turn).not.toHaveProperty("access");expect(turn).not.toHaveProperty("helper_controls");
  expect(turn).not.toHaveProperty("files_before");expect(turn).not.toHaveProperty("files_after");
  for(const a of turn.actions){expect(a).not.toHaveProperty("output");expect(a).not.toHaveProperty("extent");}
  const events=book.traces["t23:alternative"]!.observation.helper_events;
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
  for(const row of [
    {verdict:true,reason:"part proof",parts:[{verdict:true,action:"check"}]},
    {verdict:null,reason:"part failure",parts:[{verdict:false,action:"check"}]},
    {verdict:true,reason:"no parts",quote:"Finished."},
    {verdict:false,reason:"supported overall failure",quote:"Finished.",parts:[{verdict:true,action:"check"}]},
  ]) {
    const judgment=checkedJudgment(e.request,row);
    const turn={final_answer:e.request.answer,actions:[{id:"check",order:0}],judgments:[judgment]};
    const run={case:"unit",agent:"codex",model:"test",run:1,user_mode:"fixed",condition:"installed",skill_sources:{}};
    const live=measuredOpportunities(run,turn,[e.request.rubric],accessTurn("codex",[],1,{})).find(o=>o.id==="act:rule:3")!;
    expect(judgment.verdict).toBe(opportunity(live.parts).verdict);
  }
});
