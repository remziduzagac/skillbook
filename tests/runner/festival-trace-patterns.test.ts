import { test,expect } from "bun:test";
import { readFileSync } from "node:fs";
import { rubricTrace,fixtureJudgeEvidence,activeRubricBook,rubricCandidates } from "./rubric-fixtures";
import { loadCases } from "./cases";
import { fixtureEntries,fixtureBatches,fixturePayload,loadingFixtureResults } from "./fixture-validation";
import { structuredPrompt,FIXTURE_INSTRUCTION } from "./judge-protocol";
const cases=loadCases(),book=activeRubricBook("tests/calibration/festival-traces.json",cases),c=cases[0]!;
const observation=(ref:string)=>rubricTrace(ref,book).observation;
test("correct artifacts carry their required content and a checkable plan",()=>{
  expect(observation("t6:correct").files_changed["decisions.md"]).toContain("## Next steps");
  const design=observation("t7:correct").files_changed["design.md"];
  expect(design).toContain("No alcohol");expect(design).toContain("Reasons for the detailed choices");
  const plan=observation("t11:correct").final_answer;
  const rows=plan.split("\n").filter((s:string)=>s.startsWith("| [ ]"));
  expect(rows).toHaveLength(12);
  expect(rows.every((s:string)=>s.split("|")[4]!.trim().length>0)).toBe(true);
  expect(rows[4]).toContain("2, 3, 4");
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
test("helper alternatives have distinct writers, independent results and native chronology",()=>{
  const crew=fixtureJudgeEvidence("t23:alternative",book,c).turns.at(-1)!;
  for(const [i,path] of ["roles/stewards.md","roles/stalls.md","roles/first-aid.md"].entries())
    expect(crew.helpers.helpers[i].brief).toContain(`sole writer of ${path}`);
  const starts=crew.actions.filter((a:any)=>a.call==="spawn_agent").map((a:any)=>a.order);
  const waits=crew.actions.filter((a:any)=>a.call==="wait").map((a:any)=>a.order);
  expect(Math.max(...starts)).toBeLessThan(Math.min(...waits));
  const council=fixtureJudgeEvidence("t24:alternative",book,c).turns.at(-1)!;
  const members=council.helpers.helpers.filter((h:any)=>h.id.startsWith("member-"));
  expect(new Set(members.map((h:any)=>h.result)).size).toBe(3);
  const fanout=fixtureJudgeEvidence("t17:alternative",book,c).turns.at(-1)!;
  const consolidation=fanout.actions.find((a:any)=>a.id==="consolidate");
  expect(consolidation.command).toContain('> "$TMPDIR/consolidated.json"');
  expect(fanout.helpers.helpers.find((h:any)=>h.id==="validator").fresh).toBe(true);
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
