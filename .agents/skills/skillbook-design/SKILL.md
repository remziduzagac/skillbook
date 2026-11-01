---
name: skillbook-design
description: "How skillbook's skills are placed in the skill tree, named, designed and reviewed: the shape every skill's design takes and the checklist it is reviewed against. Use when adding, moving, naming, designing or reviewing a skill in this repository, recording wording already agreed included, or checking designs against how skillbook's skills are made; not for writing a skill's files, which is skillbook-write's."
---

# skillbook-design

## Purpose

Helps you place, name, design and review skillbook's skills and guides, so each one has one clear home, a shape every reader knows, and a design a builder can follow without asking again. It holds the checklist that designs are written to and reviews check against. A project skill, never shipped in any set.

## Rules

- **Rightsize every skill, design and review for its reader.** Write for the loading agent, builder using a design or user reading a review. Include enough to understand and act without asking again. Missing parts cost questions or rework. Remove parts whose removal loses nothing. Extra parts cost attention and, in skills, tokens on every loaded turn. Put the point first, then its basis, then detail. Keep every required reason, "when not" case and fallback.
- **Use the same checklist to design and review.** Each shape rule then has one home below.
- **Read the whole skill for a review.** Read its section in `blueprint/design/<set>/<group>.md`. Compare built files against that design and amendments under cited decisions. Account for every required rule, route and fallback. Read cited decisions and their notes in `blueprint/decisions.md`. Read skills it names and skills naming it.
- **Give evidence for every finding.** Name file and line, failed check, problem and proposed fix. Report no finding without a line.
  - For something missing, name where it should be and the search that found nothing.
- **Report without changing anything in a review.** The user decides the changes.
- **Adapt outside material; never copy it.** Read an outside skill before designing ours where they map. Check its licence first. Rewrite fitting ideas for skillbook inside the skill, in its own reference file, or as a new shared skill. Use no outside file as-is. Its rules are not skillbook's and its licence may forbid it.

## Advice

- Read as a builder would: someone who writes the skill from its design alone, without the conversation that made it.
- A preference is not a finding: report what fails a check, and say plainly when a check found nothing.
- Few strong findings beat many weak ones; group those that share one cause.
- Usually extra: decision history or numbers, repeated rules, pointers to files that only repeat them, examples teaching nothing, and options no case needs. Usually missing: reasons, "when not" cases, child results, fallbacks for uninstalled skills, and tests distinguishing cases.

## Instructions

- **Place or move a skill with the knowledge it needs and where its most frequent calling flow runs.** The tree is `blueprint/design/skill-tree.md`, rendered from `blueprint/design/tree/tree.json`. Other skills point to its home. Follow "Names" below.
- **Write a design section in `blueprint/design/<set>/<group>.md`.** Use that file's fields and the checklist below. Review it next. Follow skillbook-write's Plain English rule: the user and other readers may not be native speakers.
- **Reviewing a skill: check every guide and main skill against checks 1–9 and 11–13.** Add check 10 for parents. Review each child the same way.
  - Several skills may share a pass. Report each separately.
  - For several groups at once, use one reviewer per group, each loading this skill, so findings stay independent. Recheck their findings before they reach the user.
  - Report each skill by name, then its findings. Each finding names file and line, check number, problem and fix. Name a general pattern, never a single case to special-case.
  - Add one line naming the checks with no findings.
  - End with coverage: what was reviewed, which checks applied and what remains unverified.
- **Trimming or filling an existing skill: show the change list first.** End the turn for approval, by essentials' `act-rightsize` approval rule. Unseen cuts can drop requirements. Unseen additions can lack design support. Apply only approved changes.
  - For a grown skill, list what goes and why.
  - For a skill leaving questions, list additions with design sources. Mark unsourced additions as gaps for the user to settle in the design. Write no rule or default for a gap meanwhile.
  - A trim or fill request is not approval of the list. Show it first. Offer the list if you noticed the need unasked.
- **Writing a skill's files:** skillbook-write, this repository's other project skill.
- **Last, always: recheck every finding against the rules before returning a review.** Check a design against the checklist before showing it.

## Names

