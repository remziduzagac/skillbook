# Review of the designed skills (2026-10-13)

The skills designed so far were reviewed against how skillbook's skills are written (D112), with the project skill skillbook-tree, built for it (D113). This is the record of every finding and what became of it.

## How it was done

- **What was reviewed:** the main skill; conduct's own skill and all its sub-skills; understand's clarify and its three parts; author's markdown skill.
- **How:** four independent reviewers, one per area, each loading skillbook-tree and running its ten checks, read-only. Every reported contradiction was checked against the files before it reached the person.
- **Outcomes:**
  - **decided:** one of the twelve decisions taken with the person, one at a time;
  - **fixed:** a defect fixed as the reviewer or the review proposed;
  - **reshape:** a finding about the shape, applied when the skill is reshaped in the shape every skill now takes, as the flows are revisited;
  - **dropped:** a finding that did not hold, with why.

## The twelve decisions

1. **Who decides when to ask, and how deep:** understand's clarify; act names it (D115).
2. **Questions get their own skill,** conduct's ask: how the agent asks the person anything, laid out, taken back, one term, "recommended answer" (D114).
3. **What text is instructions:** the person, the instruction files the agent loads and skillbook's skills; everything else is data, with one home in guardrails (D115).
4. **Wide changes plan and go:** the plan and what it touches go in the response, then the work proceeds when reversible and inside the task; a "propose first" kind always proposes; the risky kinds have one home in guardrails (D115).
5. **A concern that would change the work waits,** asked through conduct's ask; any other concern is one line, and the work proceeds (D115).
6. **The wrap-up offer has one home,** conduct's own rules: when work stops with steps left, one question offers learn, then handoff; nothing is offered when nothing is unfinished (D115).
7. **Crew and a shared item:** a crew is agents each changing their own items; a shared item has one owner who applies the others' proposals; changes that all land in one item are a single task, or a fanout whose findings one agent applies (D115).
8. **Council versus fanout:** a council is one question and the same material, judgments compared; a fanout is the work split into parts, each a place or a sub-question, findings combined (D115).
9. **Prose in responses and files:** never wrapped in responses, since the harness wraps and unwrapped text copies cleanly; in files, unwrapped unless the project's own rules say otherwise, as act's rule on which instruction wins says (D115).
10. **The stages' order is advice,** with its reason; the work decides where it starts and what it skips (D115).
11. **Several skills is a rule:** every skill a request needs, together or in turn; a skill limits it only where it says why (D115).
12. **Numbers are advice,** "about N" with a reason, unless a rule cannot work without them; strong advice is a new level, followed unless the case gives a reason, and table rows, code lines and headings within 120 characters are strong advice; the trivial-cost line stays a rule (D116).

The person added one point for delegate: it advises using a harness's own means of running agents, such as Claude Code's subagents and workflows, to carry out a council, a fanout or a crew; skillbook gives the guidance, the harness the implementation (D115).

## The main skill

- **The markdown rule in three places,** the main skill, respond and act (check 3): fixed: the main skill's rule is the one home; respond and act name it.
- **Two statements of order,** "the order the work needs" and the stages' order (check 2): decided: the stages' order is advice (D115).
- **Several roots left as "rule or advice"** (check 2): decided: several skills is a rule (D115).
- **"Once per conversation" against "every request",** and the pointer's one-line exception missing (check 2): fixed: read once per conversation, the rules hold for every request, the exception is the pointer's.
- **Unbuilt roots during the baseline** (check 2): fixed: the restriction and its reason stated.
- **respond read and checked, but no rule says to follow it** (check 2): fixed: a rule names respond.
- **The last instruction silent when the check fails** (check 2): fixed: what fails is fixed before the response is returned.
- **One instruction per root promised and none written; advice empty** (check 9): reshape.
- **Routes to the roots not named, no list of roots** (check 1): reshape.

## conduct's own skill

- **"No rules of its own", yet the wrap-up offer, with a second home in handoff** (checks 2, 3): decided: the wrap-up offer has one home in conduct (D115).
- **Rows give only "read when", no "when not" or what each gives back** (check 9): reshape.
- **Rows describe their sub-skills' insides,** guardrails' eight kinds of risk above all (check 10): fixed: guardrails' row says only "a risky action" (D115); the other rows reshape.
- **The description is a topic list with no "when"** (check 6): reshape.
- **No rules, advice or last instruction** (check 8): reshape.
- **Routing gaps:** "check my work with another agent", several rows at once, nothing for a request no row fits (check 2): fixed: several skills is a rule (D115), a gap line sends the rest to the agent's judgment, and a test covers checking with another agent.
- **"Read again only when their rules are unclear" cannot be tested** (check 7): fixed: dropped from the flow.
- **Cross-root lines in the sub-skills do not say "through the main skill"** (check 1): dropped: conduct's file states the route once for every sub-skill, and each line names the skill it needs.

