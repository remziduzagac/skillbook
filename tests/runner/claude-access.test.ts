import { test, expect } from "bun:test";
import { accessTurn } from "./access";
import native from "../fixtures/access/claude-numbered-read.json";
import type { Event } from "./types";
const read = (events: Event[]) => accessTurn("claude",events,1,native.sources);

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
