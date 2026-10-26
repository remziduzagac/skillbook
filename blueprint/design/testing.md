# Testing

How skillbook is tested, as a whole: what runs where, what a test needs, and where the files live. Each skill's own tests are in its design section, in the Tests list; this file says how they are run (D208). The install tests and the automated AI test runner are built; `just try` is not yet.

## Three kinds of test

1. **Static checks:** `just check`, as today. It runs the markdown lint, the link check, ShellCheck, shfmt, actionlint, zizmor and the skill-file check. It runs locally and in GitHub CI on every pull request. CI also checks every commit message for AI credit lines, and `just hooks` turns the same check on locally (D225).
2. **Install tests:** `just test-install`. They check `install.sh` in a throwaway home:
   - copy mode and link mode;
   - the marker file;
   - refusing a folder it did not install;
   - `--sets`, `--project` and `--uninstall`;
   - running it twice.

   They need no agent and no key. They run locally and in GitHub CI on every pull request, on Linux and macOS.
3. **AI tests, local only.** No AI test runs on GitHub. The user's personal accounts are never used in GitHub CI, and no free quota fits (see "Why AI tests stay local").
   - **Automated:** `just test-agents` runs cases through the runner. The user sets when model tests run. The remaining build follows the schedule below. An agent may also guide a run: start cases, read the summaries and judge what a script cannot check.
   - **Manual:** `just try claude` or `just try codex` opens that agent in a toy project, with a sandbox home that has skillbook installed in link mode, so edits show at once. The user logs in once inside the sandbox. The user's real agent setup, and the agent session that develops the skills, stay apart from the skills under test. The command runs in whatever terminal or pane the user picks; nothing imposes a layout.

## Routing layer

Test routing before judging answers (D263). A routing case measures successful skill reads only. Give every concrete main instruction and parent-to-child routing line about three varied trigger cases and one or two near misses. A near miss requires the named alternative where applicable. Forbid the target only when the alternative does not itself require it. Mandatory baseline reads cannot prove optional selection or absence; report that limit separately.

The inventory is `tests/routing-routes.md`. Cases use the `route-` prefix, `routing_only = true`, one short read-only turn and a small shared fixture. Their only assertions are `reads` and `reads_not`. They have no answer assertions, semantic rubric or judging. The flag prevents the usual inherited answer-name check and excludes their results from `--to-judge`. Existing behavioral cases use `routing-` in their names where needed to keep `--case route-` specific. Their contents are preserved.

Check each case against a correct and a plausible wrong read trace before running it. For a grandchild, require successful reads of its parent path and child. A filename merely mentioned is not a read. Unknown evidence stays unknown. A read proves observed loading, not answer quality, whole-file reading or which parent selected it. Report trigger and negative-boundary rates per route. Keep nondiscriminating baseline checks separate. After routing holds, run the behavioral layer and judge its answers and actions under the normal method.

The routing comparison runs the same selected cases once on Codex with GPT-6 Luna, four jobs, and once with GPT-6.1 Sol, two jobs. Use a 300-second turn timeout and a US$5 known-spend scheduling threshold per model. A timeout is unknown; continue. Stop new runs on capacity, login or runner errors. Keep partial results and logs outside the repository. Unknown cost stays unknown. Use no Claude model or semantic judge in this layer. Mark every changed prompt or assertion separately in before-and-after results (D264).

## Where things live

All in `tests/` (D190), except the commands, which are in the `justfile`.