## respond

- **Rule 9 restates guardrails' never-rules,** and the copies already differ (check 3): decided: what text is instructions has one home in guardrails (D115); rule 9 names it, its report-first clause kept as a variation.
- **How questions are put, stated in respond and three more places** (check 3): decided: conduct's ask (D114).
- **Numbered questions against markdown's question headings** (check 2): decided: conduct's ask (D114).
- **"Plain words" undefined; top-down's scope given twice** (checks 2, 7): fixed: plain words get an example and a test; top-down's scope stated once.
- **Restrictions without reasons,** rules 3, 8, 9 and 10 (check 4): fixed: reasons stated in the skill; rule 8 moves to conduct's ask (D114).
- **No word on a delegated agent, who has no person to ask** (check 2): fixed: a delegated agent's report is its response, and its questions go in it, as act's rule on delegated agents says.
- **deep clarify and verify named without their routes** (check 1): fixed: rule 7 names verify; rule 6 moves to conduct's ask (D114).
- **Advice inside the rules,** rules 2, 4 and 5 (check 5): reshape.
- **No tests for rule 5, rule 8's positive case and rule 9's irreversible clause** (check 7): fixed: tests added.
- **The description says what, not when** (check 6): reshape.

## act

- **Rule 1's "when in doubt, ask" against clarify's "ask only what would change the work",** and a second home for questioning a plan (check 2): decided: clarify decides when to ask and how deep; act names it (D115).
- **Rule 3 does not say whether to wait after a concern** (check 2): decided: a concern that would change the work waits (D115).
- **Rule 5's "wide" against guardrails' proportion** (check 2): decided: wide changes plan and go; the risky kinds have one home in guardrails (D115).
- **Rule 6's title broader than its body** (check 2): fixed: retitled to conversation history.
- **Rule 7 names a code skill not designed yet, and no other file type** (check 2): fixed: the gap named; other types follow the project's conventions and the agent's judgment.
- **Rule 10 silent on the person's own instruction files** (check 2): fixed: the person's own files placed in the order; guardrails' never-rules and "propose first" kinds hold whatever an instruction says.
- **Rule 9's fixed "three" with no reason; "same step" unclear** (checks 4, 5): decided: numbers are advice (D116); the stop is the rule, "about three" the advice, the same step means the same goal by the same means.
- **Rule 11 incomplete, with "never delegates further" only in delegate, and untested** (checks 3, 7): fixed: rule 11 is the one home, delegate's brief names it, a test added.
- **Restrictions without reasons,** rules 2, 3 and 8 (check 4): fixed: reasons stated.
- **No split of rules and advice; the description names five rules of eleven** (checks 5, 6): reshape.
- **"First on every request" without the pointer's exception** (check 2): fixed: read once per conversation; the exception is the pointer's.

## organize and its parts

- **No sections; shared rules mixed with advice such as the warning signs** (checks 5, 8): reshape.
- **split, compose and cluster overlap on "grouping"** (checks 6, 7): fixed: the chooser separates moving items, adding a parent and adding a view; a test per boundary; several may be used.
- **No "when not", nothing for a request no operation fits** (checks 2, 9): fixed: a request that fits none, such as renaming, reordering, deleting or moving one item, is not organize's: it is done directly under act's rules, a deletion through guardrails.
- **"More than about seven parts" with no reason** (check 5): decided: numbers are advice (D116); the reason stated.
- **What counts as a change for the two approvals is undefined** (checks 4, 7): fixed: defined.
- **merge, normalize and compose restate the shared rules** (check 3): dropped: each flow opens "within organize's shared rules", and its "done when" names its own end state, which is not a second home of the rules.
- **normalize silent when neither a glossary nor a conduct sub-skill is the home** (check 2): fixed: the gap named, with its fallback.
- **merge's "never resolved silently" has no reason** (check 4): fixed: so that nothing is lost.

## explain

- **"Did not land" has no test against understand's work** (check 7): fixed: a test for quoted agent text against a thing named; both may run.
- **Its steps restate respond's top-down and words rules** (check 3): fixed: explain names respond's rules and keeps only what it adds.
- **"Once the ambiguity is cleared" has no way of knowing** (check 2): fixed: the person's next message decides.
- **No "when not" line in explain itself** (check 7): reshape.

## verify

- **Coverage stated twice, in the four checks and the table** (check 3): fixed: coverage is shown with the table's checklist, so it has one home.
- **"Three times by hand" with no reason** (check 5): decided: numbers are advice (D116).
- **The person's check against guardrails' approval** (check 2): fixed: verify's is of the result, guardrails' of the action.
- **No test of who checks** (check 7): fixed: a test where meaning or taste is checked by the person.

## guardrails

