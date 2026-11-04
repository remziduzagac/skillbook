import { test,expect } from "bun:test";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { rubricTrace,fixtureJudgeEvidence,activeRubricBook,rubricCandidates,resolveRubricTrace } from "./rubric-fixtures";
import { loadCases } from "./cases";
import { fixtureEntries,fixtureBatches,fixturePayload,loadingFixtureResults } from "./fixture-validation";
import { structuredPrompt,FIXTURE_INSTRUCTION } from "./judge-protocol";
const cases=loadCases().filter(x=>x.id==="essentials/festival"),book=activeRubricBook("tests/calibration/festival-traces.json",cases),c=cases[0]!;
const observation=(ref:string)=>rubricTrace(ref,book).observation;
test("correct helper traces run the workers, while fallback alternatives retain the failed start",()=>{
  const design=fixtureJudgeEvidence("t7:correct",book,c).turns.at(-1)!;
  const write=design.actions.find((a:any)=>a.tool==="file_change").order;
  for(const path of ["decisions.md","council/update-2026.md","handbook.md"])
    expect(design.actions.find((a:any)=>a.command===`cat ${path}`).order).toBeLessThan(write);
  expect(design.actions.find((a:any)=>a.id==="read-saved-items").order).toBeGreaterThan(write);
  for(const n of [7,17,22,23,24]){
    const correct=fixtureJudgeEvidence(`t${n}:correct`,book,c).turns.at(-1)!;
    expect(correct.helpers.helpers.some((h:any)=>h.start && h.result)).toBe(true);
    const turn=fixtureJudgeEvidence(`t${n}:alternative`,book,c).turns.at(-1)!;
    expect(turn.actions.some((a:any)=>a.call==="spawn_agent"&&a.status==="failed")).toBe(true);
    expect(turn.helpers.helpers.every((h:any)=>h.start===null)).toBe(true);
    expect(turn.final_answer).not.toContain("controls were unavailable");
  }
  const crew=fixtureJudgeEvidence("t23:correct",book,c).turns.at(-1)!;
  expect(crew.actions.find((a:any)=>a.command==="cat decisions.md").order)
    .toBeLessThan(Math.min(...crew.actions.filter((a:any)=>a.call==="spawn_agent").map((a:any)=>a.order)));
});
test("authored inventory, link, source and preservation checks execute and reject changed required content",()=>{
  for(const [n,id,path,mutate] of [
    [7,"check-design-inventory","design.md",(s:string)=>s.replaceAll("No alcohol","Alcohol permitted")],
    [20,"check-index-coverage","handbook/index.md",(s:string)=>s.replace(/\]\([^)]+\)/g,"](#missing)")],
    [21,"check-welcome-source-comparison","welcome.md",(s:string)=>s.replaceAll("hat","coat")],
    [22,"check-kept-contacts","duplicate-contacts.csv",(s:string)=>s+"changed"],
  ] as const){
    const root=mkdtempSync(join(tmpdir(),"festival-authored-check-"));
    try{
      const trace=resolveForCheck(`t${n}:correct`);
      for(const [p,s] of Object.entries(trace.files)){mkdirSync(dirname(join(root,p)),{recursive:true});writeFileSync(join(root,p),s as string);}
      const action=observation(`t${n}:correct`).actions.find((a:any)=>a.id===id);
      const run=()=>spawnSync("sh",["-c",action.command],{cwd:root,encoding:"utf8"});
      const good=run();expect(good.status,good.stderr).toBe(0);
      writeFileSync(join(root,path),mutate(trace.files[path]));
      expect(run().status).not.toBe(0);
    }finally{rmSync(root,{recursive:true,force:true});}
  }
});
function resolveForCheck(ref:string){
  const trace=resolveRubricTrace(ref,book);
  return {files:trace.turns.at(-1)!.files_after};
}
test("the fanout trace's exact contract check accepts consolidation and rejects lost negative results",()=>{
  const action=observation("t17:correct").actions.find((a:any)=>a.id==="check-findings-contract-and-preservation");
  const script=`
import ast,json,os,shlex,subprocess,sys,tempfile
from pathlib import Path
data=json.load(sys.stdin);code=shlex.split(data['command'])[2]
expected=next(ast.literal_eval(n.value) for n in ast.parse(code).body if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id=='expected')
with tempfile.TemporaryDirectory(prefix='festival-contract-') as folder:
    root=Path(folder);scratch=root/'scratch';scratch.mkdir()
    for path,text in data['sources'].items():
        if path.startswith('notes/'):
            p=root/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
    for path,rows in expected.items():(scratch/path).write_text(''.join(json.dumps(r)+'\\n' for r in rows))
    bundled=Path.cwd()/'skills/essentials/references/coordinate/delegate/fanout/scripts/consolidate.py'
    result=subprocess.run(['python3','-I',str(bundled),'--source-root',str(root),*[str(scratch/p)for p in expected]],capture_output=True,text=True,check=True)
    output=scratch/'consolidated.json';output.write_text(result.stdout)
    env={**os.environ,'TMPDIR':str(scratch)}
    assert subprocess.run(['python3','-c',code],cwd=root,env=env,capture_output=True).returncode==0
    broken=json.loads(output.read_text());broken['not_found']=[];output.write_text(json.dumps(broken))
    assert subprocess.run(['python3','-c',code],cwd=root,env=env,capture_output=True).returncode!=0
`;
  const result=spawnSync("python3",["-I","-c",script],{encoding:"utf8",input:JSON.stringify({command:action.command,
    sources:book.chapter_sources![`${c.id}:${rubricTrace("t17:correct",book).chapter}`]})});
  expect(result.status,result.stderr).toBe(0);
});
test("correct artifacts carry their required content and a checkable plan",()=>{
  expect(observation("t6:correct").files_changed["decisions.md"]).toContain("## Next steps");
  const design=observation("t7:correct").files_changed["design.md"];
  expect(design).toContain("No alcohol");expect(design).toContain("Reasons for the detailed choices");
  const plan=observation("t11:correct").final_answer;
  const rows=plan.split("\n").filter((s:string)=>s.startsWith("| [ ]"));
  expect(rows).toHaveLength(3);
  expect(rows.every((s:string)=>s.split("|")[4]!.trim().length>0)).toBe(true);
  expect(rows[0]).toContain("application procedure");expect(rows[1]).toContain("usable capacity");
  expect(rows[2]).toContain("next executable checklist");expect(rows[2]).toContain("D1, D2");
  expect(plan).toContain("No downstream execution begins under this discovery checklist");
  for(const n of [18,19])expect(observation(`t${n}:correct`).final_answer).toContain("Switch on hall lights");
  expect(observation("t19:correct").final_answer).toContain("| Proposed page | Boundary |");
});
test("source investigations record actual folder contents rather than only claiming to read them",()=>{
  for(const [n,path] of [[12,"council/update-2026.md"],[14,"signups/import-log.txt"],[17,"notes/40.md"],[27,"roles/first-aid.md"]] as const) {
    const actions=fixtureJudgeEvidence(`t${n}:correct`,book,c).turns.at(-1)!.actions;
    expect(actions.some((a:any)=>a.command===`cat ${path}` && a.exit_code===0)).toBe(true);
  }
  expect(observation("t15:correct").actions.some((a:any)=>a.id==="check-extraction-removed")).toBe(true);
});
test("wrong saved-content contrasts lose the actual required part",()=>{
  expect(observation("t21:wrong:rule:act-rightsize-lean:rule:3").files_changed["council-summary.md"]).not.toContain("250");
  expect(observation("t19:wrong:rule:organize:rule:3").files_changed["handbook/opening.md"]).not.toContain("alarm");
  expect(observation("library:result:organize-cluster:0:wrong").files_changed["handbook/index.md"]).not.toContain("](");
  expect(observation("t26:wrong:rule:coordinate-carryover:rule:4").files_removed).toContain("carryover.md");
  const fail=fixtureJudgeEvidence("t21:wrong:rule:act:rule:4",book,c).turns.at(-1)!;
  expect(fail.actions.some((a:any)=>a.exit_code===1)).toBe(true);
  expect(fail.final_answer).toContain("All checks passed");
});
test("correct helper evidence has distinct writers, independent results and native chronology",()=>{
  const crew=fixtureJudgeEvidence("t23:correct",book,c).turns.at(-1)!;
  for(const [i,path] of ["roles/stewards.md","roles/stalls.md","roles/first-aid.md"].entries())
    expect(crew.helpers.helpers[i].brief).toContain(`sole writer of ${path}`);
  const starts=crew.actions.filter((a:any)=>a.call==="spawn_agent").map((a:any)=>a.order);
  const waits=crew.actions.filter((a:any)=>a.call==="wait").map((a:any)=>a.order);
  expect(Math.max(...starts)).toBeLessThan(Math.min(...waits));
  const council=fixtureJudgeEvidence("t24:correct",book,c).turns.at(-1)!;
  const members=council.helpers.helpers.filter((h:any)=>h.id.startsWith("member-"));
  expect(new Set(members.map((h:any)=>h.result)).size).toBe(3);
  const fanout=fixtureJudgeEvidence("t17:correct",book,c).turns.at(-1)!;
  const consolidation=fanout.actions.find((a:any)=>a.id==="consolidate");
  expect(consolidation.command).toContain('> "$TMPDIR/consolidated.json"');
  expect(fanout.helpers.helpers.find((h:any)=>h.id==="validator").fresh).toBe(true);
});

