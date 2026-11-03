# Skill tests

The active case is [festival.yaml](cases/essentials/festival.yaml): five chapters and 28 turns from [the scenario design](../blueprint/design/scenarios/festival.md). Each chapter starts a fresh session from an authored checkpoint. It is a development scenario, not unseen evidence of skill effectiveness. Executable checks and authored traces are not observed model results.

## Inspect without a model

```sh
just test-coverage
just test-runner
just check-runner-ts
bun tests/run.ts --validate
bun tests/run.ts --case festival --dry-run
bun tests/run.ts --case festival --chapter 3 --agents codex --model codex=gpt-6.1-sol --dry-run
```

The case permits exactly Claude Code with Sonnet and Haiku, and Codex with GPT-6.1-Sol and GPT-6 Luna. Its default plan includes all four once. An explicit model outside its list is rejected before a model call. The old `--pilot` preset is retired; a future chapter pilot needs its own agreed workload, call caps and cost estimate. `--no-skill` selects a separate run without installations or pointers. Ordinary `--runs`, `--model`, `--chapter` and fixed/simulated user modes remain available.

`just test-coverage` and `just check-coverage` read YAML. They list declared aspects against the current skill text, keep manual-only aspects in [manual.toml](manual.toml), warn about uncovered aspects and fail on unknown IDs. A declaration does not establish that a model passed. The festival does not cover every rule, advice item or step; rejected organize-result undo and the project-skill scenarios remain future coverage.

## Run and judge

`just test-agents` and `just test-agents-ts` invoke the same Bun runner. It prints the workload and asks before spending. The runner cannot forecast token usage, helper work or auxiliary calls, so it reports the cost estimate as unavailable. Before a real run, give a separate estimate based on observed pilot usage and inspect its selected chapters, models, conditions and call limits. Nothing in the account-free checks starts a model. The scheduling budget stops new runs after known spending reaches it; already running calls finish. Claude also receives a per-call remaining-budget cap. Codex has no hard spending cap.

