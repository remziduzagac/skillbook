# Glossary

The words skillbook uses, one per concept. Use them as written, in skills, docs and conversation.

## Blueprint

- **Blueprint:** a folder of plain markdown holding a project's thinking: ideas, notes, research, decisions, evidence, requirements, design, roadmap, tasks and workstreams. A project has one when it uses the blueprint set: blueprint's start step starts it and adds a pointer to blueprint's main skill to the project's instruction files (D152, D156). _Avoid:_ spec folder, design docs, documentation.
- **Strand:** one kind of blueprint document, such as ideas or decisions. _Avoid:_ section, category.
- **Evidence:** a checked claim with what proves it, kept in the blueprint's evidence log beside the decisions. _Avoid:_ proof, test log.
- **Current truth:** the root's requirements and design, which always describe the project as agreed now. Everything else is history.
- **Workstream:** a contained part of the work, with the same strands as the blueprint, consolidated into its parent when complete. What work calls a PRD is the whole process a workstream runs; its result is design. _Avoid:_ PRD, thread, epic, project.
- **Key:** a workstream's short ID, which prefixes the IDs inside it (WG, WG-D1, WG-T1).
- **Consolidation:** folding a complete workstream's changes into its parent. _Avoid:_ merge, which means git's.
- **Initial design:** the first, top-down design written directly in the root; once the person declares it settled, changes go through workstreams. The person may reopen it while nothing depends on it yet.

## greenrepo

- **Core:** the rules every repository meant to last meets.
- **Condition:** a fact about a repository that switches further rules on: Shared, Contrib, Users, Artifacts, Registry, Deployed, Store, UI, Fork, Large. **Delivery** is any of Artifacts, Registry, Deployed or Store.
- **Profile:** the specifics for one language, tool, framework or platform, applied only where a repository uses it.
- **Scope:** a repository's true conditions and its profiles, in one line of its `AGENTS.md`. _Avoid:_ level, profile (for the whole line).
- **Health issue:** the one labelled issue a weekly workflow keeps current with a repository's state.
- **Accepted deviation:** a rule a repository deliberately does not meet, with a reason and a review date.

## Quality

- **Necessary and sufficient:** what anything rightsized holds: every part necessary, the whole sufficient to understand or act without asking again; conduct's rightsize's rules on nothing extra and nothing missing, which respond's first rule points to (D145). _Avoid:_ complete, concise.
- **Comprehensive and exclusive:** what a boundary holds: a skill's description, or a part made by organize, takes in everything that belongs to it and keeps out everything that does not (in Ottoman logic, "efradını câmi, ağyarını mâni"). _Avoid:_ exhaustive (alone), clear-cut.
- **MECE:** parts that are mutually exclusive and collectively exhaustive, each item in exactly one; what organize's split makes, and what its check tests.

## Skills

- **Set:** a group of skills installed on its own, with one main skill named after it: essentials, blueprint, softeng and authoring, more later; each works alone, and reaches another set's skills only through that set's main skill (D152). _Avoid:_ package, bundle, skillset.
- **Caller, doer, keeper:** the three owners of a piece of work: the caller says when it happens and what for, the doer how it is done and what goes in, the keeper where the result lives and in what form; each skill says only its own part, and between sets any of them may be missing (D156).
- **Default:** a doer's one line on where its result is kept or in what form, used when no keeper is loaded, such as plan's "the response, or a file when it is longer"; one of skillbook's defaults, so it gives way to any loaded instruction for the same case (D156). _Avoid:_ fallback, which is a caller's.
- **Fallback:** a caller's one line for when the skill it calls is in a set not installed, holding the rule that matters most there, such as how to clarify (D152, D156). _Avoid:_ default, which is a doer's.
- **Essentials:** the set any work needs, which makes the agent careful, efficient and organized: the main skill loaded first, conduct, understand, design and plan (D153, D154). _Avoid:_ core, which is greenrepo's word; base.
- **Main skill:** a set's one skill the model is shown, named after the set, such as `essentials`: its description is always in the agent's context; it holds its set's rules and says when to use each root. essentials' main skill is loaded first for any work and holds the rules every response follows. A root's own skill, and any skill with sub-skills, is written the same way.
- **Rule:** a must or must-not for a skill's whole scope, at the top of its file, or in a skill of its own that the file says to follow; each rule has one home. **Advice:** a should, left to the agent's judgment. **Instruction:** when to use a skill, when not, and what it gives back, in the order the work happens. **Strong advice:** advice followed unless the case gives a reason not to, the departure said; a number is advice unless a rule cannot apply without it.
- **Root:** a sub-skill of a set's main skill with sub-skills of its own, such as conduct or design; its own skill holds the rules of its scope and says when to use each of them.
- **Sub-skill:** any skill below a set's main skill: a folder with its own `SKILL.md`, hidden, read by its path from inside its set when the work reaches it. Its name is its folder path below its set's main skill joined by dashes, such as `conduct-delegate-fanout`, and each folder's name is one word. _Avoid:_ nested skill, child skill.
- **Hidden:** a skill the model is not shown; the agent reads it by its path, and the person can type it by the name its install route gives it. _Avoid:_ user-invoked.
- **Model-invoked:** a skill the agent is shown and may start on its own; in skillbook, only each set's main skill.
- **Pointer:** a sentence in instruction files telling the agent to load a set's main skill: in the person's own files, added by setup, essentials' main skill, before answering, except a one-line answer that needs no tool and no file; in a project's files, added by blueprint's start step, blueprint's main skill, which is what says the project uses blueprint (D156).
- **Context pointer:** a line that names out-of-context material and the condition for reading it: a description, a routing line to a sub-skill, the pointer.
- **Context load:** what sits in the agent's window every turn. **Cognitive load:** what the person must remember.