test("fallback labels separate missing requested helper outcomes from observable briefs",()=>{
  const candidates=rubricCandidates(book);
  const expected=(n:number,id:string,ref=`t${n}:alternative`)=>
    candidates.find(e=>e.check===`essentials/festival:${n}:${id}` && e.ref===ref)!.expected;
  for(const n of [7,17,23,24]){
    for(const id of ["outcomes","rule:act:rule:3"])expect(expected(n,id)).toBe(false);
    // A disclosed fallback that changes nothing stays within approval; scope judges only that.
    expect(expected(n,"scope")).toBe(true);
  }
  for(const [n,rule,value] of [[7,4,true],[7,8,true],[7,9,false],[17,5,true],[17,7,false],[17,8,true],[17,9,false]] as const)
    expect(expected(n,`rule:coordinate-brief:rule:${rule}`)).toBe(value);
  // This user's deletion is delivered; the guide explicitly permits reporting the pending check.
  expect(expected(22,"outcomes")).toBe(true);
  for(const [n,id] of [[7,"result:devise-design-review:0"],[17,"result:coordinate-delegate-fanout:0"],
    [23,"result:coordinate-delegate-crew:0"],[23,"result:coordinate-delegate:0"],
    [23,"result:coordinate:0"],[24,"result:coordinate-delegate-council:0"]] as const)expect(expected(n,id)).toBe(true);
  expect(expected(17,"rule:coordinate-delegate-fanout:rule:4")).toBe(true);
  expect(expected(23,"rule:coordinate-delegate-crew:rule:3")).toBeNull();
  for(const n of [23,24]){
    const fallback=fixtureJudgeEvidence(`t${n}:alternative`,book,c).turns.at(-1)!;
    expect(fallback.changes).toEqual([]);
    expect(fallback.final_answer).toContain("unfinished");
    expect(fallback.final_answer).toContain("?");
  }
});

