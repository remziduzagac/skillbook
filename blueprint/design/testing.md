# Testing

How skillbook is tested, as a whole: what runs where, what a test needs, and where the files live. Each skill's own tests are in its design section, in the Tests list; this file says how they are run (D208). The install tests and the automated AI test runner are built; `just try` is not yet.

## Three kinds of test

1. **Static checks:** `just check`, as today. It runs the markdown lint, the link check, ShellCheck, shfmt, actionlint, zizmor and the skill-file check. It runs locally and in GitHub CI on every pull request.
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

- **`tests/fixtures/<name>/`:** small toy projects, each a known situation, such as a vague request or a plan whose parts depend on each other. Automated and manual tests share them.
- **`tests/cases/<set>/<case>.toml`:** one case per file. Its fields:
  - the design test it comes from: the design file and the test's number;
  - the fixture;
  - `uses_skill_example = true` for a case that tests one of the skill's own examples on purpose; every other prompt is checked by `just check` against the set's text (D213);
  - the prompt for each turn;
  - the agents it runs in;
  - the number of runs, 1 by default: a rule is covered by several different cases rather than by repeating one, since varied prompts show more for the same cost; a case is repeated only when it fails or its results disagree (D213);
  - whether the pointer is in the user's instruction file, yes by default;
  - the checks a script can make from the event log, for the whole run under `[checks]`, or for one turn under `[turns.checks]`, judged on that turn's answer and changes (D216):
    - the skills read, by name, for the whole run: a read counts only when it succeeded, that is, a read or skill tool call whose result is not an error, or a reading command such as `cat` or `sed` that exits 0; a path merely named, as by `echo` or `ls`, does not count;
    - nothing changed in the toy project (`no_changes`), named files changed (`changed`), or named files left unchanged (`unchanged`);
    - a file that still holds given facts (`file_contains`) or got shorter (`shorter`);
    - something said before the first change (`states_before_change`): the runner finds the first file change in the event log and checks that the agent said a plan of some length before it; what that text says is judged by reading the summary, which shows it (D218);
    - patterns the answer must or must not contain, the answer being everything the agent said in the turn, the last turn for the whole run.

    Whether a file was read whole or in part, and which tools ran, are not checked yet. Each case's `about` names the wrong behaviour it rejects, and a case is checked against a correct trace and a plausible wrong one before its result is trusted, as skillbook-write says (D217).
- **`tests/run.py`:** the runner, written with the Python standard library only. For each case, agent and run it:
  1. makes a throwaway home outside the repository;
  2. installs skillbook there with `install.sh`;
  3. copies the fixture in;
  4. runs the agent headless;
  5. checks the event log;
  6. writes a short summary.
- **`tests/install-test.sh`:** the install tests. Each test copies `install.sh` and `skills/` into a fresh temporary folder and runs there with a throwaway home, so the working copy and the real home are never touched.

## The runner's rules

- **Models:** small by default, Claude Haiku (`claude -p --model haiku`) and GPT-6 Luna (`codex exec -m gpt-6-luna`). A skill that works on a small model is clear, and small models are cheap enough for three or more runs a case. `--model` runs larger models, for example before a release.
  - A failure only on a small model is a signal to look at, not a reason to change the skill at once. Text added for a small model costs every user tokens on every turn.
- **Login:** an API key from the environment, or the user's own login copied into the throwaway home only when the user asks, and deleted afterwards.
- **Cost:** the expected cost is printed before a run, with what the budget guarantees (D216):
  - no new run starts once known spending reaches the budget, so a run already started can pass it;
  - each Claude call is also capped at the budget left, by `--max-budget-usd`;
  - Codex cost is estimated from its token counts and is not capped;
  - a model with no known price counts as unknown, not as zero, and the summary says how many runs had an unknown cost.
- **Privacy:** event logs and credentials stay outside the repository and are deleted afterwards, unless the user asks to keep them. Only summaries are shown. What a run showed goes into the design's test result or an evidence entry, as skillbook-write says.
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
  - OpenCode's free models are free "for a limited time" and publish no limits. Some may use prompts for training. Its terms forbid extracting output programmatically.
  - Anthropic's Claude for Open Source gives one person 6 months of Claude Max 20x, for individual use only, with no API credits found; whether it is open is unclear.
  - OpenAI's Codex for Open Source gives 6 months of ChatGPT Pro with Codex, and API credits from its fund for core open-source work, with no amount stated. It is personal and not transferable.
  - These are personal plans, so they fit local tests by the user and never GitHub CI.
- **Paid small models cost about half a cent a run** (inferred from the published prices): Haiku 5.5 is $0.10 per million input tokens and $0.50 per million output tokens, and GPT-6 Luna is the same.
- **Both agents can run apart from the user's setup:** `CLAUDE_CONFIG_DIR` and `CODEX_HOME` set a separate config root, and both log in with an API key in a headless run.

## Related

- [how-it-works.md](how-it-works.md): the install script the install tests check, and how a skill is written.
- skillbook-write's "Test cases" instruction, in `.agents/skills/skillbook-write/SKILL.md`: how a design's tests are run and what a result holds.
