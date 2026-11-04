# Skill tests

The runner holds two chaptered scenarios side by side. The festival, [festival.yaml](cases/essentials/festival.yaml), has five chapters and 28 turns from [its design](../blueprint/design/scenarios/festival.md); it is a development scenario, not unseen evidence of skill effectiveness. The todo app, `cases/essentials/todo-app.yaml`, has six chapters and 40 turns from [its design](../blueprint/design/scenarios/todo-app.md); it is code work and a confirmation scenario. Each chapter starts a fresh session from an authored checkpoint. Executable checks and authored traces are not observed model results.

`--case` matches part of a case id, so `--case festival` and `--case todo-app` each select one scenario. The same selection works for runs, dry runs, coverage, `judge-scenarios.ts --case` and `recheck-scenarios.ts --case`. Each case has its own active trace book: `calibration/festival-traces.json` and, once written, `calibration/todo-app-traces.json`. Select it with `--rubric-book` in the runner and saved-answer judge, and with `--book` in the fixture validator. A book is checked against its own case only, so judge one case's runs at a time. When results cover several cases, scores and summaries keep each case's totals apart; results for one case keep their usual keys.

A case may name programs its project's work needs in `requires`, such as `["python3"]`. Before any agent call, the runner runs each program with `--version` and stops with a message that names a missing one. A dry run reports a missing program too and exits with status 1.

## Inspect without a model

```sh
just test-coverage
just test-runner
just check-runner-ts
bun tests/run.ts --validate
bun tests/run.ts --case festival --dry-run
bun tests/run.ts --case festival --chapter 3 --agents codex --model codex=gpt-6.1-sol --dry-run
bun tests/run.ts --case todo-app --dry-run
```

The festival permits exactly Claude Code with Sonnet and Haiku, and Codex with GPT-6.1-Sol and GPT-6 Luna. Its default plan includes all four once. An explicit model outside its list is rejected before a model call. The old `--pilot` preset is retired; a future chapter pilot needs its own agreed workload, call caps and cost estimate. `--no-skill` selects a separate run without installations or pointers. Ordinary `--runs`, `--model`, `--chapter` and fixed/simulated user modes remain available.

`just test-coverage` and `just check-coverage` read YAML. They list declared aspects against the current skill text, keep manual-only aspects in [manual.toml](manual.toml), warn about uncovered aspects and fail on unknown IDs. A declaration does not establish that a model passed. The festival does not cover every rule, advice item or step; rejected organize-result undo and the project-skill scenarios remain future coverage.

## Run and judge

`just test-agents` and `just test-agents-ts` invoke the same Bun runner. It prints the workload and asks before spending. The runner cannot forecast token usage, helper work or auxiliary calls, so it reports the cost estimate as unavailable. Before a real run, give a separate estimate based on observed pilot usage and inspect its selected chapters, models, conditions and call limits. Nothing in the account-free checks starts a model. The scheduling budget stops new runs after known spending reaches it; already running calls finish. Claude also receives a per-call remaining-budget cap. Codex has no hard spending cap.

