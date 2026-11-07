# Testing

How skillbook is tested, as a whole: what runs where, what a test needs, and where the files live. Each skill's own tests are in its design section, in the Tests list; this file says how they are run (D208). Skills are tested with small cases: each run is compared with another (no skill, or the old text), checked by scripts first and then judged by two judges, Sol and Sonnet, and a change stays only if it beats the old text ([D311](../decisions.md#d311-small-cases-replace-the-long-scenarios-2026-11-06)). The two long scenarios that came before are frozen ([D310](../decisions.md#d310-the-live-run-after-the-gates-showed-no-progress-and-was-stopped-2026-11-06)). The install tests and the automated AI test runner are built; `just try` is not yet.

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
   - **Automated:** `just test-agents-ts` runs small cases through the TypeScript runner, and `tests/judge-small.ts` judges their answers. The user sets when model tests run. An agent may also guide a run: start cases, read the summaries and read every fail.
   - **Manual:** `just try claude` or `just try codex` opens that agent in a toy project, with a sandbox home that has skillbook installed in link mode, so edits show at once. The user logs in once inside the sandbox. The user's real agent setup, and the agent session that develops the skills, stay apart from the skills under test. The command runs in whatever terminal or pane the user picks; nothing imposes a layout.

## Small cases (D311)

A small case tests one guide with a short request. It is cheap enough to run about 3 times on each model, so a change to a guide can be compared with the old text on the same cases. The method is adapted from three outside approaches, as D311 lists; nothing is copied.

- **Three kinds,** by what the case checks:
  - **should-load:** a request the guide covers. It checks that the guide is read (`reads`).
  - **should-not-load:** a near miss, a request that looks like the guide's job but is not. It checks that the guide stays closed (`reads_not`) and that nothing else changes (`no_changes` or `only_changed`).
  - **behaviour:** a request with a few yes-or-no questions in the turn's `rubric`.
- **Every case starts from the main skill,** as a real user's session does. The prompt does not name the guide.
- **A few varied cases per rule, one held out.** The cases differ in kind of work and wording. One is written apart from any fix, as the held-out case of the merge rule. Each case is run about 3 times on each model, because single runs vary.
- **Every run has a comparison:** the skill against no skill (`--no-skill`), or the old guide text against the new. The cases and the judging stay the same.
- **Scripts first, then two judges.** The runner's automatic checks (`reads`, `reads_not`, `no_changes`, `only_changed`, `file_contains`, `answer_contains`) decide what they can. Then Sol and Sonnet each answer every turn's questions. Each answers pass, fail or unknown, with a quote from the answer. A verdict counts where the two judges agree. Where they disagree, the question is a split: it is counted apart, listed in a file, and read. The questions come from the current case files, so a changed question is judged again on saved answers without new runs.
- **Each question names one thing.** "Is 'DPF' explained where it first appears?" is a good question. "Is every hard term explained?" is not: a broad question lets the judge apply its own standard, so it measures the judge and not the agent. A question that does not apply to an answer, such as a term the answer never uses, is answered unknown and left out of the counts. No question counts words or lines (D303).
- **Trusting the judge.** Read every fail before anything changes. Check each new question once: it must pass a saved good answer and fail a saved bad one, such as a with-skill and a no-skill run of the same case. There is no judge tuning.
- **The report** gives pass counts per check, per model and per condition (skill or no skill). It flags two kinds of check:
  - **passes everywhere:** it passes with no skill too, so it measures nothing. Rewrite the case or drop it.
  - **unstable:** the results are mixed over 3 or more runs.
- **Loading is a diagnostic, not a pass.** A guide that was read and gave a wrong result is a fail.
- **The merge rule:** a guide change stays only if it beats the old text on its cases and on a held-out case written apart from the change. Otherwise it is reverted. A gap of one or two runs is noise: the same saved answers, judged twice, moved by one.
- **Fix patterns shared by failures,** never a single case.

The commands, with the cost given first and `--budget` set:

```sh
bun tests/run.ts --case PATTERN --agents claude,codex \
  --model claude=sonnet --model codex=gpt-6.1-sol \
  --runs 3 --login --jobs 6 --budget N --yes --out DIR [--no-skill]
bun tests/judge-small.ts RESULTS_DIR... --out JUDGED.json (--login | --report-only) [--jobs 6] [--judges sol,sonnet]
```