- **`tests/fixtures/<name>/`:** small toy projects, each a known situation, such as a vague request or a plan whose parts depend on each other. Automated and manual tests share them. A fixture's project instruction file is `AGENTS.md` only; the runner copies it to `CLAUDE.md` for Claude Code, so both agents get the same instructions and the repository holds no nested `CLAUDE.md` that would load into a developer's own session.
- **`tests/cases/<set>/<case>.toml`:** one case per file. Its fields:
  - the design test it comes from: the design file and the test's number;
  - the fixture, and `version_control = true` for a case whose project starts under version control with one commit, since whether a change can be undone the user's usual way can depend on it;
  - `uses_skill_example = true` for a case that tests one of the skill's own examples on purpose; every other prompt is checked by `just check` against the set's text (D213);
  - the prompt for each turn;
  - the agents it runs in;
  - the number of runs, 1 by default: a rule is covered by several different cases rather than by repeating one, since varied prompts show more for the same cost; a case is repeated only when it fails or its results disagree (D213);
  - whether the pointer is in the user's instruction file, yes by default;
  - `skills`, the implemented skills whose behaviour or routing boundary it exercises; `category`, normal, boundary or edge; `rejects`, the plausible wrong behaviour;
  - `covers`, the aspects of the skills it tests, by the ids `tests/run.py --coverage` names from the skill files: each rule, piece of advice, step, route, "Not for" line, checklist item and last instruction, such as `act:rule:5` or `act:not-for:act-rightsize`; only what its checks or review can fail on;
  - `routing_only = true`, the reads-only, one-turn routing layer described above;
  - `review`, semantic acceptance criteria for behavioral cases; automatic success leaves these pending, and the summary includes each turn's answer for review. After each behavioral run, passed or failed, it is judged against them by fresh agents on Sonnet, another model only with the person's approval (D247), as `tests/judge.md` says, and the person spot-checks unclear verdicts and those the automatic checks disagree with;
  - `project_skills`, the repository's own skills copied into the isolated agent skill folder for a project-skill exercise only, never added to the shipped set;
  - the checks a script can make from the event log, for the whole run under `[checks]`, or for one turn under `[turns.checks]`, judged on that turn's answer and changes (D216):
    - the skills read or not read (`reads`, `reads_not`), by name, for the run or one turn: a read counts only with a successful matching tool result or a supported reading command that exits 0; a path merely named, as by `echo` or `ls`, does not count; a step counts only where a zero exit proves it ran and succeeded: every step of `a && b`, and only what follows the last `;`, new line or `||`; a step holding a pipe or a redirection, and a command with a command substitution or a background job, is left uncounted; a command that exits non-zero proves no read, even where a later step such as a search found nothing;
    - nothing changed in the toy project (`no_changes`), named files changed or created (`changed`), or named files left unchanged (`unchanged`);
    - a file that still holds given facts (`file_contains`) or got shorter (`shorter`);
    - at least a number of files written under a folder (`written_under`), and no file written there matching a pattern (`folder_lacks`), for files whose names the agent chooses, such as new test cases;
    - something said before the first change (`states_before_change`): the runner combines file-state changes with event order and checks for a statement before the first definite or potential mutation; an opaque command whose timing cannot be established leaves this assertion unknown, never passing by assuming no change, while a step that only sets a shell variable or changes folder counts as a read, since it touches no file (D236); what the statement says is judged by reading the summary (D218);
    - patterns the answer must or must not contain, the answer being everything the agent said in the turn, and in every turn for the whole run, so a pattern no turn may hold is checked in each (D236);
    - nothing the agent started still running when the turn ended (`nothing_left_running`), unknown where the process list cannot be read or the system does not show a process's environment, since a process that left its group could then go unseen (D233);
    - a path in the run's own temporary folder, when the turn ended, that matches a pattern (`tmp_has`) or none that does (`tmp_lacks`), such as an unpacked copy the agent should have removed or was asked to keep: every path is checked, not the short listing the summary shows, and the full list of paths is never kept; unknown where the folder could not be read (D235).
    - a file the agent was asked to remove (`removed`), passing only when it is gone (D240);
    - an agent started (`agent_started_or_answer`): Codex's exec record shows neither an agent it starts nor that agent's actions, so on Codex any call about agents, or a change no recorded action explains, leaves the check unknown, not failed; the summary says an agent may have run unseen, and judges follow skillbook-write's record-limit lesson (D242, D254);
    - no skill named in the answer: Codex's harness tells it to say which skills it uses, so only a short line that says it loads, uses, reads or follows essentials and gives no reason is left out; a line with a reason, such as "because the essentials skill prohibits…", counts as naming a skill (D242);

    Whether a file was read whole or in part, and which tools ran, are not checked yet. Each case's `about` names the wrong behaviour it rejects, and a case is checked against a correct trace and a plausible wrong one before its result is trusted, as skillbook-write says (D217).
