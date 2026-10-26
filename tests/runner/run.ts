import {
  mkdtempSync,
  mkdirSync,
  cpSync,
  copyFileSync,
  existsSync,
  writeFileSync,
  unlinkSync,
  rmSync,
  readdirSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { FIXTURES, MARKER } from "./paths";
import { prepareHome, agentEnv, snapshot, fixtureText, fixtureDiffs, commitFixture, observe } from "./files";
import { runTurn, endRun } from "./process";
import { agentCommand } from "./agents";
import { parse_events, sessionId, turn_parts, action_evidence, redact } from "./trace";
import { cost, DEFAULT_MODELS } from "./cost";
import { check } from "./checks";
import { evaluateTagged, score, scoreRuns } from "./scoring";
import { runStatus, summarize } from "./reports";
import type { Agent, Case, Options, Event, Verdict } from "./types";
export async function runOne(
  c: Case,
  agent: Agent,
  model: string,
  n: number,
  args: Options,
  out: string,
  budget: number,
  driver: typeof runTurn = runTurn,
): Promise<Event> {
  if (c.user?.mode === "simulated") throw Error(`${c.id}: simulated user execution belongs to the scenario layer`);
  const result: Event = {
    case: c.id,
    agent,
    model,
    run: n,
    error: null,
    cost: 0,
    cost_unknown: false,
    checks: {},
    reads: [],
    changes: [],
    answer: "",
    review: c.review ?? [],
    turns: [],
    routing_only: c.routing_only ?? false,
  };
  const root = mkdtempSync(join(tmpdir(), "skillbook-test-ts-")),
    groups: number[] = [];
  let marker: string | undefined;
  try {
    const home = join(root, "home"),
      work = join(root, "work"),
      tmp = join(root, "tmp");
    mkdirSync(tmp);
    cpSync(join(FIXTURES, c.fixture), work, { recursive: true });
    if (c.version_control) commitFixture(work);
    if (agent === "claude" && existsSync(join(work, "AGENTS.md")) && !existsSync(join(work, "CLAUDE.md")))
      copyFileSync(join(work, "AGENTS.md"), join(work, "CLAUDE.md"));
    prepareHome(home, agent, c, args.login, args.instruction);
    const before = snapshot(work),
      env = agentEnv(home, agent, args.login, tmp);
    marker = env[MARKER];
    const events: Event[][] = [],
      turnChecks: Record<string, Verdict> = {},
      taggedHistory: Record<string, Verdict> = {};
    let session: string | undefined,
      previous = before,
      previousText = fixtureText(work),
      lastTmp: string[] | null = null;
    for (const [index, turn] of c.turns.entries()) {
      const i = index + 1,
        remaining = Math.max(0, budget - result.cost);
      if (agent === "claude" && (remaining <= 0 || result.cost_unknown)) {
        result.error = `turn ${i}: remaining budget is exhausted or unknown`;
        break;
      }
      const ran = await driver(
          agentCommand(agent, model, turn.prompt, remaining, session),
          work,
          env,
          args.timeout,
          groups,
        ),
        failed = ran.status !== 0;
      if (ran.status === null) result.error = `turn ${i}: took longer than ${args.timeout} seconds`;
      else if (failed) result.error = `turn ${i}: exit ${ran.status}: ${redact(ran.stderr.trim().slice(-300))}`;
      const turnEvents = parse_events(ran.stdout);
      if (args.keep)
        writeFileSync(
          join(
            out,
            `${c.id.replaceAll("/", "--")}--${agent}--${model.replace(/[^A-Za-z0-9._-]+/g, "-")}--${n}--turn${i}.jsonl`,
          ),
          ran.stdout,
        );
      const turnCost = cost(agent, model, [turnEvents]);
      result.cost += turnCost ?? 0;
      result.cost_unknown ||= turnCost === null || failed;
      events.push(turnEvents);
      session ??= sessionId(agent, turnEvents);
      const taggedAssertions = Object.assign({}, ...(turn.tagged_checks ?? []).map((x) => x.assert));
      const observation = observe(agent, [turnEvents], c.set, previous, work, { ...taggedAssertions, ...turn.checks });
      observation.left_running = ran.left;
      observation.left_unknown_because = ran.left_why;
      observation.tmp_listing = ran.tmp;
      const currentText = fixtureText(work),
        [final, between] = turn_parts(agent, turnEvents);
      const tagged = evaluateTagged(turn.tagged_checks ?? [], observation, taggedHistory, c.fixture, ran.tmp_paths);
      for (const t of tagged) taggedHistory[`${i}:${t.id}`] = t.verdict;
      result.turns.push({
        ...observation,
        scripted_message: turn.prompt,
        sent_message: turn.prompt,
        purpose: turn.purpose ?? "",
        final_answer: final,
        between_tools: between,
        actions: action_evidence(agent, turnEvents),
        file_diffs: fixtureDiffs(previousText, currentText),
        trace_complete: !failed,
        tagged_checks: tagged,
        rubric_pending: turn.rubric ?? [],
      });
      lastTmp = ran.tmp_paths;
      for (const [name, value] of Object.entries(check(turn.checks ?? {}, observation, c.fixture, lastTmp)))
        turnChecks[`turn ${i}: ${name}`] = value;
      previous = snapshot(work);
      previousText = currentText;
      if (failed) break;
    }
    if (events.length) {
      Object.assign(result, observe(agent, events, c.set, before, work, c.checks));
      result.left_running = result.turns.at(-1).left_running;
      result.checks = { ...turnChecks, ...check(c.checks, result, c.fixture, lastTmp) };
      result.scores = score(result.turns.flatMap((t: Event) => t.tagged_checks));
    }
  } catch (error) {
    result.error = `runner error: ${String(error)}`;
    result.cost_unknown = true;
  } finally {
    await endRun(groups, marker);
    for (const login of [".claude/.credentials.json", ".codex/auth.json"])
      try {
        unlinkSync(join(root, "home", login));
      } catch (error: any) {
        if (error.code !== "ENOENT")
          result.error = (result.error ?? "") + `; could not delete copied login: ${String(error)}`;
      }
    rmSync(root, { recursive: true, force: true });
  }
  return result;
}
export function planRuns(cases: Case[], args: Options): [Case, Agent, string, number][] {
  const plan: [Case, Agent, string, number][] = [];
  for (const c of cases)
    for (const agent of args.agents)
      if (c.agents.includes(agent)) {
        const models = args.model.filter((m) => m.startsWith(agent + "=")).map((m) => m.slice(agent.length + 1));
        for (const model of models.length ? models : [DEFAULT_MODELS[agent]])
          for (let n = 1; n <= (args.runs || c.runs); n++) plan.push([c, agent, model, n]);
      }
  return plan;
}
export async function runPlan(
  plan: ReturnType<typeof planRuns>,
  args: Options,
  out: string,
  runner: typeof runOne = runOne,
) {
  mkdirSync(out, { recursive: true });
  let next = 0,
    spent = 0,
    unknown = 0,
    stop = false;
  const done = new Map<number, Event>();
  const interrupt = () => {
    stop = true;
    console.log("interrupted; waiting for running runs to clean up");
  };
  process.on("SIGINT", interrupt);
  const sharedBefore = new Set(readdirSync("/tmp"));
  async function worker() {
    while (!stop && next < plan.length && spent < args.budget) {
      const index = next++,
        item = plan[index]!,
        left = args.budget - spent;
      let result: Event;
      try {
        result = await runner(...item, args, out, left);
      } catch (error) {
        const [c, agent, model, n] = item;
        result = {
          case: c.id,
          agent,
          model,
          run: n,
          error: `runner error: ${String(error)}`,
          cost: null,
          cost_unknown: true,
          checks: {},
          turns: [],
          review: c.review ?? [],
        };
      }
      done.set(index, result);
      spent += result.cost ?? 0;
      unknown += Number(result.cost_unknown || result.cost === null);
      console.log(`  ${result.case}  ${result.agent}  ${result.model} run ${result.run}: ${runStatus(result)}`);
      if (result.error && /login|usage limit|capacity|runner error/i.test(result.error)) stop = true;
    }
  }
  try {
    await Promise.all(Array.from({ length: Math.min(args.jobs, plan.length) }, worker));
  } finally {
    process.off("SIGINT", interrupt);
  }
  const results = [...done].sort(([a], [b]) => a - b).map(([, r]) => r);
  writeFileSync(join(out, "summary.json"), JSON.stringify(results, null, 2) + "\n");
  writeFileSync(join(out, "summary.md"), summarize(results, spent, unknown));
  writeFileSync(join(out, "scores.json"), JSON.stringify(scoreRuns(results as any), null, 2) + "\n");
  const sharedAfter = readdirSync("/tmp").filter((n) => !sharedBefore.has(n));
  if (sharedAfter.length)
    console.log("new shared /tmp names during run (may belong to other processes): " + sharedAfter.join(", "));
  console.log(
    `results: ${out}; ${next} of ${plan.length} scheduled; ` +
      `known spending $${spent.toFixed(4)}; ${unknown} unknown-cost runs`,
  );
  return results;
}