- Name skills you do with bare verbs. Name skills about something, including groups, with nouns. Give leaves short verbs or nouns. Coin a name only when no plain word works.
- Each set's main skill is named after its set: `essentials`, `blueprint`, `softeng`, `authoring`.
- Put every non-main skill in a plain file under the main skill's `references/`. Call it a **guide**: only the main skill is a skill in the harness's list, and a guide called a skill makes agents look for it there. The six first-level guides are the **main guides**. Join its path with dashes for its name: `references/coordinate/delegate/fanout.md` is `coordinate-delegate-fanout`. Put its scripts and templates in `scripts/` and `assets/` inside a same-named folder beside its file. Neither folder can be a child name. Sets distinguish identical names across sets.
- Copy this name rule word for word into every main skill: "Names: a guide named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, go on with your own judgment, and name the file in your final answer." Put it in the main skill's guide map, beside every first- and second-level guide's path. Guides name each other by name, with the word "guide" where a bare name could be read as a skill, such as "the `act` guide"; paths appear only in the map. For `organize-merge`, read `references/organize.md` then `references/organize/merge.md`. A parent holds rules shared by everything below it.
- Each set's folder is `skills/<set>/` in the repository.
- Install the four main skills under their set names without prefixes. The install script catches clashes with personal skills. It never overwrites a folder it did not install.
- How a guide's file opens, and how a design becomes files, are skillbook-write's.

## The checklist

1. **Name every needed guide.** A set may name `essentials` and the sets it builds on: load that skill, then use its name rule, with a one-line fallback if it is not installed. `essentials` names no other set, since it is installed on its own and cannot know which sets exist. Where another kind of work comes up, it says generically to use a skill in the harness's list that covers it, such as code or documents, and what to do otherwise. Each skill says only its part: caller for when and why, doer for how and inputs, keeper for location and form. Give location or form as a one-line default.
2. **Remove ambiguity, contradictions and unstated cases:**
    - **one reading:** give each instruction one reading. Contradict no other skill;
    - **gaps named:** name every uncovered case and its destination: another skill or the agent's judgment;
    - **overlaps ordered:** say which category wins when two fit. Otherwise one case gets two answers;
    - **boundary changes:** check positive routes, exclusions, callers and paired tests together. A boundary moved in only one place leaves two homes or none. When a rule changes what the agent does, find the cases whose rubric expects the old behaviour and update them with the rule.
3. **Cover the scope without overlap:**
    - **coverage:** cover every in-scope case or name it as a gap;
    - **one home:** give each rule and concern one home, here or in a called skill. Never send a case back to its caller, directly or through others. Restate a rule only as an explicit variation naming the rule changed;
    - **shared terms:** use another skill's whole definition, such as parked or assumed. Otherwise give the exception and why. Partial definitions quietly change the source rule.
4. **Give a reason for every restriction.** Use "never", "only" or "must not" only for a real risk. Do not stop or wait where a note would serve. An absolute's reason must cover every forbidden case. Allow several skills for one request.
5. **Separate musts from advice:**
    - **rule or advice:** mark firm requirements as rules and judgment as advice. Mark strong advice: follow it unless the case gives a reason not to, and say when departing;
    - **numbers:** use "about N" as advice with a reason. Make a number firm only if the rule needs it to work;
    - **step by step:** give detail only where agents are known to fail without it. Say why;
    - **presentation:** make formats, heading levels and widths defaults. Give way to the medium and user preferences.
6. **Describe what the skill does and when to use it.** Do not overlap a sibling's description.
7. **Check the tests:**
    - **told apart:** test each "when to use" against its "when not". Cover near misses, not just obvious triggers;
    - **held out:** use prompts unlike skill examples. A pass must show the rule, not an example match;
    - **can fail:** name a plausible wrong behaviour each test rejects. A test that cannot fail measures nothing;
    - **every aspect:** design a test for every rule, advice item, step, boundary line and final check. Otherwise give a reason, such as behaviour visible only in a live session. Untested aspects can break unseen;
    - **kinds kept apart:** distinguish designed tests (design's Tests list), executable cases (`tests/cases/`) and observed results (decision's Tested line). Never report one as another.
8. **Give every guide the same shape,** so a reader finds each part in the same place:
    - `# <name>`, then `## Purpose`: what the guide is for and what it achieves, in a sentence or two. `Needs:` follows, only if the guide needs a capability, with its fallback;
    - `## When to use`, `## When not` and `## Gives back`, by check 9;
    - `## Rules`, only if the guide has musts: each a bold must, then its reason;
    - `## Advice`, only if it has advice. Strong advice is marked inside it, not in a section of its own;
    - `## Instructions`, always: it opens with its goal and one clear instruction, then numbered steps, each a bold action, why it matters, and how. Steps are guidelines by default, to fit into the harness's own flow; a step that must not move, such as approval before a change, says so in its own words. The last step is the check before anything is returned, marked to come last, always: a separate section would repeat the end of the steps.
    - A main skill follows the same order after its frontmatter, with its guide map between Advice and Instructions.
