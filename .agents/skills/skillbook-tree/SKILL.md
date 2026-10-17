---
name: skillbook-tree
description: "How a skill is made and reviewed in the skillbook repository: the checklist every skill's design and SKILL.md is reviewed against, one home per rule, when to use each skill and when not, gaps stated, no restriction without a reason. Use when designing, writing or reviewing a skill in this repository, or checking designed skills against how skillbook's skills are written."
---

# skillbook-tree

How skills are made and reviewed in this repository; a project skill, never shipped in any set. It holds the review now; making a skill is added later (D77, D112).

## Rules

- **A review reads the whole skill:** its section in `blueprint/design/<root>.md`, or its `SKILL.md` once built; the decisions it cites, in `blueprint/decisions.md`, with the notes under them; and the skills it names or that name it.
- **Every finding is evidence:** the file and line, the check it fails, what is wrong, and a proposed fix. A finding that cannot name its line is not reported.
- **A review changes nothing.** It reports; the person decides what changes, as `AGENTS.md` says: agents propose, the person approves.

## Advice

- Read as a builder would: someone who has to write the skill from its design alone, with no access to the conversation that made it.
- A preference is not a finding. Report what fails a check, and say plainly when a check found nothing.
- Few strong findings are worth more than many weak ones; group findings that share one cause.

## Instructions

- **Reviewing a skill:** run checks 1 to 7 and 11 over it. For a skill with sub-skills of its own, run checks 8 to 10 as well, then review each sub-skill the same way. Several skills can be reviewed in one pass; report each separately.
- **Reviewing several roots at once:** one reviewer per root, each loading this skill, so findings stay independent; the findings are then checked before they reach the person.
- **Outside material:** adapted, never copied. What a skill takes from another collection or an earlier project is rewritten for skillbook's case, inside the skill, in a reference file of its own, or as a new skill where other skills need it too; no outside file is used as it is, and its licence is checked first (D30, D120).
- **Making or changing a skill:** not covered here yet. Follow "How a skill is written" in `blueprint/design/how-it-works.md`, then review the result with this checklist.
- **A skill's name, folder and place in the tree:** not covered here yet. Follow "Names" in `blueprint/design/how-it-works.md` and the tree in `blueprint/ideas/skill-tree.md`.

## The checklist

Checks 1 to 7 and 11 hold for every skill, leaf skills too; checks 8 to 10 also for a skill with sub-skills of its own.

1. **Every instruction names the skill it needs:** by its path within a root, through the main skill across roots, and through the other set's main skill, by name, across sets, with a short fallback where that set is not installed (D152).
2. **Nothing ambiguous, nothing contradictory, no unstated gap:** no instruction can be read two ways; none contradicts another skill's; every case the skill does not cover is named, with where to go: another skill, or the agent's own judgment.
3. **Comprehensive and exclusive:** every case in the skill's scope is covered or named as a gap; each rule and each concern has one home. A rule stated a second time is allowed only as a clear variation that names the rule it changes.
4. **No restriction without a reason:** "never", "only", "must not" appear only where something real is at risk, and say why. Nothing stops the agent from using several skills for one request.
5. **Musts apart from advice:** what is firm is stated as a rule, what is left to judgment as advice, and strong advice is marked as such. A number is advice, "about N" with its reason, unless the rule cannot be applied without it. Step-by-step detail appears only where agents are known to go wrong without it, and says so.
6. **The description:** says what the skill does and when to use it, and does not overlap a sibling's description.
7. **Tests:** each "when to use" and each "when not" has a test that can tell them apart.
8. **The sections, in order:** rules at the top, advice, instructions in the order the work happens, and the last instruction, what is done before anything is returned.
9. **Each sub-skill:** when to use it, when not, and what it gives back.
10. **Its own level:** if-then-else only where an order must be imposed, and nothing about how a sub-skill works inside.
11. **Cost:** every turn carries the whole context again, so the skill spends no tokens that do not buy quality (D142, D149):
    - **reading:** only what is needed, by searching first, reading parts and following pointers; nothing read twice;
    - **turns:** independent calls go together, and skills named for the same step are read in one turn; no check repeated without need;
    - **writing:** outputs rightsized, by conduct's rightsize; pointers where pasted content would do; no question to the person that is not truly open;
    - **delegation:** a step that should go to an agent goes through conduct's delegate; no fanout where a search would do;
    - **loading:** other skills reached only at the moment they are needed; the skill's own file short, with what only some work needs in a linked file;
    - **the main context:** no step pours large output into the main session; bulk goes to a named file;
    - **checks:** the cheapest evidence that would fail if the claim were false.

## The report

For each skill reviewed: its name; then each finding, with the file and line, the check by number, what is wrong and the proposed fix; then, in one line, the checks that found nothing.

Before returning the report, check each finding again: it names its line, it fails the check it cites, and it is not a preference.
