import { test, expect } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadCases } from "./cases";
import { parseArgs, selectCases } from "./cli";
import { runOne, planRuns } from "./run";
import { ruleChecks, resultChecks, declaredRules } from "./rule-checks";
import { measurementPlan, offeredRules } from "./measure-turn";
import { accessTurn } from "./access";
import { activeRubricBook, rubricCandidates, validateRubricFixtures, resolveRubricTrace, rubricTrace } from "./rubric-fixtures";
import { judgeEvidence } from "./scenario";
import { check } from "./checks";
import { traceObservation } from "./trace-checks";
import { uncoveredRules, uncoveredReturns } from "./library-coverage";
import { reachableGuides, resolvedNeeds } from "./needs";
import { recheckScenario, requireSavedCases } from "./recheck";
import { aspectCoverage } from "./inventory";
import { putCheckpoint } from "./chapters";
import { sourceSnapshots } from "./source-snapshots";
import { fixtureText } from "./files";
import { wordCount } from "./answers";
import { summarize } from "./reports";
import type { Event, Checks } from "./types";
const path = "tests/calibration/festival-traces.json";
// The festival is selected by id; other case files may sit beside it.
const festival = () => loadCases().find(c => c.id === "essentials/festival")!;
const encode = (text: string, events: Event[] = []) => ({stdout: [...events,
  {type: "item.completed", item: {type: "agent_message", text}},
  {type: "turn.completed", usage: {input_tokens: 10, output_tokens: 2}},
].map(e => JSON.stringify(e)).join("\n"), stderr: "", status: 0, left: [], left_why: null, tmp: null, tmp_paths: []});

test("the festival is the five-chapter, 28-turn case with four permitted models, selected by id", () => {
  const all = loadCases(); expect(all.map(c => c.id)).toContain("essentials/festival");
  expect(selectCases(all, parseArgs(["--case", "festival"])).map(c => c.id)).toEqual(["essentials/festival"]);
  const c = festival(); expect(c.turns).toHaveLength(28); expect(c.chapters!.map(ch => ch.start_turn)).toEqual([1,7,12,23,27]);
  const plan = planRuns(selectCases(all, parseArgs(["--case", "festival"])), parseArgs(["--dry-run"]));
  expect(plan.map(([, a, m]) => [a, m])).toEqual([["claude","sonnet"],["claude","haiku"],["codex","gpt-6.1-sol"],["codex","gpt-6-luna"]]);
  for (const model of ["claude=opus", "claude=fable", "codex=gpt-6-astra"])
    expect(() => planRuns([c], parseArgs(["--model", model]))).toThrow("not allowed");
  expect(aspectCoverage(all).unknown).toEqual([]);
  expect(c.user!.facts.approvals).toContain("turn 22");
  const design = readFileSync("blueprint/design/scenarios/festival.md", "utf8");
  const messages = [...design.matchAll(/\*\*Message:\*\* "(.*?)"\n/g)].map(m => m[1]);
  expect(c.turns.map(t => t.prompt)).toEqual(messages);
  expect(c.turns[6]!.if_taken!.map(n => n.skill)).toEqual(["understand-discuss"]);
  expect(c.turns[8]!.if_taken!.map(n => n.skill)).toEqual(["understand-clarify-shallow"]);
});

test("the active trace gate covers source rules, visible returns and distinct wrong/alternative candidates", () => {
  const c = festival(), b = activeRubricBook(path, [c]);
  expect(validateRubricFixtures(b, [c])).toBe(b.checks.length + b.library!.length);
  // The festival's turns reach every guide with a visible return today, so its own library holds each one. Whole-library
  // coverage of rules and returns is the union over every active case and book (library-coverage.test.ts).
  const reach = new Set(c.turns.flatMap(t => [...reachableGuides(t, ruleChecks())]));
  const reached = resultChecks().filter(p => !p.exclusion && reach.has(p.skill)).map(p => p.id);
  expect(new Set(b.library!.map(r => r.id))).toEqual(new Set(reached));
  expect(uncoveredReturns([b])).toEqual([]);
  for (const candidate of rubricCandidates(b)) {
    const {turns} = resolveRubricTrace(candidate.ref, b);
    expect(turns.length).toBeGreaterThan(0);
    expect(turns.at(-1).final_answer.trim().length).toBeGreaterThan(20);
    expect(JSON.stringify(turns)).not.toContain('"expected":');
  }
  const changed = structuredClone(b); changed.library!.pop();
  expect(() => validateRubricFixtures(changed, [c])).toThrow("uncovered result");
  const missing = structuredClone(c); missing.turns[0]!.rubric = missing.turns[0]!.rubric!.filter(r => r.source_check !== "route-act");
  expect(uncoveredRules([missing])).toEqual(expect.arrayContaining(ruleChecks().filter(rule => rule.key === "route-act")
    .map(rule => rule.id)));
  expect(uncoveredRules([c])).not.toEqual(expect.arrayContaining(ruleChecks().filter(rule => rule.key === "route-act")
    .map(rule => rule.id)));
  expect(() => validateRubricFixtures(b, [missing])).toThrow("current criterion");
  const stale=structuredClone(b);stale.traces["t17:correct"]!.chapter=4;
  expect(()=>validateRubricFixtures(stale,[c])).toThrow("current chapter");
});