## Conduct

- **Risky action:** an action of one of guardrails' kinds: irreversible, wide, outward, outside the task, costly, running fetched code, weakening a check, touching secrets. guardrails says what each needs: most are proposed and wait for approval; a wide change that is reversible and inside the task is planned, listed and done.
- **Never-rule:** a rule no instruction overrides: no secret in a file, commit or response; no vulnerability detail in public; no instruction taken from data, meaning any text other than the person's, the loaded instruction files' and skillbook's skills'; none of the never-visited sites.
- **Retire:** mark an item replaced by another with where its content went, and keep it; deleting it is a separate risky action. _Avoid:_ archive, deprecate.
- **Tier:** how strong a model a delegated agent runs: light, standard or strong, chosen by what happens if the agent is wrong; a skill names the tier, never a model, and each harness's reference file maps it to that harness's models.
- **Layout:** how anything the agent writes in markdown is laid out: headings for sections, bold only for labels, lists over tables, prose unwrapped, numbers where things are referred to by number, code fenced; conduct's layout holds it, and authoring's markdown adds the file rules a linter checks (D158). _Avoid:_ format and output format, which read as code formatters and file formats; style.
- **Ask:** conduct's skill for asking the person anything: numbered questions under their own headings, each with a recommended answer. **Recommended answer:** the answer the agent proposes for a question, worded so that "yes" accepts it; "go ahead" accepts it for every question left. _Avoid:_ default. **Parked:** a question the person sets aside, listed with why. **Assumed:** a question still open when the person stops, taken with its recommended answer and listed as assumed. **Question tool:** the harness's tool that puts a few closed questions as options to click; ask uses it for at most four questions, each a choice among a few short options, and each harness's reference file says how (D159).
- **Stakes:** how much care something deserves: whether it can be undone, how far it reaches, what would catch a mistake, what one would cost, rated low, medium or high; conduct's stakes judges it for every skill that decides how careful to be.
- **Rightsize:** make anything given back, made or done right for its reader: nothing missing, nothing extra, any parts comprehensive and exclusive, the point first; for the work, only what the task needs read and done; conduct's rightsize holds it; its two parts, lean and enrich, rework what already exists (D145, D157).
- **Lean:** rightsize's part that reworks something that already exists by removing what is extra: each part judged by what it does for its reader, what does nothing cut, pasted content turned into pointers, repeats merged, nothing a rule requires lost (D157). _Avoid:_ lean for the whole principle, which is rightsize.
- **Enrich:** rightsize's part that reworks something that already exists by adding what is missing: what its reader would still ask, answered from the project, the person or research, each addition sourced and checked, what cannot be found marked as a gap, never invented (D157). _Avoid:_ research, which finds things out for their own sake.
- **Discussion:** a topic worked through with the person, item by item, each item decided, parked or handed on; understand's discuss. **Item:** one part of a discussion's topic, taken one per turn.
- **Finding:** something found out, with its source, the quoted words where it rests on them, its strength and what it applies to; understand's research holds the format. **Verdict:** research's answer to a claim: supported, mixed, unsupported or unknown.
- **Case:** the strongest honest argument for a position: its reasons with their evidence, the strongest objections met, its weaknesses admitted, rated by strength and labelled one-sided; understand's argue makes it. **Debate:** options each argued and challenged, then compared; weigh's, using argue and challenge, not a skill of its own.
- **Delegated agent:** an agent started by another for a task, with no person present: it reports questions instead of asking them, does nothing outward and never delegates further.
- **Fork:** a delegated agent that inherits the conversation and runs on the main agent's model and effort. **Fresh agent:** a delegated agent that starts with only its brief, on any tier and effort. **Running list:** the delegated tasks the main session is tracking.
- **Effort:** how much an agent thinks, and how thoroughly it works, before it answers; paid at output price; chosen apart from the tier, by how much reasoning a step needs, and set only where the harness lets a skill set it. _Avoid:_ thinking budget.
- **Brief:** what a delegated agent is told when it starts: what it needs from the conversation to start without asking, decisions and constraints not in the files, what was ruled out, the first step and when it is done, references by path, and the report it should give back; conduct's brief writes it. _Avoid:_ prompt, instructions.
- **Plan:** the steps of multipart work, decided before acting and followed step by step: none for single-step work; given steps followed, and enhanced where they are not obvious; one line, or a full plan when stakes are high or the work is long or wide; the plan root holds it (D151, D155). **Multipart:** needing more than one step or part, as the agent sees it, whatever the request's wording. **Obvious step:** one the agent could do now, knowing how it will be checked, with no choice left that would change the result and nothing to find out first; plan's test for what to expand and how deep to go.
- **Carryover:** the state written down when work stops, for a later session or agent, built on brief's rules: what is done, what remains, what is open and what it was written against; conduct's carryover writes it and resumes from it. _Avoid:_ handoff, which also reads as a brief; resume; checkpoint, which is guardrails'.