- **`tests/run.py`:** the runner, written with the Python standard library only. It runs up to four runs at a time (`--jobs`), sharing only the budget; nothing is shared between runs, such as a home, a session or a fixture copy, since a shared one would carry one case's history into another. For each case, agent and run it:
  1. makes a throwaway home outside the repository, with the run's own temporary folder inside it, set as the agent's `TMPDIR`, so nothing an agent leaves there outlives the run, after a short listing of its paths and sizes is kept in the turn's evidence (D233);
  2. installs skillbook there with `install.sh`;
  3. copies the fixture in, and commits it when the case asks for version control;
  4. runs the agent headless, each turn in a process group of its own, with a marker in its environment for a process that leaves the group;
  5. records what the agent left running when each turn ended, then, when the run ends or a turn times out, ends it, so a leftover the model caused is still observed and nothing keeps running on the user's machine (D233);
  6. checks the event log;
  7. writes a short summary.
- **`tests/install-test.sh`:** the install tests. Each test copies `install.sh` and `skills/` into a fresh temporary folder and runs there with a throwaway home, so the working copy and the real home are never touched.
- **`tests/test_runner.py`:** account-free tests of the evidence and case inventory, run by `just test-runner` inside `just check`. Correct and wrong synthetic traces exercise the assertions without spending on a model. `just test-coverage` reports executable scenario counts, not observed success, and lists each aspect that no case covers and `tests/manual.toml` does not name.
- **`tests/manual.toml`:** the aspects only a person can test in a live session, such as the harness's question tool, real compaction or publishing, each with its reason.
- **`just check-coverage`,** inside `just check`: warns with the number of uncovered aspects, and fails only when a case or `tests/manual.toml` names an aspect that does not exist.
- **Review evidence:** before deleting each sandbox, the runner retains per-turn fixture diffs, observed file contents requested by assertions, answers and an ordered action ledger of tool names, commands and target paths. Tool outputs and credential-home contents are not copied into that ledger. Failed or timed-out turns retain the evidence available, marked incomplete. Evidence grading follows skillbook-write's test-case rules. Raw events may be kept explicitly when needed.

## Project skill scenarios

The project skills have no shipped-set design sections. These scenarios apply their existing contracts, with small fixture drafts, without changing their rules:

1. skillbook-design reviews overlapping routes: it reports the actual conflicting lines and a general fix, changing nothing.
2. skillbook-design reviews a leaf: it applies the relevant checklist without inventing a requirement for child-routing sections.
3. skillbook-write corrects one spelling error: it preserves the design and required fallback, changing nothing unrelated.
4. skillbook-write finds a requested behaviour absent from the design: it proposes the design change through skillbook-design before changing either file.
5. skillbook-write finds the requested behaviour already present: it reports the evidence and leaves the files alone.

## Build validation schedule

Build the remaining batches and their cases before behavioral model tests. Run no model tests per batch. After all batches, test the routing layer first. Once routing holds, run every behavioral case once on Codex with GPT-6.1 Sol, then once with GPT-6 Luna. Investigate patterns both models share. Fix those patterns and rerun only the affected cases. Then run one full pass on each model for side effects. This schedule changes when tests run, not their case-writing or judging requirements (D253).

## The runner's rules

- **Models:** small by default, Claude Haiku (`claude -p --model haiku`) and GPT-6 Luna (`codex exec -m gpt-6-luna`). A skill that works on a small model is clear, and small models are cheap enough for three or more runs a case. `--model` runs larger models, for example before a release.
  - A failure on one small model is noted, not acted on. When more than one model fails the same case, or a larger model fails it, the failure is looked into, what fails and why, before anything changes, since the cause is then likely the skill. Text added for one small model costs every user tokens on every turn. The summary flags a case that more than one model failed (D214).
