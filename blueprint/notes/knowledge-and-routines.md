# Notes: knowledge and routines, set aside

knowledge (notes and sources) and routines (the person's daily work) were set aside on 2026-10-11 as future work (D64). This note keeps what was known then, so their design can start from it. Nothing here is decided unless it cites a decision. Names the person's private projects: review before publishing.

## Where they stood

Both sat under a group named productivity (D48), in the sample tree ([../ideas/skill-tree.md](../ideas/skill-tree.md) before D64). Each skill is listed with the sources that hold material for it; "(an idea)" marks one with none worked out yet.

**knowledge:** what is known, in plain files.

- **capture:** get it down now, sort it later (VaultOps, slipbox, workslate, alirezarezvani/claude-skills).
- **ingest:** keep the source first, card it, extract from it (VaultOps, workslate).
- **distill:** atomic insights linked back to their sources (VaultOps, workslate).
- **find:** search lenses and topic briefings (workslate, slipbox, loomcraft and infoloom).
- **tidy:** links, orphans, frontmatter, tags (slipbox, loomcraft and infoloom).
- **vault:** set up or reorganise a notes folder or an Obsidian vault, an idea (VaultOps, slipbox).
- **teach:** learn a topic over several sessions (mattpocock/skills).

**routines:** the person's daily work: meetings, reviews, tasks.

- **meetings:** decisions and actions with owner, due date and a quote; hands notes to knowledge's capture (workslate, VaultOps).
- **reflect:** daily, weekly and monthly reviews; chronicles (VaultOps, slipbox, gstack, alirezarezvani/claude-skills).
- **close-out:** keep what matters, wrap up, clean, retire; hands over to distill, to conduct's handoff and to conduct's learning from a session (workslate, VaultOps).
- **tasks:** personal tasks: parents, waiting or blocked, today, an idea (VaultOps).
- **triage:** incoming issues turned into agent-ready briefs, as a routine, an idea (mattpocock/skills, gstack).
- **focus:** a focused work session, an idea (alirezarezvani/claude-skills).
- **people:** one-to-ones, hiring rubrics, onboarding, feedback, an idea (workslate).

## Decided earlier, still standing

- **Daily routines stay outside design's flow** (D31): triage and meetings are not design work.
- **The vault skill belongs to knowledge,** and maintain points to it; status updates moved from routines to write (D41).
- **Descriptions keep each other's requests out** (D62). In the routing tests, "note this down for later, I'll sort it out next week" went to routines' tasks instead of knowledge's capture ([../research/skill-loading.md](../research/skill-loading.md), "Top-level shapes").
- **understand's skills keep nothing themselves** (D50): knowledge is where their results can be kept outside a project.

## Discussed, not decided

1. **A split like design's** (D46): knowledge's main skill would be how to work with notes anywhere (capture, find, tidy, distill, teach), with a vault sub-skill holding the person's vault system, used only where one exists.
2. **The folders.** The person wants the blueprint folder to become the centre of everything. Proposed: in every project a `skillbook/` folder holds `blueprint/` and the knowledge folder side by side, each with its own rules:
   - blueprint holds what is decided and built and can be public, as skillbook's is (D25);
   - the knowledge folder holds sources and insights, often private, since copied sources cannot always be published;
   - the person's own notes use the same layout without a blueprint, in place of a vault;
   - this repository keeps its `blueprint/` where it is, beside the plugin's `skills/skillbook/`.
3. **The knowledge folder's name:** not "library", too common. "study" if it holds active study as well as results, "knowledge" if it holds mostly what is already known. Other candidates from the earlier projects: loom (workslate's info loom), slipbox, vault (suggests Obsidian), crate, shelf, catalog (each names one part only).
4. **The boundary with blueprint's research:** research notes answer one project's questions and cite their sources; the knowledge folder keeps the sources and insights themselves, and research notes link to it rather than copy it.
5. **Work in progress lives with what it produces:** work that ends in a design or code for a project goes in blueprint, as a workstream; work that ends in knowledge goes in the knowledge folder; meetings and personal tasks go in routines. VaultOps' words then map onto existing ones instead of standing beside them:

   | VaultOps | In blueprint | In the knowledge folder |
   | --- | --- | --- |
   | track | a workstream | a topic being studied |
   | thread | an open question in the discussion notes | a study thread, if one is needed |
   | desk | a view of what is in progress, not a folder | the same, for study |
   | slate, traces, output | the workstream's own files | the thread's files |
   | harvest | consolidate | distill |

6. **Where learn's highlights wait:** highlights from a session wait in a home of their own until learn judges them (D66): one per project, for highlights about that project, and one for the person, for how they work with agents. Both depend on the project folder.
7. **Routines and knowledge together or apart:** VaultOps kept its calendar (tasks, meetings, logs, chronicles) in the same room as knowledge; whether routines share the knowledge folder or get their own is open.

## Material to read first

- [draft-ideas.md](draft-ideas.md), "Knowledge" and "Productivity", and "Vocabulary worth keeping".
- VaultOps' layout, from the person's Obsidian sandbox: a "Study Room" with Inbox (new, review, processed, a drop folder, daily rollover), Crate (raw sources), Card Catalog (resource cards in 12 types; atomic evergreen insights), Shelf (compendia), Desk (tracks and threads, each with input, slate, traces and output), Calendar (tasks, meetings, logs, chronicles), Navigate and Cabinet (templates, prompts, schemas, trash). Five pillars: Capture, Storage, Library, Workspace, Time. Pipelines: Ingest; Refine (extract, then distill); Process (the desk's dialogue loop). It removed its Folio, Subject and Topic types and let tags carry the taxonomy.
- [../ideas/open.md](../ideas/open.md), "The project folder".
