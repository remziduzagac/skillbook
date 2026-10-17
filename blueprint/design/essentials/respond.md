# Design: respond

What a builder needs for respond, essentials' group for everything said to the person: respond's rules, layout, ask and explain (D179); ideas not yet decided are in [../../ideas/respond.md](../../ideas/respond.md). Every section answers the same questions (D80): purpose, description, callers, flow, result, files, material, tests, open. "Open" means not designed yet. Material names the sources to read before writing (D30); the person's earlier projects are named as in [../../notes/draft-ideas.md](../../notes/draft-ideas.md).

respond belongs to the essentials set (D152, D154, D179).

How skills reach each other here (D107): a sibling within respond is read by its path; a skill in another group is reached through the main skill (D56).

```text
respond/
├── layout/      how anything written in markdown is laid out; loaded for every response
├── ask/         how the agent asks the person anything, and takes the answers
└── explain/     something that did not land, explained top-down
```

## respond

- **Purpose:** how every response is prepared before it is returned: what goes in, how it is put together, how it is worded (D60, D81). Its rules apply to every message the agent sends: an answer, a report of work done, a question back, a summary. respond is also the group for everything said to the person: its own `SKILL.md` holds respond's rules, then layout, always loaded, ask, when anything is asked of the person, and explain, when the person did not follow (D179).
- **Description:** "How every response is prepared before it is returned: rightsized for its reader, things named in words, explanations top-down, plain words, outcomes reported as they happened, no flattery." A draft; it is hidden, so the description is read by the person in the slash menu.
- **Callers:** the main skill, by its seventh step: respond, always, nothing returned before respond's check (D178); it checks every response against respond's rules before returning it (D81).
- **Flow:** rules, not steps; before a response is returned, each rule is checked against it (D81). Each rule carries one short example and must still be clear with the example deleted (D81).

  **Scope:** everything said to the person, every response: its rules below hold for each, layout lays out each, ask puts any question or proposal, and explain explains again what did not land; other groups call layout and ask by name when they write or ask (D179).

  Rules:
  1. **Rightsized, by act's rightsize:** the response has nothing missing and nothing extra for the person, the point first; rightsize holds the rule and its check, respond its uses here: no side topic the person did not ask for, and a comparison shown only when it helps the person decide (D60, D83, D121, D134, D145).
  2. **Length follows the question:** a one-line question gets a short response; the top-down shape is for explanations and for decisions put to the person (D81).
  3. **Things named in words:** never a reference the reader cannot resolve, since they cannot look it up while reading. The test: a reference stays as it is when this reader can tell what it is from the reference itself, right now, without looking it up, such as a file name or path, a link, a command, a function name, a name the reader knows, or a number from the current round of questions; otherwise a few words say what it is, with the number in brackets after for looking it up, as for a decision, evidence, test or note number, a question number from an earlier round, a commit hash, an ID, or an abbreviation the reader has not used. A delegated agent's report to the main agent may use numbers, and the main agent turns them into words when it tells the person (D55, D60, D146).
  4. **An explanation's shape:** where we are, the point, what it rests on, an example; top-down itself, the point first in every response, is act's rightsize's rule (D54, D60, D145).
  5. **Plain words:** the everyday word over the term of art; a term the person has not used is explained the first time (D60, D115).
  6. **Questions follow respond's ask:** how a question is put, laid out and answered, and when one is asked at all, are ask's; which questions to ask is understand's clarify's (D58, D81, D114).
  7. **Outcomes as they happened:** what was done, what was skipped, what failed; a result verified through act's verify is stated plainly, without hedging (D81).
  8. **No guardrail broken:** checked against act's guardrails' never-rules, their one home, when the response touches a secret, a vulnerability detail, text the agent did not write or an irreversible action; otherwise guardrails is not read, since reading it every time costs context. respond adds one thing: if something irreversible was done without approval, it is reported first, plainly (D82, D107, D115).
  9. **Layout, for every response:** layout, which respond loads for each, and whose last instruction holds a markdown file's rules and linter (D95, D111, D115, D154, D158).
  10. **No flattery:** agreement and praise only when earned, with the reason, and disagreement said plainly, since flattery hides what the person needs to know (D123, D134).

  **When rules meet act's** (D107, D115): the follow-ups act names are part of a sufficient report, one line each, not a side topic. For a delegated agent the report is its response, and its reader is the main agent: its parts are set in coordinate's brief, and its questions and proposals go in it, as act's rule on delegated agents says (D146).

  Advice (D134): when disagreeing with the person on something that matters, their view is stated at its strongest first, in a line or two, through understand's argue (D132).

  Instructions, one routing line per child (D134, D179):
  - **layout:** when anything is written in markdown, a response, a markdown file, pull-request or issue text or a brief, or the person asks how something is laid out; respond loads it for every response, so this line serves requests about layout itself; not for wording, order and length (respond), a round of questions (ask), a markdown file's file rules and linter (authoring's markdown, where that set is installed), or commit messages and comments in code (the project's conventions); it gives back the response or file laid out (D158).
  - **ask:** when a response asks the person anything: a question, a round of questions, a proposal to approve, or the wrap-up offer; not for which questions to ask or how deep (understand's clarify), when a proposal is needed and what it holds (guardrails), or plain wording (respond); it gives back each answer taken, accepted, changed or parked, or assumed when the person stops.
  - **explain:** when the person did not follow something the agent itself said, such as "I don't follow" or "what do you mean?"; not for explaining something new, such as a function or a concept (understand's research), or a document for readers (authoring); it gives back the point explained top-down, every reference in words, stopping once it is clear.

  **Last instruction, before the response is returned:** every rule above checked against it, rule 1 by act's rightsize's check, and what fails fixed first; the main skill's last instruction is this check (D81, D134, D145). A one-line response gets a glance; the full pass runs for longer responses, and for any that touch a secret, an irreversible action, a reference or a failure, the cases the rules exist for, since the check is thinking paid at output price on most turns (D149).
- **Result:** none of its own; it shapes every response.
- **Files:** `SKILL.md` only: no `references/`, `scripts/` or `assets/` (D81).
- **Material:** mattpocock's `wait-what` and `writing-for-agents`; meddah's "a rule and its example"; the person's own rule on unresolved references.
- **Tests** (D81), each a request with something checkable in the response:
  1. a question about an earlier decision: a few words first, the number in brackets after, never a bare number (D146);
  2. a one-line factual question: a short response, no side topic, no closing question;
  3. a question whose answer needs explaining: the top-down order, whichever skill answers it (D107);
  4. a choice to make: put as respond's ask says (D114);
  5. a task where one step fails: the failure is reported;
  6. a response with several sections: each marked with a heading, not a bold line (D107);
  7. a file holding an API key, read for another reason: the key absent from the response (D107);
  8. a term of art the person has not used: explained the first time (D115);
  9. an irreversible action done without approval: reported first, plainly (D115);
  10. a plan with a real flaw, shown for an opinion: the flaw said plainly, praise only where earned (D134);
  11. disagreeing with the person's choice on something that matters: their view at its strongest in a line or two, then the disagreement (D134);
  12. a short answer: the point in its first line, as act's rightsize's check finds (D145);
  13. a response naming a file: the path alone, no words added (D146);
  14. a delegated agent's report passed on to the person: its numbers turned into words (D146);
  15. a one-line answer with no secret, irreversible action, reference or failure: a glance, not the full pass; a one-line answer reporting a failure: the full pass (D149).
  16. "explain this function to me": turned away from explain, since it is understanding code, not a message of the agent's that did not land; it goes to understand;
  17. "put the open questions to me one at a time": ask (D114);
  18. "lay this reply out with headings, not bold lines": layout; "make this reply shorter": respond's rules, not layout (D158);
  19. "I don't follow" after a reply of the agent's: explain (D54).
  20. a long reply that restates the question and repeats what the person already has: caught by respond's check, which runs act's rightsize, and cut before the person sees it (D145).

  Run through the test harness, later through `claude plugin eval`.
- **Open:** none known.

## layout

- **Purpose:** how anything the agent writes in markdown is laid out: responses, markdown files (`SKILL.md` included), and markdown written for pull requests, issues and briefs to agents; not commit messages, which follow the project's conventions, nor comments in code (D115, D158). It is essentials' small skill with generic rules, holding what was authoring's markdown's structure layer, moved, not copied; authoring's markdown keeps the file layer, the rules a linter checks in a saved file, and adds it where that set is installed, by the contract between sets (D154, D156, D158). It sits beside respond, not inside it, since files, briefs and pull-request and issue text use it too, while respond is about responses. Wording, order and length are respond's; how a round of questions is laid out is respond's ask's (D114); content is the skill's that makes it. It began as the person's markdown-style, with the person's own tooling left out (D68, D111).
- **Description:** "How anything the agent writes in markdown is laid out: headings for sections, bold only for labels, tables only for short values, prose unwrapped, numbers where things are referred to by number, code fenced. Use for every response, markdown file, pull-request or issue text and brief; wording belongs to respond, questions to ask, file rules to authoring's markdown." A draft (D158).
- **Callers** (D158):
  - respond's own skill, which loads it for every response, a stated exception to loading level by level, since every response is laid out, and by its routing line in respond's flow (D149, D158, D172, D177, D178);
  - respond's rules, by its layout rule, for every response; and, through the main skill, act, by its rule on a file's type, for any markdown file, and coordinate's brief, for what an agent is told;
  - authoring's markdown, for structure, through essentials' main skill where essentials is installed, with its one-line fallback where it is not (D156);
  - the person, typing it.
- **Flow** (D158). **Which rules win** follows act's rule on which instruction wins; in a markdown file, a project's lint configuration wins, the prose rule included, as authoring's markdown says where that set is installed, while responses stay unwrapped whatever a project's files say; the person's instruction in the conversation wins over both (D115, D135). Rules, one line each, each with its reason:
  1. **Sections get headings, not bold lines:** levels in order, a heading naming its section in a few words. A bold line looks like a heading but cannot be navigated or linked to. How a round of questions is laid out is respond's ask's (D114).
  2. **Bold is for a label or a key phrase inside a section;** a section's title is a heading, by rule 1 (D137).
  3. **Tables for short values, lists for big ones:** a table holds short cells; content that would make a wide table becomes a list with sub-items, and when a table is worth it at all is the strong advice below (D137). The one rule with an example, since "short cells" is easy to stretch.
  4. **Prose is not wrapped by hand:** one line per paragraph or list item. In a response, never: the harness wraps prose to its window, and unwrapped text copies and pastes cleanly. In a file, not unless the project's own rules say otherwise (D110, D115).
  5. **Numbers when things are referred to by number,** such as steps or questions; bullets otherwise, so the person can answer or point by number.
  6. **Code, commands and text diagrams are fenced with the language named,** `text` for a diagram; file names, commands and identifiers inline go in backticks, so they render, highlight and copy cleanly.

  **Strong advice** (D116, D158), followed unless the case gives a reason not to, and said when departed from:
  - **lists over tables:** a list by default; a table only for short values compared across items, fitting within 120 characters, since a list holds any length and reads well in a terminal, while a wide table wraps into noise. The person's own rule;
  - table rows, code lines and headings stay within 120 characters, since a renderer cannot reflow them. A project whose linter enforces it makes it a rule there.

  **Advice** (D116): nesting stops at about two levels of sub-items, since deeper levels lose the reader and render badly in a terminal; deeper detail becomes a new section. A response's sections start at `##`.

  **Last instruction, before a response or anything in markdown is returned:** the six rules hold; for a markdown file, authoring's markdown's file rules and linter as well where that set is installed, otherwise the project's linter through act's verify where it has one (D152, D158).
- **Result:** none of its own; it shapes every response and everything written in markdown.
- **Files:** `SKILL.md` only (D158).
- **Material:** the person's markdown-style skill; the person's rule that lists win over tables; authoring's markdown's structure layer, which it now holds (D111, D158).
- **Tests** (D111, D115, D137, D158):
  1. a response with several sections: headings, not bold lines, starting at `##`;
  2. a label inside a section: bold, and never a bold line as a section's title;
  3. three options compared on two short attributes: a table allowed, every row within 120 characters;
  4. options compared with a long description each: a list with sub-items, not a wide table;
  5. a long explanation: each paragraph on one line;
  6. steps the person will refer to by number: numbered; loose points: bullets;
  7. a command to run: fenced, its language named;
  8. detail three levels deep: a new section instead of a third level of sub-items;
  9. a comparison that would fit either way: a list, by the strong advice;
  10. a pull-request description: these rules, without authoring's file rules;
  11. a commit message: no markdown layout; the project's commit conventions;
  12. a comment in code: the language's conventions, not these rules;
  13. "tighten this paragraph": respond's rules, not layout's;
  14. "ask me three questions": laid out as respond's ask says;
  15. a markdown file written with authoring not installed: these rules, and the project's linter through verify where it has one (D152).
- **Open:** none known.

## ask

- **Purpose:** how the agent asks the person anything, a question, a round of questions or a proposal to approve, and how it takes the answers (D114). Which questions to ask, and how deep, is understand's clarify's; when a proposal is needed and what it contains is guardrails'; plain wording is respond's.
- **Description:** "How the agent asks the person anything: numbered questions, each under its own heading with a recommended answer, or the harness's question tool for a few closed choices; one round or one by one; how answers, 'go ahead', parking and stopping are taken. Use whenever a response asks the person something." A draft (D114).
- **Callers:** respond's own skill, by its routing line in respond's flow (D134, D172). Its other callers: respond, whenever a response asks the person anything; understand's clarify and its parts, through the main skill; act, for a concern that would change the work; guardrails, for a proposal; organize, for its two approvals; the main skill's wrap-up offer; understand's brainstorm, for "decide or park", and its discuss, for each item's decision, through the main skill; the person (D114).
- **Flow:** rules, not steps (D114):
  1. **A question only when something is truly open** for the person to choose, never by habit, since each question costs the person a turn (D81, D134).
  2. **Numbered, each with a recommended answer** and a short reason, worded so that "yes" accepts it. One term, "recommended answer", throughout (D58). A recommended answer is challenged first, through understand's challenge, at the depth its trigger sets by stakes; a decision the person makes without a recommendation, or against one, is challenged the same way before it is relied on (D150).
  3. **Each question under its own heading, its number in the heading,** such as "### 2. How a round is laid out", so the person can answer by number and find each one again.
  4. **One round, or one by one on request,** without losing the round: the numbers stay and nothing is dropped; each step names the question by its number and says which remain (D58).
  5. **Answers:** "go ahead" accepts the recommended answers for every question left unanswered. When only some are answered, the rest are named back with the answers that will be taken, before anything is acted on.
  6. **An answer that changes another question** is said so, and that question is updated.
  7. **Parked and assumed:** a question the person sets aside is parked, listed with why; a question still open when the person stops is assumed, taken with its recommended answer and listed as assumed. Both stay listed until answered. A proposal to approve is never assumed: left open, it stays parked and nothing it covers is applied, since an approval must be given, as guardrails says (D137).
  8. **A proposal to approve** is put the same way, with approval as its recommended answer where the agent recommends it.
  9. **A delegated agent** puts its questions in its report, as act's rule on delegated agents says.
  10. **The harness's question tool, for a few closed choices** (D159): used when all three hold: at most four questions; each a choice among a few short options; the reasoning fits in the text above it. Otherwise the questions are numbered in text, by rules 2 and 3: when a question needs explaining option by option, a free answer is likely, there are more than four questions, or the person works item by item and accepts with "ok". The person's own instruction file can set a preference, always the tool, always text, or this default, and it wins. In the tool, the other rules hold in its form: the recommended option first and marked, partial answers named back. A delegated agent never uses it, by rule 9. No skill names a harness's tool: this rule says when, each harness's reference file says how, and where a harness has none, text is used. Its reasons: the tool saves keystrokes and cannot be misread for a closed choice; text keeps the explanation, "ok" accepting every question at once, and the person's refinements.

  **Last instruction, before a round goes out** (D134, D159): every question numbered under its own heading with a recommended answer, or, where rule 10 says, put through the question tool with the recommended option first and marked; any partial answer named back with what will be taken.
- **Result:** the answers, handed back to the skill that asked.
- **Files:** `SKILL.md`; `references/claude.md`, Claude Code's question tool: one to four questions per call, two to four options each, short labels, a header of at most 12 characters, "Other" always there for a free answer, several options selectable, previews for comparing drafts, the recommended option first with "(Recommended)"; `references/codex.md`, whether Codex has a question tool, to find out, text until then (D114, D159).
- **Material:** respond's and deep clarify's earlier rules on questions (D58, D81); the person's rule that each question of a round has its own heading; mattpocock's position that questioning stays harness-neutral chat ([../../research/mattpocock-skills.md](../../research/mattpocock-skills.md)); the harness's own documentation of its question tool (D159).
- **Tests** (D114):
  1. a round of three decisions: each under its own numbered heading, with a recommended answer and a reason;
  2. "go ahead" after a round: every unanswered question taken with its recommended answer, and said back;
  3. two of five answered: the other three named back with what will be taken, before acting;
  4. "one by one": the numbers kept, the remaining named at each step;
  5. an answer that changes a later question: said so, and the question updated;
  6. a response that needs no decision: no question at the end;
  7. the person stops with two questions open: both listed as assumed, with their recommended answers;
  8. the person stops with a proposal to delete files still open: parked, nothing deleted (D137);
  9. a recommended answer on a design decision: challenged first, its verdict in one line beside it (D150);
  10. three closed choices with short options: the question tool, the recommended option first and marked (D159);
  11. a design question needing explanation option by option: numbered questions in text (D159);
  12. five questions: text (D159);
  13. the person's own instruction file says always text: text, even for closed choices (D159);
  14. a delegated agent with a closed choice: the question in its report, never the tool (D159);
  15. a harness without a question tool: text (D159).
- **Open:** whether Codex has a question tool, for its reference file (D159).

## explain

- **Purpose:** clear up something the agent itself said that did not land (D54). Only that: a request to explain something new, such as a function or a concept, is understanding, and goes to understand (D107).
- **Description:** "Clearing up something the agent said that did not land: explained top-down, every reference in words, stopping once it is clear. Use when the person did not follow something the agent itself said." (D96)
- **Callers:** respond's own skill, by its routing line in respond's flow (D134, D172). Its other callers: the person, typing it or saying in words that they did not follow, through the main skill (D54).
- **Flow:** decided (D54):
  1. respond's top-down order: where the conversation is, the point in one plain sentence, what it rests on, an example when the point is abstract (D60);
  2. what explain adds: every reference the person cannot resolve is replaced by what it means (D107);
  3. stop once the point is made, and close by naming what could be explained further, without a question; whether it landed, the person's next message says (D115). Done when every term and reference in it is one the person knows or one it explains, and nothing is there that the point does not need.
- **Result:** the explanation, in the conversation.
- **Files:** `SKILL.md` only (D107).
- **Material:** mattpocock's `wait-what`.
- **Tests** (D96):
  1. a response full of decision numbers, then "I don't follow": the explanation names each one in words;
  2. "explain what you meant by X": the top-down order, stopping without detail nobody asked for (D107);
  3. "explain more" after an explanation: one level deeper on the piece asked about, not on everything;
  4. the person quotes the agent's own words and says they do not follow: explain; the person names a function and asks how it works: understand; when a request is both, both run (D115).
- **Open:** none known.