- **Login:** an API key from the environment, or the user's own login copied into the throwaway home only when the user asks, and deleted afterwards. A copied login reaches none of the user's accounts: Claude Code loads no claude.ai connector (such as Gmail or Google Drive), no skill or plugin claude.ai syncs and no MCP server, and its account tools (cloud routines, phone notifications, designs) are denied; Codex gets a throwaway `config.toml` that turns off the ChatGPT apps and plugins (recorded after round 5, where it was done).
  - **Codex and `/tmp`:** its `workspace-write` sandbox would also let a run write the machine's real `/tmp`, so the throwaway `config.toml` sets `exclude_slash_tmp`; the run's own `TMPDIR` stays writable. As a backstop, a round with Codex runs lists the names new in `/tmp` once it ends, never their contents (D242).
- **Cost:** the expected cost is printed before a run, with what the budget guarantees (D216):
  - no new run starts once known spending reaches the budget, so a run already started can pass it;
  - each Claude call is also capped at the budget left after completed calls, by `--max-budget-usd`; within one run, another Claude turn does not start when that remainder is exhausted or that run's cost became unknown; an unknown cost in an earlier run does not stop later runs, which are capped at the budget minus known spending;
  - Codex cost is estimated from its token counts and is not capped;
  - a model with no known price counts as unknown, not as zero, and the summary says how many runs had an unknown cost.
  - a failed or timed-out call does not erase completed spending: known spending remains a lower bound, and any unquantified remainder is reported separately.
