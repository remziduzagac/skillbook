import { test, expect } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runOne, runPlan, planRuns } from "./run";
import { parseArgs } from "./cli";
import { normalize, validateCase } from "./cases";
import { tmpPaths } from "./process";
import { recheckScenario } from "./recheck";
import type { Event } from "./types";
import { spawnSync } from "node:child_process";
const message = (text: string) => ({ type: "item.completed", item: { type: "agent_message", text } });
const args = () => parseArgs(["--agents", "codex", "--yes"]);

test("a Claude run with a copied login needs no Codex login, makes no auxiliary call and deletes its home",()=>{
  const fakeHome=mkdtempSync(join(tmpdir(),"runner-claude-login-"));
  try{
    mkdirSync(join(fakeHome,".claude"));
    writeFileSync(join(fakeHome,".claude/.credentials.json"),'fixture-claude-login');
    const script=`
      import {runOne} from './tests/runner/run';
      import {normalize} from './tests/runner/cases';
      import {parseArgs} from './tests/runner/cli';
      import {readFileSync,existsSync} from 'node:fs';
      import {join} from 'node:path';
      const options=parseArgs(['--agents','claude','--login','--yes']);
      const c=normalize({fixture:'tiny-weather',turns:[{prompt:'First'},{prompt:'Second'}]},'essentials/claude-login');
      let runHome='',codexCalls=0;
      const result=await runOne(c,'claude','sonnet',1,options,process.env.HOME!,1,async(cmd,work,env)=>{
        if(cmd[0]==='codex')codexCalls++;
        runHome=env.HOME!;
        if(readFileSync(join(runHome,'.claude/.credentials.json'),'utf8')!=='fixture-claude-login')
          throw Error('run lacks its copied Claude login');
        const events=[{type:'assistant',session_id:'main',message:{content:[{type:'text',text:'Done'}]}},
          {type:'result',session_id:'main',total_cost_usd:0.001}];
        return {stdout:events.map(e=>JSON.stringify(e)).join('\\n'),stderr:'',status:0,left:[],left_why:null,tmp:null,tmp_paths:[]};
      });
      if(codexCalls!==0||result.turns.length!==2||existsSync(runHome)||result.error)
        throw Error('login, auxiliary call or cleanup contract failed: '+result.error);
      console.log('Claude login and cleanup passed');
    `;
    const ran=spawnSync(process.execPath,['--eval',script],{cwd:process.cwd(),env:{...process.env,HOME:fakeHome},encoding:'utf8'});
    expect(ran.status,ran.stderr).toBe(0);expect(ran.stdout).toContain('Claude login and cleanup passed');
  }finally{rmSync(fakeHome,{recursive:true,force:true});}
});
const sample = () =>
  normalize(
    {
      fixture: "tiny-weather",
      turns: [
        { prompt: "first", checks: { answer_contains: ["first"], no_changes: true } },
        { prompt: "second", checks: { answer_contains: ["second"], unchanged: ["NOTES.md"] } },
      ],
      checks: { answer_contains: ["first", "second"] },
      review: ["Useful answer"],
    },
    "essentials/port-unit",
  );

test("turn timeout reaches the transport and cleanup checks ignore pre-existing runtime paths",async()=>{
  const out=mkdtempSync(join(tmpdir(),"runner-turn-limits-")),timeouts:number[]=[];
  const c=normalize({fixture:"tiny-weather",turns:[{prompt:"first"},{prompt:"second",timeout:900,
    checks:{tmp_lacks:["."]}}]},"essentials/cleanup-unit");
  try{
    const result=await runOne(c,"codex","gpt-6.1-sol",1,args(),out,1,async(_cmd,_work,env,timeout)=>{
      timeouts.push(timeout);
      if(timeouts.length===1){mkdirSync(join(env.TMPDIR!,"runtime"));writeFileSync(join(env.TMPDIR!,"runtime/lock"),"");}
      return {stdout:JSON.stringify(message("Done")),stderr:"",status:0,left:[],left_why:null,tmp:null,tmp_paths:tmpPaths(env.TMPDIR)};
    });
    expect(timeouts).toEqual([300,900]);
    expect(result.checks["turn 2: temporary folder lacks /./"]).toBe(true);
    expect(recheckScenario(result,c).checks["turn 2: temporary folder lacks /./"]).toBe(true);
    expect(JSON.stringify(result.turns[1].tmp_checks)).not.toContain("runtime");
    const timed=await runOne({...c,turns:[c.turns[1]!] },"codex","gpt-6.1-sol",1,args(),out,1,
      async()=>({stdout:"",stderr:"",status:null,left:[],left_why:null,tmp:null,tmp_paths:null}));
    expect(timed.error).toContain("900 seconds");
    for(const timeout of [0,-1,Infinity,NaN])expect(()=>validateCase({fixture:"tiny-weather",turns:[{prompt:"x",timeout}]})).toThrow();
  }finally{rmSync(out,{recursive:true,force:true});}
});

