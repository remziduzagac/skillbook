import { test, expect } from "bun:test";
import { accessTurn } from "./access";
import native from "../fixtures/access/claude-numbered-read.json";
import type { Event } from "./types";
import { action_evidence, skills_read, sameClaudeAgent, sessionId, text_before_change } from "./trace";
import { judgeEvidence } from "./scenario";
const read = (events: Event[]) => accessTurn("claude",events,1,native.sources);

test("Claude helper actions retain their owner while main loading and context exclude helper events",()=>{
  // The kept Haiku chapter has no helper events; this uses the parent_tool_use_id event contract.
  const helper=structuredClone(native.events) as Event[];
  for(const e of helper){e.parent_tool_use_id="worker";e.session_id="worker-session";}
  const events=[...helper,{type:"system",subtype:"compact_boundary",parent_tool_use_id:"worker"},
    {type:"assistant",parent_tool_use_id:"worker",message:{content:[{type:"tool_use",id:"write",name:"Write",input:{file_path:"report.md"}}]}},
    ...structuredClone(native.events)] as Event[];
  events.at(-1)!.message.content[0].is_error=true;
  events.at(-1)!.message.content[0].content="Denied";
  events.at(-1)!.tool_use_result.file.content="Denied";
  const access=read(events),actions=action_evidence("claude",events);
  expect(access.records).toHaveLength(1);expect(access.records[0]!.call_success).toBe(false);
  expect(access.records[0]!.extent).not.toBe("whole");
  expect(access.boundaries).toEqual([]);expect(access.first_attempt).toBeNull();
  expect([...skills_read("claude",[events],null,"essentials")]).toEqual([]);
  expect(sessionId("claude",events)).toBeUndefined();expect(text_before_change("claude",[events])[1]).toBe(false);
  expect(actions.filter(a=>a.id==="read-understand").map(a=>[a.parent_tool_use_id,a.status])).toEqual([["worker","succeeded"],[null,"failed"]]);
  expect(sameClaudeAgent(actions[0]!,events[0]!)).toBe(true);
  expect(sameClaudeAgent(actions[0]!,events.at(-2)!)).toBe(false);
  expect(judgeEvidence([{actions}]).turns[0]!.actions).toEqual(actions);
  expect(read(helper).records).toEqual([]);
});

test("native Claude numbered Read preserves indentation and verifies the complete frozen guide",()=>{
  expect(read(native.events).records.find(r=>r.skill==="understand")).toMatchObject({extent:"whole",operation:"read",success:true});
  const numberedOnly=structuredClone(native.events) as Event[];
  delete numberedOnly[1]!.tool_use_result;
  expect(read(numberedOnly).records.find(r=>r.skill==="understand")!.extent).toBe("whole");
  const old=structuredClone(numberedOnly);
  old[1]!.message.content[0].content=native.sources.understand.split("\n").map((s,i)=>`${i+1}→${s}`).join("\n");
  expect(read(old).records.find(r=>r.skill==="understand")!.extent).toBe("whole");
});
test("native Read counts corroborate verified slices; partial, missing and truncated text cannot prove whole",()=>{
  const partial=(from:number,count:number):Event[]=>{
    const events=structuredClone(native.events) as Event[],file=events[1]!.tool_use_result.file;
    file.startLine=from;file.numLines=count;
    file.content=native.sources.understand.split("\n").slice(from-1,from-1+count).join("\n");
    events[1]!.message.content[0].content=file.content.split("\n").map((s:string,i:number)=>`${from+i}\t${s}`).join("\n");
    return events;
  };
  expect(read(partial(1,10)).records[0]!.extent).toBe("partial");
  const first=partial(1,10),last=partial(11,66);
  last[0]!.message.content[0].id="last";last[1]!.message.content[0].tool_use_id="last";
  expect(read([...first,...last]).records.at(-1)!.extent).toBe("whole");
  for(const mode of ["empty","missing middle","truncated"]){
    const broken=structuredClone(native.events) as Event[];
    if(mode==="truncated")broken[1]!.message.content[0].content+="\nOutput truncated";
    else {
      const text=mode==="empty"?"":"# understand\nlast line";
      broken[1]!.message.content[0].content=text;broken[1]!.tool_use_result.file.content=text;
    }
    expect(read(broken).records[0]!.extent).not.toBe("whole");
  }
});
test("Claude cd then cat attributes every delivered guide, without promoting a partial or searched guide",()=>{
  const command="cd /sandbox/home/.claude/skills/essentials/references && cat understand.md act.md";
  const events=(output:string,cmd=command):Event[]=>[
    {type:"assistant",message:{content:[{type:"tool_use",id:"cat",name:"Bash",input:{command:cmd}}]}},
    {type:"user",message:{content:[{type:"tool_result",tool_use_id:"cat",content:output}]},
      tool_use_result:{stdout:output,stderr:"",interrupted:false,isImage:false,noOutputExpected:false}},
  ];
  const whole=read(events(native.sources.understand+native.sources.act));
  expect(whole.records.filter(r=>r.extent==="whole").map(r=>r.skill).sort()).toEqual(["act","understand"]);
  const partial=read(events(native.sources.understand+native.sources.act.slice(0,100)));
  expect(partial.records.find(r=>r.skill==="act")!.extent).toBe("partial");
  expect(partial.records.find(r=>r.skill==="understand")!.extent).toBe("whole");
  const searched=read(events(native.sources.understand+native.sources.act,command.replace("cat","grep ''")));
  expect(searched.records.every(r=>r.extent!=="whole")).toBe(true);
});
