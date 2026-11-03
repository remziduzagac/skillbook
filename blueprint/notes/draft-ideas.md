# Notes: draft ideas from earlier projects

Ideas gathered on 2026-10-10 for skillbook's skill tree. They come from the person's own projects, each read for ideas rather than code, and from other skill collections ([../research/skill-collections.md](../research/skill-collections.md)). Everything here is a source to learn from: none of it is decided, and the projects themselves may be wrong, unfinished or abandoned. The tree drafted from it is [skillbook-tree.md](../ideas/skill-tree.md).

**Privacy:** this note describes the person's private projects and does not name them. Review it before the repository is published (D12).

## The sources

- **A private agent-workflow project**, and **an earlier one** before it: a design for agent knowledge work and the 13 tools meant to carry it, then a single-vault rethink. Offers skill writing, the learning loop, cooperation patterns, handoff.
- **A private notes system** and private agent-orchestration specs kept beside it: a vault run as a knowledge codebase with AI actions, and supervisors, experts and a message bus. Offers knowledge pipelines, propose → approve → apply, coordination roles.
- **Agent customisations:** the person's skills and modes for another agent program. Offers clarify, ideation, discuss and note-taking, all implemented.
- **Two private documentation systems:** spec-driven, with Cursor rules and commands. Offer intent routing, rule and command writing, cascading updates.
- **slipbox:** a notes app shared by people and agents over plain files. Offers safe writes, link conventions, context briefings.
- **trailscout:** a design-only search engine for agents. Offers design reviews, research with provenance, evaluation methods.
- **herdsman:** the person's fork of herdr. Offers fork upkeep, safe reproduction, a release flow.
- **A private narrative-game project:** the person's active project. Offers evaluation by fleets of agents, and turning findings into rules.

## What the projects teach about the tree

1. **An entry point routes by intent.** The private documentation system's dispatcher → manager → specialist, the agent customisations' discuss mode routing to clarify or ideation, herdsman's "What are you doing?" at the top of its skill, hyperframes' entry skill with a routing table.
2. **Depth only where it earns it.** The private notes system removed its Folio, Subject and Topic types and let tags carry the taxonomy; the private agent-workflow project kept "a flat namespace until volume forces tags".
3. **Each layer has its own job.** The earlier private agent-workflow project's ladder: always-on principles (AGENTS.md) carry the why, skills the when and how, checks what must be true, hooks what was missed. The private agent-workflow project: principles always on, skills on demand, prompts one-shot.
4. **Every skill serves a stated purpose.** trailscout: every part serves a pillar or is clutter. The private agent-workflow project: a library that is 80% engineering makes "skill" mean "dev procedure", so seed every topic.
5. **When to use, and when not: use the sibling.** The agent customisations' skills and the vault's skill files name the sibling to use instead.
6. **The description holds triggers only.** A description that summarises the steps gets followed instead of the skill (superpowers, agent customisations, the private agent-workflow project).
7. **The person decides at named points.** The private notes system, herdsman and the private documentation system each list where the agent stops and asks.
8. **One source, native shapes.** The earlier private agent-workflow project's "align, don't unify": keep each agent's native configuration, keep the content consistent; the second private documentation system generated each harness's files from one authored document.
9. **Scopes and overrides.** The private agent-workflow project's scopes (shipped, user, project), most specific wins; the agent customisations' common base plus profile overlays holding overrides only; a skill tells where it was resolved from.
10. **A mode holds the algorithm, a skill the invariants.** The agent customisations' discuss mode ran the steps; its skills were reference cards.
11. **Steps say how to check them.** The agent customisations' steps carry Action, Verify and If fails; herdsman's carry "Done when".
12. **Promotion and retirement are explicit.** A skill moves to a broader scope by decision; a retired one names what supersedes it (the private agent-workflow project).
13. **Skills are procedural memory.** The private agent-workflow project's layers: episodic (sessions), semantic (insights), procedural (skills), reference (documents), static (principles).
14. **The installed tool is the authority.** A skill teaches how to discover current syntax rather than freezing it (herdsman).

## Ideas by topic

### Agents

