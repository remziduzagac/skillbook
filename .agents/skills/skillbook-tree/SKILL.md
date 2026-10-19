---
name: skillbook-tree
description: "skillbook's skill tree, and how a skill in it is placed, named, designed and reviewed: the shape every skill's design takes and the checklist it is reviewed against. Use when adding, moving, naming, designing or reviewing a skill in this repository, or checking designs against how skillbook's skills are made; not for writing a skill's files, which is skillbook-write's."
---

# skillbook-tree

skillbook's skill tree, and how each skill in it is placed, named, designed and reviewed. A project skill, never shipped in any set.

## Rules

- **Rightsized, above all:** every skill, design and review holds nothing missing and nothing extra for its reader: the agent that loads the skill, the builder who writes it from its design, the person who reads the review. Nothing missing: the reader can understand and act without asking again, since a missing part costs a question or a redo. Nothing extra: every part does work for the reader, and a part whose removal loses nothing goes, since an extra part costs attention and, in a skill, tokens on every turn it is loaded. The point comes first, then what it rests on, then the detail. Nothing a rule requires is cut, such as a reason, a "when not" case or a fallback.
- **One list for designing and reviewing:** a design is written to the checklist below, and a review checks it against the same list, so each rule of a skill's shape is stated once, here.
- **A review reads the whole skill:** its section in `blueprint/design/<set>/<group>.md`, or its file once built; the decisions it cites, in `blueprint/decisions.md`, with the notes under them; and the skills it names or that name it.
- **Every finding is evidence:** the file and line, the check it fails, what is wrong, and a proposed fix; a finding that cannot name its line is not reported.
- **A review changes nothing:** it reports, and the person decides what changes.
- **Outside material is adapted, never copied:** where an outside skill maps to one of ours, it is read before ours is designed, and what fits is rewritten for skillbook's case, inside the skill, in a reference file of its own, or as a new skill where other skills need it too, its licence checked first. No outside file is used as it is, since its rules are not skillbook's and its licence may not allow it.

## Advice

- Read as a builder would: someone who writes the skill from its design alone, without the conversation that made it.
- A preference is not a finding: report what fails a check, and say plainly when a check found nothing.
- Few strong findings beat many weak ones; group those that share one cause.
- Usually extra in a skill: the history of how it was decided, decision numbers, a rule restated from another skill, a pointer to a file that only repeats it, an example that teaches nothing, an option no case needs. Usually missing: the reason behind a rule, the "when not" cases, what a child gives back, the fallback where a skill is not installed, a test that tells two cases apart.

## Instructions

- **Placing or moving a skill:** the tree is `blueprint/design/skill-tree.md`, rendered from `blueprint/design/tree/tree.json`. A skill lives with the knowledge it needs, where the flow that calls it most runs, and other skills point to it; its name follows "Names" below.
- **Designing a skill:** a section in its group's design file, `blueprint/design/<set>/<group>.md`, with the fields every section there has, written to the checklist below; then reviewed. Write the design in plain English too, as skillbook-write's rule on plain English says, since the person and other readers may not be native speakers.
- **Reviewing a skill:** checks 1 to 7 and 11 to 13 for every skill; 8 to 10 as well for a skill with children of its own, then each child the same way. Several skills can be reviewed in one pass, each reported separately; several groups at once get one reviewer per group, each loading this skill, so findings stay independent, and the findings are checked again before they reach the person. The report gives, for each skill, its name, then each finding with its file and line, the check by number, what is wrong and the proposed fix, then one line naming the checks that found nothing. A finding names a pattern to fix in general, never a single case to special-case.
- **Trimming or filling an existing skill:** when it has grown, what does no work for its reader goes, with a list of what went and why; when it leaves its reader asking, what is missing is added, each addition with its source, and what cannot be found marked as a gap. Either is done on request, or proposed when noticed.
- **Writing a skill's files:** skillbook-write, this repository's other project skill.

## Names

- Skills you do are bare verbs; skills about something, the groups among them, are nouns. Leaf skills take short verbs or nouns, and a name is coined only where a plain word will not do.
- Each set's main skill is named after its set: `essentials`, `blueprint`, `softeng`, `authoring`.
- Inside a set, every other skill is a plain file under its set's main skill's `references/`, at its path, and its name is that path joined by dashes: `references/coordinate/delegate/fanout.md` is `coordinate-delegate-fanout`. A skill's own scripts and templates sit in `scripts/` and `assets/` inside the folder of the same name beside its file, so those two are never a child's name. The same name may appear in two sets, told apart by their set.
- Each set's main skill holds the name rule, worded exactly: "Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down. If a file cannot be read, look for it by its name in this skill's folder; if it still cannot be read, say so plainly and go on with your own judgment." A call names the skill and nothing more; for `organize-merge` the agent reads `references/organize.md` and then `references/organize/merge.md`, since a group skill holds the rules shared by everything under it.
- Each set's folder is `skills/<set>/` in the repository.
- The installed skills are the four main skills, named after their sets with no prefix; a clash with a person's own skill is caught by the install script, which never overwrites a folder it did not install.
- How a plain skill file opens, and how a design becomes files, are skillbook-write's.

