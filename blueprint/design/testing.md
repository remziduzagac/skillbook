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
   - **Automated:** `just test-agents` runs cases through the runner. The user starts it, or an agent does while building or changing a skill. An agent may also guide a run: start cases, read the summaries and judge what a script cannot check.
   - **Manual:** `just try claude` or `just try codex` opens that agent in a toy project, with a sandbox home that has skillbook installed in link mode, so edits show at once. The user logs in once inside the sandbox. The user's real agent setup, and the agent session that develops the skills, stay apart from the skills under test. The command runs in whatever terminal or pane the user picks; nothing imposes a layout.

## Where things live

All in `tests/` (D190), except the commands, which are in the `justfile`.

- **`tests/fixtures/<name>/`:** small toy projects, each a known situation, such as a vague request or a plan whose parts depend on each other. Automated and manual tests share them. A fixture's project instruction file is `AGENTS.md` only; the runner copies it to `CLAUDE.md` for Claude Code, so both agents get the same instructions and the repository holds no nested `CLAUDE.md` that would load into a developer's own session.
- **`tests/cases/<set>/<case>.toml`:** one case per file. Its fields:
  - the design test it comes from: the design file and the test's number;
  - the fixture;
  - `uses_skill_example = true` for a case that tests one of the skill's own examples on purpose; every other prompt is checked by `just check` against the set's text (D213);
  - the prompt for each turn;
  - the agents it runs in;
  - the number of runs, 1 by default: a rule is covered by several different cases rather than by repeating one, since varied prompts show more for the same cost; a case is repeated only when it fails or its results disagree (D213);
  - whether the pointer is in the user's instruction file, yes by default;
  - `skills`, the implemented skills whose behaviour or routing boundary it exercises; `category`, normal, boundary or edge; `rejects`, the plausible wrong behaviour;
  - `covers`, the aspects of the skills it tests, by the ids `tests/run.py --coverage` names from the skill files: each rule, piece of advice, step, route, "Not for" line, checklist item and last instruction, such as `act:rule:5` or `act:not-for:act-rightsize`; only what its checks or review can fail on;
  - `review`, semantic acceptance criteria; automatic success leaves these pending, and the summary includes each turn's answer for review. After each run, every run, passed or failed, is judged against them by fresh agents on a larger model than the ones tested, as `tests/judge.md` says, and the person spot-checks unclear verdicts and those the automatic checks disagree with;
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

    Whether a file was read whole or in part, and which tools ran, are not checked yet. Each case's `about` names the wrong behaviour it rejects, and a case is checked against a correct trace and a plausible wrong one before its result is trusted, as skillbook-write says (D217).
- **`tests/run.py`:** the runner, written with the Python standard library only. It runs up to four runs at a time (`--jobs`), sharing only the budget; nothing is shared between runs, such as a home, a session or a fixture copy, since a shared one would carry one case's history into another. For each case, agent and run it:
  1. makes a throwaway home outside the repository, with the run's own temporary folder inside it, set as the agent's `TMPDIR`, so nothing an agent leaves there outlives the run, after a short listing of its paths and sizes is kept in the turn's evidence (D233);
  2. installs skillbook there with `install.sh`;
  3. copies the fixture in;
  4. runs the agent headless, each turn in a process group of its own, with a marker in its environment for a process that leaves the group;
  5. records what the agent left running when each turn ended, then, when the run ends or a turn times out, ends it, so a leftover the model caused is still observed and nothing keeps running on the user's machine (D233);
  6. checks the event log;
  7. writes a short summary.
- **`tests/install-test.sh`:** the install tests. Each test copies `install.sh` and `skills/` into a fresh temporary folder and runs there with a throwaway home, so the working copy and the real home are never touched.
- **`tests/test_runner.py`:** account-free tests of the evidence and case inventory, run by `just test-runner` inside `just check`. Correct and wrong synthetic traces exercise the assertions without spending on a model. `just test-coverage` reports executable scenario counts, not observed success, and lists each aspect that no case covers and `tests/manual.toml` does not name.
- **`tests/manual.toml`:** the aspects only a person can test in a live session, such as the harness's question tool, real compaction or publishing, each with its reason.
- **`just check-coverage`,** inside `just check`: warns with the number of uncovered aspects, and fails only when a case or `tests/manual.toml` names an aspect that does not exist.
- **Review evidence:** before deleting each sandbox, the runner retains per-turn fixture diffs, observed file contents requested by assertions, answers and an ordered action ledger of tool names, commands and target paths. Tool outputs and credential-home contents are not copied into that ledger. Failed or timed-out turns retain the evidence available, marked incomplete. A semantic criterion that cannot be established from the retained evidence stays unknown; raw events may be kept explicitly when needed.

## Project skill scenarios

The project skills have no shipped-set design sections. These scenarios apply their existing contracts, with small fixture drafts, without changing their rules:

1. skillbook-design reviews overlapping routes: it reports the actual conflicting lines and a general fix, changing nothing.
2. skillbook-design reviews a leaf: it applies the relevant checklist without inventing a requirement for child-routing sections.
3. skillbook-write corrects one spelling error: it preserves the design and required fallback, changing nothing unrelated.
4. skillbook-write finds a requested behaviour absent from the design: it proposes the design change through skillbook-design before changing either file.
5. skillbook-write finds the requested behaviour already present: it reports the evidence and leaves the files alone.

## The runner's rules

- **Models:** small by default, Claude Haiku (`claude -p --model haiku`) and GPT-6 Luna (`codex exec -m gpt-6-luna`). A skill that works on a small model is clear, and small models are cheap enough for three or more runs a case. `--model` runs larger models, for example before a release.
  - A failure on one small model is noted, not acted on. When more than one model fails the same case, or a larger model fails it, the failure is looked into, what fails and why, before anything changes, since the cause is then likely the skill. Text added for one small model costs every user tokens on every turn. The summary flags a case that more than one model failed (D214).
- **Login:** an API key from the environment, or the user's own login copied into the throwaway home only when the user asks, and deleted afterwards.
- **Cost:** the expected cost is printed before a run, with what the budget guarantees (D216):
  - no new run starts once known spending reaches the budget, so a run already started can pass it;
  - each Claude call is also capped at the budget left after completed calls, by `--max-budget-usd`; within one run, another Claude turn does not start when that remainder is exhausted or that run's cost became unknown; an unknown cost in an earlier run does not stop later runs, which are capped at the budget minus known spending;
  - Codex cost is estimated from its token counts and is not capped;
  - a model with no known price counts as unknown, not as zero, and the summary says how many runs had an unknown cost.
  - a failed or timed-out call does not erase completed spending: known spending remains a lower bound, and any unquantified remainder is reported separately.
- **Privacy:** raw event logs and credentials stay outside the repository and are deleted afterwards, unless the user asks to keep the logs. Local review summaries retain the fixture and action evidence described above, never the separate credential home or raw tool outputs. What a run showed goes into the design's test result or an evidence entry, as skillbook-write says.
- **Judging:** scripts check behaviour. What only judgment can check, such as whether an explanation is clear, is judged by the agent that guides the run or by the user, and the result says which.
- **Cases come from the designs' Tests lists,** which stay the source. A few are turned into cases first, starting with essentials.
- **Test first for behaviour rules that are new, changed or failed:** the case is written and seen to fail before the wording changes, as skillbook-write says (D211).

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
