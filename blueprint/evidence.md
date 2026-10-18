# Evidence

Claims that matter beyond the conversation, each with the evidence that it is true (D90): a task finished, a requirement met, a decision tested, a release checked, the person's confirmation of meaning. Entries are numbered and never rewritten; a later check is a new entry. Each says what was claimed, what was run or seen, who verified it, and what it supports.

## E1: One visible main skill routes at least as well as visible roots (2026-10-11)

- **Claim:** a single main skill, listed to the model, reaches the right skill at least as often as six or thirteen listed roots, and applies its rules whenever it loads.
- **Evidence:** 192 runs over the sample tree, four top-level shapes, ten requests and two that need nothing, twice per agent: right answers 13 of 20 in Claude Code and 18 in Codex with one main skill, against 11 and 18 with six roots; the rule applied in every run that loaded the main skill ([research/skill-loading.md](research/skill-loading.md), "Top-level shapes").
- **Verified by:** the agent, by running both agents.
- **Supports:** D56.

## E2: A description and a pointer make the main skill load (2026-10-11)

- **Claim:** a description telling the agent to load the main skill first, or a sentence in `AGENTS.md`, ends answers given without any skill.
- **Evidence:** 108 runs, three variants, seven requests and two trivial ones, twice per agent: answers without any skill in Claude Code fell from 6 of 14 to 0 with either fix ([research/skill-loading.md](research/skill-loading.md), "Making the main skill load").
- **Verified by:** the agent, by running both agents.
- **Supports:** D57.

## E3: A skill read once is reused for the rest of the conversation (2026-10-11)

- **Claim:** neither agent loads a skill again after reading it, after compaction too, without being told.
- **Evidence:** eight conversations of seven turns: on the second use of a skill no file was read, 8 of 8; after compaction the skills were still followed, numbering rule included, 8 of 8 ([research/skill-loading.md](research/skill-loading.md), "Loading once, using many times").
- **Verified by:** the agent, by running both agents.
- **Supports:** D72.

## E4: act's rule stops Claude Code searching the skill folders (2026-10-11)

- **Claim:** with the rule to follow a skill's route and read its whole file, Claude Code no longer finds skills by searching their folders.
- **Evidence:** the commit-message turn, three times per variant: searched 3 of 3 without the rule, 0 of 3 with it, the commit skill read whole each time ([research/skill-loading.md](research/skill-loading.md), "Following routes, not searching").
- **Verified by:** the agent, by running both agents.
- **Supports:** D72.

## E5: Installed copies update as described (2026-10-11)

- **Claim:** Claude Code reads a local plugin in place and updates a Git-installed one only when its version rises, after refreshing the marketplace; Codex copies a local plugin and refreshes a Git-installed one by itself.
- **Evidence:** a small plugin with a code word changed at its source after each step, from a local folder, from a Git repository served on the same machine, and from a throwaway public GitHub repository, since deleted ([research/skill-loading.md](research/skill-loading.md), "Picking up a changed plugin").
- **Verified by:** the agent, by running both agents; the person deleted the GitHub repository.
- **Supports:** D74, D75.

## E6: The pointer's narrow exception keeps real work loading the main skill (2026-10-11)

- **Claim:** with "except a one-line answer that needs no tool and no file", every real request still loads the main skill, and Claude Code skips it for trivial ones.
- **Evidence:** 72 runs, six real requests and three trivial ones, twice per agent: the main skill loaded for 12 of 12 real requests in each agent; Claude Code skipped it for 6 of 6 trivial ones, Codex for 1 of 6 ([research/skill-loading.md](research/skill-loading.md), "The pointer's exception").
- **Verified by:** the agent, by running both agents.
- **Supports:** D78.

## E7: Claude Code reads CLAUDE.local.md in addition to CLAUDE.md (2026-10-12)

- **Claim:** a project's `CLAUDE.local.md` is loaded together with its `CLAUDE.md`, not instead of it.
- **Evidence:** one run in an empty configuration folder, with a different word in each file and the question asked without reading any file: both words were reported, each from its file ([research/skill-loading.md](research/skill-loading.md), "Instruction files").
- **Verified by:** the agent, by running Claude Code 2.1.296.
- **Supports:** D93.

