# Skill tests

Skills are tested with small cases: one guide, a short request, a comparison and a few plain questions (D311, [the testing design](../blueprint/design/testing.md)). The two long scenarios, the festival and the todo app, are frozen. They stay as a record in [archive/](archive/README.md), with their fixtures and traces, and are not run again (D310). Executable checks and authored cases are not observed model results.

## Small cases

A case is `cases/<set>/small/<guide>--<topic>.yaml`, with its project in `fixtures/small/<name>/`. There are three kinds:

- **should-load:** a request the guide covers. It checks that the guide is read (`reads`).
- **should-not-load:** a near miss. It checks that the guide is not read (`reads_not`) and that nothing else changes (`no_changes` or `only_changed`).
- **behaviour:** a request with a few yes-or-no questions in the turn's `rubric`. Each question names one thing.

Every case starts from the main skill, as a real user's session does, so the prompt does not name the guide. A case holds `about` (the wrong behaviour it rejects), `goal`, `fixture` and its turns. Each turn has a `prompt`, `checks` and `rubric`. A rubric entry has an `id`, a `tag` and a `criterion`. For example, the first turn of `organize--recipes`:

```yaml
turns:
  - prompt: Please split recipes.md into one file per recipe, in a recipes/ folder.
    checks: {reads: [organize], no_changes: true}
    rubric:
      - {id: map-first, tag: organize, criterion: 'Before changing any file, the answer shows the map ...'}
```

The automatic checks for small cases are `reads`, `reads_not`, `no_changes`, `only_changed`, `file_contains` and `answer_contains`. [The testing design](../blueprint/design/testing.md#where-things-live) lists every check the runner has, and `runner/types.ts` defines the format.

## Inspect without a model

```sh
just test-runner
just check-runner-ts
bun tests/run.ts --validate
bun tests/run.ts --case small/respond --dry-run
```

`--case` takes one substring of the case id, such as `small/respond` or `organize--recipes`. A dry run prints the runs it would start and spends nothing. Nothing in the account-free checks starts a model.

## Run

Give the cost before a real run, and set `--budget`. The runner prints the workload and asks before spending, unless `--yes` is given. It cannot forecast token usage, helper work or auxiliary calls, so it reports its cost estimate as unavailable: give your own estimate from earlier usage.

```sh
bun tests/run.ts --case PATTERN --agents claude,codex \
  --model claude=sonnet --model codex=gpt-6.1-sol \
  --runs 3 --login --jobs 6 --budget N --yes --out DIR [--no-skill]
```

- **Models:** always pass `--model`. Without it, the runner picks Haiku and Luna.
- **Runs:** about 3 per case on each model, because single runs vary.
- **Comparison:** every run has one. `--no-skill` runs the same cases without installations, project-skill copies or startup pointers. To compare old guide text with new, run the same cases on each, into separate `--out` folders, and judge both the same way.
- **Login:** `--login` copies your own login into the throwaway home and deletes it afterwards. Runs use throwaway homes and project copies. Claude has a sandbox restricted to the run folder and temporary folder, no network, a strict empty MCP configuration, no cloud connectors and no synced plugins. Codex uses `workspace-write`, turns off apps and plugins and excludes shared `/tmp`; its own `TMPDIR` stays writable. `--keep` preserves raw events outside this repository.
- **Budget:** no new run starts once known spending reaches it, so a running call can pass it. Claude also gets a per-call cap of the budget left. Codex has no hard cap. Unknown cost stays unknown, never zero.

Claude's `result.total_cost_usd` and Codex's `turn.completed.usage` are cumulative counters. The runner subtracts the preceding counter on a resumed call and starts from zero only for an explicitly fresh session. A missing, decreasing or unexpectedly changed counter leaves that call's cost unknown. Claude's root total includes helper work, so child totals are not added again. Codex token deltas are priced at the configured model's rates. See [Claude's cost contract](https://code.claude.com/docs/en/agent-sdk/cost-tracking) and [Codex 0.163.0's JSONL emitter](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/exec/src/event_processor_with_jsonl_output.rs).

Each result records final answers, ordered actions, file diffs, relevant contents and helper evidence, with completeness. Claude action records keep `parent_tool_use_id`: null means the main agent. A helper's reads and sessions never count as the main agent's loading. Missing Codex helper details stay unknown.

## Judge

```sh
bun tests/judge-small.ts RESULTS_DIR... --out JUDGED.json --login
bun tests/judge-small.ts RESULTS_DIR... --out JUDGED.json --report-only
```

`RESULTS_DIR` is a runner `--out` folder. The script reads the runner's results and the current case files. Sol answers each turn's questions with pass, fail or unknown and a quote from the answer. Judgments are saved in `JUDGED.json`. A question changed in a case file is judged again on the saved answers, with no new run. `--report-only` prints the report without a judge call.

The report gives pass counts per check, per model and per condition (skill or no skill). It flags two kinds of check:

- **passes everywhere:** it passes with no skill too, so it measures nothing. Rewrite the case or drop it.
- **unstable:** the results are mixed over 3 or more runs.

Read every fail before anything changes. Check each new question once: it must pass a saved good answer and fail a saved bad one, such as a with-skill and a no-skill run of the same case. Loading is a diagnostic: a guide that was read and gave a wrong result is a fail. Keep a guide change only if it beats the old text on its cases and on a held-out case written apart from the change. A gap of one or two runs is noise.

## Retained tools

[run.py](run.py) is an assertion and replay oracle for saved runs. It has no cases of its own. The old TOML and YAML cases are retired; the `essentials-old-tests` tag keeps them.

The judging machinery of the long scenarios is retired, and its code is removed (D311): the second judge, calibration and trace books, the gates and the gap fill, the frozen rule copies in `checks/`, the coverage list and the judge brief `judge.md`. Git history keeps them. The frozen scenarios stay readable in [archive/](archive/README.md).

The dependency versions are exact in [package.json](../package.json) and [bun.lock](../bun.lock). Regenerate the schema with `bun run schema`. Python contracts, Bun unit tests and schema validation run without an account, model or network. Static checks also cover Markdown, local links, shell scripts and workflows; [install-test.sh](install-test.sh) tests installs in throwaway homes.