9. **Give each guide its own boundary at the top of its file:** "When to use", "When not" and "Gives back".
    - **When to use:** the need the skill meets, as a test the agent can apply, with a qualifying example. Give the timing where it matters, such as "before the first change".
    - **When not:** each near case, with what fits better instead and why: another skill by name, or the agent's judgment.
    - **Gives back:** what the skill returns, and whether the user sees it.
    - A main skill has none of the three sections: its description says when to load it, and its map holds the others' boundaries.
    - The file is the source. The main skill's map summarises it in 1 to 3 sentences: what the skill helps with, when it is needed, and what fits better in a near case. Change both together.
    - Keep the skill's rules and instructions in line with its boundary. Do not repeat a trigger test in a rule.
10. **Make a parent a flow, not a router.** The main skill's map is where the agent chooses skills. The agent reads each path top-down and each file whole.
    - At a parent's top, keep only rules and advice shared by everything below and lacking their own skill.
    - Give each direct child one line: its name and its purpose. Introduce no grandchildren there.
    - Use if-then-else only to impose order. Leave child internals to the child. A parent doing the child's work makes the agent stop there. Turn complicated instructions into children.
    - Any guide may use any other guide when needed.
    - A main skill holds the guide map: one entry per main guide and per guide under it, with its path, what it is for, when to use it and when not. It may pass about 100 lines where the map needs it, with the reason in its design.
11. **Spend tokens only where they buy quality.** Every turn carries the whole context again:
    - **reading:** search first, read needed parts and follow pointers. Read nothing twice;
    - **turns:** combine independent calls. Read skills for the same step in one turn. Repeat no check without need;
    - **writing:** rightsize outputs by the first rule. Use pointers where they replace pasted content. Ask no question that is not truly open;
    - **delegation:** delegate steps that should go to an agent. Use the lightest capable agent. Brief with pointers, not pasted files. Do not fan out when a search suffices;
    - **loading:** reach other skills only when needed. Keep the skill file short. Put work needed only sometimes in linked files. Trim grown files by "Trimming or filling an existing skill";
    - **the main context:** put bulk output in a named file, not the main session;
    - **checks:** choose the cheapest evidence that would fail if the claim were false;
    - **evidence quality:** fit evidence to the claim. Use file and line for project contents, an observed command and output for behaviour, and a current, authoritative source for outside facts. A source alone does not prove support. Passing tests do not prove nothing needed was lost: public interfaces, documented behaviour and untested requirements count too.
12. **Name actions, not tools:**
    - **naming:** say commit, branch, checkpoint, dry run or version control, not git, a command or product. Actions work with other tools. Tests may name tools when the request or project does: they are concrete cases. Material keeps source names. The `rigs` skill is the exception: each of its skills covers one program;
    - **capabilities:** declare needed capabilities, such as version control, in main `compatibility` or plain-file `Needs:`, and the design's Files line. Without one, say so in one line. Stop that step. Offer a fallback if available. Install nothing yourself. Propose it and end the turn: installation changes the machine and may run fetched code;
    - **programs:** put commands, flags and gotchas in the `rigs` skill. Where it is not installed, use the agent's knowledge and the program's help.
13. **Give starts and skips a test the agent can apply, not a mood:**
    - **trigger:** replace judgment words such as "when not clear", which let the agent choose acting. Give a test: "if two likely answers lead to different results and the choice is about intent, ask";
    - **exit:** make "only", "skip", "no need" and "a clear request needs only that check" narrow and exact. Agents take these eagerly;
    - **boundary:** give each trigger a qualifying example and a near miss. Otherwise models draw their own lines. "Write the announcement for the release" leaves the audience open. "Rename `foo` to `bar` in this file" leaves nothing;
    - **who decides:** ask the user about intent, taste, hard-to-undo choices and facts only they know. Make choices settled by project conventions or reversible defaults. If the result rests on your choices, show a "going with" message. End the turn before changes. Choices seen afterward are too late to correct. A line paired with continuing work ends up in private thinking.
      - If the user told you to choose or just answered your questions, go ahead. Put the line in the final answer.
      - Give mixed choices to the user. Reversibility settles only what they left to the agent.
      - Judge undo by consequences, not just files.
      - Show choices the result rests on, not every minor one;
    - **one action:** give each trigger one visible action, such as "end the turn", as skillbook-write's Sharp instructions rule says. Search the skill for a message paired with going on, such as "say … then go ahead", "show … and start" or "write the line and continue". Report each one, with a fix in one of two shapes: show it and end the turn, or put it in the final answer. Pairing soft and strong actions loses the soft one;
    - **proportion:** scale questions, confirmations and checks to stakes, undo and whether work is a deliverable or intermediate. Use a light path for routine work. Heavy paths everywhere cost turns and attention for little. Keep mandatory checks, such as secrets and irreversible actions, cheap on every path. Scale only the rest;
    - **varied examples:** draw from varied work, not just code. Give a different example at each repetition of a rule. Repeated examples teach the example, not the rule.
