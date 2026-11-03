# Rule and result checks

D278 rule and promised-return checks for every guide used by the festival scenario. The YAML files are JSON-form YAML. Each freezes a coverage id using the number displayed in the guide, source file, line and full source block. Loading rejects absent ids and changed source text. Update checks and affected scenarios together when a rule changes.

Scenario criteria beginning with `check:` resolve through the definition's key. Other criteria still run unchanged. The current definitions follow the current guide text. Historical trace judgments do not validate rewritten criteria. Measurement also supplies the full source rule to the outcome batch. Coverage declarations are not observed passes.

Definitions declare `always`, `scenario`, `action` or `claim` applicability. A single per-turn inventory combines author labels, recorded actions and verified claim/mark evidence before outcome judging. Checks of the same rule become parts of one opportunity, using its earliest deadline. `no_skill_eligible: true` includes a check in matched comparisons. Result definitions validate their source mappings; named alternative groups require one applicable return, with other alternatives excluded when a verified return supplies it.

`bun tests/run.ts --no-skill` creates a fresh home without installations, project-skill copies or startup pointers. Account features remain disabled. The retired `--pilot` option fails. The festival case names four permitted models: Claude Sonnet and Haiku, Codex GPT-6.1-Sol and GPT-6 Luna. Its default dry run selects all four. New pilot limits must be calculated from the selected chapter; generic call-limit contracts remain.

Runs retain skill source snapshots and normalized per-turn access before cleanup. `measurement.json` contains loading, rule grids, outcome/result counts, no-skill rates, matched transitions and distinct rules exercised. Reader-assisted timing labels and native Claude validation remain pending user checks and recordings. The legacy flattened read assertions live in `tests/runner/legacy-reads.ts`; they are compatibility checks and never establish measured delivery.

Retained recording names include the condition, and each turn links its recording. Reader `access-3` attributes supported reads and searches per file and preserves independently established whole reads when the same file is also searched. The 20 annotated Codex recordings contain two whose observed files match Git versions, sixteen with mixed matches and two without skill reads. Historical labels use matched Git blobs where possible; fifty unmatched full-file claims remain unknown, and one unmatched range stays partial. Replaying the confirmed versions and one failed delivery agrees on 69/69 access labels; 51 accesses have no matched source version. Against these historical labels, today’s default reader agrees on 63/120: seven older whole reads appear partial, and fifty unmatched versions also appear partial. The separate `current_reader_expected` labels retain 120/120 agreement against today’s skills. Three manually checked reads precede the first write although the reader leaves their timing unknown. User checks remain pending. Claude reuse requires the same recorded session and no compaction/resume boundary; reused loads have separate counts.

Codex exec JSON alone cannot establish retention. `codex-retention-1` reads only the runner's throwaway home's native session files before cleanup. Reuse requires the same session, complete consecutive ordinals from its metadata through each completed turn, matching turn counts and final answers, and an unchanged previous checkpoint prefix. The reader supports native CLI version `0.163.0` only. Compaction, rollback, inherited history, missing or unsupported records, incomplete turns and changed prefixes keep retention unknown. A native boundary whose position cannot be aligned to exec events also leaves current-turn loading unknown. Normal `exec resume` can retain text when these checks succeed. Keep normalized record counts, relative evidence paths and checkpoint hashes; retain no native account metadata or tool output.

The pinned [Codex persistence policy](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/rollout/src/policy.rs) persists compaction checkpoints. Its [history replacement implementation](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/core/src/session/mod.rs) writes them when installing compacted history. Saved throwaway logs validate the native shape and complete/incomplete detection; synthetic two-turn fixtures and stubbed runner tests cover reuse and boundary rejection. No native multi-turn or compaction session was created for validation.

Unknown applicability, unsupported shell effects, unproved context retention and missing semantic evidence stay unknown. Internal returns without a required later visible step are excluded. The account-free tests validate the mechanics; they do not validate semantic judge failure detection or establish a skill's causal effect.

Routing notes are diagnostic hints beside each grid opportunity. The runner retains ordered Codex reasoning summaries, Claude thinking blocks and existing progress messages between tool calls. Final answers and helper thinking are excluded. Redacted thinking has no usable text. A name, file or literal phrase from the frozen rule label before its deadline yields `considered`; otherwise the report says `not mentioned` or `no thinking available`. Quotes keep source and event/block order, with late and unplaced mentions separate. Summaries can omit the relevant thought, and paraphrases can escape the literal matcher. A hint proves neither a decision nor loading. These notes never enter judge evidence or change scores, grid cells or loading labels.

Every Codex test home uses `model_reasoning_summary = "auto"`, in both installed and no-skill conditions. Runs retain their thinking settings for comparison. The pinned [0.163.0 configuration schema](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/core/config.schema.json) defines this key; the [exec JSON writer](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/exec/src/event_processor_with_jsonl_output.rs) emits nonempty summaries as reasoning items. Enabling summaries does not guarantee that the model returns one. Missing text stays `no thinking available`.

## Chapters and evidence

Chaptered cases restore a checkpoint before every working session. Needed-guide labels include `skill_needs`, `also_called` and conditional `if_taken` paths. Parents inherit deadlines. Conditional labels use `taken_when` assertions or verified path marks; unsupported path applicability stays unknown. The main skill, `act`, `respond`, `respond-layout` and `act-rightsize` are always needed. The other four main guides are needed on a turn only where its label lists them or one of their children. Result parts are selected from needed-guide labels as well as rule opportunities.

