import { resultRubric } from "./judge-protocol";
import { wordCount } from "./answers";
import { selectedTurns, putCheckpoint, commitCheckpoint } from "./chapters";
import { resolvedNeeds } from "./needs";
import { sourceSnapshots } from "./source-snapshots";
import { helperEvidence } from "./helpers";
import { ruleChecks } from "./rule-checks";
import { measurementReport } from "./measurement-report";
import { applicableClaims, assessedResults, measuredOpportunities, measurementPlan } from "./measure-turn";
import { CallLimits } from "./call-limits";
import { accessTurn, frozenSkills, retainAccess } from "./access";
import { inspectCodexRetention, withCodexRetention } from "./codex-retention";
import { collectRoutingNotes, CODEX_REASONING_SUMMARY } from "./routing-notes";
import { gitTips, gitEvidence, testCommands, runTestCommands, needsTurnStart } from "./project-evidence";
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
import { prepareHome, agentEnv, ownLogin, snapshot, fixtureText, fixtureDiffs, commitFixture, observe } from "./files";
import { runTurn, endRun, tmpPaths, addedTmpPaths } from "./process";
import { agentCommand } from "./agents";
import { parse_events, sessionId, turn_parts, action_evidence, redact, sameClaudeAgent } from "./trace";
import { CostTracker, DEFAULT_MODELS } from "./cost";
import { check } from "./checks";
import { progressFindings } from "./progress";
import { structuredCall, simulate, fit, rubricBatch, judgeEvidence } from "./scenario";
import { evaluateTagged, score, scoresByCase, scenarioReliability } from "./scoring";
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
  limits?: CallLimits,
): Promise<Event> {
  const selected = selectedTurns(c, args.chapter);
  const costs = new CostTracker(agent,model);
  const noSkill = c.condition === "no-skill" || args.no_skill;
  const mode = args.user_mode ?? c.user?.mode ?? "fixed";
  if (mode === "simulated" && (!c.user || !c.goal)) throw Error("simulated mode needs scenario user facts and goal");
  const result: Event = {
    user_mode: mode,
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
    expected_turns: selected.length,
    selected_turns: selected.map(t => t.index + 1),
    chapter_checkpoints: {},
    chapter_errors: [],
    expected_fit_transitions: selected.filter((t, i) => selected[i + 1]?.chapter?.number === t.chapter?.number &&
      selected[i + 1]?.index === t.index + 1).length,
  };
  const root = mkdtempSync(join(tmpdir(), "skillbook-test-ts-")),
    groups: number[] = [];
  let marker: string | undefined;
  try {
    const home = join(root, "home"),
      work = join(root, "work"),
      tmp = join(root, "tmp");
    mkdirSync(tmp);
    if (!c.chapters) {
      cpSync(join(FIXTURES, c.fixture), work, { recursive: true });
      if (c.version_control) commitFixture(work);
    } else mkdirSync(work);
    if (agent === "claude" && existsSync(join(work, "AGENTS.md")) && !existsSync(join(work, "CLAUDE.md")))
      copyFileSync(join(work, "AGENTS.md"), join(work, "CLAUDE.md"));
    prepareHome(home, agent, { ...c, no_skill: noSkill }, args.login, args.instruction);
    let before = snapshot(work);
    const env = agentEnv(home, agent, args.login, tmp);
    result.initial_paths = Object.keys(before);
    result.fixture_sources = sourceSnapshots(work, fixtureText(work), c.source_snapshots, true);
    marker = env[MARKER];
    const judgeWork = join(root, "judge"), judgeHome = join(root, "judge-home");
    mkdirSync(judgeWork);
    mkdirSync(join(judgeHome, ".codex"), { recursive: true });
    writeFileSync(join(judgeHome, ".codex", "config.toml"),
      '[features]\napps = false\nplugins = false\nremote_plugin = false\n');
    const needsAuxiliary = agent === "codex" || args.judge || mode === "simulated" || result.expected_fit_transitions > 0;
    if (args.login && needsAuxiliary) copyFileSync(ownLogin("codex"),
      join(judgeHome, ".codex", "auth.json"));
    const judgeEnv = agentEnv(judgeHome, "codex", args.login, tmp);
    // The Claude cap guards the tested agent's own spending; auxiliary Codex calls are billed apart and stay reported.
    let chapterCostUnknown = false, agentCostUnknown = false;
    const rawCall = structuredCall(judgeWork, judgeEnv, args.timeout, groups, amount => {
      limits?.account(amount);
      result.cost += amount ?? 0;
      result.cost_unknown ||= amount === null;
    }, driver);
    const call: typeof rawCall = async (instruction, data) => {
      limits?.dispatch(instruction.startsWith("Play the user") ? "simulated_user" : "judge");
      return rawCall(instruction, data);
    };
    const events: Event[][] = [],
      turnChecks: Record<string, Verdict> = {},
      taggedHistory: Record<string, Verdict> = {};
    let session: string | undefined,
      previous = before,
      previousText = result.fixture_sources,
      baseline = before, baselineText = result.fixture_sources,
      chapterNumber: number | undefined,
      chapterEvents: Event[] = [],
      chapterTurns: Event[] = [],
      failedChapter: number | undefined,
      lastTmp: string[] | null = null;
    for (const {index, turn, chapter} of selected) {
      const chapterStart = chapter && chapter.number !== chapterNumber;
      if (chapterStart) {
        await endRun(groups, marker); groups.length = 0;
        // Temporary material cannot leak into a new working session.
        rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp);
        putCheckpoint(work, chapter, c.gitignore);
        if (agent === "claude" && existsSync(join(work, "AGENTS.md")) && !existsSync(join(work, "CLAUDE.md")))
          copyFileSync(join(work, "AGENTS.md"), join(work, "CLAUDE.md"));
        commitCheckpoint(work, chapter.number, chapter.checkpoint.untracked);
        previous = baseline = snapshot(work); previousText = baselineText = sourceSnapshots(work, fixtureText(work), c.source_snapshots, true);
        if (!result.turns.length) {
          before = baseline; result.initial_paths = Object.keys(before); result.fixture_sources = baselineText;
        }
        result.chapter_checkpoints[chapter.number] = { sources: baselineText, paths: Object.keys(baseline), snapshot: baseline };
        chapterNumber = chapter.number; chapterEvents = []; chapterTurns = []; session = undefined; chapterCostUnknown = false;
        for (const key of Object.keys(taggedHistory)) delete taggedHistory[key];
      }
      if (chapter && failedChapter === chapter.number) continue;
      const i = index + 1,
        remaining = Math.max(0, budget - result.cost);
      if (agent === "claude" && (remaining <= 0 || (c.chapters ? chapterCostUnknown : agentCostUnknown))) {
        result.error = `turn ${i}: remaining budget is exhausted or unknown`;
        if (!chapter || remaining <= 0) break;
        failedChapter = chapter.number;
        result.chapter_errors.push({chapter: chapter.number, turn: i, error: result.error});
        continue;
      }
      if (turn.fresh_session) session = undefined;
      const sent = mode === "simulated" ? await simulate(call, c, index, chapterTurns, baselineText) :
        { message: turn.prompt, steered: false };
      const beforeTmp = tmpPaths(tmp), timeout = turn.timeout ?? args.timeout, tipsBefore = gitTips(work);
      limits?.dispatch("agent");
      const ran = await driver(
          agentCommand(agent, model, sent.message, remaining, session),
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
      limits?.account(turnCost);
      result.cost += turnCost ?? 0;
      result.cost_unknown ||= turnCost === null || failed;
      chapterCostUnknown ||= turnCost === null || failed;
      agentCostUnknown ||= turnCost === null || failed;
      events.push(turnEvents);
      chapterEvents.push(...turnEvents);
      const observedSession = sessionId(agent, turnEvents);
      session = observedSession ?? session;
      const taggedAssertions = Object.assign({}, ...(turn.tagged_checks ?? []).map((x) => x.assert));
      const observation = observe(agent, [turnEvents], c.set, previous, work, { ...taggedAssertions, ...turn.checks });
      observation.left_running = ran.left;
      observation.left_unknown_because = ran.left_why;
      observation.tmp_listing = ran.tmp;
      const turnTmp = addedTmpPaths(beforeTmp, ran.tmp_paths);
      observation.tmp_check_basis = "paths added during this turn";
      const tmpAssertions = [turn.checks, ...(turn.tagged_checks ?? []).map(t => t.assert)];
      observation.tmp_checks = check({tmp_has: tmpAssertions.flatMap(c => c?.tmp_has ?? []),
        tmp_lacks: tmpAssertions.flatMap(c => c?.tmp_lacks ?? [])}, observation, c.fixture, turnTmp);
      observation.baseline_files = baselineText;
      observation.baseline_snapshot = baseline;
      Object.assign(observation, gitEvidence(work, tipsBefore));
      const commands = testCommands(tmpAssertions);
      if (commands.length) observation.test_runs = await runTestCommands(commands, work, home, root);
      if (needsTurnStart(tmpAssertions)) { observation.start_snapshot = previous; observation.start_files = previousText; }
      const currentText = sourceSnapshots(work, fixtureText(work), c.source_snapshots),
        [final, between] = turn_parts(agent, turnEvents);
      observation.files = currentText;
      observation.final_answer = final;
      observation.between_tools = between;
      let access = { ...accessTurn(agent, turnEvents, i, result.skill_sources, !failed),
        change_confirmed: observation.changes.length > 0 };
      if (agent === "codex") {
        const prior = !turn.fresh_session && chapterTurns.at(-1)?.session === observedSession ? chapterTurns.at(-1) : undefined;
        const sessionTurns = prior ? (prior.access.retention_evidence?.completed_turns ?? 0) + 1 : 1;
        access = withCodexRetention(access, inspectCodexRetention(home, observedSession, sessionTurns, final,
          prior?.access.retention_evidence));
      }
      const tagged = evaluateTagged(turn.tagged_checks ?? [], observation, taggedHistory, c.fixture, turnTmp);
      for (const t of tagged) taggedHistory[`${i}:${t.id}`] = t.verdict;
      result.turns.push({
        ...observation,
        session: observedSession, turn: i, chapter: chapterNumber,
        helpers: helperEvidence(agent, chapterEvents),
        recording,
        routing_notes: collectRoutingNotes(agent, turnEvents),
        skill_needs: turn.skill_needs ?? [], author_rule_marks: turn.rule_marks ?? [],
        scripted_message: turn.prompt,
        sent_message: sent.message,
        steered: sent.steered,
        fresh_session: !!chapterStart || (turn.fresh_session ?? false),
        purpose: turn.purpose ?? "",
        final_answer: final,
        final_words: wordCount(final),
        between_tools: between,
        claim_text: observation.answer,
        claim_messages: turnEvents.flatMap((e, order) => agent === "codex" ?
          e.type === "item.completed" && e.item?.type === "agent_message" ? [{ text: e.item.text, order }] : [] :
          e.type === "assistant" && !e.parent_tool_use_id ? (e.message?.content ?? []).filter((b: Event) => b.type === "text").map((b: Event) => ({ text: b.text, order })) : []),
        actions: action_evidence(agent, turnEvents).map(action => ({ ...action, order: turnEvents.findIndex(e =>
          agent === "codex" ? e.item?.id === action.id && e.type === action.phase :
            sameClaudeAgent(action,e) && e.message?.content?.some((b: Event) => b.type === "tool_use" && b.id === action.id)),
          ...(agent === "claude" ? { result_order: turnEvents.findIndex(e =>
            sameClaudeAgent(action,e) && e.message?.content?.some((b: Event) => b.type === "tool_result" && b.tool_use_id === action.id)) } : {}) })),
        file_diffs: fixtureDiffs(previousText, currentText),
        trace_complete: !failed,
        access: retainAccess(access, observedSession, chapterTurns, !!chapterStart || turn.fresh_session),
        tagged_checks: tagged,
        rubric_pending: turn.rubric ?? [],
      });
      const evidence = result.turns.at(-1);
      chapterTurns.push(evidence);
      evidence.judgments = [];
      if (args.judge && !failed && turn.if_taken?.some(n => !n.taken_when)) {
        try {
          const marked = await call('Mark only paths taken in this turn. Return {"marks":[{"path":string,"taken":boolean,"quote":string,"action":string|null}]}. Cite a verbatim answer quote or recorded action id; leave unsupported paths unmarked.',
            { paths: turn.if_taken.filter(n => !n.taken_when), answer: evidence.answer, actions: evidence.actions });
          evidence.path_marks = Array.isArray(marked.marks) ? marked.marks : [];
        } catch (error) { evidence.path_applicability_unknown = String(error); }
      }
      evidence.resolved_needs = resolvedNeeds(turn, evidence, true);
      if (args.judge && !failed) {
        try {
          const applicability = await applicableClaims(call, evidence.claim_text, evidence.actions, sent.message, ruleChecks().filter(def => def.applicability !== "scenario" ||
            turn.rule_marks?.some(mark => mark.id === def.id) ||
            evidence.resolved_needs.some((need: Event) => need.needed === true && need.skill === def.required_skill)), evidence.claim_messages);
          evidence.claim_applicability = applicability.claims;
          evidence.rule_applicability = applicability.marks;
        }
        catch (error) { evidence.claim_applicability_unknown = String(error); }
      }
      const measurement = measurementPlan(evidence, turn.rubric ?? [], evidence.access);
      evidence.opportunity_inventory = measurement.inventory;
      const activeRubrics = measurement.rubrics;
      evidence.result_parts = measurement.result_parts;
      for (const part of evidence.result_parts.filter((p: Event) => !p.exclusion && (p.kind === "visible" || p.later_step)))
        if (!activeRubrics.some(r => r.id === part.id)) activeRubrics.push(resultRubric(part));
      const pending = [];
      for (const rubric of activeRubrics) {
        const dep = rubric.depends_on, prior = dep ? taggedHistory[`${dep.turn}:${dep.check}`] : true;
        if (prior !== true) evidence.judgments.push({ id: rubric.id, tag: rubric.tag,
          verdict: prior === "not reached" ? "not reached" : null, reason: "prerequisite not established" });
        else pending.push({ rubric, answer: final, evidence: judgeEvidence(chapterTurns, baselineText, turn.judge_files) });
      }
      try {
        evidence.judgments.push(...(args.judge && !failed ? await rubricBatch(call, pending) : pending.map(r =>
          ({ id: r.rubric.id, tag: r.rubric.tag, verdict: null, reason: "judge unavailable or incomplete turn" }))));
      } catch (error) {
        evidence.judgments.push(...pending.map(r => ({ id: r.rubric.id, tag: r.rubric.tag,
          verdict: null, reason: String(error) })));
      }
      for (const judgment of evidence.judgments) taggedHistory[`${i}:${judgment.id}`] = judgment.verdict;
      evidence.result_parts = assessedResults(evidence);
      evidence.opportunities = measuredOpportunities(result, evidence, activeRubrics, evidence.access, evidence.opportunity_inventory);
      if (args.judge) evidence.rubric_pending = [];
      if (c.user && mode === "fixed" && c.turns[index + 1] &&
        (!c.chapters || selected.find(t => t.index === index + 1)?.chapter?.number === chapterNumber)) {
        try { evidence.fit = failed ? { off_script: null, reason: "incomplete agent turn" } :
          await fit(call, observation.answer, c.turns[index + 1]!.prompt); }
        catch (error) { evidence.fit = { off_script: null, reason: String(error) }; }
      }
      lastTmp = ran.tmp_paths;
      for (const [name, value] of Object.entries(check(turn.checks ?? {}, observation, c.fixture, turnTmp)))
        turnChecks[`turn ${i}: ${name}`] = value;
      previous = snapshot(work);
      previousText = currentText;
      if (failed) {
        if (!chapter) break;
        failedChapter = chapter.number;
        result.chapter_errors.push({ chapter: chapter.number, turn: i, error: result.error });
      }
    }
    if (events.length) {
      Object.assign(result, observe(agent, events, c.set, before, work, c.checks));
      if (c.chapters) {
        result.changes = [...new Set(result.turns.flatMap((t: Event) => t.changes))].sort();
        result.baseline_files = baselineText; result.baseline_snapshot = baseline;
      }
      result.left_running = result.turns.at(-1).left_running;
      result.checks = { ...turnChecks, ...check(c.checks, result, c.fixture, lastTmp) };

    }
  } catch (error) {
    result.error = `runner error: ${String(error)}`;
    result.cost_unknown = true;
  } finally {
    result.progress_findings = progressFindings(result.turns);
    result.run_checks = c.suite && c.checks.names_no_skill ? [{
      id: "no-skill-names", tag: "habit:no-skill-names",
      verdict: result.checks["answer names no skill or skill file"] ?? null,
    }] : [];
    result.unreached_turns = selected.filter(t => !result.turns.some((r: Event) => r.turn === t.index + 1))
      .map(t => ({ turn: t.index + 1, chapter: t.chapter?.number, reason: t.chapter ? "chapter interrupted" : "run interrupted" }));
    result.unreached_turn_checks = selected.filter(t => !result.turns.some((r: Event) => r.turn === t.index + 1))
      .flatMap(({turn, index, chapter}) => [...(turn.tagged_checks ?? []), ...(turn.rubric ?? [])].map(check =>
        ({ turn: index + 1, chapter: chapter?.number, id: check.id, tag: check.tag, verdict: null })));
    result.scores = score([...result.turns.flatMap((t: Event) => [...t.tagged_checks, ...(t.judgments ?? [])]),
      ...result.unreached_turn_checks, ...result.run_checks]);
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
  const limits: CallLimits | undefined = undefined;
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
        result = await runner(...item, args, out, left, runTurn, limits);
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
      if (args.rubric_validation_summary) result.rubric_validation = args.rubric_validation_summary;
      done.set(index, result);
      writeFileSync(join(out, `run-${index + 1}.json`), JSON.stringify(result, null, 2) + "\n");
      spent += result.cost ?? 0;
      unknown += Number(result.cost_unknown || result.cost === null);
      console.log(`  ${result.case}  ${result.agent}  ${result.model} run ${result.run}: ${runStatus(result)}`);
      if (result.error && /call cap|login|usage limit|capacity|runner error|network|connect|stream|resolve|dns/i.test(result.error)) stop = true;
    }
  }
  try {
    await Promise.all(Array.from({ length: Math.min(args.jobs, plan.length) }, worker));
  } finally {
    process.off("SIGINT", interrupt);
  }
  const results = [...done].sort(([a], [b]) => a - b).map(([, r]) => r);
  if (limits) writeFileSync(join(out, "calls.json"), JSON.stringify(limits, null, 2) + "\n");
  writeFileSync(join(out, "summary.json"), JSON.stringify(results, null, 2) + "\n");
  writeFileSync(join(out, "summary.md"), summarize(results, spent, unknown));
  writeFileSync(join(out, "measurement.json"), JSON.stringify(measurementReport(results), null, 2) + "\n");
  writeFileSync(join(out, "reliability.json"), JSON.stringify(scenarioReliability(results), null, 2) + "\n");
  writeFileSync(join(out, "scores.json"), JSON.stringify(scoresByCase(results), null, 2) + "\n");
  const sharedAfter = readdirSync("/tmp").filter((n) => !sharedBefore.has(n));
  if (sharedAfter.length)
    console.log("new shared /tmp names during run (may belong to other processes): " + sharedAfter.join(", "));
  console.log(
    `results: ${out}; ${next} of ${plan.length} scheduled; ` +
      `known spending $${spent.toFixed(4)}; ${unknown} unknown-cost runs`,
  );
  return results;
}