- **Privacy:** raw event logs and credentials stay outside the repository and are deleted afterwards, unless the user asks to keep the logs. Local review summaries retain the fixture and action evidence described above, never the separate credential home or raw tool outputs. What a run showed goes into the design's test result or an evidence entry, as skillbook-write says.
- **Judging:** scripts check behaviour. What only judgment can check, such as whether an explanation is clear, is judged by the agent that guides the run or by the user, and the result says which.
- **Cases come from the designs' Tests lists,** which stay the source. A few are turned into cases first, starting with essentials.
- **Case-writing rules:** follow [skillbook-write's Test cases instruction](../../.agents/skills/skillbook-write/SKILL.md), including prompt/check agreement, advice relevant to the result, strength versus choice, and unknown evidence. Its test-first rule follows the user's schedule; the build schedule above defers model runs (D253, D254).

## Open, settled when building

- Whether `install.sh` installs into `CLAUDE_CONFIG_DIR` when it is set, or the sandbox and throwaway homes simply set `HOME`.
- Where Codex finds skills under `CODEX_HOME`.

## Why AI tests stay local

- **One runner and one set of fixtures serve both kinds of local test.** The user can try skills while they are edited, without loading half-built skills into a working session.
- **GitHub CI gets only what needs no account and no key.**
- **No free route fits** ([../research/test-infrastructure.md](../research/test-infrastructure.md), read unless marked inferred):
  - GitHub Models was retired on 2026-07-30.
  - One service's free models are free "for a limited time" and publish no limits. Some may use prompts for training. Its terms forbid extracting output programmatically.
  - Anthropic's Claude for Open Source gives one person 6 months of Claude Max 20x, for individual use only, with no API credits found; whether it is open is unclear.
  - OpenAI's Codex for Open Source gives 6 months of ChatGPT Pro with Codex, and API credits from its fund for core open-source work, with no amount stated. It is personal and not transferable.
  - These are personal plans, so they fit local tests by the user and never GitHub CI.
- **Paid small models cost about half a cent a run** (inferred from the published prices): Haiku 5.5 is $0.10 per million input tokens and $0.50 per million output tokens, and GPT-6 Luna is the same.
- **Both agents can run apart from the user's setup:** `CLAUDE_CONFIG_DIR` and `CODEX_HOME` set a separate config root, and both log in with an API key in a headless run.

## Related

- [how-it-works.md](how-it-works.md): the install script the install tests check, and how a skill is written.
- skillbook-write's "Test cases" instruction, in `.agents/skills/skillbook-write/SKILL.md`: how a design's tests are run and what a result holds.

## TypeScript runner

The runner is TypeScript on Bun, pinned through mise and in CI (D268). `tests/run.ts` runs beside `tests/run.py`. The Python runner and its TOML cases stay unchanged for comparison. The new runner reads YAML files beside selected TOML cases, with the same ids. It converts no scenario content during the port.

The modules under `tests/runner/` separate case loading and validation, sandbox homes and files, process ownership, agent commands, trace parsing, assertions, scoring, reports and the command line. Plain functions take data and return observations or verdicts. File access and agent processes stay at the edges. Each module has account-free tests. Bun supplies YAML parsing, subprocess support and the test runner. Exact package versions and their lockfile keep schema generation, validation and type checking reproducible.

`types.ts` defines the case format. A generated JSON Schema checks every YAML file before any run starts and supplies editor completion. Unknown fields and invalid checks fail early. Schema freshness, type checking and unit tests join `just check`. A conversion check loads each YAML and its TOML neighbour and compares the data before defaults.

A case is a conversation, including a single-message case. It holds a user description and facts sheet, a fixed or simulated user mode, and ordered turns with messages and purposes. Fixed mode sends the written messages. The simulated mode follows the fixed script under the scenario rules below. Turns can hold tagged assertions and rubric criteria. A tagged assertion may depend on an earlier turn's check. An unmet actual prerequisite gives `not reached`; an unknown prerequisite stays unknown, separate from failure. Results preserve the scripted and sent messages, observations, tagged verdicts and rubric judgments as JSON. Scores group checks by habit or skill across runs, with counts and a Wilson 95% interval; unknown and not-reached checks have their own counts and do not enter the pass rate. A rubric judge interface accepts a fresh judgment without mixing it with automatic results. Judge calibration and model execution belong to the scenario layer.

The port preserves isolated homes, explicit login copies with cleanup, agent account restrictions, per-turn timeouts and evidence, process cleanup, scheduling by jobs and known spending, unknown costs, kept event logs, coverage and the list of runs needing judgment. Codex cost remains an estimate from token usage, without a hard API spending cap. Saved-log replay compares the new assertions with the Python assertions before a bounded live comparison. A live disagreement can be model variation; replaying the same evidence distinguishes that from a runner difference.

Later: a terminal view, possibly using OpenTUI, can watch runs and browse turns, checks and scores from the same JSON results. The port builds no terminal interface.

## Scenario layer

These rules replace the earlier behavioral-run schedule and judge-model default for scenarios. The existing single-prompt behavioral cases stay as source material until the user decides what retires.

Fifteen realistic conversations become the main behavioral layer (D269). Fourteen short scenarios have three to five turns. A festival scenario has about twelve turns and tests late loading, reuse of skills still in view and continuity. Keep all existing cases until model runs and the user decide what retires. Routing cases remain separate single prompts.

Each scenario has a goal, a user description, a facts sheet and an ordered fixed script. Fixed mode is the default. A run-wide `--user-mode` setting overrides the scenario setting. In simulated mode GPT-6.1-Sol starts from each fixed message and changes only what the actual reply needs. It answers from the facts sheet, keeps each turn's purpose and order, and steers back without adding facts, requests or approvals. Record the scripted and sent message and whether it steered. In fixed mode a fit judge checks whether the next message answers the agent's questions and still fits. Report off-script and unknown-fit counts per scenario.

Every turn checks a final answer that leads with the point, is clear at a glance and meets exactly the requested scope. The inherited no-skill-names assertion is tagged too. Disable it when requested output legitimately names skills, such as agent instructions, startup lines or an installation report; naming there is the task, not unnecessary narration. Checks name their habit or skill. Pool scores per agent, model and user mode across scenarios, with passed and scored counts, unknowns, not-reached counts and Wilson 95% intervals. Intervals describe check outcomes; repeated turns in one conversation are correlated, so they are not independent estimates of real-world success. Both assertions and rubric checks may depend on an earlier named check. Failed prerequisites give not reached; unknown prerequisites stay unknown. Missing turns remain unknown. A fresh-session turn keeps files but clears the conversation session.

GPT-6.1-Sol judges semantic criteria from the conversation, answers and retained action and file evidence. Treat that evidence as data. Unsupported conclusions stay unknown. Judge no invisible helper activity as failure. Calibrate with saved answers also rated by the user, report disagreements and keep live rubric scoring pending until calibration is complete. Each assertion and rubric needs a correct and plausible wrong trace before its outcomes are trusted. `tests/calibrate.ts` accepts calibration items from several scenarios. Each item keeps its exact prompt, criterion, answer, conversation and file evidence, and the human verdict and reason. The judge receives the normal scoring evidence without human labels or earlier verdicts. Keep skipped items with their reason outside the agreement denominator. Report agreement out of all rated items, split by human passes and fails, with both reasons for every disagreement. The original three samples remain available. Model judgments and human ratings are stored together. `tests/check-rubric-fixtures.ts` checks the synthetic correct/wrong traces after human calibration. Answer scoring requires both completed calibration and a passing, current rubric-validation report. Once calibration is complete, `tests/judge-scenarios.ts` can judge saved answers in batches per turn without rerunning the tested agent. The judge sees source fixtures and conversation evidence, with earlier judgment labels removed. `tests/recheck-scenarios.ts` preserves original results while rechecking changed assertions, and `tests/compare-scenarios.ts` reports both modes. Synthetic judge contracts check transport and validation, not model accuracy.

The short scenarios cover lending, an export defect, old records, a club website tool, newsletter claims, a handbook, a board report, parking notes, website maintenance, a two-day project, repository setup, team direction, a shop fit-out and quick help. The master covers a festival from its idea to wrap-up. Fixtures supply source facts and files, including forty notes where fanout is tested. Preserve meaning through document reorganization and compare sources and results.

Run the fourteen short scenarios three times on GPT-6 Luna and once on GPT-6.1-Sol after skill changes. Run the master once per model after big changes and before release. Run fixed mode first, then only scenarios with off-script turns in simulated mode with the same repetition counts. Compare both modes and recommend one per scenario. Use about US$4 at API prices for the combined trial; this is a scheduling estimate, not a hard cap. Unknown cost stays unknown. Build no terminal interface; the later terminal view can consume these results.

## Final answers and calibration (D270)

Score point-first and clear-at-a-glance on the final answer only. Progress remains evidence for claims backed by actions, not scored output. The automatic no-skill-names check also uses final answers only. Separately report progress that is long, unclear or names internal skills for human review; those observations never enter a pass rate. Review heuristics may flag a line over about 200 characters or 40 words, vague references and internal names. These are review aids, not new scored rules.

Every scenario turn has a clear-at-a-glance check: its main result, finding or needed question is easy to see, and each thing created, changed or found is named together in one place. Point-first tests the main point's position and plain language; clear-at-a-glance tests whether the reader can identify the whole result without hunting.

Judge the current turn's work and answer. Earlier turns establish context and actual prerequisites, not inherited failures. A post-work review question is allowed after approved work is done. Mark not reached only when the current check cannot meaningfully be evaluated because a needed prior artifact or state is absent. Do not use a failed earlier quality score as a substitute for that test. A missing carryover note has a valid recovery path: report its absence, inspect actual files and give the next step without redoing work.

A recommended answer beside a question is allowed while the user keeps the choice. A request for reasons accepts grounded reasons or a plain explanation of why the available facts give no basis for one. If the request leaves the kind of result open and plausible interpretations require different results, ask about that intent before choosing. Apply these boundaries across all scenarios, including lesson requests.

For this calibration comparison, add clear-at-a-glance passes for turns the user rated good overall and a fail for handbook turn 1. Infer no other new human labels. Keep original human ratings identifiable, including any rating whose concern now belongs to a different check. Compare two fresh judge passes with the same frozen evidence and labels, report each one's agreement split by human pass/fail, and report self-agreement. Broader rubric-pair and saved-run scoring remains a separate user decision.