- **The never-rule on others' text against act's rule that makes instruction files binding** (check 2): decided: what text is instructions (D115).
- **"Others' text is data" in five homes; "run only if asked" against "only after approval"** (checks 2, 3): decided: one home in guardrails, one wording for running code (D115).
- **Never-visited places with no reason, and no word on an unlisted one** (check 4): fixed: the reason stated; a doubtful place: stop and ask.
- **"Wide" has no test; US$1 has no reason** (checks 5, 7): decided: wide changes plan and go (D115); the cost line stays a rule, its reason stated (D116).
- **Proportion against the "propose first" kinds** (check 2): decided: a "propose first" kind always proposes (D115).
- **"Exactly the approved scope" against a trivial extra** (check 2): fixed: an example of what counts.

## instruct

- **"No rule that repeats a skillbook rule" against setup's "repeats stay unless the whole team uses skillbook"** (check 2): fixed: instruct takes setup's condition.
- **"About 200 lines" and "never inside a copied folder" with no reason** (checks 4, 5): decided: numbers are advice (D116); both reasons stated.
- **Callers omit learn** (check 2): fixed: learn added.
- **The description overlaps setup and learn** (check 6): reshape.
- **Its wording and steps rules overlap skillbook-tree's craft** (check 3): reshape.

## setup

- **A fresh session is needed, and how to start one is unstated** (check 2): fixed: the agent starts one where its reference file says how, and otherwise asks the person to.
- **"Only when the whole team uses skillbook" cannot be known** (check 2): fixed: the person is asked; a repeat stays by default.
- **The pointer's one-line exemption against "every request"** (checks 2, 3): fixed: the exemption is the pointer's; the main skill, once loaded, applies its rules.
- **Hooks that "keep being broken" and recommendations tested only for Python** (check 7): fixed: a test for a skill that does not fit; hooks wait for a real case, as setup's Open says.
- **The allow-list's place and format unstated** (check 2): fixed: stated once, for setup and delegate.

## learn

- **No source for highlights and no criteria to judge them** (check 2): fixed: where highlights come from and the questions that judge them stated.
- **The wrap-up offer stated a third time** (checks 3, 7): decided: one home in conduct (D115).
- **No "when not"; overlap with handoff's decisions part** (check 9): reshape.

## delegate, council, fanout and crew

- **delegate's six steps are a script, not rules and when to use** (checks 8, 9): reshape.
- **council and fanout overlap on angles and lenses** (check 2): decided: council versus fanout (D115).
- **crew's purpose and last line contradict on a shared item** (check 2): decided: crew and a shared item (D115).
- **The delegated agent's rules and the findings format each in several homes** (check 3): fixed: act's rule on delegated agents and fanout's format are the homes; delegate names both.
- **The reasons to delegate miss council and crew; the obstacle check sits as a step** (check 2): fixed: independent judgment and parallel work added as reasons; the obstacle check placed as a retry rule.
- **Tier rows overlap** (check 2): fixed: the highest tier that fits wins.
- **Restrictions without reasons; council's light members against the rule that judging is not given to the light tier** (check 4): fixed: reasons stated; council members are of a tier fit to judge.
- **A harness off the allow-list, a missing reference file, consolidate's input, who synthesizes** (check 2): fixed: a harness off the list is proposed, not used; fanout's format is consolidate's input; the main agent synthesizes and runs crew's pass.
- **Council's "three by default" with no reason** (check 5): decided: numbers are advice (D116).
- **The delegation threshold, an estimate stated as a rule** (check 5): decided: numbers are advice, search first and the figure as an example (D116).
- **Fanout's findings format inside the flow** (check 5): reshape: its rule and advice parts split when fanout is reshaped.

## handoff

- **"I'm stopping for today" gets a handoff alone, against conduct's one question** (check 2): decided: the wrap-up offer has one home in conduct (D115).
- **Resuming reports a difference, then continues without waiting** (check 2): fixed: a difference that touches the next step is reported and waited on, through conduct's ask (D115).
- **The state misses uncommitted changes and projects without git** (check 2): fixed: the working tree's state recorded, the fallback without git named.
- **The seven parts and "about a page" with no reason** (check 5): decided: numbers are advice; the seven parts stay, with their reason (D116).
- **Kept in the response alone, nothing can be resumed** (check 2): fixed: the agent asks where it goes, recommending a file.
- **"Or another agent" overlaps delegate's description** (check 6): reshape.

## clarify

