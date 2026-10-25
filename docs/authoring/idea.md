# authoring

The first idea of the authoring set. Most of it is not designed yet: apart from the markdown skill, every line below is an idea that may change.

## What it is for

authoring is writing for people: documentation for a project's users, documents for colleagues and stakeholders, articles, and issues for whoever was not in the conversation. Essentials makes every answer an agent gives clear, short and well laid out. authoring adds what a piece of writing needs beyond one answer: a reader who has only the document, a form that suits its kind, and a file that passes its checks.

The form of a project's design documents, such as an idea, a decision or a design, belongs to the [blueprint](../blueprint/idea.md) set, not here.

## Its skills

- **docs:** documentation for a project's users, such as a guide, a reference page or a README.
- **business:** documents for stakeholders, such as a status update, a report, a proposal or a memo.
- **articles:** writing for a wider audience, such as a blog post or an essay.
- **edit:** makes an existing text read better: clearer wording, better order, a steadier voice. Removing whole parts that do nothing for the reader is essentials' job.
- **issue:** an issue for a project's tracker, written for a maintainer or teammate who was not in the conversation. The agent proposes it and never posts it on its own, and a security problem goes through the project's private channel instead.
  - **bug:** what happened against what was expected, the steps to reproduce, the environment, and the evidence, with secrets removed.
  - **feature:** the problem first, then the proposal, the alternatives considered and what is left out.
- **reader:** reads a document as its intended reader would, with only the document, often through a fresh agent, and reports what that reader could not do from it. Its name is not settled yet.
- **markdown:** the file rules a markdown linter checks, and running the linter. A project's own lint settings win in its files. The layout itself, such as headings and lists, comes from essentials. This is the one skill already designed.

## How it fits

- **Built on essentials:** respond's rules for wording and layout hold in every document. authoring adds only what a kind of document needs.
- **The reader check serves other sets:** a design, a brief for another agent, a carryover note or a questionnaire can each be read cold, to find what its reader would still ask.
- **Issues meet softeng:** test, review and ship raise issues, and maintain triages the ones that come in.

## Open questions

- What each kind of document needs as its form, and how much a project's own templates replace it.
- The reader skill's name, and whether a fresh agent or the same agent reads cold.
- Where a document's sections are planned, since essentials' organize already splits topics into parts.
- Whether issue needs more kinds later, such as a question or a task.
