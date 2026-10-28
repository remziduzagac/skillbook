import { test, expect } from "bun:test";
import { accessTurn } from "./access";
import { availability, opportunity, verified, promised, grid, exercised, compareConditions, loadingView, type Opportunity } from "./measurement";
import { CallLimits } from "./call-limits";
import { ruleChecks } from "./rule-checks";
const sources = { act: "# act\n\nmiddle required\n\nlast\n" };
const command = "cat /sandbox/skills/essentials/references/act.md";
const done = (output: string, code = 0, cmd = command) => ({ type: "item.completed", item:
  { id: "read", type: "command_execution", command: cmd, aggregated_output: output, exit_code: code } });
const read = (output: string) => accessTurn("codex", [done(output)], 1, sources);

test("whole delivery needs the middle; endpoints, filenames and acknowledgments fail", () => {
  expect(read(sources.act).records[0]!.extent).toBe("whole");
  for (const wrong of ["# act\nlast", command, "Loaded act", "# act\nmiddle required\nOutput truncated\nlast"])
    expect(read(wrong).records[0]!.extent).not.toBe("whole");
});
test("search, failed calls and missing results never establish whole text", () => {
  expect(accessTurn("codex", [done(sources.act, 0, command.replace("cat", "rg last"))], 1, sources).records[0]!.operation).toBe("search");
  expect(accessTurn("codex", [done("permission denied", 1)], 1, sources).records[0]!.success).toBe(false);
  expect(accessTurn("codex", [{ type: "item.started", item: { ...done("").item } }], 1, sources).records[0]!.result).toBeNull();
});
test("late text cannot repair the first deadline or inflate one rule's denominator", () => {
  const access = accessTurn("codex", [{type:"item.started",item:{id:"write",type:"file_change"}}, done(sources.act)],1,sources);
  expect(access.records[0]!.timing).toBe("after");
  const parts = [{verdict:true as const,deadline:0,availability:availability(access,"act",0)},
    {verdict:true as const,deadline:2,availability:availability(access,"act",2)}];
  expect(opportunity(parts)).toEqual({verdict:true,availability:"not opened"});
  expect(grid([row(parts)]).cells.not_opened_passed.total).toBe(1);
});
test("Claude synthetic Read delivery, Skill acknowledgment, Grep and errors", () => {
  for (const [tool,input,output,error,extent] of [
    ["Read",{file_path:"/sandbox/skills/essentials/references/act.md"},"1\t# act\n2\t\n3\tmiddle required\n4\t\n5\tlast",false,"whole"],
    ["Skill",{skill:"act"},"Loaded act",false,"unknown"],
    ["Read",{file_path:"/sandbox/skills/essentials/references/act.md"},"Denied",true,"unknown"],
  ] as const) {
    const a=accessTurn("claude",[{type:"assistant",message:{content:[{type:"tool_use",id:"c",name:tool,input}]}},
      {type:"user",message:{content:[{type:"tool_result",tool_use_id:"c",content:output,is_error:error}]}}],1,sources);
    expect(a.records[0]!.extent).toBe(extent);
  }
});
test("semantic outcomes require matching quotes or action ids, even failures", () => {
  expect(verified(true,{quote:"passed"},"2 tests passed",[])).toBe(true);
  expect(verified(false,{action:"r"},"",[{id:"r"}])).toBe(false);
  expect(verified(false,{quote:"not present"},"passed",[])).toBeNull();
  expect(verified(true,{action:"invented"},"",[])).toBeNull();
});
test("internal returns need a visible later step; exclusions are not passes or missing", () => {
  expect(promised([{kind:"internal",verdict:false,exclusion:"no visible requirement"}])).toBe("excluded");
  expect(promised([{kind:"internal",later_step:"final answer",verdict:false}])).toBe(false);
  expect(promised([{kind:"visible",verdict:true},{kind:"visible",verdict:null}])).toBeNull();
});
function row(parts: Opportunity["parts"] = [{verdict:true,deadline:1,availability:"opened"}]): Opportunity {
  return {id:"act:rule:4",skill:"act",turn:1,case:"c",conversation:"s",agent:"codex",model:"sol",mode:"fixed",
    version:"v",condition:"installed",trigger:"trigger",origin:"action",parts,no_skill_eligible:true,result:false};
}
test("grid preserves unknown groups and outcome/result disagreement", () => {
  const rows=[row(),row([{verdict:null,deadline:1,availability:"unknown"}]),row([{verdict:false,deadline:1,availability:"unknown"}]),
    row([{verdict:null,deadline:1,availability:"opened"}]),row([{verdict:"not reached",deadline:1,availability:"unknown"}])];
  expect(grid(rows).unknown).toEqual({both:1,loading:1,behavior:1,not_reached:1});
  expect(grid(rows).results.passed_missing).toBe(1);
  expect(grid([]).cells.opened_passed.interval).toBeNull();
});
test("unavailable no-skill reads are not regressions and routing has no equivalent", () => {
  const absent={...row([{verdict:true,deadline:1,availability:"not opened"}]),condition:"no-skill" as const};
  expect(compareConditions([row(),absent]).difference_pp).toBe(0);
  expect(grid([absent]).cells.not_opened_passed.total).toBe(0);
  expect(compareConditions([{...absent,no_skill_eligible:false}]).absent.total).toBe(0);
});
test("unmarked action needs affect loading and distinct exercised rules", () => {
  const access=read(sources.act), view=loadingView(access,[{skill:"act",deadline:0,origin:"action"}],["act"]);
  expect(view[0]!.needed).toBe(true);expect(view[0]!.origins).toEqual(["action"]);
  expect(exercised([row(),row()],["act:rule:4","respond:rule:1"]).exercised).toEqual(["act:rule:4"]);
});
test("caps count failed and unpriced dispatches and never allow retries in pilot", () => {
  const limits=new CallLimits({agent:1,judge:1,simulated_user:0,retry:0});
  limits.dispatch("agent");limits.account(null);
  expect(()=>limits.dispatch("agent")).toThrow();expect(()=>limits.dispatch("retry")).toThrow();
  limits.dispatch("judge");limits.account(5);expect(limits.unknown).toBe(1);
  expect(()=>limits.dispatch("judge")).toThrow();
});
test("check sources and positional ids exist in the current frozen inventory", () => {
  expect(ruleChecks().length).toBeGreaterThan(10);
});
test("supported ranges combine only with verified middle text", () => {
  const a=accessTurn("codex",[
    done("# act\n",0,"sed -n '1,2p' /sandbox/skills/essentials/references/act.md"),
    done("middle required\n\nlast",0,"sed -n '3,5p' /sandbox/skills/essentials/references/act.md")],1,sources);
  expect(a.records.at(-1)!.extent).toBe("whole");
  const wrong=accessTurn("codex",[done("# act\n",0,"sed -n '1,2p' /sandbox/skills/essentials/references/act.md"),
    done("last",0,"sed -n '5,5p' /sandbox/skills/essentials/references/act.md")],1,sources);
  expect(wrong.records.at(-1)!.extent).not.toBe("whole");
});
test("redacted native Codex fragments retain their annotated labels", async () => {
  const fixtures=await Bun.file("tests/fixtures/access/codex.json").json();
  for (const f of fixtures) {
    const access=accessTurn("codex",f.events);
    for (const expected of f.expected) expect(access.records.find(r=>r.skill===expected.skill)).toMatchObject(expected);
  }
});
test("prior full reads stay unknown when retention cannot be proved; fresh sessions clear them", () => {
  const a=accessTurn("codex",[],2,sources);
  expect(availability({...a,prior_whole:["act"]},"act",3)).toBe("unknown");
  expect(availability(a,"act",3)).toBe("not opened");
});
test("pilot schedules 24 fresh conversations and 108 turns, alternating both conditions", async () => {
  const {parseArgs}=await import("./cli"), {loadCases}=await import("./cases"), {planRuns}=await import("./run");
  const args=parseArgs(["--pilot"]), cases=loadCases().filter(c=>/scenario-(06-handbook|14-quick)$/.test(c.id));
  const plan=planRuns(cases,args);
  expect(plan.length).toBe(24);expect(plan.reduce((n,[c])=>n+c.turns.length,0)).toBe(108);
  expect(new Set(plan.map(([c])=>c.condition))).toEqual(new Set(["installed","no-skill"]));
  expect(args.user_mode).toBe("fixed");expect(args.budget).toBe(5);
});
test("absence checks need established applicability and reject affected changes", async () => {
  const {codeOutcome}=await import("./rule-outcomes");
  const base={applies:true,access:read(sources.act),actions:[],changed:[],affected:["x"]};
  expect(codeOutcome("wait-for-answer",base)).toBe(true);
  expect(codeOutcome("wait-for-answer",{...base,applies:null})).toBeNull();
  expect(codeOutcome("wait-for-answer",{...base,changed:["changed x"]})).toBe(false);
});
test("complete returned text survives a later failing compound command", () => {
  const a=accessTurn("codex",[done(sources.act+"\nfatal: not a repository",128,command+"; git status")],1,sources);
  expect(a.records[0]).toMatchObject({extent:"whole",success:true,call_success:false});
});
test("author marks keep explicit applicability and deadlines separate from model marks", async () => {
  const {measuredOpportunities}=await import("./measure-turn");
  const run={case:"c",agent:"codex",model:"sol",run:1,user_mode:"fixed",condition:"installed",skill_sources:sources};
  const turn={author_rule_marks:[{id:"understand-clarify:rule:1",applies:false,deadline:0,near_miss:true}],
    final_answer:"Done",actions:[],changes:[],judgments:[]};
  const rows=measuredOpportunities(run,turn,[{id:"intent",tag:"rule",criterion:"check",source_check:"open-intent"}],read(sources.act));
  const clarify = rows.find(r => r.id === "understand-clarify:rule:1")!;
  expect(clarify.needed).toBe(false);expect(clarify.trigger).toBe("near-miss");
  expect(clarify.parts[0]!.deadline).toBe(0);
});