`--case` takes one substring of the case id. `--report-only` prints the report from saved judgments without a judge call.

## Routing layer

Routing is tested by the should-load and should-not-load cases. Check such a case with `reads` and `reads_not` and no rubric. The rules for a read:

- For a grandchild, require successful reads of its parent path and of the child. A filename merely mentioned is not a read.
- Unknown evidence stays unknown.
- A read proves observed loading. It does not prove answer quality, whole-file reading or which parent selected the guide.
- The account-free tests try each read check on a correct and a plausible wrong synthetic trace.

## Where things live

All in `tests/` (D190), except the commands, which are in the `justfile`.

- **`tests/fixtures/small/<name>/`:** small toy projects, each a known situation, such as a vague request or a plan whose parts depend on each other. Automated and manual tests share them. A fixture's project instruction file is `AGENTS.md` only; the runner copies it to `CLAUDE.md` for Claude Code, so both agents get the same instructions and the repository holds no nested `CLAUDE.md` that would load into a developer's own session. The other fixtures serve the account-free unit tests: the toy projects `tests/fixtures/tiny-weather/` and `routing-studio/`, and recorded agent events in `access/` and `cost-counters.json`.
- **`tests/cases/<set>/small/<guide>--<topic>.yaml`:** one small case per file, in the format `tests/runner/types.ts` defines (D268). Its fields:
  - `about`: the wrong behaviour it rejects, or what it shows;
  - `goal`, and the fixture;
  - `version_control = true` for a case whose project starts under version control with one commit, since whether a change can be undone the user's usual way can depend on it;
  - `uses_skill_example = true` for a case that tests one of the skill's own examples on purpose; every other prompt is checked by `just check` against the set's text (D213);
  - the prompt for each turn;
  - the agents it runs in, and the number of runs, 1 by default; small cases are run with `--runs 3`;
  - whether the pointer is in the user's instruction file, yes by default;
  - `skills`, the implemented skills whose behaviour or routing boundary it exercises; `category`, normal, boundary or edge; `rejects`, the plausible wrong behaviour;
  - `project_skills`, the repository's own skills copied into the isolated agent skill folder for a project-skill exercise only, never added to the shipped set;
  - the questions a judge answers, in `turns[].rubric`: each has an `id`, a `tag` and a `criterion` that names one thing;
  - other fields: `models`, the models a case allows; `review`, points a person checks by reading the answer; `routing_only`, for a one-turn case with only `reads` and `reads_not`; and for a turn, `timeout` in seconds and `fresh_session` for a turn that starts a new conversation;
  - the checks a script can make from the event log, for the whole run in `checks`, or for one turn in `turns[].checks`, judged on that turn's answer and changes (D216):
    - the skills read or not read (`reads`, `reads_not`), by name, for the run or one turn: a read counts only with a successful matching tool result or a supported reading command that exits 0; a path merely named, as by `echo` or `ls`, does not count; a step counts only where a zero exit proves it ran and succeeded: every step of `a && b`, and only what follows the last `;`, new line or `||`; a step holding a pipe or a redirection, and a command with a command substitution or a background job, is left uncounted; a command that exits non-zero proves no read, even where a later step such as a search found nothing;
    - nothing changed in the toy project (`no_changes`), named files changed or created (`changed`), named files left unchanged (`unchanged`), or only the named files changed (`only_changed`);
    - a file that still holds given facts (`file_contains`) or got shorter (`shorter`);
    - at least a number of files written under a folder (`written_under`), and no file written there matching a pattern (`folder_lacks`), for files whose names the agent chooses, such as new test cases;
    - something said before the first change (`states_before_change`): the runner combines file-state changes with event order and checks for a statement before the first definite or potential mutation; an opaque command whose timing cannot be established leaves this assertion unknown, never passing by assuming no change, while a step that only sets a shell variable or changes folder counts as a read, since it touches no file (D236); what the statement says is judged by reading the summary (D218);
    - patterns the answer must or must not contain (`answer_contains`, `answer_not_contains`), the answer being everything the agent said in the turn, and in every turn for the whole run, so a pattern no turn may hold is checked in each (D236);
    - nothing the agent started still running when the turn ended (`nothing_left_running`), unknown where the process list cannot be read or the system does not show a process's environment, since a process that left its group could then go unseen (D233);
    - a path added in the run's own temporary folder during the turn that matches a pattern (`tmp_has`) or none that does (`tmp_lacks`), such as an unpacked copy the agent should have removed or was asked to keep: compare complete listings before and after the turn, so existing harness files do not count. Check every new path, including new children of existing directories, not the short summary listing. Keep the derived verdicts for replay, never the full path lists; unknown where either listing could not be read (D235);
    - a file the agent was asked to remove (`removed`), passing only when it is gone (D240);
    - an agent started (`agent_started_or_answer`): Codex's exec record shows neither an agent it starts nor that agent's actions, so on Codex any call about agents, or a change no recorded action explains, leaves the check unknown, not failed; the summary says an agent may have run unseen, and judges follow skillbook-test-write's record-limit rule (D242, D254);
    - a path in the temporary folders that the answer names and that holds a pattern (`answer_path_has`), and no recorded action target, such as a command or a file path, that matches a pattern (`actions_lack`); the Python runner checks both the same way;
    - no skill named in the answer: Codex's harness tells it to say which skills it uses, so only a short line that says it loads, uses, reads or follows essentials and gives no reason is left out; a line with a reason, such as "because the essentials skill prohibits…", counts as naming a skill (D242);

    Whether a file was read whole or in part, and which tools ran, are not checked yet. Each case's `about` names the wrong behaviour it rejects.
