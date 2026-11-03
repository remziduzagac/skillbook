import { test,expect } from "bun:test";
import { CostTracker,cost } from "./cost";
import { replay } from "./replay";
import { structuredCall } from "./scenario";
import { runOne } from "./run";
import { normalize } from "./cases";
import { parseArgs } from "./cli";
import { mkdtempSync,writeFileSync,rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import native from "../fixtures/cost-counters.json";
import type { Event } from "./types";
const claude=(total:unknown,session="a"):Event[]=>[{type:"result",session_id:session,total_cost_usd:total}];
const codex=(input:number,cached:number,output:number,session="a"):Event[]=>[
  {type:"thread.started",thread_id:session},
  {type:"turn.completed",usage:{input_tokens:input,cached_input_tokens:cached,output_tokens:output}},
];

test("Claude resumed totals are differenced and explicit fresh sessions restart from zero",()=>{
  const tracker=new CostTracker("claude","haiku");
  expect(tracker.next(claude(.1),{fresh:true})).toBeCloseTo(.1);
  expect(tracker.next(claude(.16),{fresh:false,expectedSession:"a"})).toBeCloseTo(.06);
  expect(tracker.next(claude(.03,"b"),{fresh:true})).toBeCloseTo(.03);
  expect(tracker.next(claude(.05,"b"),{fresh:false,expectedSession:"b"})).toBeCloseTo(.02);
  expect(cost("claude","haiku",[claude(.1),claude(.16)])).toBeCloseTo(.16);
});
test("decreasing, missing and unexpectedly changed session counters never become zero cost",()=>{
  for(const bad of [claude(.09),claude(undefined),[],claude(.2,"unexpected")]){
    const tracker=new CostTracker("claude","haiku");tracker.next(claude(.1),{fresh:true});
    expect(tracker.next(bad,{fresh:false,expectedSession:"a"})).toBeNull();
    expect(cost("claude","haiku",[claude(.1),bad])).toBeNull();
  }
  const tracker=new CostTracker("claude","haiku");
  tracker.next(claude(.1),{fresh:true});expect(tracker.next(claude(undefined))).toBeNull();
  expect(tracker.next(claude(.2))).toBeNull();expect(tracker.next(claude(.23))).toBeCloseTo(.03);
  expect(tracker.next(claude(.02,"fresh"),{fresh:true})).toBeCloseTo(.02);
  const untracked=new CostTracker("claude","haiku");
  expect(untracked.next(claude(.4),{fresh:false,expectedSession:"a"})).toBeNull();
  expect(cost("claude","haiku",[[{type:"result",subtype:"error_during_execution",total_cost_usd:0}]])).toBeNull();
});
test("Claude root cost includes helpers once; real kept records telescope to the final session total",()=>{
  expect(cost("claude","haiku",[[...claude(.05,"child").map(e=>({...e,parent_tool_use_id:"worker"})),...claude(.3)]])).toBeCloseTo(.3);
  expect(cost("claude","haiku",native.claude)).toBeCloseTo(.03926992,12);
  const tracker=new CostTracker("claude","haiku"),amounts=native.claude.map((events,i)=>tracker.next(events,{fresh:i===0}));
  expect(amounts.every(n=>n!==null)).toBe(true);
  expect(amounts[1]!).toBeCloseTo(.00432670,12);
  expect(amounts.reduce<number>((sum,n)=>sum+n!,0)).toBeCloseTo(.03926992,12);
});
test("Claude background wakes end with several session totals; the last counts once",()=>{
  expect(cost("claude","sonnet",[[...claude(.48),...claude(.48)]])).toBeCloseTo(.48);
  const tracker=new CostTracker("claude","sonnet");tracker.next(claude(.1),{fresh:true});
  expect(tracker.next([...claude(.3),...claude(.35)],{fresh:false,expectedSession:"a"})).toBeCloseTo(.25);
  for(const bad of [[...claude(.3),...claude(.2)],[...claude(.3),...claude(undefined)],[...claude(.3),...claude(.4,"b")]])
    expect(cost("claude","sonnet",[bad])).toBeNull();
});
test("Codex thread-total input, cached and output counters are differenced before pricing",()=>{
  const tracker=new CostTracker("codex","gpt-6.1-sol");
  expect(tracker.next(codex(1000,800,100),{fresh:true})).toBeCloseTo(.00148,12);
  expect(tracker.next(codex(1500,1000,120),{fresh:false,expectedSession:"a"})).toBeCloseTo(.00082,12);
  expect(tracker.next(codex(100,0,10,"b"),{fresh:true})).toBeCloseTo(.0003,12);
  for(const events of [codex(10,0,1),codex(1600,1200,130),codex(1600,1000,130,"other"),
    [{type:"thread.started",thread_id:"a"},{type:"turn.completed"}]]){
    const t=new CostTracker("codex","gpt-6.1-sol");t.next(codex(1500,1000,120),{fresh:true});
    expect(t.next(events,{fresh:false,expectedSession:"a"})).toBeNull();
  }
  // The native third result contains totals, not one more independent turn's tokens.
  const expected=((281286-263680)*2+263680*.1+1193*10)/1e6;
  expect(cost("codex","gpt-6.1-sol",native.codex)).toBeCloseTo(expected,12);
});
test("fresh auxiliary Codex calls account their own total independently",async()=>{
  const amounts:(number|null)[]=[];
  const call=structuredCall("/tmp",{},1,[],n=>amounts.push(n),async()=>({
    stdout:[{type:"thread.started",thread_id:"independent"},
      {type:"item.completed",item:{type:"agent_message",text:'{"ok":true}'}},
      {type:"turn.completed",usage:{input_tokens:1000,cached_input_tokens:800,output_tokens:100}}]
      .map(e=>JSON.stringify(e)).join("\n"),stderr:"",status:0,left:[],left_why:null,tmp:null,tmp_paths:[],
  }));
  await call("unit",{});await call("unit",{});
  expect(amounts).toEqual([.00148,.00148]);
});
test("saved replay uses final cumulative totals and retains deliberate fresh boundaries",()=>{
  const root=mkdtempSync(join(tmpdir(),"cost-replay-"));
  try{
    const paths=native.claude.slice(0,2).map((events,i)=>{
      const path=join(root,`turn${i}.jsonl`);writeFileSync(path,events.map(e=>JSON.stringify(e)).join("\n"));return path;
    });
    const row={folder:"unit",case:"unit",agent:"claude",model:"haiku",run:1,set:"essentials",checks:{},
      base:{},paths,expected:{},local:paths.map(()=>({checks:{},base:{},expected:{}})),reads:[],cost:.02275528};
    expect(replay({rows:[row],skipped:[]}).mismatches).toEqual([]);
    const fresh=join(root,"fresh.jsonl");writeFileSync(fresh,claude(.03,"fresh").map(e=>JSON.stringify(e)).join("\n"));
    row.paths.push(fresh);row.local.push({checks:{},base:{fresh_session:true}as any,expected:{}});row.cost+=.03;
    expect(replay({rows:[row],skipped:[]}).mismatches).toEqual([]);
  }finally{rmSync(root,{recursive:true,force:true});}
});
test("runner spending stops use deltas across resumes and reset at an explicit fresh session",async()=>{
  const root=mkdtempSync(join(tmpdir(),"cost-runner-"));
  const c=normalize({fixture:"tiny-weather",turns:[{prompt:"one"},{prompt:"two"},{prompt:"three"},
    {prompt:"fresh",fresh_session:true}]},"essentials/cost-unit");
  try{
    let calls=0;const caps:number[]=[];
    const result=await runOne(c,"claude","haiku",1,parseArgs(["--agents","claude","--yes"]),root,.25,async cmd=>{
      caps.push(Number(cmd[cmd.indexOf("--max-budget-usd")+1]));calls++;
      const events=claude([.1,.16,.2,.03][calls-1],calls===4?"fresh":"a");
      return {stdout:events.map(e=>JSON.stringify(e)).join("\n"),stderr:"",status:0,left:[],left_why:null,tmp:null,tmp_paths:[]};
    });
    expect(calls).toBe(4);expect(result.cost).toBeCloseTo(.23,12);expect(result.cost_unknown).toBe(false);
    expect(caps).toEqual([.25,.15,.09,.05]);
  }finally{rmSync(root,{recursive:true,force:true});}
});