test("saved six-chapter evidence cannot be silently judged or relabelled as the merged session",()=>{
  const c=festival(),cases=new Map([[c.id,c]]);
  const old={case:c.id,turns:[{turn:17,chapter:4,fresh_session:true}]};
  expect(()=>requireSavedCases([old],cases)).toThrow("chapter/session layout differs");
  expect(()=>recheckScenario(old,c)).toThrow("matching case revision");
  expect(()=>requireSavedCases([{...old,turns:[{turn:17,chapter:3,fresh_session:true}]}],cases))
    .toThrow("chapter/session layout differs");
  expect(()=>requireSavedCases([{...old,turns:[{turn:17,chapter:3,fresh_session:false}]}],cases)).not.toThrow();
});

test("generated five-chapter checkpoints and trace sources match the design, including the unfixed initial typo",()=>{
  const root=mkdtempSync(join(tmpdir(),"festival-generator-"));
  try {
    const base=join(root,"base"), overlays=join(root,"overlays");
    const ran=spawnSync("python3",["-I","tests/fixtures/make-festival.py",base,overlays],{encoding:"utf8"});
    expect(ran.status,ran.stderr).toBe(0);
    const compare=(actual:string,generated:string)=>{
      const names=readdirSync(actual,{withFileTypes:true});
      expect(names.map(n=>n.name).sort()).toEqual(readdirSync(generated).sort());
      for(const n of names)if(n.isDirectory())compare(join(actual,n.name),join(generated,n.name));
      else expect(readFileSync(join(actual,n.name))).toEqual(readFileSync(join(generated,n.name)));
    };
    compare("tests/fixtures/scenarios/festival",base);
    compare("tests/fixtures/scenarios/festival-checkpoints",overlays);
    const c=festival(),b=activeRubricBook(path,[c]),work=join(root,"work");
    const dates=["4 May","11 May","8 June","22 June","6 July"];
    for(const ch of c.chapters!){
      putCheckpoint(work,ch,c.gitignore);
      const sources=sourceSnapshots(work,fixtureText(work),c.source_snapshots,true);
      expect(sources).toEqual(b.chapter_sources![`${c.id}:${ch.number}`]);
      expect(sources["AGENTS.md"]).toContain(dates[ch.number-1]!);
      if(ch.number===3)expect(sources["welcome.md"]).toContain("recieve");
      if(ch.number>=4)expect(sources).not.toHaveProperty("old-signups.csv");
    }
    const history=resolveRubricTrace("t17:correct",b).turns;
    expect(history.map(t=>t.turn)).toEqual([12,13,14,15,16,17]);
    expect(history.at(-1)!.files_before["welcome.md"]).toContain("receive");
  } finally {rmSync(root,{recursive:true,force:true});}
});