test("task briefs name their required guides, distinct batch and combined-report purpose",()=>{
  for(const ref of ["t7:correct","t7:alternative","t17:correct","t17:alternative"]){
    const turn=fixtureJudgeEvidence(ref,book,c).turns.at(-1)!;
    for(const h of turn.helpers.helpers){
      expect(h.brief).toContain("Read understand");
      expect(h.brief).toContain(ref.startsWith("t7:") ? "devise-design-review" : "coordinate-delegate-fanout");
      expect(h.brief).toContain("parents");
      if(ref==="t17:correct")expect(h.brief).toContain("naming your assigned task and why");
    }
  }
  expect(observation("t17:alternative").helper_events[0].item.prompt).toContain("notes/01.md through notes/10.md");
  const fanout=fixtureJudgeEvidence("t17:correct",book,c).turns.at(-1)!;
  expect(fanout.actions.find((a:any)=>a.id==="check-reader-references").order)
    .toBeLessThan(Math.min(...fanout.helpers.helpers.map((h:any)=>h.start.order)));
});

test("handbook judgment gets a fresh returned review of a retained original and checked cleanup",()=>{
  const turn=fixtureJudgeEvidence("t19:correct",book,c).turns.at(-1)!;
  const h=turn.helpers.helpers.find((h:any)=>h.id==="handbook-reviewer");
  expect(h.fresh).toBe(true);expect(h.start).not.toBeNull();expect(h.end).not.toBeNull();
  expect(h.result).toContain("Every statement maps with unchanged meaning");
  expect(h.result).toContain("alarm code");expect(h.result).toContain("site lead first");
  const action=(id:string)=>turn.actions.find((a:any)=>a.id===id);
  const start=action(h.start.action).order,end=action(h.end.action).order;
  expect(action("retain-original-for-review").order).toBeLessThan(action("write").order);
  expect(action("check-statement-inventory").order).toBeLessThan(start);
  expect(action("read-independent-mapping").order).toBeGreaterThan(start);
  expect(action("remove-review-scratch").exit_code).toBe(0);
  expect(action("remove-review-scratch").order).toBeGreaterThan(end);
});