Claude's root `result.total_cost_usd` and Codex's `turn.completed.usage` are cumulative session or thread counters. The runner subtracts the preceding counter on a resumed call and starts from zero only for an explicitly fresh session. Missing, decreasing or unexpectedly changed counters leave that call's cost unknown. Claude's root total includes helper work; child result totals are not added again. Codex token deltas are priced at the configured model's rates. Fresh fit and judge calls count their own totals independently. Failed calls preserve known spending as a lower bound and report an unknown remainder. Saved-log replay uses the same accounting and saved fresh-session boundaries; historical totals from the frozen Python runner can therefore differ. See [Claude's cost contract](https://code.claude.com/docs/en/agent-sdk/cost-tracking) and [Codex 0.163.0's JSONL emitter](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/exec/src/event_processor_with_jsonl_output.rs).

Runs use throwaway homes and project copies. Personal credentials are copied only with an explicit `--login`, then deleted. Claude has a sandbox restricted to the run folder and temporary folder, no network, strict empty MCP configuration, no cloud connectors or synced plugins. Codex uses `workspace-write`, disables apps/plugins and excludes shared `/tmp`; its own `TMPDIR` remains writable. Each run owns its process groups and removes its home after recording results. Missing process visibility stays unknown. `--keep` preserves explicitly requested raw events outside this repository.

Each result records final answers, unscored progress, ordered actions, file diffs, relevant contents, helper evidence and completeness. A helper's start, brief, returned work, freshness and end are separate facts. Missing Codex helper details stay unknown; a wait call is not a start. A helper-unavailable answer must disclose the limit and any pending independent check. Refusal, a file name or a claim of execution alone cannot establish a promised result.

Claude action records preserve `parent_tool_use_id`: null means the main agent, and an ID identifies the helper's parent call. Helpers' reads, context boundaries and session IDs do not establish main-agent loading or retention. Both the loading reader and compatibility read list exclude helper events. Judges retain the attributed actions and helper reports. With `--login`, auxiliary Codex fit/judge calls receive the Codex login in their own throwaway home even when Claude is the tested agent. A Claude-only run with no auxiliary call needs no Codex login.

Semantic scoring requires calibrated judging and a validated active trace book. See [checks/README.md](checks/README.md#historical-and-active-validation) and [judge.md](judge.md). Automatic passes do not imply semantic passes. Correct, allowed-alternative and targeted wrong traces are in [festival-traces.json](calibration/festival-traces.json); account-free tests check their structure and exercise file assertions. The first semantic validation found trace and label faults; the corrected book requires a fresh report under the shared live-scoring contract. The scoring gate stays closed without a matching report.

## Chapters and evidence

The schema is generated from [runner/types.ts](runner/types.ts). Each chapter has a consecutive `number`, a global `start_turn` and a `checkpoint` containing a base `fixture`, ordered `overlays` and optional project-relative `remove` paths. The case supplies `gitignore: ['*.csv']`. Checkpoint assembly is described in [the fixture README](fixtures/scenarios/festival-checkpoints/README.md).

At every chapter boundary the runner ends leftover processes, restores the project exactly, writes `.gitignore`, commits on `main`, clears guide retention and starts a fresh session. `--chapter N` preserves global turn numbers. A process failure marks the rest of that chapter unknown and continues at the next checkpoint. Dependencies and conversations never cross chapter boundaries. Before-comparisons use the chapter checkpoint.

A turn may set `timeout` in seconds, overriding the runner's `--timeout` default for that turn. The festival's six helper turns allow 900 seconds for the main work and independent workers or reviewers; ordinary turns retain the 300-second default. This is a wall-clock limit, not a spending cap.

The fixed user's facts are stored in the case's `user.facts`; the simulated user receives those facts, the current chapter script, conversation and checkpoint. It receives no other chapter history or unexpected approvals.

Each turn's `judge_files` lists checkpoint files or folder prefixes relevant to its checks. Binary sources may supply authored `source_snapshots` tied to the exact file SHA-256. The tool archive’s decoded sheets are verified against that digest before use; stale snapshots are withheld, and a stale checkpoint fails before an agent call. Judges also receive files changed or made during the chapter, together with the selected sources. Unrelated checkpoint files are omitted. Prior chapter files never enter the request. Evidence keeps action and helper facts without copying private home contents. The unit suite checks selection and reports an estimate of each festival turn's serialized evidence size; actual token usage remains a pilot measurement.

`skill_needs`, `also_called` and conditional `if_taken` paths hold guide names and deadlines (`first change`, `answer` or event index). Parents inherit them. Conditional paths use `taken_when` assertions or verified judge marks; unsupported applicability stays unknown. Every turn needs the main skill, `act`, `respond`, `respond-layout` and `act-rightsize`. A turn also lists `understand`, `devise`, `organize` or `coordinate` itself when that stage's test fires and no listed child brings it in. Result checks follow needed-guide labels even without a marked rule. The scenario's open act-stakes question is unchanged.

Automatic assertions include strict `words_under` bounds, `only_replacement`, `unchanged_under`, `index_links` and `keeps_lines`. Word counts include only whitespace-separated tokens containing a Unicode letter or digit, so Markdown markers do not consume the allowance. `folder_contains` checks preserved facts across pages whose names the agent chooses. Missing or withheld evidence stays unknown; an observed missing required file fails.

`index_links: {'*': 'pages'}` accepts one Markdown file added or changed in the turn that links to every page under `pages/`. The index may be inside that folder or elsewhere. Use `{folder: 'pages', contains: ['pattern']}` as the value to require patterns in that same index, such as the table the user requested. Links or patterns from several incomplete files cannot be combined into a pass. An exact index path remains available when the user specified one. Proposed enrichments are judged for quality and sources; automatic checks on the applied result must not require an example addition that was absent from the approved proposal.

Turn-level `tmp_has` and `tmp_lacks` inspect paths added since a complete listing immediately before the turn. Existing runtime files do not count as leftovers; new children of existing folders do. Either missing listing leaves the check unknown. The full paths stay in memory; saved results retain the check verdicts for replay. Old short listings cannot establish the before/after difference.

Guide-name exceptions are judged per turn, including the requested setup inspection at turn 25. Near misses check that an inappropriate action was skipped; they never punish reading a guide's boundary.

## Retained tools and historical evidence

The old TOML/YAML cases and their unused fixtures are retired. The `essentials-old-tests` tag retains them for historical rechecking. [run.py](run.py) remains an assertion/replay oracle: empty coverage is valid, and an executable selection with no TOML cases fails clearly. Conversion comparison remains independently unit-tested with temporary cases. Saved JSON comparison does not require live old cases.

The four historical calibration files and reader recordings are unchanged. Historical trace resolution uses its frozen source snapshots and never loads retired cases. Old human labels and reader agreement numbers do not validate the new festival checks. Rechecking a retired case requires the tagged checkout and fails before output or model calls in the current tree.

The dependency versions are exact in [package.json](../package.json) and [bun.lock](../bun.lock). Regenerate the schema with `bun run schema`. Python contracts, Bun unit tests, schema validation, YAML example-copy detection and coverage run without an account, model or network. Static checks also cover Markdown, local links, shell scripts and workflows; [install-test.sh](install-test.sh) tests installs in throwaway homes.