for (const no_skill of [false, true]) test(`festival runs all chapters with an injected transport (${no_skill ? "no skill" : "installed"})`, async () => {
  const c = festival(), book = activeRubricBook(path, [c]), out = mkdtempSync(join(tmpdir(), "festival-unit-"));
  const declared = declaredRules(c), declaredKeys = new Set(declared.map(r => r.key)), offeredKeys: string[] = [];
  let count = 0, fits = 0, outcomes = 0;
  const sizes: Event[] = [], inputs: Event[] = [];
  try {
    const result = await runOne(c, "codex", "gpt-6.1-sol", 1, {...parseArgs([]), no_skill, judge: true}, out, 5,
      async (cmd, work, _env, _timeout, _groups, input) => {
        if (input) {
          const data = JSON.parse(input.split("\nDATA:\n")[1]!);
          inputs.push({turn: count, kind: input.includes("Mark claims") ? "applicability" :
            input.includes("Mark only paths") ? "conditional-path" : data.criteria ? "outcomes" : "fit",
            input_bytes: new TextEncoder().encode(input).length});
          if (input.includes("Mark claims")) {
            offeredKeys.push(...data.checks.map((r: Event) => r.key));
            if (count === 21) expect(data.checks.some((r: Event) => r.key === "approval")).toBe(true);
            if (count === 1) expect(data.checks.some((r: Event) => r.key === "approval")).toBe(false);
            return encode(JSON.stringify({claims: [], marks: []}));
          }
          if (input.includes("Mark only paths")) return encode(JSON.stringify({marks: []}));
          if (data.criteria) {
            outcomes++;
            if (data.evidence.current_turn===17)
              expect(data.evidence.turns.map((t:Event)=>t.turn)).toEqual([12,13,14,15,16,17]);
            sizes.push({turn: data.evidence.current_turn, criteria: data.criteria.length,
              source_files: Object.keys(data.evidence.sources).length,
              source_bytes: JSON.stringify(data.evidence.sources).length,
              input_bytes: new TextEncoder().encode(input).length});
            if (data.evidence.current_turn === 15) {
              expect(data.evidence.sources["research/tools.zip"]).toContain("tools/rotaeasy.md");
              expect(data.evidence.sources["research/tools.zip"]).toContain("$6 a month");
              expect(data.evidence.sources["research/tools.zip"]).toContain("January 2026");
            }
            if ([1,18,22,23,24,25,26,27,28].includes(data.evidence.current_turn)) {
              expect(Object.keys(data.evidence.sources).some(p => p.startsWith("notes/"))).toBe(false);
              expect(JSON.stringify(data.evidence).includes('"signups/signups.csv"')).toBe(false);
            }
            // Transport correctness is tested without inventing semantic verdicts.
            return encode(JSON.stringify({results: data.criteria.map((r: Event) => ({id: r.id, verdict: null, reason: "fake transport: semantics unjudged"}))}));
          }
          fits++; return encode(JSON.stringify({off_script: false, reason: "synthetic fit"}));
        }
        const n = ++count;
        if (n===17) {
          expect(cmd).toContain("resume");
          expect(readFileSync(join(work,"welcome.md"),"utf8")).toContain("receive");
          expect(readFileSync(join(work,"welcome.md"),"utf8")).not.toContain("recieve");
          expect(readFileSync(join(work,"AGENTS.md"),"utf8")).toContain("Monday 8 June 2026");
        }
        const row = rubricTrace(`t${n}:correct`, book);
        expect(cmd.at(-1)).toBe(c.turns[n-1]!.prompt);
        const fresh = c.chapters!.some(ch => ch.start_turn === n);
        expect(cmd.includes("resume")).toBe(!fresh);
        for (const [p, text] of Object.entries(row.observation.files_changed ?? {})) {
          mkdirSync(join(work, p, ".."), {recursive: true}); writeFileSync(join(work, p), text as string);
        }
        for (const p of row.observation.files_removed ?? []) rmSync(join(work, p));
        return encode(row.observation.final_answer, [{type: "thread.started", thread_id: `chapter-${row.chapter}`},
          {type: "item.completed", item: {id: `work-${n}`, type: "command_execution", command: "git status --short", exit_code: 0, aggregated_output: ""}}]);
      });
    expect(result.error).toBeNull(); expect(count).toBe(28); expect(outcomes).toBe(28); expect(fits).toBe(23);
    expect(result.turns.filter((t: Event) => t.fresh_session).map((t: Event) => t.turn)).toEqual([1,7,12,23,27]);
    // Each turn records its final answer's word count, and the report prints the median and total beside the scores.
    expect(result.turns.every((t: Event) => t.final_words === wordCount(t.final_answer) && t.final_words > 0)).toBe(true);
    expect(summarize([result], 0)).toContain("## Final-answer length");
    expect(Object.entries(result.checks).filter(([,v]) => v !== true)).toEqual([]);
    expect(result.turns[26].baseline_files["council-summary.md"].split(/\s+/).length).toBeGreaterThan(150);
    expect(result.turns[26].changes).toEqual([]); expect(result.unreached_turns).toEqual([]);
    expect(result.turns.every((t: Event) => t.judgments.every((j: Event) => j.verdict === null))).toBe(true);
    // Only the festival's own rule definitions are offered, measured and scored, whatever else the library holds.
    expect(offeredKeys.length).toBeGreaterThan(28);
    expect(offeredKeys.filter(key => !declaredKeys.has(key))).toEqual([]);
    const ids = new Set(declared.map(r => r.id));
    for (const t of result.turns) {
      for (const o of t.opportunities) expect(ids.has(o.id), o.id).toBe(true);
      for (const j of t.judgments.filter((j: Event) => j.tag.startsWith("rule:"))) expect(ids.has(j.tag.slice(5)), j.tag).toBe(true);
    }
    const replay = recheckScenario(result, c).checks;
    for (const [name, verdict] of Object.entries(replay))
      expect(verdict).toBe(result.checks[name]);
    if (!no_skill) writeFileSync("/tmp/phase-b-judge-input-estimates.json", JSON.stringify({outcomes:sizes, calls:inputs}, null, 2)+"\n");
    writeFileSync(join(out, "status.json"), JSON.stringify({turns: count, checks: result.checks}));
  } finally { rmSync(out, {recursive: true, force: true}); }
}, 30000);