- **`tests/run.ts` and `tests/runner/`:** the runner. The Python runner, `tests/run.py`, stays for replaying saved runs and comparing assertions; it has no cases of its own (D288). The runner runs several runs at a time (`--jobs`), sharing only the budget; nothing is shared between runs, such as a home, a session or a fixture copy, since a shared one would carry one case's history into another. For each case, agent and run it:
  1. makes a throwaway home outside the repository, with the run's own temporary folder inside it, set as the agent's `TMPDIR`, so nothing an agent leaves there outlives the run, after a short listing of its paths and sizes is kept in the turn's evidence (D233);
  2. installs skillbook there with `install.sh`, unless the run is a no-skill run;
  3. copies the fixture in, and commits it when the case asks for version control;
  4. runs the agent headless, each turn in a process group of its own, with a marker in its environment for a process that leaves the group;
  5. records what the agent left running when each turn ended, then, when the run ends or a turn times out, ends it, so a leftover the model caused is still observed and nothing keeps running on the user's machine (D233);
  6. checks the event log;
  7. writes a short summary.
- **`tests/judge-small.ts`:** the two judges and the report for small cases, as "Small cases" describes. It reads the runner's result folders and the current case files, saves both judges' verdicts in one file, and lists the splits in a file beside it.
- **`tests/install-test.sh`:** the install tests. Each test copies `install.sh` and `skills/` into a fresh temporary folder and runs there with a throwaway home, so the working copy and the real home are never touched.
- **`tests/test_runner.py`:** account-free tests of the evidence and case inventory, run by `just test-runner` inside `just check`. Correct and wrong synthetic traces exercise the assertions without spending on a model.
- **`tests/archive/`:** the frozen long scenarios, kept as a record and not run (see "Frozen long scenarios").
- **Review evidence:** before deleting each sandbox, the runner retains per-turn fixture diffs, observed file contents requested by assertions, answers and an ordered action ledger of tool names, commands and target paths. Tool outputs and credential-home contents are not copied into that ledger. Failed or timed-out turns retain the evidence available, marked incomplete. Evidence grading follows skillbook-test-write's rules. Raw events may be kept explicitly when needed.

## Project skill cases

The project skills have no shipped-set design sections. These designed cases apply their existing contracts, with small fixture drafts, without changing their rules. Their executable cases were retired (D288); they return as small cases:

1. skillbook-guide-design reviews overlapping routes: it reports the actual conflicting lines and a general fix, changing nothing.
2. skillbook-guide-design reviews a leaf: it applies the relevant checklist without inventing a requirement for child-routing sections.
3. skillbook-guide-write corrects one spelling error: it preserves the design and required fallback, changing nothing unrelated.
4. skillbook-guide-write finds a requested behaviour absent from the design: it proposes the design change through skillbook-guide-design before changing either file.
5. skillbook-guide-write finds the requested behaviour already present: it reports the evidence and leaves the files alone.
6. skillbook-test-write is asked to test a changed rule: it writes a case the guide covers, a near miss and a behaviour case whose questions each name one thing, one of them held out, and runs them on the old text before the change.
7. skillbook-test-write sees a change beat the old text by one run: it reports the gap as noise and reverts the change, claiming no gain.

