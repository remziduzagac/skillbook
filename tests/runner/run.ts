import { wordCount } from "./answers";
import { helperEvidence } from "./helpers";
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
import { frozenSkills } from "./inventory";
import {
  prepareHome,
  agentEnv,
  snapshot,
  fixtureText,
  fixtureDiffs,
  commitFixture,
  observe,
  CODEX_REASONING_SUMMARY,
} from "./files";
import { runTurn, endRun, tmpPaths, addedTmpPaths } from "./process";
import { agentCommand } from "./agents";
import { parse_events, sessionId, turn_parts, action_evidence, redact, sameClaudeAgent } from "./trace";
import { CostTracker, DEFAULT_MODELS } from "./cost";
import { check } from "./checks";
import { progressFindings } from "./progress";
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
  const costs = new CostTracker(agent,model);
  const noSkill = c.condition === "no-skill" || args.no_skill;
  const result: Event = {
    condition: noSkill ? "no-skill" : "installed",
    thinking_settings: agent === "codex" ? { model_reasoning_summary: CODEX_REASONING_SUMMARY } :
      { source: "harness thinking blocks; settings unchanged" },
    skill_sources: frozenSkills(),
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
    expected_turns: c.turns.length,
    selected_turns: c.turns.map((_, i) => i + 1),
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
    prepareHome(home, agent, { ...c, no_skill: noSkill }, args.login, args.instruction);
    const before = snapshot(work);
    const env = agentEnv(home, agent, args.login, tmp);
    result.initial_paths = Object.keys(before);
    result.fixture_sources = fixtureText(work);
    marker = env[MARKER];
    const events: Event[][] = [],
      turnChecks: Record<string, Verdict> = {};
    let session: string | undefined,
      previous = before,
      previousText = result.fixture_sources,
      costUnknown = false,
      lastTmp: string[] | null = null;
    for (const [index, turn] of c.turns.entries()) {
      const i = index + 1,
        remaining = Math.max(0, budget - result.cost);
      if (agent === "claude" && (remaining <= 0 || costUnknown)) {
        result.error = `turn ${i}: remaining budget is exhausted or unknown`;
        break;
      }
      if (turn.fresh_session) session = undefined;
      const beforeTmp = tmpPaths(tmp), timeout = turn.timeout ?? args.timeout;
      const ran = await driver(
          agentCommand(agent, model, turn.prompt, remaining, session),
          work,
          env,
          timeout,
          groups,
        ).catch(error => ({ stdout: "", stderr: `runner error: ${String(error)}`, status: 1,
          left: null, left_why: "transport threw", tmp: null, tmp_paths: null })),
        failed = ran.status !== 0;
      if (ran.status === null) result.error = `turn ${i}: took longer than ${timeout} seconds`;
      else if (failed) result.error = `turn ${i}: exit ${ran.status}: ${redact(ran.stderr.trim().slice(-300))}`;
      const turnEvents = parse_events(ran.stdout);
      const recording = args.keep ? join(out,
        `${c.id.replaceAll("/", "--")}--${agent}--${model.replace(/[^A-Za-z0-9._-]+/g, "-")}--${n}--${result.condition}--turn${i}.jsonl`) : null;
      if (recording) writeFileSync(recording, ran.stdout);
      const turnCost = costs.next(turnEvents,{fresh:!session,expectedSession:session});
      result.cost += turnCost ?? 0;
      result.cost_unknown ||= turnCost === null || failed;
      costUnknown ||= turnCost === null || failed;
      events.push(turnEvents);
      const observedSession = sessionId(agent, turnEvents);
      session = observedSession ?? session;
      const observation = observe(agent, [turnEvents], c.set, previous, work, turn.checks ?? {});
      observation.left_running = ran.left;
      observation.left_unknown_because = ran.left_why;
      observation.tmp_listing = ran.tmp;
      const turnTmp = addedTmpPaths(beforeTmp, ran.tmp_paths);
      observation.tmp_check_basis = "paths added during this turn";
      observation.tmp_checks = check({tmp_has: turn.checks?.tmp_has ?? [], tmp_lacks: turn.checks?.tmp_lacks ?? []},
        observation, c.fixture, turnTmp);
      observation.baseline_files = result.fixture_sources;
      const currentText = fixtureText(work),
        [final, between] = turn_parts(agent, turnEvents);
      observation.files = currentText;
      observation.final_answer = final;
      observation.between_tools = between;
      result.turns.push({
        ...observation,
        session: observedSession, turn: i,
        helpers: helperEvidence(agent, events.flat()),
        recording,
        scripted_message: turn.prompt,
        sent_message: turn.prompt,
        fresh_session: turn.fresh_session ?? false,
        final_answer: final,
        final_words: wordCount(final),
        between_tools: between,
        actions: action_evidence(agent, turnEvents).map(action => ({ ...action, order: turnEvents.findIndex(e =>
          agent === "codex" ? e.item?.id === action.id && e.type === action.phase :
            sameClaudeAgent(action,e) && e.message?.content?.some((b: Event) => b.type === "tool_use" && b.id === action.id)),
          ...(agent === "claude" ? { result_order: turnEvents.findIndex(e =>
            sameClaudeAgent(action,e) && e.message?.content?.some((b: Event) => b.type === "tool_result" && b.tool_use_id === action.id)) } : {}) })),
        file_diffs: fixtureDiffs(previousText, currentText),
        trace_complete: !failed,
        rubric_pending: turn.rubric ?? [],
      });
      lastTmp = ran.tmp_paths;
      for (const [name, value] of Object.entries(check(turn.checks ?? {}, observation, c.fixture, turnTmp)))
        turnChecks[`turn ${i}: ${name}`] = value;
      previous = snapshot(work);
      previousText = currentText;
      if (failed) break;
    }
    if (events.length) {
      Object.assign(result, observe(agent, events, c.set, before, work, c.checks));
      result.left_running = result.turns.at(-1).left_running;
      result.checks = { ...turnChecks, ...check(c.checks, result, c.fixture, lastTmp) };
    }
  } catch (error) {
    result.error = `runner error: ${String(error)}`;
    result.cost_unknown = true;
  } finally {
    result.progress_findings = progressFindings(result.turns);
    result.unreached_turns = c.turns.map((_, i) => i + 1).filter(turn => !result.turns.some((r: Event) => r.turn === turn))
      .map(turn => ({ turn, reason: "run interrupted" }));
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
        for (const model of models.length ? models : c.models?.[agent] ?? [DEFAULT_MODELS[agent]]) {
          if (c.models?.[agent] && !c.models[agent]!.includes(model)) throw Error(`model ${model} is not allowed by ${c.id}`);
          for (let n = 1; n <= (args.runs || c.runs); n++) plan.push([c, agent, model, n]);
        }
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
      writeFileSync(join(out, `run-${index + 1}.json`), JSON.stringify(result, null, 2) + "\n");
      spent += result.cost ?? 0;
      unknown += Number(result.cost_unknown || result.cost === null);
      console.log(`  ${result.case}  ${result.agent}  ${result.model} run ${result.run}: ${runStatus(result)}`);
      if (result.error && /login|usage limit|capacity|runner error|network|connect|stream|resolve|dns/i.test(result.error)) stop = true;
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
  const sharedAfter = readdirSync("/tmp").filter((n) => !sharedBefore.has(n));
  if (sharedAfter.length)
    console.log("new shared /tmp names during run (may belong to other processes): " + sharedAfter.join(", "));
  console.log(
    `results: ${out}; ${next} of ${plan.length} scheduled; ` +
      `known spending $${spent.toFixed(4)}; ${unknown} unknown-cost runs`,
  );
  return results;
}
