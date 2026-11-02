import { test, expect } from "bun:test";
import { claudeStructuredCall } from "./claude-judge";

test("the Claude judge runs without tools, parses its JSON answer and refuses tool use or failure", async () => {
  const accounts: (number | null)[] = [];
  const result = (text: string, status = 0, action = false) => ({
    stdout: [
      { type: "system", subtype: "init", session_id: "j" },
      ...(action ? [{ type: "assistant", session_id: "j", message: { content: [
        { type: "tool_use", id: "t1", name: "Read", input: { file_path: "x" } }] } }] : []),
      { type: "assistant", session_id: "j", message: { content: [{ type: "text", text }] } },
      { type: "result", subtype: "success", session_id: "j", total_cost_usd: 0.02, result: text },
    ].map(x => JSON.stringify(x)).join("\n"), stderr: "failure", status,
    left: [], left_why: null, tmp: null, tmp_paths: null,
  });
  const caller = (text: string, status = 0, action = false) => claudeStructuredCall("sonnet", "/tmp", {}, 1, [],
    amount => accounts.push(amount), async (command, _work, _env, _timeout, _groups, prompt) => {
      expect(command.slice(command.indexOf("--tools"), command.indexOf("--tools") + 2)).toEqual(["--tools", ""]);
      expect(command).toContain("sonnet");expect(prompt).toContain("test");
      return result(text, status, action);
    });
  expect(await caller('{"ok":true}')("test", {})).toEqual({ ok: true });
  await expect(caller("not JSON")("test", {})).rejects.toThrow();
  await expect(caller('{"ok":true}', 1)("test", {})).rejects.toThrow("scenario model failed");
  await expect(caller('{"ok":true}', 0, true)("test", {})).rejects.toThrow("used tools");
  expect(accounts).toEqual([0.02, 0.02, 0.02, 0.02]);
});