## The checklist

1. **Every instruction names the skill it needs,** by name; a skill in another set by loading that set's main skill and then using the skill by its name rule, with a one-line fallback where that set is not installed. Each skill says only its own part of a piece of work: the caller when and what for, the doer how and what goes in, the keeper where and in what form; its word on where its result is kept, or in what form, is a one-line default.
2. **Nothing ambiguous, contradictory or unstated:** no instruction can be read two ways; none contradicts another skill's; every case the skill does not cover is named, with where to go: another skill, or the agent's own judgment.
3. **Comprehensive and exclusive:** every case in the skill's scope is covered or named as a gap; each rule and each concern has one home, in this skill or in a skill it tells the agent to follow, and a case one skill sends to another never comes back to it, directly or through others. A rule stated a second time is allowed only as a clear variation that names the rule it changes.
4. **No restriction without a reason:** "never", "only", "must not" appear only where something real is at risk, and say why; no stop, wait or "never" where going on with a note would serve, and an absolute only where its reason covers every case it forbids. Nothing stops the agent from using several skills for one request.
5. **Musts apart from advice:** what is firm is a rule, what is left to judgment is advice, and strong advice is marked: followed unless the case gives a reason not to, the departure said. A number is advice, "about N" with its reason, unless a rule cannot be applied without it. Step-by-step detail appears only where agents are known to go wrong without it, and says so.
6. **The description** says what the skill does and when to use it, and does not overlap a sibling's.
7. **Tests:** each "when to use" and each "when not" has a test that can tell them apart, and each trigger's test covers its near miss too, not only the obvious case. A test's prompt is never one of the skill's own examples, so a pass shows the rule, not a matched example.
8. **The sections, in order,** for a skill with children: rules at the top, the musts for its whole scope; advice; instructions in the order the work happens; and the last instruction, what is done before anything is returned.
9. **Each child:** when to use it, when not, and what it gives back.
10. **Level by level:** a skill with children opens like a node of a tree. At its top, only the rules and advice that hold for everything under it and have no skill of their own; then one line per direct child, saying when to load it. A child is loaded only when its step comes and opens its own children the same way, so nothing is read before it is needed. No grandchild is introduced in its own lines; an exception is stated with its reason, as respond is loaded for every response. This is about how a skill opens, not a limit on use: any skill may use any other skill or sub-skill by name when a step needs it. If-then-else only where an order must be imposed; nothing about how a child works inside, since a parent that does part of a child's work makes the agent stop at the parent; an instruction that grows complicated becomes a child of its own.
11. **Cost:** every turn carries the whole context again, so the skill spends no tokens that do not buy quality:
    - **reading:** only what is needed, by searching first, reading parts and following pointers; nothing read twice;
    - **turns:** independent calls go together, and skills named for the same step are read in one turn; no check repeated without need;
    - **writing:** outputs rightsized, by the first rule; pointers where pasted content would do; no question to the person that is not truly open;
    - **delegation:** a step that should go to an agent is delegated, on the lightest agent that does it well, briefed with pointers rather than pasted files; no fanout where a search would do;
    - **loading:** other skills reached only at the moment they are needed; the skill's own file short, with what only some work needs in a linked file, and a file that has grown trimmed, as "Trimming or filling an existing skill" says;
    - **the main context:** no step pours large output into the main session; bulk goes to a named file;
    - **checks:** the cheapest evidence that would fail if the claim were false.
12. **Actions, not tools:** the action is named, never the tool that does it: commit, branch, checkpoint, dry run, version control, never git, a command or a product, since the same action works with another tool. Tests may name a tool where the request or the project does, since a test is a concrete case; Material keeps its sources' names; rigs, whose skills are each about one program, is the exception. A capability the skill needs, such as version control, is declared in a main skill's `compatibility` field or a plain skill file's `Needs:` line, and in its design's Files line; without it, the skill says so in one line and stops that step, offering a fallback where one exists, and never installs anything itself, which is proposed to the person first, since it changes the machine and may run fetched code. How to drive a particular program, its commands, flags and gotchas, belongs to rigs; until rigs exists, the agent's own knowledge and the program's help.
13. **Triggers, exits and boundaries:** a rule that starts or skips something is a test the agent can apply, not a mood:
    - **trigger:** no judgment word such as "when not clear", which lets the agent decide in favour of acting; write a test instead, such as "if two likely answers would lead to different work or a different result, ask";
    - **exit:** "only", "skip", "no need" and "a clear request needs only that check" are taken eagerly, so each is narrow and says exactly when it applies;
    - **boundary:** each trigger has a case that qualifies and a near miss that does not, since each model draws the line where it likes without them: "add caching to the API" is not clear; "rename `foo` to `bar` in this file" is clear;
    - **varied examples:** examples come from different kinds of work, not only code, and a rule stated in several places gets a different example in each, since one repeated example teaches the example, not the rule.

## The last instruction

Before a review is returned, each finding is checked again against the rules above; before a design is shown, it is checked against the checklist.