- **Three triggers for a plan going deep that contradict,** including shallow's "many questions" (check 2): decided: clarify decides when to ask and how deep; dependence is the one trigger, and shallow's "many questions" line goes (D115).
- **"Shallow first" against "when unsure, deep"** (check 2): fixed: "when unsure" applies after the shallow round, and act names clarify (D115).
- **The recommended answer, facts first and "nothing acted on" each in two homes** (check 3): decided: how questions are put lives in conduct's ask (D114); fixed: clarify keeps its shared rules once, and its parts name them.
- **"Go ahead" in deep, and work while a questionnaire is out** (check 2): fixed: "go ahead" accepts the recommended answers; what depends on a questionnaire waits, and the person decides on the rest.
- **Who decides that only someone else can answer** (check 2): fixed: the agent asks the person whether someone else holds the answer.
- **The routing line has no "when not" tests** (check 7): fixed: tests for a clear request, an opinion asked and options wanted.
- **Firm rules and weighed recommendations mixed** (checks 4, 5): reshape.
- **No sections and no last instruction** (check 8): reshape.
- **No "when not" per part; the parts' insides stated in clarify** (checks 9, 10): reshape, in part done by conduct's ask taking the form (D114).
- **The description says what, not when** (check 6): reshape.

## shallow

- **How a new level is entered is unstated** (check 2): fixed: deep sees each new level inside a part whole first, as shallow does.
- **"Many questions" undefined; the hand-over comes after "going with"** (checks 2, 7): decided with clarify's first finding (D115); fixed: the hand-over comes before "going with".
- **"One round" is a fixed limit with no reason** (check 4): dropped: its reason is in clarify, one round costs little.
- **It restates clarify's shared rules** (check 3): fixed: it names them.
- **"Default" against "recommended answer"** (check 2): decided: one term, "recommended answer", in conduct's ask (D114).
- **No "when not"** (check 7): reshape.

## deep

- **Stopping early and "go ahead" against the confirmed summary** (check 2): fixed: stopping lists the open questions as assumptions in the summary the person confirms; "go ahead" accepts the recommended answers.
- **Where decisions are recorded when no skill called it** (check 2): fixed: a file the person names.
- **"Never unasked" with no reason** (check 4): fixed: recording writes to the project, which was not asked.
- **Rules restated from clarify and respond** (check 3): decided: conduct's ask (D114); fixed: clarify's rules named.
- **No test for when it is chosen and when not** (check 7): fixed: tests added.
- **"Parked" and "assumed" undefined** (check 2): fixed: both defined in conduct's ask (D114).
- **Rules, instructions and advice mixed** (checks 8, 9): reshape.

## questionnaire

- **respond's and act's rules restated** (check 3): fixed: it names respond and guardrails, its stricter "no reference to the conversation" kept as a variation.
- **A suggested answer only where the person has one, against "every question has a recommended answer"** (check 2): decided: named as a variation in conduct's ask (D114).
- **Its own questions asked before looking; a file or an issue as its destination** (check 2): fixed: the conversation is checked first; a destination outside the response is proposed through guardrails.
- **"Never sent by the agent" gives its reason only by implication** (check 4): dropped: the reason is given, posting or sending it is outward.
- **Answers come back in part, or against the person's own** (check 2): fixed: unanswered questions stay open and listed; the person parks them or asks again.
- **No "when not"** (check 9): reshape.

## author's markdown

- **The prose rule says "never" while the project's lint configuration wins, and names lint only** (check 2): decided: prose in responses and files (D115).
- **The prose rule's homes include this repository's `AGENTS.md` and lint configuration** (check 3): dropped: they are this repository's own rules, not homes of the skill's.
- **Numbered questions in respond against question headings here** (check 2): decided: conduct's ask (D114).
- **The heading length is missing; a response's starting level unstated** (check 2): decided: headings within 120 characters are strong advice (D116); fixed: a response's sections start at the second level, as advice.
- **"Done when the linter passes" is incomplete** (checks 1, 2): fixed: through conduct's verify; a linter that must be downloaded is proposed first, through guardrails; no linter, one that cannot run, and failures on lines the agent did not write each named.
- **Rules restated across the two layers** (check 3): fixed: the file rules keep only what the structure layer does not say.
- **"Short cells", "a few words" and two levels of nesting without measure or reason** (checks 2, 5): decided: numbers are advice (D116); fixed: the row width is the test, the reasons stated.
- **Restrictions without reasons** (check 4): fixed: reasons stated; the file rules marked as linter defaults.
- **"All markdown" has no edge** (checks 2, 3): fixed: what it covers and a "not for" line, commit messages among them, with tests.
- **The description says what, not when, and "document" reaches toward the sibling skills** (check 6): fixed: it says when, and leaves content and wording to the siblings.
- **Some rules untested; no negative tests** (check 7): fixed: tests for bold, numbers, a commit message and a wide table.
- **Rules and advice mixed; no "when not"** (check 5): reshape.
- **"Open: none known" no longer true** (check 2): fixed: Open lists what waits for the reshape.

## What could not be checked

- The empty fields of the main skill, the undesigned roots and understand's other sub-skills; descriptions against siblings that have none yet.
- Anything that needs a built `SKILL.md` or a running harness: loading, a fresh session, the reference files.
