# Ideas

Open questions and ideas not yet agreed, by topic. When a decision settles one, its outcome is added.

## Blueprint

- Writing guidelines for each kind of document: how to write ideas, notes, research, decisions, requirements, design, roadmap, tasks and workstream files (tone, length, what to include and leave out). Partly answered by agent-writing (D22). (2026-10-10)
- The skill's exact procedures beyond the outline in design/blueprint.md's "The agent at work": the commands it runs, what it asks the person, and how it syncs each tracker. To settle while building the skill. (2026-10-09)
- How attachment files are stored beyond their committed index, and how they travel between machines. Deliberately left open (D9). (2026-10-09)

- blueprint's own flow (D29), drafted in notes/skillbook-tree.md, goes into design/blueprint.md when blueprint is improved. (2026-10-10)
- An export mode that renders a workstream's design as one document, for readers who expect a PRD (D31). (2026-10-10)

## greenrepo

- Verify the platform limits in design/greenrepo.md, "When the platform does not offer a feature", against GitHub's current plans. (2026-10-10)
- Test with a first manual run of the health workflow: whether `vulnerability-alerts: read` works on a personal-account repository; whether the workflow token may pin an issue; whether the bot's issue edits count as activity for the 60-day rule; whether `ubuntu-slim` is free on public repositories; whether workflow execution protections and Copilot Automations reach personal-account public repositories. (2026-10-10)
- Read the OpenSSF OSPS Baseline scanner (`ossf/pvtr-github-repo-scanner`) before writing greenrepo's own settings comparison. (2026-10-10)
- An account-wide `.github` repository holding shared community files: which files, and their contents. (2026-10-10)
- Versioned user docs, after herdr: `docs/next/` (drafts edited with each feature), `docs/preview/` (a snapshot per preview build) and `docs/versions/<version>/` (a snapshot per stable release, with `/docs/` showing the default). herdsman's import drops the last two today and publishes `docs/next` from `main`. (2026-10-08)
- A project template made with copier, so that `copier update` brings later improvements into existing repositories, and a script that sets a new repository's GitHub settings at creation. Left from the template plan of 2026-10-08, whose other parts became skillbook and greenrepo. (2026-10-08)

## skillbook

- One naming form for every root: Anthropic recommends the "-ing" form and warns against mixing patterns; the roots now mix bare verbs, "-ing" forms and nouns. (2026-10-11)
- Evaluation first: Anthropic's skill-creator loop, `claude plugin eval` and this repository's loading harness make automated checks of skills possible, against requirements.md's "no automated evaluation". (2026-10-11)
- The engineering sets as roots of their own, beside writing and the other groups ("option 2"): likely where the tree settles once the other groups are clear, since writing and coding belong on the same layer. For now engineering stays one root. (2026-10-10)
- Daily routines, such as triage and meetings, get their own skill set outside blueprint (D31): now the routines group (D33). (2026-10-10)
- A skill tree of any depth under the one `skillbook` namespace: top-level concepts such as engineering and productivity (the person wants these), then subtopics, then skills; nodes shared between branches make it a graph. Widens skillbook beyond keeping projects well, so requirements and SCOPE.md would change. (2026-10-10)
- Survey other skill collections (superpowers, Anthropic's skills, well-used single skills) for structure and for content to adopt or adapt. (2026-10-10)
- The person's older project folders hold ideas for the tree's content and functionality. They are sources to learn from, not decisions. (2026-10-10)
- Much of what those projects tried to build as tools can now be built as skill sets, plus a few tools, since the concepts and the agents' own tools are clearer. (2026-10-10)
- A tree of flat skills under one `skillbook` namespace: roots model-invoked and listed, modes user-invoked and loaded by path, reference in plain files, calls between roots by full name. It would change D21 (no links between skill folders) and how sub-skills are named (research/skill-loading.md). (2026-10-10)
- Machines where skills are edited: the working copy installed as a local plugin instead of the link script, which gives no namespace. Claude Code reads a local plugin in place; Codex copies it, so it may need a reinstall after each edit, not yet tested. (2026-10-10)
- `plugin.json`'s `skills` field makes no difference for `skills/<name>/`; drop it, and the planned check that it lists exactly the folders in `skills/`. (2026-10-10)
- Partial installation: installing only some skills on a machine or for a project, for example blueprint without greenrepo. Options: several plugins in one marketplace, per-skill installs through skills.sh, or a selection in the link script; each must handle a skill that calls one not installed. (2026-10-10)
