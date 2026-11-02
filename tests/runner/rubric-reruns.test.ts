import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { rubricCandidates, rubricFixtureHash, rubricFixtures, rubricMisses, combineRubricReports,
  validateRubricReport, rubricValidationSummary, type RubricBook } from "./rubric-fixtures";
import { fixtureEntries, rerunFixtureMisses } from "./fixture-validation";
import { summarize } from "./reports";
import type { Event } from "./types";
function book(): RubricBook {
  return {scope:"active",sources:{unit:{"source.md":"Known source"}},traces:Object.fromEntries(
    ["good","alternative","bad"].map(ref=>[ref,{case:"unit",prior:[],observation:{turn:1,
      final_answer:`The ${ref} result is observable.`,actions:[],files_changed:{},trace_complete:true}}])),
    checks:[{case:"unit",turn:1,id:"result",tag:"task",criterion:"Returns the result",positive:"good",
      alternatives:["alternative"],negative:"bad",expectations:{alternative:null}}]};
}
function full(b:RubricBook, missed=["good"]):Event {
  return {mode:"full",model:"gpt-6.1-sol",fixture_hash:rubricFixtureHash(b),
    expected_judgments:rubricCandidates(b).length,results:rubricCandidates(b).map(c=>({...c,
      judgment:{verdict:missed.includes(c.ref)?c.expected===true?false:true:c.expected},matches:true}))};
}
function repeat(f:Event,b:RubricBook,ordinal:number):Event {
  const missed=rubricMisses(f,b);
  return {mode:"rerun",round:ordinal,scoring_authorized:false,model:f.model,fixture_hash:f.fixture_hash,
    expected_judgments:missed.length,results:missed.map(c=>({...c,judgment:{verdict:c.expected}}))};
}
test("a perfect full gate needs no reruns, while two matches retain a visible noise exception",()=>{
  const b=book(),perfect=full(b,[]);
  expect(validateRubricReport(perfect,b)).toBe(3);
  expect(rubricValidationSummary(perfect,b).noise_candidates).toEqual([]);
  const initial=full(b),before=JSON.stringify(initial);
  expect(rubricMisses(initial,b).map(c=>c.ref)).toEqual(["good"]);
  const combined=combineRubricReports(initial,[repeat(initial,b,1),repeat(initial,b,2)],b);
  expect(combined.gate_passed).toBe(true);expect(validateRubricReport(combined,b)).toBe(3);
  expect(combined.noise_candidates).toEqual([{check:"unit:1:result",ref:"good",expected:true,initial:false,reruns:[true,true]}]);
  expect(combined.flip_rate).toMatchObject({changed:3,compared:239,revision:"94fd856",rate:3/239});
  expect(JSON.stringify(initial)).toBe(before);
});
test("either repeated miss blocks, including unknown reruns against an expected Boolean",()=>{
  const b=book(),initial=full(b);
  for(const index of [0,1])for(const verdict of [false,null]){
    const rounds=[repeat(initial,b,1),repeat(initial,b,2)];rounds[index]!.results[0].judgment.verdict=verdict;
    const combined=combineRubricReports(initial,rounds,b);
    expect(combined.gate_passed).toBe(false);expect(combined.blocking_candidates).toHaveLength(1);
    expect(()=>validateRubricReport({...combined,gate_passed:true},b)).toThrow("miss repeated");
  }
  const unknown=full(b,["alternative"]);
  expect(validateRubricReport(combineRubricReports(unknown,[repeat(unknown,b,1),repeat(unknown,b,2)],b),b)).toBe(3);
});
test("missing, extra, duplicated or preview rounds cannot substitute for two numbered reruns",()=>{
  const b=book(),initial=full(b),one=repeat(initial,b,1),two=repeat(initial,b,2);
  for(const rounds of [[],[one],[one,one],[one,two,two],[one,{...two,mode:"preview"}],
    [one,{...two,round:undefined}]])
    expect(()=>validateRubricReport(combineRubricReports(initial,rounds,b),b)).toThrow();
  expect(()=>validateRubricReport({...full(b,[]),mode:"preview"},b)).toThrow("preview");
  expect(()=>validateRubricReport({...full(b,[]),mode:"rerun"},b)).toThrow("full or combined");
  expect(()=>rubricMisses({...initial,mode:"preview"},b)).toThrow("full report");
});
test("stale hashes, wrong models, missing rows and foreign or duplicate rerun candidates fail closed",()=>{
  const b=book(),initial=full(b,["good","bad"]);
  for(const mutate of [
    (r:Event)=>{r.fixture_hash="stale";},(r:Event)=>{r.model="other";},
    (r:Event)=>{r.results.pop();},(r:Event)=>{r.results[1]=structuredClone(r.results[0]);},
    (r:Event)=>{r.results[0].ref="foreign";},(r:Event)=>{r.results[0].expected=null;},
    (r:Event)=>{r.results[0].error="missing judgment";},(r:Event)=>{delete r.results[0].judgment;},
  ]){
    const rounds=[repeat(initial,b,1),repeat(initial,b,2)];mutate(rounds[1]!);
    expect(()=>validateRubricReport(combineRubricReports(initial,rounds,b),b)).toThrow();
  }
  expect(()=>rubricMisses({...initial,fixture_hash:"stale"},b)).toThrow("stale");
  const extra=repeat(full(b),b,1);extra.results.push(full(b,[]).results[1]);
  expect(()=>validateRubricReport(combineRubricReports(full(b),[extra,repeat(full(b),b,2)],b),b)).toThrow();
});
test("noise metadata and its measured flip rate cannot disappear from an accepted combined report",()=>{
  const b=book(),initial=full(b),combined=combineRubricReports(initial,[repeat(initial,b,1),repeat(initial,b,2)],b);
  for(const overrides of [{noise_candidates:[]},{noise_candidates:undefined},{flip_rate:undefined},
    {flip_rate:{changed:0,compared:239,rate:0}}])
    expect(()=>validateRubricReport({...combined,...overrides},b)).toThrow("retain its noise");
  const reordered={...combined,noise_candidates:combined.noise_candidates.map((row:Event)=>
    Object.fromEntries(Object.entries(row).reverse())),flip_rate:Object.fromEntries(Object.entries(combined.flip_rate).reverse())};
  expect(validateRubricReport(reordered,b)).toBe(3);
});
test("rerun dispatch selects only full-report misses and calls exactly two fresh phases",async()=>{
  const b=book(),initial=full(b),calls:Event[]=[],updates:Event[]=[];
  const combined=await rerunFixtureMisses(initial,b,fixtureEntries(b),async(selected,ordinal,checkpoint)=>{
    calls.push({refs:selected.map(e=>e.ref),ordinal});
    const result=repeat(initial,b,ordinal);checkpoint(result);return result;
  },r=>updates.push(r));
  expect(calls).toEqual([{refs:["good"],ordinal:1},{refs:["good"],ordinal:2}]);
  expect(updates[0]!.gate_passed).toBe(false);expect(updates.at(-1)!.gate_passed).toBe(true);
  expect(validateRubricReport(combined,b)).toBe(3);
});
test("a failed rerun stays visible and blocks instead of generating extra retry phases",async()=>{
  const b=book(),initial=full(b);let calls=0;
  const combined=await rerunFixtureMisses(initial,b,fixtureEntries(b),async(_selected,ordinal)=>{
    calls++;return ordinal===1?{...repeat(initial,b,ordinal),results:[{error:"transport failed"}]}:repeat(initial,b,ordinal);
  });
  expect(calls).toBe(2);expect(combined.reruns[0].results[0].error).toBe("transport failed");
  expect(combined.gate_passed).toBe(false);expect(()=>validateRubricReport(combined,b)).toThrow();
});
test("run summaries keep the accepted noise names and historical flip measurement",()=>{
  const b=book(),initial=full(b),combined=combineRubricReports(initial,[repeat(initial,b,1),repeat(initial,b,2)],b);
  const summary=summarize([{case:"unit",agent:"codex",model:"gpt-6.1-sol",run:1,cost:0,checks:{},turns:[],
    rubric_validation:rubricValidationSummary(combined,b)}],0);
  expect(summary).toContain("Nonblocking noise: unit:1:result, trace good");
  expect(summary).toContain("3/239 (1.3%)");expect(summary).toContain("initial false; expected true; reruns true, true");
  const unknown=full(b,["alternative"]),noise=combineRubricReports(unknown,[repeat(unknown,b,1),repeat(unknown,b,2)],b);
  expect(summarize([{case:"unit",agent:"codex",model:"gpt-6.1-sol",run:1,cost:0,checks:{},turns:[],
    rubric_validation:rubricValidationSummary(noise,b)}],0)).toContain("expected null; reruns null, null");
});
test("the rerun CLI plans exactly its misses twice without login and preserves the full report",()=>{
  const root=mkdtempSync(join(tmpdir(),"rubric-rerun-cli-"));
  try{
    const initial=full(rubricFixtures,[rubricCandidates(rubricFixtures)[0]!.ref]);
    const source=join(root,"full.json"),output=join(root,"plan.json");
    writeFileSync(source,JSON.stringify(initial));const before=readFileSync(source,"utf8");
    const args=["tests/check-rubric-fixtures.ts",output,"--historical","--rerun-misses",source,"--dry-run"];
    const ran=spawnSync(process.execPath,args,{encoding:"utf8"});expect(ran.status,ran.stderr).toBe(0);
    const plan=JSON.parse(readFileSync(output,"utf8"));
    expect(plan).toMatchObject({mode:"rerun",rounds:2,model_calls:0,scoring_authorized:false});
    expect(plan.candidates).toHaveLength(rubricMisses(initial,rubricFixtures).length);
    expect(readFileSync(source,"utf8")).toBe(before);
    writeFileSync(source,JSON.stringify({...initial,mode:"preview"}));
    expect(spawnSync(process.execPath,args,{encoding:"utf8"}).stderr).toContain("full report");
    for(const invalid of [null,false,0]){
      writeFileSync(source,JSON.stringify(invalid));
      expect(spawnSync(process.execPath,args,{encoding:"utf8"}).stderr).toContain("full report");
    }
    expect(spawnSync(process.execPath,[...args,"--preview"],{encoding:"utf8"}).stderr).toContain("cannot be combined");
    expect(spawnSync(process.execPath,["tests/check-rubric-fixtures.ts",source,"--historical","--rerun-misses",source,
      "--dry-run"],{encoding:"utf8"}).stderr).toContain("new output");
  }finally{rmSync(root,{recursive:true,force:true});}
},30000);