- **Skill writing.** The description is the trigger; explain why; a thin `SKILL.md` with bundled files; "Done when" on every step; a Gotchas section of real failures; one skill, one workflow; intake questions, a template and a checklist, saved only after the person confirms (the private agent-workflow project, agent customisations, the two private documentation systems).
- **Principles files.** `AGENTS.md` under about 200 lines, pointing to skills rather than holding procedures; never an `AGENTS.md` inside a folder that is copied into projects (the private agent-workflow project, agent customisations, the private narrative-game project).
- **Learning loop.** After a task, sort what was learned into a skill change, an insight, a decision, a session record, a note, or nothing; draft a skill from a session with approval; prune unused skills (the private agent-workflow project, its predecessor).
- **Cooperation patterns.** Handoff, inquiry, fan-out, multi-inquiry and discussion, each with a sender side and a receiver side (the private agent-workflow project).
- **Council.** Several agents answer one scoped question in posts; a spokesman sums up; the person, as authority, decides or asks for more; the raw posts stay visible (the private agent-workflow project, its predecessor).
- **Handoff.** Four fields: done, remaining, decisions, uncertain; references by path (the private agent-workflow project, its predecessor, agent customisations).
- **Supervisor and experts.** A supervisor delegates to experts and collects their reports (fan-in); roles such as coder, tester, searcher, researcher, analyst, scribe; "stuck" and "stale" timers (the private agent-orchestration specs).
- **Parallel writing.** One agent per file; a serial pass after a parallel one; re-read from disk after writing; prove invariants by diff; distrust confident findings until checked (the private narrative-game project).
- **Safe change.** Propose → approve → apply; a review status on what an agent touched; an edit scope of allowed paths; plan then apply for bulk edits; a checkpoint commit first (the private notes system, slipbox, the second private documentation system).
- **Verification.** Evidence before "done"; choose the verifier, autonomous or the person; every guardrail mechanically checkable; four upward checks: contradiction, duplication, drift, coverage (the private agent-workflow project, the private narrative-game project).
- **Conduct.** Ask before changes across many files; "what do you think?" means an opinion and a plan, then wait; raise concerns before implementing; never delete without confirmation (the private documentation system).
- **Packaging for many agents.** One command-line tool with thin per-agent adapters; a session-start context of about 100 tokens (trailscout).

### Engineering

- **Design reviews.** A consistency review by several read-only agents, one angle each, every finding cited and verified; a lean review (simpler without losing a capability) with proposers and adversarial verifiers; a model check that extracts state machines and data ownership and flags loose ends; a review of applied changes (trailscout).
- **Testing and debugging.** Test first; characterisation tests before a risky refactor; systematic debugging; a throwaway reproduction in a disposable environment, with an evidence list and one variable changed at a time (herdsman, and mattpocock, superpowers).
- **Code review.** Post the review on the work item; receive a review without performative agreement (the earlier private agent-workflow project, and superpowers).
- **Git.** Conventional commits proposed before committing; worktrees; finishing a branch (the private agent-workflow project, herdsman, and superpowers).
- **Forks.** Small marked hooks instead of edits, an import branch for upstream, merging an upstream release in seven steps with stop points for the person, a licence gate (herdsman).
- **Releases.** Notes, CI on the exact commit, a rehearsal as a private draft, fast-forward-only promotion (herdsman); greenrepo's territory.
- **Security.** Never run repository code by default; mark untrusted text in tool output (slipbox, trailscout).
- **Smaller ideas.** Frozen API contracts that only grow; multiplicative performance paths; a ledger of vendored patches (herdsman). Work breakdown into tracks, deliverables, acceptance criteria and risks (the private agent-orchestration specs).
- **Topic seeds.** Foundations, APIs, data, security, testing, observability, scalability, build and deploy, recovery, user experience, governance (the second private documentation system).

### Projects and design documents, feeding blueprint

- **Decisions land everywhere,** in the same change, guided by a table of which document answers which question (the private narrative-game project).
- **Write down, check up:** a level is outlined, then defined; deepen one vertical slice first; writing goes down, checking goes up (the private narrative-game project).
- **Notebook → rules:** record an observation, classify it, promote a rule and delete it from the notebook (the private narrative-game project).
- **Plan versus shipped:** keep the plan and add what shipped; the divergence is the useful part (the private narrative-game project).
- **Cascading updates:** up to the parent, then down through every layer, never skipping one (the second private documentation system).
- **Living blueprint:** spec → code → sync back (the private documentation system); blueprint's two-way sync already holds it.
- **A design document's life:** draft → in discussion → ratified → superseded; an open question needs a thread (the earlier private agent-workflow project).
- **Pillars and a numbered capability baseline** to judge proposals against (trailscout).
- **Spec completeness:** intent, function, location, scope, synchronisation (the private documentation system).
- **A scratch folder** that is not canonical; ideas are promoted out of it (the second private documentation system).

### Thinking

- **Clarify:** restate the request as intent, deliverable, constraints, acceptance and non-goals; ask one to five questions that change direction, each with a safe default; run only the checks that unlock a decision; decide or park (agent customisations).
- **Ideation:** an altitude guard, a frame, three to seven distinct options, intensify, trade-offs, a coherence check, decide or park; a thread map (agent customisations).
- **Discuss:** a no-code mode over threads and notes: an anchor note (current understanding), scribbles (history) and a final note (handoff); a discussion closes when every thread has its final note (agent customisations).
- **Thinking moves:** init, diverge, critique, simulate, gap detection, converge, calibrate, park (the private notes system).
- **Grilling:** interview in rounds over the design tree, each question with a recommended answer (mattpocock).
- **The altitude ladder:** idea, frame, options, feasibility, handoff (agent customisations).