## E8: Delegating searchable reading costs more than searching (2026-10-12)

- **Claim:** when a search can find what is asked for, the main agent searching alone is cheaper than delegating the reading to subagents, light or standard, and as accurate.
- **Evidence:** nine runs over fifty documents: all found 12 of 12; the main agent alone cost US$0.21 on average, with five haiku subagents US$0.43, with five sonnet subagents US$1.02; the main agent's context grew from about 28,000 to about 40,000 tokens when it delegated ([research/skill-loading.md](research/skill-loading.md), "Delegating wide reading").
- **Verified by:** the agent, by running Claude Code.
- **Supports:** D105.

## E9: A five-subagent fanout costs the main agent about US$0.40 (2026-10-12)

- **Claim:** with opus as the main agent, briefing five haiku subagents, taking in their reports and consolidating costs about US$0.35 to US$0.45, while the subagents' reading of about 60,000 words costs about US$0.03.
- **Evidence:** six delegated runs over two generated corpora, the cost split by model in each run ([research/skill-loading.md](research/skill-loading.md), "Delegating wide reading"). The second test's comparison with the main agent alone is not evidence for real documents: generated filler let it find the answers by counting repeated sentences.
- **Verified by:** the agent, by running Claude Code.
- **Supports:** D105.

## E10: A fork's first call reads the parent's conversation from cache (2026-10-17)

- **Claim:** in Claude Code, a fork started while the parent's cache is warm reads the parent's whole conversation from cache on its first call, writing only the few tokens that start it.
- **Evidence:** one run with the parent at about 176,700 tokens: the parent's call that started the fork read 176,654 tokens from cache and wrote 78; the fork's first call read 176,654 and wrote 78, so 99.96% came from cache; its second call read 176,732 and wrote 487. The fork started seconds after the parent's turn; a cold cache was not tested ([research/token-cost.md](research/token-cost.md), "Measured").
- **Verified by:** the agent, by running Claude Code 2.1.302 with `claude-haiku-5-5` as the main agent.
- **Supports:** D142.

## E11: A fresh subagent's start-up is about 14,700 tokens (2026-10-17)

- **Claim:** in Claude Code, a fresh general-purpose subagent starts with about 14,700 tokens, and an Explore subagent with about 12,600, in a folder with no instruction files; each type's start-up is shared from cache only with agents of the same type started after it was written.
- **Evidence:** three runs: two general-purpose agents started in one message each wrote 14,675 tokens to the cache, neither reading the other's; two Explore agents started in one message each wrote 12,609; two general-purpose agents started one after the other each read 14,675 from cache, written by an earlier run about 40 seconds before ([research/token-cost.md](research/token-cost.md), "Measured").
- **Verified by:** the agent, by running Claude Code 2.1.302 with `claude-haiku-5-5` as the main agent.
- **Supports:** D142.

## E12: Sets as plugins with hidden nested skills work in Claude Code and Codex (2026-10-18)

- **Claim:** two plugins in one marketplace, each with a listed main skill and hidden skills nested below it, are listed as their main skills only, are walked down by the name rule in both agents, call each other through the main skill with a fallback where one is missing, and survive compaction after a long sub-skill was read, without a permission prompt.
- **Evidence:** Claude Code 2.1.302 and Codex 0.163.0, two runs per case: only the main skills listed, in both; down the tree, 4 of 4; with the name rule, 4 of 4 read the right file directly, without it 3 of 4, each after searching the folders; between the plugins, 4 of 4 with both installed and 4 of 4 with the fallback when one was missing; after compaction, 4 of 4 answered a second buried fact of a sub-skill of about 31,000 characters; no permission prompt, reads in the real plugin cache included ([research/skill-loading.md](research/skill-loading.md), "Plugins with nested skills").
- **Verified by:** the agent, by running both agents.
- **Supports:** D186, D187, and D72's point on a long skill after compaction.