## The runner's rules

- **Models:** the models the user names for tests: now Sonnet (`claude -p --model sonnet`) and Sol (`codex exec -m gpt-6.1-sol`), about 3 runs per case on each (D311). `--model` selects them.
  - A failure on one model is noted, not acted on. When both models fail the same case, the failure is looked into, what fails and why, before anything changes, since the cause is then likely the skill. Text added for one model costs every user tokens on every turn. The summary flags a case that more than one model failed (D214).
- **Login:** an API key from the environment, or the user's own login copied into the throwaway home only when the user asks (`--login`), and deleted afterwards. A copied login reaches none of the user's accounts: Claude Code loads no claude.ai connector (such as Gmail or Google Drive), no skill or plugin claude.ai syncs and no MCP server, and its account tools (cloud routines, phone notifications, designs) are denied; Codex gets a throwaway `config.toml` that turns off the ChatGPT apps and plugins (recorded after round 5, where it was done).
  - **Codex and `/tmp`:** its `workspace-write` sandbox would also let a run write the machine's real `/tmp`, so the throwaway `config.toml` sets `exclude_slash_tmp`; the run's own `TMPDIR` stays writable. As a backstop, a round with Codex runs lists the names new in `/tmp` once it ends, never their contents (D242).
- **Cost:** give an estimate based on observed usage before a run, with what the budget guarantees (D216). The runner prints the workload and reports its own estimate as unavailable until token usage, helper work and auxiliary calls can be forecast:
  - no new run starts once known spending reaches the budget, so a run already started can pass it;
  - each Claude call is also capped at the budget left after completed calls, by `--max-budget-usd`; within one run, another Claude turn does not start when that remainder is exhausted or that run's cost became unknown; an unknown cost in an earlier run does not stop later runs, which are capped at the budget minus known spending;
  - Codex cost is estimated from its token counts and is not capped;
  - both CLIs report cumulative session or thread counters: subtract the preceding counter for a resumed call and restart from zero only at an explicitly fresh session; fresh auxiliary calls count independently. Claude's root total includes helper spending, so child totals are not added. A Claude turn whose background helpers wake the session again ends with one result per wake, each carrying the session total; the last counts. Each wake starts with a new init, and the user sees the text of each earlier wake as its own message, so that text counts as progress text and only the last wake's text is the final answer. Replay uses the same accounting and saved session boundaries;
  - a missing or decreasing counter, or an unexpected session change, leaves the call's cost unknown. A valid later counter can establish a new baseline, but cannot recover the missing call's spending;
  - a model with no known price counts as unknown, not as zero, and the summary says how many runs had an unknown cost;
  - a failed or timed-out call does not erase completed spending: known spending remains a lower bound, and any unquantified remainder is reported separately.
- **Privacy:** raw event logs and credentials stay outside the repository and are deleted afterwards, unless the user asks to keep the logs. Local review summaries retain the fixture and action evidence described above, never the separate credential home or raw tool outputs. What a run showed goes into the decision's Tested line, as skillbook-test-write says.
- **Judging:** scripts check behaviour. What only judgment can check, such as whether an explanation is clear, is judged by `tests/judge-small.ts` on questions that each name one thing, and a person reads every fail. The judge's cost is given and counted like a run's, and an unknown cost stays unknown.
- **Case-writing rules:** follow [skillbook-test-write](../../.agents/skills/skillbook-test-write/SKILL.md), including prompt/check agreement, advice relevant to the result, strength versus choice, and unknown evidence. Its test-first rule follows the user's schedule.

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
- **Small cases cost little:** the trial of D311 ran three guides on Sonnet and Sol, 3 runs each, with judging, for $17.69.
- **Both agents can run apart from the user's setup:** `CLAUDE_CONFIG_DIR` and `CODEX_HOME` set a separate config root, and both log in with an API key in a headless run.

## Related

- [how-it-works.md](how-it-works.md): the install script the install tests check, and how a skill is written.
- skillbook-test-write, in `.agents/skills/skillbook-test-write/SKILL.md`: how a design's tests become cases, how they are run and judged, and what a result holds.
- `tests/README.md`: how to run and judge small cases.

## TypeScript runner