test("library entries the festival does not declare never change its offered, measured or scored rules", () => {
  const c = festival(), library = ruleChecks(), access = accessTurn("codex", [], 1, {});
  // Without other cases' entries the library is exactly what the festival declares. The entries added for other
  // cases are all scenario rules; add them and one synthetic scenario rule whose guide every festival turn needs.
  const own = library.filter(r => (c.covers ?? []).includes(r.id)), added = library.filter(r => !own.includes(r));
  expect(added.length).toBeGreaterThan(0);
  expect(added.filter(r => r.applicability !== "scenario")).toEqual([]);
  const needed = library.find(r => r.required_skill === "respond")!;
  const grown = [...library, {...needed, id: "respond:rule:902", key: "unit-new-scenario", applicability: "scenario"}];
  expect(declaredRules(c, grown).map(r => r.id)).toEqual(own.map(r => r.id));
  // A case that declares nothing still gets every rule that is not a scenario rule.
  expect(declaredRules({turns: []}, grown)).toEqual(grown.filter(r => r.applicability !== "scenario"));
  for (const [i, t] of c.turns.entries()) {
    const needs = resolvedNeeds(t, {}, true);
    const offered = (rules: Event[]) => offeredRules(declaredRules(c, rules), t, needs).map(r => r.id);
    expect(offered(grown), `turn ${i + 1}`).toEqual(offered(own));
    // A judge that marks every library key applicable, with a change and a claim, still reaches only declared rules.
    const turn = {claim_text: "Done.", final_answer: "Done.", sent_message: t.prompt, changes: ["changed a.md"],
      author_rule_marks: t.rule_marks ?? [], claim_applicability: [{quote: "Done.", action: null}],
      rule_applicability: grown.map(r => ({key: r.key, applicable: true, quote: "Done.", action: null}))};
    const measured = (rules: Event[]) => {
      const plan = measurementPlan(turn, t.rubric ?? [], access, declaredRules(c, rules));
      return [plan.inventory.map(o => o.definition.id), plan.rubrics.map(r => r.id), plan.result_parts.map(p => p.id)];
    };
    expect(measured(grown), `turn ${i + 1}`).toEqual(measured(own));
  }
});

test("judge selection keeps named sources and current edits while excluding unrelated earlier made files", () => {
  const data = judgeEvidence([{chapter: 2, turn: 7, files: {"design.md":"design", "old.md":"old"}, file_diffs:{"old.md":"made earlier"}},
    {chapter: 2, turn: 8, files:{"design.md":"design", "old.md":"old", "new.md":"new"}, file_diffs:{"new.md":"made now"}}],
    {"sources.md":"source", "notes/01.md":"unrelated", "signups.csv":"large"}, ["sources.md", "design.md"]);
  expect(data.sources).toEqual({"sources.md":"source"});
  expect(data.turns.at(-1)!.files).toEqual({"design.md":"design", "new.md":"new"});
  expect(JSON.stringify(data)).not.toContain("old.md"); expect(JSON.stringify(data)).not.toContain("signups.csv");
});