## E13: A set's other skills as plain files under its main skill are followed as far as nested skills (2026-10-18)

- **Claim:** in Claude Code and Codex, a set's other skills kept as plain markdown files under its main skill's `references/` are read whole down chains of up to seven files, within a set and across two sets, by the name rule, are followed as far as hidden nested skills, and survive compaction without a sentence telling the agent to read them again, provided a parent only routes and its child holds the method.
- **Evidence:** Claude Code 2.1.302 and Codex 0.163.0, three runs per case, files of 41 to 56 lines: a chain of five files, 3 of 3 in both, and as hidden nested skills 3 of 3 in both; without the name rule 3 of 3 in both, each after a search; a jump to `organize-merge`, 3 of 3 in both; after compaction a buried rule was applied in 12 of 12 runs, with and without a reload sentence, Claude Code re-attaching every file read and Codex reading the needed file again every time; across sets, with a parent that only routes, 3 of 3 in both and the fallback 2 of 2 in both, where a parent holding part of its child's steps stopped Codex at the parent, 0 of 5. Limits: one model per harness, manual compaction in Claude Code and a forced low limit in Codex, non-interactive runs, chains of at most seven files, short files ([research/skill-loading.md](research/skill-loading.md), "Flattened reference files").
- **Verified by:** the agent, by running both agents.
- **Supports:** D188, D177 and D187 (their Tested lines).


## E14: A set installed as a plain folder loads as a plugin does; Claude Code's default mode refuses its files (2026-10-18)

- **Claim:** in Claude Code and Codex, a set installed as a plain folder, copied or linked, into the personal or the project skill folders loads and is followed as a plugin is, each agent listing it once although both folders hold it; in Claude Code's default permission mode the set's reference files outside the project are refused, for personal skills and plugins alike, a rule `Read(~/.claude/skills/**)` in Claude Code's user settings removes the refusal and the same rule in a project's settings did not, and the refused agent answers from the main skill alone without saying so.
- **Evidence:** Claude Code 2.1.302 and Codex 0.163.0, two runs per cell, the flattened essentials: with reads allowed every layout passed, 8 of 8 in each agent, each agent listing the set once; in the default mode only the project copy passed, 2 of 2, against 0 of 2 for the personal link, the personal copy and the project link, and 0 of 4 for plugins (a local marketplace and a Git one); the user-settings rule passed 1 of 1 in its `~` form and 1 of 1 in its absolute form, the project-settings rule 0 of 3. Limits: one or two runs per cell, one model per agent, non-interactive runs where a prompt counts as a refusal (interactively it would be a prompt), and the real install script not yet written; the earlier plugin tests' "no prompt" came from an allow list granting Read everywhere, an inference not rerun ([research/skill-loading.md](research/skill-loading.md), "Installed by a script").
- **Verified by:** the agent, by running both agents.
- **Supports:** D189 and D193 (their Tested lines).

## E15: Compaction drops essentials in Claude Code and hooks bring it back; Codex ignores ask (2026-10-19)

