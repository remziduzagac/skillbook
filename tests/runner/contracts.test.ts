import { describe, test, expect } from "bun:test";
import vectors from "./python-vectors.json";
import * as shell from "./shell";
import * as trace from "./trace";
import * as checks from "./checks";
import * as costs from "./cost";
import * as files from "./files";

const functions = Object.fromEntries(
  Object.entries({ ...shell, ...trace, ...checks, ...costs, ...files }).filter(([, v]) => typeof v === "function"),
) as Record<string, (...args: any[]) => any>;
describe("ported Python unit contracts", () => {
  for (const [index, vector] of vectors.entries()) {
    test(`${vector.function} ${index}`, () => {
      const actual = functions[vector.function]!(...vector.args);
      // The frozen Python vectors predate actor attribution and contain only main-agent actions.
      const expected = vector.function === "action_evidence" && vector.args[0] === "claude" && Array.isArray(vector.expected) ?
        vector.expected.map(action => ({...action as object,parent_tool_use_id:null})) : vector.expected;
      expect(actual instanceof Set ? [...actual].sort() : actual).toEqual(expected);
    });
  }
});