A wait call naming a helper does not count as an observed start. Helper records preserve each observed start, brief, returned result, freshness and end separately. A returned report does not establish a fresh start or disposal. Unsupported helper actions and missing lifecycle fields stay unknown.

## Historical and active validation

The frozen `tests/calibration/scenario-traces.json` book resolves and validates independently of executable cases. It remains historical evidence. `bun tests/check-rubric-fixtures.ts OUTPUT CALIBRATION --historical --login` explicitly selects it.

Active scoring requires a separate book with `scope: active`, selected with `--rubric-book FILE` in the runner and saved-answer judge. The fixture validator selects it with `--book FILE`. Its criteria must match the selected current cases and the promised-return library. Positive, alternative and negative trace references must be distinct. Every allowed alternative requires its own matching judgment or two matching reruns of an initial miss under the current contract. Active report hashes include the book and current rule/result definitions. A historical report cannot enable active scoring. Account-free transport tests cannot enable it either. The active festival book is `tests/calibration/festival-traces.json`. Its `library` records cover every visible return, including each clarification alternative; every rule definition has at least one scenario criterion. Tests check this inventory and source drift without a model. They do not create a semantic validation report.

Active trace books can supply `chapter_sources`, keyed by `case:chapter`, for checkpoint-specific source files. Trace history cannot cross a case or chapter. Rechecking uses saved chapter checkpoints and global turn numbers. Retired case selectors fail before output creation or model calls; historical rechecking requires the tagged checkout.

Each turn selects checkpoint evidence through `judge_files`: exact files or folder prefixes. Changed and made files are included with their sources. Selection never pulls files from another chapter. Full snapshots remain available locally for assertions and replay. Judge input estimates measure serialized evidence bytes, not observed tokens or dollars.

## Validation contract

Active fixture validation and live scoring use `runner/judge-protocol.ts` for full source-rule and promised-return criteria, citation checks and rule-part aggregation. Fixture traces pass through the same live evidence allowlist and native helper extractors. Author-only access assertions, raw command output and helper-control claims are excluded. Native helper prompts, states and returned reports remain evidence.

A definition may include `source_context` for a referenced source rule needed to interpret the target rule. Each context entry freezes its own id, file, line and complete numbered block, validated like the target source. Both live and fixture criteria receive that context; it adds the referenced requirement without copying whole guides into evidence. Applicability remains conditional: an observable return or action is required, and one known stage such as disk readback does not become unknown merely because worker startup is unknown.

The book may name `expectations` by trace reference, including `null` for an unobservable or inapplicable fact. Unknown matches are reported as unknown, never as observed semantic passes. Whole-guide delivery belongs to the access/loading view; its semantic-only candidates produce unknown without a model call. Caller-owned follow-up work is judged in the caller’s scope.

`fixture-validation.ts` shares each trace once per call, checks the complete structured request against 600,000 characters, and rejects an indivisible oversized candidate before dispatch. A batch is accepted only after every returned row is validated; errors record its candidate identities without a successful prefix. Active report hashes include the shaping, prompting, verification and measurement code as well as frozen sources and book data, so reports from an earlier contract expire. Historical book data and hashes remain unchanged.

Action citations accept one exact ID, an array of exact IDs, or a legacy semicolon-separated string. Every cited ID must exist in the current turn; a list with an unknown ID is rejected even beside a valid quote. Stored judgments keep `raw` with the original model response, including part verdicts before verification. Fallback fixtures follow the [testing design's helper policy](../../blueprint/design/testing.md#helper-unavailability-in-validation-traces).

Use `--preview --candidates FILE` to judge only an array of stable `{check,ref}` names. `--preview --since REPORT` selects the report's misses plus changed evidence, criteria and expectations; a report without candidate fingerprints also needs `--baseline-book FILE` from that revision. These selectors form a union. New full and preview reports retain fingerprints. Preview reports are marked `mode: preview` and `scoring_authorized: false`; the scoring gate always rejects them. Use `--dry-run` with preview to write its plan without login, calibration or model calls. Full validation remains the command above without preview selectors.

```sh
bun tests/check-rubric-fixtures.ts /tmp/preview-plan.json --book tests/calibration/festival-traces.json \
  --preview --candidates /tmp/candidates.json --dry-run
bun tests/check-rubric-fixtures.ts /tmp/preview.json /tmp/calibration.json \
  --book tests/calibration/festival-traces.json --preview --candidates /tmp/candidates.json --login
```

For a full report with misses, run the two-round gate step on the same tree:

```sh
bun tests/check-rubric-fixtures.ts /tmp/combined.json /tmp/calibration.json \
  --book tests/calibration/festival-traces.json --rerun-misses /tmp/full.json --login
```

The command judges only the full report's misses, twice, in separate fresh calls. Both reruns must match each missed candidate; either repeated miss blocks scoring. Incomplete, duplicated, extra or stale rounds cannot open the gate. The combined report retains original judgments, both rounds, noise candidates and the measured 3/239 (1.3%) flip rate at `94fd856`. Live and saved-run summaries keep the accepted noise list and that measurement. Add `--dry-run` to write a non-authorizing two-round plan without login or calibration. Rerun output must differ from the original full report; a preview cannot be its source.