test("every festival file assertion accepts its correct trace and rejects a plausible wrong state", () => {
  const c = festival(), book = activeRubricBook(path, [c]);
  let assertions = 0;
  for (const [i, t] of c.turns.entries()) {
    // The shared trace observation is what the live checks read, including the trace's own recorded evidence.
    const observation: Event = traceObservation(`t${i+1}:correct`, book, t.checks);
    const atom = (config: Checks, mutate: (wrong: Event) => void, wrongTmp: string[] = []) => {
      assertions++;
      expect(Object.values(check(config, observation, null, [])), `turn ${i+1}: ${JSON.stringify(config)}`).toEqual([true]);
      const bad = structuredClone(observation); mutate(bad);
      expect(Object.values(check(config, bad, null, wrongTmp)), `wrong turn ${i+1}: ${JSON.stringify(config)}`).toEqual([false]);
    };
    const x = t.checks ?? {};
    if (x.no_changes) atom({no_changes:true}, b => b.changes = ["created unexpected.md"]);
    if (x.nothing_left_running) atom({nothing_left_running:true}, b => b.left_running = ["probe process"]);
    for (const p of x.changed ?? []) atom({changed:[p]}, b => b.changes = b.changes.filter((s:string) => !s.endsWith(" "+p)));
    for (const p of x.unchanged ?? []) atom({unchanged:[p]}, b => b.changes.push("changed "+p));
    for (const p of x.removed ?? []) atom({removed:[p]}, b => b.changes = b.changes.filter((s:string) => s !== "removed "+p));
    for (const p of x.absent ?? []) atom({absent:[p]}, b => b.paths_present[p] = true);
    if (x.only_changed?.length) atom({only_changed:x.only_changed}, b => b.changes.push("created unrelated.md"));
    for (const [p, patterns] of Object.entries(x.file_contains ?? {})) for (const pattern of patterns)
      atom({file_contains:{[p]:[pattern]}}, b => b.files[p] = "");
    for (const [p, n] of Object.entries(x.words_under ?? {})) atom({words_under:{[p]:n}}, b => b.files[p] = "word ".repeat(n));
    for (const p of x.shorter ?? []) atom({shorter:[p]}, b => b.files[p] = b.baseline_files[p]);
    for (const [p, pair] of Object.entries(x.only_replacement ?? {})) atom({only_replacement:{[p]:pair}}, b => b.files[p]+="Unrequested edit\n");
    for (const p of x.unchanged_under ?? []) atom({unchanged_under:[p]}, b => b.project_snapshot[`${p}/extra.md`] = "extra");
    for (const [p, folder] of Object.entries(x.index_links ?? {})) atom({index_links:{[p]:folder}}, b => {
      if (p === "*") for (const path of Object.keys(b.files)) b.files[path] = "# Index\n";
      else b.files[p] = "# Index\n";
    });
    for (const p of x.keeps_lines ?? []) atom({keeps_lines:[p]}, b => b.files[p] = "Only the new rule\n");
    for (const [folder, patterns] of Object.entries(x.folder_contains ?? {})) for (const pattern of patterns)
      atom({folder_contains:{[folder]:[pattern]}}, b => { for (const p in b.files) if (p.startsWith(folder+"/")) b.files[p] = ""; });
    for (const [folder, patterns] of Object.entries(x.folder_lacks ?? {})) for (const pattern of patterns)
      atom({folder_lacks:{[folder]:[pattern]}}, b => b.files[folder+"/premature.md"] = pattern.includes("Safety") ? "# Safety\n" :
        pattern.includes("\\|") ? "# Pages\n\n| Page | For |\n| --- | --- |\n" : "# index\n");
    for (const pattern of x.tmp_lacks ?? []) atom({tmp_lacks:[pattern]}, () => {}, ["probe.txt"]);
  }
  expect(assertions).toBeGreaterThan(80);
  writeFileSync("/tmp/phase-b-automatic-trace-count.json", JSON.stringify({assertions, correct:assertions, wrong:assertions})+"\n");
});

test("understand's direct-request returns are measured; act and devise exclusions keep their source reasons", () => {
  const results = resultChecks();
  expect(results.find(p => p.skill === "understand")).toMatchObject({kind: "visible"});
  expect(results.find(p => p.skill === "understand").exclusion).toBeUndefined();
  for (const name of ["act", "devise"]) expect(results.find(p => p.skill === name).exclusion).toBeTruthy();
});
