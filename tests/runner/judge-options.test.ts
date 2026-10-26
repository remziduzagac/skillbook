import { test, expect } from "bun:test";
import { judgeTimeout } from "./judge-options";

test("judge timeout defaults to 600 seconds and accepts a positive override", () => {
  expect(judgeTimeout()).toBe(600);
  expect(judgeTimeout("120")).toBe(120);
});
test("invalid judge timeouts fail before starting a model", () => {
  for (const value of ["0", "-1", "NaN", "Infinity", "", "abc"])
    expect(() => judgeTimeout(value)).toThrow("--judge-timeout");
});

test("all judge entry points reject invalid timeouts before login or scoring", async () => {
  const { spawnSync } = await import("node:child_process");
  for (const script of ["calibrate", "judge-scenarios", "check-rubric-fixtures"]) {
    const result = spawnSync(process.execPath, [`tests/${script}.ts`, "--judge-timeout=-1"], { encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("--judge-timeout needs positive seconds");
  }
});