### Knowledge

- **Capture:** an inbox of new, review and processed, with a daily rollover (the private notes system); a scratch file of `path:line` references for the next prompt (slipbox).
- **Ingest, extract, distill:** keep the raw source first (crate-first), make a card, extract a transcript, summary and key points, then distil atomic insights that link back to their source (the private notes system); record only valuable fragments (the private agent-workflow project).
- **Provenance:** every insight traces back to its source and asset (the private notes system).
- **Promote a note:** from scratch into reference, decision, skill or work (the private agent-workflow project).
- **Safe writes:** read the hash, write only if unchanged, never write blank text, append rather than rewrite, ask before touching notes with unsaved changes (slipbox).
- **Links and briefings:** write links in the folder's own style; brief on a topic from a note, its links and backlinks, with what was left out (slipbox).
- **Tidying:** broken links, orphans, frontmatter rules, document types by path, tags reused before new ones (slipbox, the second private documentation system).
- **Search lenses:** literal, structure, keywords, intent (the private agent-workflow project).
- **A vault layout:** inbox, crate, card catalogue, shelf, desk with tracks and threads, calendar, cabinet (the private notes system).

### Productivity

- **Meeting → actions:** decisions and actions with owner, due date and a verbatim quote; ambiguity flagged, never invented (the private agent-workflow project, the private notes system).
- **Reviews and chronicles:** daily, weekly and monthly roll-ups; a weekly review (the private notes system, slipbox, and gstack, alirezarezvani).
- **Close-out:** promote what is worth keeping, write a wrap-up, clean interim files, mark the work retired; harvest a thread's results (the private agent-workflow project, the private notes system).
- **Tasks:** a parent link for hierarchy, waiting versus blocked, a "today" list (the private notes system).
- **Updates and people:** stakeholder updates, one-to-one preparation, hiring rubrics, onboarding (the private agent-workflow project).
- **Templates:** daily, weekly and meeting notes (slipbox).

### Research

- **Write-ups with provenance:** every claim tagged read, ran, summary, memory, inferred or ours; a Gaps section; key claims validated; the full reports kept beside the write-up (trailscout).
- **Prior-art surveys:** clone and run the closest projects, check licences and activity, verify every citation; what to borrow, what is missing (trailscout).
- **Fair comparisons:** equal tuning effort, cold and warm runs apart, a sealed set, a pre-registered protocol, losses published (trailscout).
- **Evaluating with agents:** steps and tokens as the measure with success as a guard, a placebo arm (trailscout); fleets of agent testers with profiles, each profile answering one question, run in waves (the private narrative-game project).
- **Sweeps and defaults:** change one number, run many, print what moved; every number is a default that was tested and moved (the private narrative-game project).
- **Root-cause trees:** decompose symptoms into causes before building (the private agent-workflow project).

### Writing

- **Notes style:** date-first file names, a title that names the subject, noun headings, at most three levels (slipbox).
- **Editing passes:** each pass asks one question and may touch only named fields (the private narrative-game project).
- **A rule and its example:** a generic rule cites one reference example as calibration; the rule must survive deleting the example (the private narrative-game project).
- **Naming decisions:** a table of rejected words, the chosen one and why; two traps: naming a part after the whole, borrowing a word that means something else nearby (the private narrative-game project).
- **Guides for agents helping people** set up or troubleshoot a product (herdsman).
- **LLM-first writing**, "explain everything", conflicts with lean skill text (the two private documentation systems).

## What still needs a tool

- **Notes and search:** slipbox (notes over plain files) and trailscout (search for agents) remain tools; knowledge skills should work without them and use them when present.
- **Running several agents:** herdr and herdsman, which ship their own skills.
- **Transcription** of audio and video, for ingest; no tool was found in the projects.

## Vocabulary worth keeping

Pillar; provenance tags; plain fix versus call (a correction versus a decision for the person); verifier; council, spokesman, authority; handoff; fan-in; propose → approve → apply; crate-first; insight; compendium; track and thread; anchor, scribble, final note; park; altitude; micro-frame; profile; wave; outlined versus defined; vertical slice; promote and delete; default, not target; gotchas; undertrigger; closure ritual; hook and seam; throwaway session.

## Parked

- A document graph in a database (the second private documentation system's lattice): heavy for what it gives.
- The second private documentation system's ordering protocol: over-engineered.
- Product-specific guidance: tiered editions, state placement, per-file React blueprints (the two private documentation systems).
- The tool parts of the private agent-workflow project: council board, ledger, gateway, tmux interface.
