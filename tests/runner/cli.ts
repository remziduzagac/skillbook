import { readFileSync } from "node:fs";
import { validateRubricReport } from "./rubric-fixtures";
import { requireCalibration } from "./calibration";
import { parseArgs as parse } from "node:util";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadCases, compareConversions } from "./cases";
import { coverage, aspectCoverage } from "./inventory";
import { runsToJudge } from "./reports";
import { loginProblem } from "./agents";
import { planRuns, runPlan } from "./run";
import type { Agent, Options } from "./types";
export function parseArgs(argv: string[]): Options {
  // Match Python's --to-judge FOLDER [FOLDER ...] as well as repeated flags.
  const expanded: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--to-judge") {
      let count = 0;
      while (i + 1 < argv.length && !argv[i + 1]!.startsWith("--")) {
        expanded.push("--to-judge", argv[++i]!);
        count++;
      }
      if (!count) throw Error("--to-judge needs a folder");
    } else expanded.push(argv[i]!);
  }
  const { values: v } = parse({
    args: expanded,
    options: {
      suite: { type: "string" },
      "user-mode": { type: "string" },
      "rubric-validation": { type: "string" },
      calibration: { type: "string" },
      judge: { type: "boolean", default: false },
      case: { type: "string", default: "" },
      agents: { type: "string", default: "claude,codex" },
      runs: { type: "string", default: "0" },
      model: { type: "string", multiple: true, default: [] },
      login: { type: "boolean", default: false },
      instruction: { type: "string", default: "" },
      budget: { type: "string", default: "1" },
      jobs: { type: "string", default: "4" },
      timeout: { type: "string", default: "300" },
      keep: { type: "boolean", default: false },
      out: { type: "string" },
      "dry-run": { type: "boolean", default: false },
      coverage: { type: "boolean", default: false },
      summary: { type: "boolean", default: false },
      yes: { type: "boolean", default: false },
      validate: { type: "boolean", default: false },
      "to-judge": { type: "string", multiple: true, default: [] },
    },
  });
  const agents = v.agents!.split(",") as Agent[];
  if (!agents.length || agents.some((a) => !["claude", "codex"].includes(a))) throw Error("--agents: claude,codex");
  for (const model of v.model!) if (!/^(claude|codex)=.+/.test(model)) throw Error("--model must be agent=model");
  const number = (name: "runs" | "budget" | "jobs" | "timeout", minimum: number, integer: boolean) => {
    const n = Number(v[name]);
    if (!Number.isFinite(n) || n < minimum || (integer && !Number.isInteger(n))) throw Error(`invalid --${name}`);
    return n;
  };
  if (v.suite && !["short", "master"].includes(v.suite)) throw Error("invalid --suite");
  if (v["user-mode"] && !["fixed", "simulated"].includes(v["user-mode"])) throw Error("invalid --user-mode");
  return {
    suite: v.suite as Options["suite"],
    user_mode: v["user-mode"] as Options["user_mode"],
    judge: v.judge,
    calibration: v.calibration,
    rubric_validation: v["rubric-validation"],
    case: v.case!,
    agents,
    runs: number("runs", 0, true),
    model: v.model!,
    login: v.login!,
    instruction: v.instruction!,
    budget: number("budget", 0, false),
    jobs: number("jobs", 1, true),
    timeout: number("timeout", 0.001, false),
    keep: v.keep!,
    out: v.out,
    dry_run: v["dry-run"]!,
    coverage: v.coverage!,
    summary: v.summary!,
    yes: v.yes!,
    validate: v.validate!,
    to_judge: v["to-judge"]!,
  };
}
export async function main(argv = Bun.argv.slice(2)): Promise<number> {
  if (argv.includes("--help")) {
    console.log(
      "bun tests/run.ts [--case TEXT] [--agents claude,codex] [--model agent=model] " +
        "[--runs N] [--jobs N] [--budget USD] [--timeout SECONDS] [--login] [--keep] [--out DIR] " +
        "[--suite short|master] [--user-mode fixed|simulated] [--judge --calibration FILE --rubric-validation FILE] [--dry-run] [--yes] [--validate] [--coverage] [--summary] [--to-judge DIR]",
    );
    return 0;
  }
  const args = parseArgs(argv);
  if (args.to_judge.length) {
    process.stdout.write(runsToJudge(args.to_judge));
    return 0;
  }
  const all = loadCases(),
    cases = all.filter((c) => c.id.includes(args.case) && (!args.suite || c.suite === args.suite));
  if (args.validate) {
    console.log(`${all.length} YAML cases valid; ${compareConversions()} TOML conversions identical`);
    return 0;
  }
  if (args.coverage) {
    console.log(coverage(args.summary ? all : cases, args.summary));
    return aspectCoverage(all).unknown.length ? 1 : 0;
  }
  if (!cases.length) throw Error(`no case matches ${args.case}`);
  const plan = planRuns(cases, args),
    turns = plan.reduce((n, [c]) => n + c.turns.length, 0);
  console.log(`${plan.length} runs, ${turns} turns; estimated cost up to about $${(turns * 0.02).toFixed(2)}`);
  console.log(
    `budget: no new run starts after known spending reaches $${args.budget.toFixed(2)}; ` +
      `up to ${args.jobs} running calls finish. Claude has a per-call cap; ` +
      "Codex has no hard spending cap. Unknown cost stays unknown.",
  );
  if (args.dry_run) {
    for (const [c, a, m, n] of plan) console.log(`  ${c.id} ${a} ${m} run ${n}`);
    return 0;
  }

  if (args.judge) {
    console.log("Judge calibration:", requireCalibration(args.calibration));
    if (!args.rubric_validation) throw Error("--judge needs --rubric-validation FILE");
    console.log("Rubric trace judgments:", validateRubricReport(JSON.parse(readFileSync(args.rubric_validation, "utf8"))));
  }
  const usable = plan.filter(([, a]) => {
    const problem = loginProblem(a, args.login);
    if (problem) console.log(`skipping ${a}: ${problem}`);
    return !problem;
  });
  if (!usable.length) throw Error("nothing to run");
  if (!args.yes && prompt("run? [y/N]")?.trim().toLowerCase() !== "y") return 1;
  const out = args.out ?? join(tmpdir(), "skillbook-test-results", new Date().toISOString().replace(/[:.]/g, "-"));
  const results = await runPlan(usable, args, out);
  return results.some((r) => r.error || Object.values(r.checks).some((v) => v === false)) ? 1 : 0;
}