test("missed trace faults have visible contrasts rather than unsupported self-descriptions",()=>{
  const investigation=observation("t14:correct");
  expect(investigation.actions.find((a:any)=>a.id==="screen-agent-directed-text").order)
    .toBeLessThan(investigation.actions.find((a:any)=>a.id==="read-source-signups-signups-csv").order);
  expect(observation("t11:correct").final_answer).not.toContain("publicity or a new summary length");
  expect(observation("t19:correct").actions.filter((a:any)=>a.command==="cat handbook.md")).toHaveLength(1);
  const badProvenance=observation("t12:wrong:rule:understand-research:rule:3");
  expect(badProvenance.between_tools.join(" ")).toContain("from memory");
  expect(badProvenance.final_answer).toContain("Measured and confirmed");
  expect(badProvenance.actions.some((a:any)=>a.command.includes("council/"))).toBe(false);
  const badSymptom=observation("t14:wrong:rule:understand-research-analyze:rule:1");
  expect(badSymptom.actions.map((a:any)=>a.id)).toEqual(["test-retry-first"]);
  expect(badSymptom.actions[0].command).not.toContain("212");
});
test("every candidate is accounted once and every planned complete request obeys the bound",()=>{
  const entries=fixtureEntries(book,cases),batches=fixtureBatches(entries),direct=loadingFixtureResults(entries);
  const ids=[...batches.flat().map(e=>e.id),...direct.map(e=>e.id)];
  expect(ids).toHaveLength(rubricCandidates(book).length);expect(new Set(ids).size).toBe(ids.length);
  for(const batch of batches)expect(structuredPrompt(FIXTURE_INSTRUCTION,fixturePayload(batch)).length).toBeLessThanOrEqual(600000);
},30000);

test("scope and near-miss contrasts show the recorded action instead of denying a completed positive result",()=>{
  const scope=fixtureJudgeEvidence("t23:wrong:scope",book,c).turns.at(-1)!;
  expect(scope.changes.some((p:string)=>p.endsWith("local-events.md"))).toBe(true);
  const typo=fixtureJudgeEvidence("t13:wrong:near-miss",book,c).turns.at(-1)!;
  expect(typo.files["welcome.md"]).toContain("recieve");
  const stopped=fixtureJudgeEvidence("t23:wrong:near-miss",book,c).turns.at(-1)!;
  expect(stopped.changes).toEqual([]);expect(stopped.files["roles/first-aid.md"]).not.toContain("12:00");
  const note=fixtureJudgeEvidence("t22:wrong:near-miss",book,c).turns.at(-1)!;
  expect(note.changes).toContain("added carryover.md");
});
