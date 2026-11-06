import { test, expect } from "bun:test";
import native from "../fixtures/access/claude-numbered-read.json";
import type { Event } from "./types";
import { action_evidence, skills_read, sameClaudeAgent, sessionId, text_before_change, turn_parts } from "./trace";

test("Claude helper actions retain their owner, and main loading and sessions exclude helper events",()=>{
  // The kept Haiku recording has no helper events; this uses the parent_tool_use_id event contract.
  const helper=structuredClone(native.events) as Event[];
  for(const e of helper){e.parent_tool_use_id="worker";e.session_id="worker-session";}
  const events=[...helper,{type:"system",subtype:"compact_boundary",parent_tool_use_id:"worker"},
    {type:"assistant",parent_tool_use_id:"worker",message:{content:[{type:"tool_use",id:"write",name:"Write",input:{file_path:"report.md"}}]}},
    ...structuredClone(native.events)] as Event[];
  events.at(-1)!.message.content[0].is_error=true;
  events.at(-1)!.message.content[0].content="Denied";
  events.at(-1)!.tool_use_result.file.content="Denied";
  const actions=action_evidence("claude",events);
  expect([...skills_read("claude",[events],null,"essentials")]).toEqual([]);
  expect(sessionId("claude",events)).toBeUndefined();expect(text_before_change("claude",[events])[1]).toBe(false);
  expect(actions.filter(a=>a.id==="read-understand").map(a=>[a.parent_tool_use_id,a.status])).toEqual([["worker","succeeded"],[null,"failed"]]);
  expect(sameClaudeAgent(actions[0]!,events[0]!)).toBe(true);
  expect(sameClaudeAgent(actions[0]!,events.at(-2)!)).toBe(false);
});

test("Claude's earlier background wakes are progress messages; only the last wake's text is the answer",()=>{
  const init={type:"system",subtype:"init",session_id:"a"},result={type:"result",subtype:"success",session_id:"a"};
  const say=(text:string)=>({type:"assistant",session_id:"a",message:{content:[{type:"text",text}]}});
  const tool={type:"assistant",session_id:"a",message:{content:[{type:"tool_use",id:"t",name:"Agent",input:{}}]}};
  // As recorded: every wake starts with init, and the results arrive together at the end.
  expect(turn_parts("claude",[init,tool,say("Two helpers are reading."),init,say("One is back."),init,
    say("Both read: the answer."),result,result,result] as Event[]))
    .toEqual(["Both read: the answer.",["Two helpers are reading.","One is back."]]);
  // One wake keeps every text after its last tool call as the answer.
  expect(turn_parts("claude",[init,say("Checking."),tool,say("Part one."),say("Part two."),result] as Event[]))
    .toEqual(["Part one.\n\nPart two.",["Checking."]]);
});
