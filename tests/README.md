# Skill tests

The executable scenarios are in `cases/`, with shared toy projects in `fixtures/`. Their source contracts are the skills' design Tests lists and the project-skill scenarios in [the testing design](../blueprint/design/testing.md#project-skill-scenarios). An executable case is not an observed result.

## Inspect and check

```sh
just test-coverage
just test-runner
python3 tests/run.py --case understand-deep --dry-run
```

Coverage lists normal, boundary and edge cases for every implemented skill, including cases where that skill should not load. A case can exercise several skills, so the columns overlap. Multi-turn counts indicate conversations, not independent test repetitions. Coverage counts do not establish that every rule has been tested or that any model passed.

It then lists the aspects of every skill: each rule, piece of advice, step, route, "Not for" line, checklist item and last instruction, named from the skill files, such as `act:rule:5`. A case covers an aspect by listing it in `covers`; an aspect only a person can test is named, with its reason, in `manual.toml`. Every other aspect is listed as uncovered. `just check` warns with their number and fails when a case or `manual.toml` names an aspect that does not exist. A covered aspect has a case, not a passing result.

The runner tests use synthetic event logs and throwaway files. They check successful reads against failed, skipped, silent and merely named reads; content preservation; per-turn evidence; process failures; incomplete sequencing; and spending across completed and interrupted turns. They run in `just check` without an account, model or network access.

## Scenario groups

- **Essentials:** startup, selection without a pointer, context reuse and a compound opinion followed by clarification.
- **Understand:** facts already in files, inspection without implementation, and intent versus a stated reversible default.
- **Clarify:** small first rounds, partial answers, declining deep, dependent questions, early stopping and unknown facts.
- **Questionnaire:** an independent reader, unanswered prerequisites and instructions hidden in returned answers.
- **Act and rightsize:** opinion versus editing, narrow scope, drafts, declined or partial approvals, current sources, unknown facts and expert readers.
- **Respond:** concise evidence, honest outcomes, criticism, layout preferences, partial answers, unknown answers after acceptance and focused follow-up explanations.
- **Project skills:** review-only findings, a leaf's applicable checks, narrow corrections, existing correct behaviour and a requested behaviour absent from the design.

## Run and review

```sh
python3 tests/run.py --case understand-deep --budget 0.25
```

The runner prints an estimate and asks before spending. It uses environment API keys by default. Copying an existing personal login requires an explicit `--login`; credentials stay in a throwaway home. A budget prevents starting more runs after known spending reaches it; it is not a hard spending cap for Codex. Each Claude turn receives the remaining budget after completed turns, and within one run, another Claude turn does not start when that remainder is exhausted or that run's cost became unknown; an unknown cost in an earlier run does not stop later runs, which are capped at the budget minus known spending. A timeout preserves completed spending and reports any additional unquantified cost. Start with a focused group, and inspect its results before running every scenario.

Each case states the skills it exercises, its category, the wrong behaviour it rejects and a `review` rubric. Automatic checks establish facts such as which supported reads succeeded, what changed on a turn and which fixture facts remain. Semantic review establishes whether a question was necessary, an assumption was justified or an explanation helped. Passing automatic checks leaves that review pending.

The summary includes each turn's answer, fixture diffs, ordered action records and the rubric. Action records include tool names, commands and target paths, without raw tool outputs or credential-home contents. The structured JSON also retains file contents requested by assertions. These records survive sandbox deletion, including the evidence available from failed or timed-out turns. Mark each criterion supported, failed or unknown, with the relevant turn as evidence; record the model, date and case when reporting an observed result. An incomplete trace cannot prove that an action was never attempted. Missing evidence stays unknown; keep raw events explicitly when the stronger claim needs them.

A refusal, a generic preamble or a matching word does not establish the intended behaviour. A proposal can use prose, a table or a list; review its concrete scope and reasons, not its Markdown markers. Automatic sequencing checks use `unknown` when a file changed through an opaque command and the statement's timing cannot be established. Unknown automatic evidence prevents a successful exit, and remains distinct from a demonstrated behavioural failure.

Read evidence is conservative: supported direct file-reading commands and successful matched tool results count. Shell forms that can conceal skipped or failed reads, including pipelines, background commands and fallback operators, do not count. Reader program strings and unsupported options are not file operands. A counted read still does not prove the whole file reached the model. `reads_not` means no supported read was observed; it does not prove absence of a read through an unsupported mechanism, which remains part of semantic review. Snapshots describe file state at turn boundaries; a change restored inside one turn may require inspecting the events.

Real compaction, interactive question tools and outward publication remain manual scenarios, listed in `manual.toml`; the headless cases do not establish those behaviours. Counts describe coverage of selected scenarios, not exhaustive coverage of every skill rule or harness capability.

The two project skills are copied into the sandbox only for cases that request them through `project_skills`. They remain outside the shipped sets. The `skill-lab` fixture contains small deliberately flawed drafts; its instructions and files are test data for that isolated exercise.