- **Claim:** in Claude Code and Codex, the built essentials loads first and its three group files are read whole in nearly every run; the pointer makes no difference to the first load; after compaction Claude Code drops the main skill and the three group files, the pointer's reload line brought them back in 1 of 1 chain and then 0 of 3, one compaction hook printing the main skill put it back but not reliably the group files, and four hooks, one per start file, put all four files back whole; Codex needs no hooks, and ignores ask's numbered rounds under headings because its own instructions outrank skills.
- **Evidence:** Claude Code 2.1.302 with `claude-opus-5-5` and codex-cli 0.163.0 (`gpt-6.1-sol` where read), a fake home per run holding only the sign-in files, the real `install.sh` in copy mode, the read rule in the fake settings, a fresh two-file fixture project, non-interactive runs (`claude -p`, `codex exec`), compaction forced by small windows. About US$7.4, US$2.8, US$2.4, US$1.6 and US$1.3 for the five Claude Code tests below; Codex's cost is not reported.
  - **Baseline test (2026-10-18, commit `b229224`):** essentials was loaded first in 41 of 41 first-turn runs with the skill installed (20 Claude Code, 21 Codex), and the three group files were read whole in each. The pointer made no difference, 18 of 18 runs without one, with a project one or with a personal one. A clarify request got a numbered round under headings in 7 of 7 Claude Code first turns and in 0 of 8 Codex first turns, where Codex asked one unnumbered question. Layout: headings 3 of 3 in Claude Code and 0 of 3 in Codex; Codex wrote table rows of 164 to 191 characters in 3 of 3. Start-up for "What is 2 + 2?": about 20,000 characters read, +53,000 input tokens summed over calls in Claude Code, +56,000 in Codex, mostly the same context sent again after each read. After compaction Claude Code re-attached only the last five files read, so the main skill and the three group files were gone, and none of 8 turns read them again; a new commit-message request did not load essentials again in 0 of 4 Claude Code and 0 of 5 Codex runs, with or without a pointer. Codex keeps the user messages, the pointer among them, and one opaque item.
  - **Compaction retest (2026-10-18, commit `44c4f82`), with the new pointer line "load it again whenever its text is no longer in view, such as after compaction":** Claude Code with the pointer reloaded essentials and the three group files in 1 of 1 chain (window forced to 20,000, which compacted 3 times); without the pointer 0 of 2, although both summaries carried the instruction. Codex with the pointer reloaded SKILL.md in 3 of 3 chains and the group files in 2 of 3; without it 0 of 2. The tiny limits made the reload itself trigger more compaction.
  - **Plain-English test (2026-10-18, commit `2c1c9bf`):** the rewrite changed nothing visible in the splits above: several questions, Claude Code 1 of 1 and Codex 0 of 2; layout, Claude Code passing all three checks and Codex one (rows up to 152 characters, no headings). The pointer after compaction at a 52,000 window: 0 of 3 reloads of the group files (two chains and a replay); each summary carried the reload instruction, and the agent answered with no tool call. At 36,000, one replay loaded the main skill, and a second compaction came before the group files.
  - **One hook test (2026-10-19):** one `SessionStart` hook with the matcher `compact` printing `SKILL.md`, two runs at a 52,000 window. The hook fired in the resumed non-interactive session, once per compaction, and its output (6,116 bytes, equal to the installed file) was in the post-compaction context in 2 of 2. The group files were read again in 1 of 2 and not in the other. Turn 3 followed respond's rules in both.
  - **Four hooks test (2026-10-19):** four hooks in one entry, one per start file (6,104, 3,731, 7,816 and 5,682 bytes, 23,333 in all), two runs at a 52,000 window. All four outputs arrived whole and equal to the installed files in 2 of 2 runs, in parallel, in 5 to 7 ms, in a different order in each run. No file was read again and the Skill tool was not called (0 tool calls in turn 3), and turn 3 followed respond's rules in both.
  - **Codex question finding (2026-10-18, a reading of Codex's source at tag `rust-v0.163.0` and of the model catalog on the machine):** Codex's default mode says to prefer reasonable assumptions over asking; its base instructions say to bundle the most critical freeform questions into one and, for some models, to write connected prose without section headings; instructions in skill files rank below them unless a skill states an explicit requirement. `request_user_input` works only in Plan mode by default, and `codex exec` rejects it. These fit the 0 of 7 runs; they were read, and the cause was not reproduced by changing the instructions.
  - **Limits:** two runs per hook arrangement, and no control run without hooks in the four-hook test; the third turn was a commit-message request, too small to show answer quality, so neither the hooks nor the pointer is shown to change it; windows were forced (20,000 to 52,000), so the reload counts at a realistic window are unknown; non-interactive runs only, no interactive or manual `/compact`; one model per agent; whether the reported token counts after compaction include the hook text was not checked; the "decision D12" check of the reference rule had no referent.
- **Verified by:** the agent, by running both agents and reading Codex's source.
- **Supports:** D204, D205, and D199's start-up measure and retest.