Claude's root `result.total_cost_usd` and Codex's `turn.completed.usage` are cumulative session or thread counters. The runner subtracts the preceding counter on a resumed call and starts from zero only for an explicitly fresh session. Missing, decreasing or unexpectedly changed counters leave that call's cost unknown. Claude's root total includes helper work; child result totals are not added again. Codex token deltas are priced at the configured model's rates. Fresh fit and judge calls count their own totals independently. Failed calls preserve known spending as a lower bound and report an unknown remainder. Saved-log replay uses the same accounting and saved fresh-session boundaries; historical totals from the frozen Python runner can therefore differ. See [Claude's cost contract](https://code.claude.com/docs/en/agent-sdk/cost-tracking) and [Codex 0.163.0's JSONL emitter](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/exec/src/event_processor_with_jsonl_output.rs).

Runs use throwaway homes and project copies. Personal credentials are copied only with an explicit `--login`, then deleted. Claude has a sandbox restricted to the run folder and temporary folder, no network, strict empty MCP configuration, no cloud connectors or synced plugins. Codex uses `workspace-write`, disables apps/plugins and excludes shared `/tmp`; its own `TMPDIR` remains writable. Each run owns its process groups and removes its home after recording results. Missing process visibility stays unknown. `--keep` preserves explicitly requested raw events outside this repository.

Each result records final answers with their word counts, unscored progress, ordered actions, file diffs, relevant contents, helper evidence and completeness. A helper's start, brief, returned work, freshness and end are separate facts. Missing Codex helper details stay unknown; a wait call is not a start. A helper-unavailable answer must disclose the limit and any pending independent check. Refusal, a file name or a claim of execution alone cannot establish a promised result.

The summary prints each run's median and total final-answer words beside the scores. Length is a number to read, never a verdict. `bun tests/compare-runs.ts BEFORE AFTER [OUTPUT.md]` compares two judged run files of the same agent and model, over the turns both cover: fails, passes and undecided per judge, overall and per check, the checks that changed to or from fail, the flip share (changed checks over checks decided in both) and the word counts. It ranks no model and reads one file at a time, because a judged run file can pass 100 MB.

Claude action records preserve `parent_tool_use_id`: null means the main agent, and an ID identifies the helper's parent call. Helpers' reads, context boundaries and session IDs do not establish main-agent loading or retention. Both the loading reader and compatibility read list exclude helper events. Judges retain the attributed actions and helper reports. With `--login`, auxiliary Codex fit/judge calls receive the Codex login in their own throwaway home even when Claude is the tested agent. A Claude-only run with no auxiliary call needs no Codex login.

Semantic scoring requires calibrated judging and a validated active trace book. See [checks/README.md](checks/README.md#historical-and-active-validation) and [judge.md](judge.md). Automatic passes do not imply semantic passes. Correct, allowed-alternative and targeted wrong traces are in [festival-traces.json](calibration/festival-traces.json); account-free tests check their structure and exercise file assertions. A turn's `tN:correct` trace must pass every automatic check of turn N; the tests evaluate them with the same code as a live run, through `runner/trace-checks.ts`. The festival's tests are in `runner/festival.test.ts`; the todo app's go in `runner/todo-app.test.ts`. The first semantic validation found trace and label faults; the corrected book requires a fresh report under the shared live-scoring contract. The scoring gate stays closed without a matching report.

## Chapters and evidence

The schema is generated from [runner/types.ts](runner/types.ts). Each chapter has a consecutive `number`, a global `start_turn` and a `checkpoint` containing a base `fixture`, ordered `overlays`, optional project-relative `remove` paths, optional `untracked` paths and optional `home` folders. The festival supplies `gitignore: ['*.csv']`. Checkpoint assembly is described in [the fixture README](fixtures/scenarios/festival-checkpoints/README.md).

At every chapter boundary the runner ends leftover processes, restores the project exactly, writes `.gitignore`, commits on `main`, clears guide retention and starts a fresh session. The commit takes every file except the checkpoint's `untracked` paths. Those stay in the project as files the user never added, such as the todo app's `config/reminders.env` in chapter 3. Without `untracked`, such a file would sit in every later commit's tree. A checkpoint's `home` lists fixture folders, relative to `tests/fixtures` like overlays, whose contents are copied in order into the run's throwaway home after the commit and before the chapter's first agent call, for both agents. A later folder's file replaces an earlier one's. The todo app keeps the user's tasks in `~/.jotdown/tasks.json` this way. First the runner removes every top-level entry that any chapter's `home` folders supply, so home files from an earlier chapter, and the agent's changes to them, never cross into a later one. The agent's own settings, skills and login stay; a `home` folder cannot supply `.agents`, `.claude`, `.claude.json`, `.codex` or `.git`. `--chapter N` puts that chapter's home files in place too and preserves global turn numbers. A process failure marks the rest of that chapter unknown and continues at the next checkpoint. Dependencies and conversations never cross chapter boundaries. Before-comparisons use the chapter checkpoint.

A turn may set `timeout` in seconds, overriding the runner's `--timeout` default for that turn. The festival's six helper turns allow 900 seconds for the main work and independent workers or reviewers; ordinary turns retain the 300-second default. This is a wall-clock limit, not a spending cap.

The fixed user's facts are stored in the case's `user.facts`; the simulated user receives those facts, the current chapter script, conversation and checkpoint. It receives no other chapter history or unexpected approvals.

Each turn's `judge_files` lists checkpoint files or folder prefixes relevant to its checks. Binary sources may supply authored `source_snapshots` tied to the exact file SHA-256. The tool archive’s decoded sheets are verified against that digest before use; stale snapshots are withheld, and a stale checkpoint fails before an agent call. Judges also receive files changed or made during the chapter, together with the selected sources. Unrelated checkpoint files are omitted. Prior chapter files never enter the request. Evidence keeps action and helper facts without copying private home contents. The unit suite checks selection and reports an estimate of each festival turn's serialized evidence size; actual token usage remains a pilot measurement.

`skill_needs`, `also_called` and conditional `if_taken` paths hold guide names and deadlines (`first change`, `answer` or event index). Parents inherit them. Conditional paths use `taken_when` assertions or verified judge marks; unsupported applicability stays unknown. Every turn needs the main skill, `act`, `respond`, `respond-layout`, `act-rightsize` and `devise`. A turn also lists `understand`, `organize` or `coordinate` itself when that stage's test fires and no listed child brings it in. Result checks follow needed-guide labels even without a marked rule. The scenario's open act-stakes question is unchanged.

Automatic assertions include strict `words_under` bounds, `only_replacement`, `unchanged_under`, `index_links` and `keeps_lines`. Each comparison has a usual basis. `unchanged` compares with the project as the turn began. `only_replacement`, `unchanged_under`, `keeps_lines` and `shorter` compare with the chapter's checkpoint, or with the fixture in a case without chapters. A turn's `compare_to: "checkpoint"` makes all five use the checkpoint; `compare_to: "turn"` makes all five use the turn's start. Use `"turn"` when an earlier turn of the chapter already changed the compared files. A check that names its basis says so in its name, such as `unchanged a.md (against the checkpoint)`. `unchanged_under` items may be `{folder, except}`: the named files under the folder may change, appear or go. Word counts include only whitespace-separated tokens containing a Unicode letter or digit, so Markdown markers do not consume the allowance. `folder_contains` checks preserved facts across pages whose names the agent chooses. Missing or withheld evidence stays unknown; an observed missing required file fails.

`index_links: {'*': 'pages'}` accepts one Markdown file added or changed in the turn that links to every page under `pages/`. The index may be inside that folder or elsewhere. Use `{folder: 'pages', contains: ['pattern']}` as the value to require patterns in that same index, such as the table the user requested. Links or patterns from several incomplete files cannot be combined into a pass. An exact index path remains available when the user specified one. Proposed enrichments are judged for quality and sources; automatic checks on the applied result must not require an example addition that was absent from the approved proposal.

Code turns have their own checks:

- `tests_pass: "python3 -m unittest"`: after the turn, the runner runs the command with `sh -c`, with `PYTHONDONTWRITEBYTECODE=1` and a 300-second limit. It runs in a copy of the project as the turn left it, with its own fresh, empty home as `HOME` and its own temporary folder, all removed afterwards. So its own run changes nothing the agent sees, in the project or in the agent's home, even when a test uses the default data path. It records the exit status, the tests run, the failures and errors, the failing tests' names and the output's last 2,000 characters. It passes when the command exits 0. It is the runner's check, not an agent action, and never enters judge evidence.
- `never_committed: [path]`: no commit made during the turn has the path, or a file under it, in its tree. A commit made during the turn is one that was not in the repository before the turn and is in it after the turn, reachable from a ref or a reflog or only stored as an object. So a commit amended or reset away during the turn still counts. The list is complete only if the repository keeps reflogs, HEAD's reflog entries from before the turn remain and no commit from before the turn is gone. Otherwise the check is unknown, not a pass.
- `tag_at_head: [tag]`: each tag, if present, points at HEAD's commit. A missing tag passes.
- `heading_once: {heading, in}`: exactly one file has a Markdown ATX heading, of any level, whose trimmed text is `heading`. `in` lists files and folders; a folder means every `.md` file under it. Headings inside fenced code do not count.
- `tree_lacks: {folder: [pattern]}`: no file under the folder after the turn matches, whether or not the turn wrote it.
- `paths_lack: [pattern]`: no path the turn added or changed matches. A removed path does not count.
- `only_new_files: {matching, at_most}`: the turn adds at most `at_most` files, each matching, and changes or removes nothing else. No new file passes.

Patterns are case-insensitive regular expressions, as everywhere in a case. A `(?-i:...)` group makes part of one exact, such as `(?-i:Overdue)`. After every turn the runner also records the commits made during the turn with the paths in each commit's tree, every tag with its commit, and HEAD. A check whose evidence is missing gives unknown, never a pass.

Python's caches, `__pycache__/` folders and `*.pyc` files, are skipped by every snapshot, change list, file check and judge evidence, so a test run leaves "no changes" true. Files that the project's `.gitignore` ignores, such as the todo app's `my-todos.txt` and `data/`, stay in snapshots, so `unchanged`, `unchanged_under` and `folder_contains` see them.

Turn-level `tmp_has` and `tmp_lacks` inspect paths added since a complete listing immediately before the turn. Existing runtime files do not count as leftovers; new children of existing folders do. Either missing listing leaves the check unknown. The full paths stay in memory; saved results retain the check verdicts for replay. Old short listings cannot establish the before/after difference.

Guide-name exceptions are judged per turn, including the requested setup inspection at turn 25. Near misses check that an inappropriate action was skipped; they never punish reading a guide's boundary.

## Trace evidence for automatic checks

A trace's `observation` holds the turn's `files_changed`, `files_removed` and `final_answer`, with the project before the turn from its history and the chapter's sources. From these, `runner/trace-checks.ts` builds the same record a live run checks: the project after the turn, the checkpoint, the turn's start and the change list. Evidence that only a live run can observe goes in these fields, in the shape the live run saves:

- `test_runs`: a list of the runner's test runs, each `{command, status, tests_run, failures, errors}`. `status` is the exit status; `null` means it timed out or was stopped, which fails.
- `commits`: the commits made during the turn, each `{sha, paths}`, where `paths` lists every file in that commit's tree. It includes commits amended or reset away during the turn. An empty list means none was made.
- `tags`: each tag with the commit it points at.
- `head`: HEAD's commit.
- `left_running`: the processes still running when the turn ended; an empty list means none.
- `tmp_paths`: the temporary paths the turn added.

A field the trace leaves out gives unknown for the checks that need it, never a pass. A trace with `base` inherits its base's fields and may replace any of them. For example, the correct trace of a release turn:

```json
{"case": "essentials/todo-app", "chapter": 6, "prior": [], "observation": {"turn": 38, "chapter": 6,
  "final_answer": "Version 1.0.0 is tagged v1.0 on the release commit. All 24 tests pass.",
  "files_changed": {"CHANGELOG.md": "# Changelog\n\n## 1.0.0\n"},
  "test_runs": [{"command": "python3 -m unittest", "status": 0, "tests_run": 24, "failures": 0, "errors": 0}],
  "commits": [{"sha": "4f2c9e1", "paths": ["CHANGELOG.md", "README.md", "jotdown/cli.py"]}],
  "tags": {"v1.0": "4f2c9e1"}, "head": "4f2c9e1", "left_running": [], "tmp_paths": []}}
```

## Retained tools and historical evidence

The old TOML/YAML cases and their unused fixtures are retired. The `essentials-old-tests` tag retains them for historical rechecking. [run.py](run.py) remains an assertion/replay oracle: empty coverage is valid, and an executable selection with no TOML cases fails clearly. Conversion comparison remains independently unit-tested with temporary cases. Saved JSON comparison does not require live old cases.

The four historical calibration files and reader recordings are unchanged. Historical trace resolution uses its frozen source snapshots and never loads retired cases. Old human labels and reader agreement numbers do not validate the new festival checks. Rechecking a retired case requires the tagged checkout and fails before output or model calls in the current tree.

The dependency versions are exact in [package.json](../package.json) and [bun.lock](../bun.lock). Regenerate the schema with `bun run schema`. Python contracts, Bun unit tests, schema validation, YAML example-copy detection and coverage run without an account, model or network. Static checks also cover Markdown, local links, shell scripts and workflows; [install-test.sh](install-test.sh) tests installs in throwaway homes.