The runner is TypeScript on Bun, pinned through mise and in CI (D268). It reads the YAML cases. The Python runner stays for replaying saved runs and comparing assertions; its TOML cases were retired (D288).

The modules under `tests/runner/` separate case loading and validation, sandbox homes and files, process ownership, agent commands, trace parsing, assertions, reports and the command line. Plain functions take data and return observations or verdicts. File access and agent processes stay at the edges. Each module has account-free tests. Bun supplies YAML parsing, subprocess support and the test runner. Exact package versions and their lockfile keep schema generation, validation and type checking reproducible.

`types.ts` defines the case format. A generated JSON Schema checks every YAML file before any run starts and supplies editor completion. Unknown fields and invalid checks fail early. Schema freshness, type checking and unit tests join `just check`, with a check that the cases load.

A case is a conversation, including a single-message case. Its turns hold a message, checks and questions. Results preserve the sent messages, observations and verdicts as JSON. Isolated homes, explicit login copies with cleanup, agent account restrictions, per-turn timeouts and evidence, process cleanup, scheduling by jobs and known spending, unknown costs and kept event logs are the runner's. Codex cost remains an estimate from token usage, without a hard API spending cap.

Later: a terminal view, possibly using OpenTUI, can watch runs and browse turns, checks and scores from the same JSON results. The runner builds no terminal interface.

## The no-skill run

`bun tests/run.ts --no-skill` makes a fresh home without installations, project-skill copies, startup pointers or skill registrations. Account features stay disabled. It keeps the task facts, the project's normal constraints, the model, permissions, account isolation, timeouts and the number of runs. Both conditions use fresh conversations and homes. Eligible checks are scored the same way in both; routing and loading checks have no no-skill equivalent. A check that passes in the no-skill run too measures nothing and is flagged (see "Small cases").

## Skill loading and rule outcomes (D278)

Retired by D311. Small cases produce no rule grid or four-box report. Loading is read from the `reads` and `reads_not` checks and kept as a diagnostic, and the comparison with a no-skill run stays (see "The no-skill run"). The full D278 design is in git history before D311.

## Frozen long scenarios (D310, D311)

The festival ([festival.md](scenarios/festival.md): five chapters, 28 turns) and the todo app ([todo-app.md](scenarios/todo-app.md): six chapters, 37 turns) were the behavioural test layer (D269, D288, D305). They are frozen and are not run again. Their cases, fixtures, trace books and the scripts that wrote them stay as a record in `tests/archive/`, outside the runner's validation; its README lists what is there. The fifteen earlier scenarios and every single-prompt case were retired before them; the last commit holding those is tagged `essentials-old-tests`.

The last full live run on both scenarios showed no progress: the fails both judges agreed on did not move, most fails happened with the right guide read, and a gate cost about $47 (D310).

The judging machinery of those runs is retired, and its code is removed (D311):

- judge tuning against hand-written traces (calibration and trace books);
- the gates, the gap fill (D309) and the contract hash;
- the frozen copy of every rule in `tests/checks/`, and judging every rule at every turn;
- the rule grid and four-box report of D278, and the coverage list (the `covers` field, `--coverage`, `just test-coverage` and the `check-coverage` step).

The runner features only these scenarios used are removed too: chapters and checkpoints, the simulated user and its fit check, and the checks only they used, such as `words_under`, `index_links` and `tests_pass`. Git history before the D311 build keeps all of it.

What the retired method left, kept in the decisions: the check designs for final answers (D270), one check per behaviour (D299) and judge validation (D273), the festival's no-skill comparison (D288) and the live-run results (D305 to D310). On 2026-10-27, Sol judged 30 blind-rated items once: it passed 27 of 27 human passes and failed 2 of 3 human fails, a very wide range for fail detection.

Outside sources read for the retired measurement design, adapted and not copied: [Skill Coverage](https://shuaijiumei.github.io/skillcoverage/) (rules exercised), [SRA-Bench](https://arxiv.org/abs/2604.24594) (retrieval apart from use), [SkillsBench](https://arxiv.org/abs/2602.12670) and [SWE-Skills-Bench](https://arxiv.org/abs/2603.15401) (matched runs with and without skills), the [2026 survey](https://arxiv.org/html/2606.11435v1), and [LHAW](https://huggingface.co/datasets/ScaleAI/lhaw) (CC BY 4.0; no tasks, scoring or environments imported), whose idea of labelling whether a request needs a question still informs clarification cases.