test("turn observations, resume, kept logs and copied homes have separate lifetimes", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-output-"));
  const calls: Event[] = [];
  try {
    const options = { ...args(), keep: true };
    const driver = async (cmd: string[], work: string, env: NodeJS.ProcessEnv) => {
      calls.push({ cmd, work, home: env.HOME, tmp: env.TMPDIR });
      const text = calls.length === 1 ? "first" : "second";
      return {
        stdout:
          JSON.stringify({ type: "thread.started", thread_id: "unit-session" }) +
          "\n" +
          JSON.stringify(message(text)) +
          "\n" +
          JSON.stringify({ type: "turn.completed", usage: { input_tokens: 10, output_tokens: 2 } }),
        stderr: "",
        status: 0,
        left: [],
        left_why: null,
        tmp: { entries: [], cut: false },
        tmp_paths: [],
      };
    };
    const result = await runOne(sample(), "codex", "gpt-6-luna", 1, options, out, 1, driver);
    expect(result.error).toBeNull();
    expect(Object.values(result.checks).every((v) => v === true)).toBe(true);
    expect(result.turns.map((t: Event) => t.answer)).toEqual(["first", "second"]);
    expect(calls[1]!.cmd).toContain("resume");
    expect(calls[1]!.cmd).toContain("unit-session");
    expect(readdirSync(out).filter((p) => p.endsWith(".jsonl"))).toHaveLength(2);
    expect(existsSync(calls[0]!.home)).toBe(false);
    expect(existsSync(calls[0]!.tmp)).toBe(false);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("timeout and runner exceptions retain evidence, unknown spending and cleanup", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-failure-"));
  let home = "";
  try {
    const driver = async (_cmd: string[], _work: string, env: NodeJS.ProcessEnv) => {
      home = env.HOME!;
      return {
        stdout: JSON.stringify(message("partial")),
        stderr: "",
        status: null,
        left: [],
        left_why: null,
        tmp: null,
        tmp_paths: null,
      };
    };
    const result = await runOne(sample(), "codex", "gpt-6-luna", 1, args(), out, 1, driver);
    expect(result.error).toContain("took longer");
    expect(result.cost_unknown).toBe(true);
    expect(result.turns).toHaveLength(1);
    expect(result.turns[0].trace_complete).toBe(false);
    expect(result.turns[0].answer).toBe("partial");
    expect(existsSync(home)).toBe(false);
    const error = await runOne(sample(), "codex", "gpt-6-luna", 1, args(), out, 1, async () => {
      throw Error("synthetic");
    });
    expect(error.error).toContain("synthetic");
    expect(error.cost_unknown).toBe(true);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("scheduler stops at known budget and tracks unknown cost separately", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-budget-"));
  const options = { ...args(), budget: 0.5, jobs: 1, runs: 4 };
  let calls = 0;
  try {
    const fake = async () => ({
      case: "x",
      agent: "codex",
      model: "unpriced",
      run: ++calls,
      error: null,
      cost: calls === 1 ? 0 : 0.5,
      cost_unknown: calls === 1,
      checks: {},
      turns: [],
      review: [],
    });
    const results = await runPlan(planRuns([sample()], options), options, out, fake);
    expect(results).toHaveLength(2);
    expect(readFileSync(join(out, "summary.md"), "utf8")).toContain("unquantified spending in 1 runs");
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("fresh-session turns retain work files but never resume the prior conversation", async () => {
  const out = mkdtempSync(join(tmpdir(), "runner-fresh-"));
  const commands: string[][] = [];
  const c = sample();
  c.turns[1]!.fresh_session = true;
  try {
    const result = await runOne(c, "codex", "gpt-6-luna", 1, args(), out, 1, async (command, work) => {
      commands.push(command);
      expect(existsSync(join(work, "NOTES.md"))).toBe(true);
      return { stdout: [JSON.stringify({ type: "thread.started", thread_id: "old-session" }),
        JSON.stringify(message(commands.length === 1 ? "first" : "second")),
        JSON.stringify({ type: "turn.completed", usage: { input_tokens: 10, output_tokens: 2 } })].join("\n"),
        status: 0, stderr: "", left: [], left_why: null, tmp: null, tmp_paths: null };
    });
    expect(result.error).toBeNull();
    expect(commands[1]).not.toContain("resume");
    expect(commands[1]).not.toContain("old-session");
    expect(result.turns[1].fresh_session).toBe(true);
  } finally { rmSync(out, { recursive: true, force: true }); }
});
