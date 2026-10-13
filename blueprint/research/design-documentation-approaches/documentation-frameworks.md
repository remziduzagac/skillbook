# Documentation frameworks: Diátaxis, arc42, C4, docs-as-code, ARCHITECTURE.md

Scope: how each framework would map onto a solo developer's markdown `blueprint/` (agenda, ideas, discussion notes, research, numbered decisions, a current-state `design/` tree with explainers such as `how-it-works.md`, PRDs), and how explainers relate to published user docs in `docs/` (a Starlight site). Overriding constraint: simplicity.

Method note: pages were read through a fetch tool that returns a model summary of the page. Quoted strings below are the quotes that summary returned; they are very likely verbatim but were not checked character by character.

## Diátaxis: the four types, the compass, explanation vs reference, and scope

### Takeaway

Diátaxis sorts documentation by the reader's need into tutorials, how-to guides, reference and explanation, using two questions (action or cognition, acquisition or application). An explainer like `how-it-works.md` is Diátaxis "explanation". Diátaxis claims to apply to internal as well as public docs, but it describes reader-facing documentation, not working artefacts such as agendas, discussion notes or decision records.

### Cited Findings

- Four forms: "tutorials, how-to guides, technical reference, and explanation", which correspond to four distinct user needs — [Diátaxis](https://diataxis.fr/)
- Two axes: action vs cognition (doing vs understanding) and acquisition vs application (learning vs working) — [Diátaxis](https://diataxis.fr/)
- The compass table: action + acquisition = tutorial; action + application = how-to guide; cognition + application = reference; cognition + acquisition = explanation. You classify content by asking "Is this action or cognition?" and "Is this acquisition or application?" — [Diátaxis compass](https://diataxis.fr/compass/)
- The compass is meant for diagnosing mixed content: "particularly effective when you think that you (or even the documentation in front of you) are doing one thing - but you are troubled by a sense of doubt" — [Diátaxis compass](https://diataxis.fr/compass/)
- Explanation is "a discursive treatment of a subject, that permits *reflection*", "understanding-oriented", and takes a "higher and wider" view than reference's "close-up view of the machinery" — [Diátaxis: explanation](https://diataxis.fr/explanation/)
- Explanation should "explain *why* things are so - design decisions, historical reasons, technical constraints". It "can and must consider alternatives, counter-examples or multiple different approaches", and it may contain opinion — [Diátaxis: explanation](https://diataxis.fr/explanation/)
- Naming convention for explanation: an implicit "About [topic]" title, e.g. "About user authentication" — [Diátaxis: explanation](https://diataxis.fr/explanation/)
- "Keep explanation closely bounded": explanation tends to absorb instructional and reference content, and that creep "interferes with the explanation itself" — [Diátaxis: explanation](https://diataxis.fr/explanation/)
- Test for reference vs explanation: "is this something someone would turn to while working ... Or is it something they'd need once they have stepped away from the work, and want to think about it?" — [Diátaxis: reference and explanation](https://diataxis.fr/reference-explanation/)
- Explanation sprinkled into reference "is bad for the reference, interrupted and obscured by digressions". Example given: a tidal chart is reference; an article on why there are tides is explanation — [Diátaxis: reference and explanation](https://diataxis.fr/reference-explanation/)
- Scope: the site presents Diátaxis as applicable to internal and public documentation. Its adoption quotes include Vonage ("high-quality set of internal documentation that our users love"), Gatsby (reorganised open-source docs) and Cloudflare ("north star for information architecture"). It claims use in "hundreds of documentation projects" — [Diátaxis](https://diataxis.fr/)
- Canonical adopted Diátaxis as the basis for its documentation (Anbox Cloud, Juju, Ubuntu Core and others). The author, Daniele Procida, leads documentation at Canonical. This is from search-result summaries of [Canonical's blog post](https://ubuntu.com/blog/diataxis-a-new-foundation-for-canonical-documentation) and [Canonical documentation practice](https://canonical.com/documentation)

### Inferences

- The developer's explainers (`how-it-works.md`: narrative, diagrams, defers to area docs) are exactly Diátaxis "explanation". Its rule to keep explanation bounded and push detail into reference fits "defers to the area documents" directly.
- The `design/` area documents are closest to reference for the developer: current-state descriptions consulted while working. Where an area doc explains *why*, Diátaxis would say split that into an explainer rather than mix it in. For a solo developer, a lighter rule is enough: "facts in area docs, why and how-it-fits in explainers".
- Agenda, ideas, discussion notes, research, decisions and PRDs are working or historical records, not documentation for a reader with a task. Diátaxis does not try to classify them. Applying the four types to the whole `blueprint/` would be a category error; apply them to `design/` and to `docs/`.
- For the published `docs/` site, Diátaxis is the natural structure: explanation pages derived from blueprint explainers; reference derived from area docs (CLI, config, API); how-tos and tutorials written fresh, since design docs rarely contain task steps.
- Simplicity: the compass is a two-question check usable on any single page. Adopting it does not require four top-level folders; a small site can have a few pages of each kind.

### Gaps

- I found no Diátaxis page specifically about architecture or design documents. The explanation page does not mention them.
- I did not verify the "applies to internal docs" claim beyond the homepage summary and the Vonage quote.

## arc42: the 12 sections, lean use, decisions and building blocks

### Takeaway

arc42 is a 12-section template, and its own FAQ says not to fill it all in: "Document only what your stakeholders need". The suggested minimum is quality goals, context, solution strategy, building block view level 1 and the key crosscutting concepts. Decisions go in section 9, ideally as ADRs, without repeating section 4.

### Cited Findings

- The 12 sections, from [arc42 docs](https://docs.arc42.org/home/):
  1. Introduction and Goals: requirements, stakeholders, quality goals.
  2. Constraints: technical and organisational limits, conventions.
  3. Context and Scope: business and technical environment, external interfaces.
  4. Solution Strategy: core decisions and approaches.
  5. Building Block View: static decomposition as black-box and white-box levels.
  6. Runtime View: how building blocks interact at runtime.
  7. Deployment View: infrastructure and topology.
  8. Crosscutting Concepts: recurring patterns and approaches.
  9. Architecture Decisions: significant, costly or risky choices.
  10. Quality Requirements: quality attributes and scenarios.
  11. Risks and Technical Debt.
  12. Glossary.
- The docs site describes "Lean", "Thorough" and "Essential" approaches. Lean means "travel light" while keeping the essential value; "Essential" items always warrant documentation, notably the quality goals — [arc42 docs](https://docs.arc42.org/home/)
- FAQ B-1, "Which parts of arc42 are essential, which are optional?": "Please don't *fill in everything*. Document **only what your stakeholders need**", and "only document things, facts and reasons that you or your stakeholders consider *important* enough to justify written documentation" — [arc42 FAQ B-1](https://faq.arc42.org/questions/B-1/)
- FAQ B-4, "What is the minimal amount of an arc42 documentation?": it depends on "the system, its stakeholders, criticality, complexity, size and/or risks". The suggested minimum: "3-5 central quality requirements, expressed in scenarios"; "Context view and external interfaces"; a "Brief explanation of your solution strategy"; "Building block view, level 1"; "Most important crosscutting concepts" — [arc42 FAQ B-4](https://faq.arc42.org/questions/B-4/)
- The FAQ methodology category also covers incremental updates (B-14), "economical" documentation (B-16) and arc42 vs C4 (B-17) — [arc42 FAQ category B](https://faq.arc42.org/category_b/)
- Section 9 content: "Important, expensive, large scale or risky architecture decisions including rationales", so that stakeholders can "comprehend and retrace your decisions" — [arc42 section 9](https://docs.arc42.org/section-9/)
- Section 9 form: an "ADR (architecture decision record) for every important decision", or a "list or table, ordered by importance and consequences", or a separate section per decision. Nygard ADR fields: Title, Context, Decision, Status, Consequences (including negative ones) — [arc42 section 9](https://docs.arc42.org/section-9/)
- Section 9 lean advice: "Avoid redundant texts. Refer to section 4, where you captured the most important decisions of your architecture already." Decisions can also be recorded locally with the building block they affect — [arc42 section 9](https://docs.arc42.org/section-9/)
- The arc42 docs give sections 5 and 9 the most tips (28 and 10 according to the fetch summary) — [arc42 docs](https://docs.arc42.org/home/)
- arc42 vs C4: C4 has "*many* similarities to a few sections from arc42, but omits certain parts (e.g. quality requirements, crosscutting concepts, risks and a few others)" — [arc42 FAQ B-17](https://faq.arc42.org/questions/B-17/)
- Unverified: a search-result snippet attributed to the arc42 FAQ book lists another agile minimum: sections 1.2, 3, 5 (level 1), 9 and 12. It also says "all sections are optional". I could not read the primary text — [arc42-FAQ (Leanpub)](https://leanpub.com/arc42-faq/read); see also [arc42 documentation](https://arc42.org/documentation/)

### Inferences

- arc42 maps onto the blueprint without adding files:
  - Section 1 (goals, quality goals) maps to PRDs and the top of the project overview.
  - Section 3 (context) and section 5 level 1 (building blocks) map to the `design/` tree. Each area doc is a building block: a black box with responsibility and interfaces.
  - Sections 4 (solution strategy) and 6 (runtime view) map to `how-it-works.md`.
  - Section 8 (crosscutting concepts) maps to a crosscutting area doc or an explainer section.
  - Section 9 maps to the numbered decisions, which already are ADRs.
  - Section 11 (risks and debt) is roughly the agenda or ideas list.
  - Section 12 (glossary) is a single optional file.
- Worth keeping for a solo project: the FAQ B-4 minimum (a few quality goals, context, strategy, building blocks level 1, key crosscutting concepts) plus section 9. Usually skippable: section 2 (constraints, unless real), section 7 (deployment, for a locally installed binary), section 10 as a separate document (goals can live in section 1), and deeper building-block levels.
- Use arc42 as a checklist ("have I covered goals, context, strategy, blocks, crosscutting, decisions?"), not as 12 headings to fill. That matches its own B-1 advice.
- The section 9 rule "refer to section 4, don't repeat" corresponds to "explainer summarises and links to decision N, it does not restate it".

### Gaps

- I did not read FAQ B-14 (incremental updates) or B-16 ("economical" documentation) in full.
- I found no primary arc42 source on keeping arc42 docs as markdown in git. arc42 publishes templates in several formats, but I did not verify which.

## C4 model: levels, diagrams-as-code, what a small project needs, keeping diagrams in sync

### Takeaway

C4 has four zoom levels (system context, containers, components, code) plus landscape, dynamic and deployment diagrams. Its own guidance is that context and container diagrams are enough for most teams, and that code diagrams are not worth keeping. For one developer, one or two text-based diagrams (Mermaid in markdown) are the simple option; a Structurizr model pays off only when many diagrams share elements.

### Cited Findings

- C4 is "A set of hierarchical abstractions - software systems, containers, components, and code", plus "An additional set of supporting diagrams - system landscape, dynamic, and deployment". It is "Notation independent" and "Tooling independent" — [C4 model](https://c4model.com/)
- "you don't need to use all 4 levels of diagram; only those that add value - the system context and container diagrams are sufficient for most software development teams" — [C4 diagrams](https://c4model.com/diagrams)
- Code-level diagrams are not recommended: "No, particularly for long-lived documentation because most IDEs can generate this level of detail on demand". Even then, the page says to show only what tells the story, and the level is "not recommended for anything but the most important or complex components" — [C4 code diagram](https://c4model.com/diagrams/code)
- On scale: "don't be afraid to split that single complex diagram into a larger number of simpler diagrams". C4 was designed for "custom-built, bespoke software systems"; embedded or firmware systems are "perhaps less suited" — [C4 FAQ](https://c4model.com/faq)
- Tooling: diagramming tools ("boxes and lines") cannot validate or query diagrams. "if you rename a box, you need to rename it across every diagram where it appears", and many have formats that are "hard to diff" — [C4 tooling](https://c4model.com/tooling)
- C4 recommends modelling ("Modelling (recommended)"): build "a single definition of all elements and the relationships between them" and create views from it. The model is then a single source of truth — [C4 tooling](https://c4model.com/tooling)
- Structurizr DSL "provides a way to define a software architecture model (based upon the C4 model) using a text-based domain specific language". It can export to PlantUML and Mermaid, and it supports Markdown/AsciiDoc documentation and ADRs alongside the model — [Structurizr DSL](https://docs.structurizr.com/dsl)
- Mermaid's C4 support: "This is an experimental diagram for now. The syntax and properties can change in future releases." It supports C4Context, C4Container, C4Component, C4Dynamic and C4Deployment, and its syntax is "compatible with plantUML". Limitations: fixed styling; layout controlled only by statement order; no sprites, tags, links or legends — [Mermaid C4](https://mermaid.js.org/syntax/c4.html)
- GitHub renders Mermaid natively "in GitHub Issues, GitHub Discussions, pull requests, wikis, and Markdown files" — [GitHub docs: creating diagrams](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
- C4 leaves out quality requirements, crosscutting concepts and risks, which arc42 covers — [arc42 FAQ B-17](https://faq.arc42.org/questions/B-17/)

### Inferences

- For a small project, one system context diagram (the tool, its user, the external systems it talks to) and one container diagram are enough. A container is a separately running or deployable unit, for example a server process, a TUI client, a CLI and child processes. Both fit in `how-it-works.md`.
- Component diagrams belong, if anywhere, in the area doc for a complex area, and only when they add value. Skip code diagrams.
- Diagrams-as-code choice, simplest first:
  - Plain Mermaid `flowchart` or `sequenceDiagram` blocks inside the markdown. They are stable, render on GitHub, diff in git and need no build step.
  - Mermaid C4 syntax gives C4 shapes, but it is experimental and has layout limits.
  - A Structurizr DSL workspace gives one model and many views, which solves rename drift. It adds a tool and a render or export step, which is hard to justify for one or two diagrams.
- Keeping diagrams in sync: few diagrams, at coarse levels, kept next to the text that explains them, and changed in the same commit as the design change. Coarse diagrams (context and containers) change rarely, which is the same argument matklad makes for keeping ARCHITECTURE.md short.
- C4 dynamic diagrams, or a Mermaid sequence diagram, fit an explainer's "walk a request through the system" narrative. That is arc42 section 6 (runtime view) in C4 notation.

### Gaps

- I did not check whether Starlight renders Mermaid without a plugin (it likely needs a remark or rehype plugin).
- I found no C4 guidance aimed at single-developer projects, and no C4 statement on keeping hand-written diagrams in sync beyond the modelling recommendation.

## Docs-as-code: plain text in git, review, CI, generated sites, docs in the same PR

### Takeaway

Docs-as-code means writing documentation with the same tools as code: plain-text markup, git, review, automated checks and a generated site. The main lever for keeping docs current is to make docs part of the change (the same PR or commit) and to let CI fail on breakage such as broken links.

### Cited Findings

- Definition: "Documentation as Code (*Docs as Code*) refers to a philosophy that you should be writing documentation with the same tools as code." Listed practices: issue trackers, version control (Git), plain-text markup (Markdown, reStructuredText, AsciiDoc), code reviews, automated tests — [Write the Docs: docs as code](https://www.writethedocs.org/guide/docs-as-code/)
- Benefits: "Writers integrate better with development teams"; "Developers will often write a first draft of documentation"; "You can block merging of new features if they don't include documentation, which incentivizes developers to write about features while they are fresh" — [Write the Docs: docs as code](https://www.writethedocs.org/guide/docs-as-code/)
- The guide links talks from Google, Rackspace, Microsoft, Twitter, AWS and Pantheon. It aims for "a culture where writers and developers both feel ownership of documentation" — [Write the Docs: docs as code](https://www.writethedocs.org/guide/docs-as-code/)
- GitLab: "Developers are the primary authors of documentation for a feature or feature enhancement". Documentation is part of the definition of done when "A new or enhanced feature is shipped that impacts the user or administrator experience" — [GitLab docs workflow](https://docs.gitlab.com/development/documentation/workflow/)
- GitLab on the same-MR rule: "the Technical Writing team strongly encourages including documentation in the same merge request as the code that it relates to, but this isn't strictly mandatory"; teams "may elect to adopt a workflow where it is mandatory" — [GitLab docs workflow](https://docs.gitlab.com/development/documentation/workflow/)
- Local example: herdsman's user docs are a Starlight site in `docs/next/website/`. `npm run build` "fails on broken internal links", user docs are updated "when a user-facing change needs docs", and the embedded agent skill must be kept "in step with the CLI" — `herdsman/CLAUDE.md` (Docs section)

### Inferences

- For a solo developer, "review via PRs" becomes "the docs change is in the same commit or branch as the code". The useful rule is GitLab's definition of done, made mandatory: a user-visible change is not done until `docs/` is updated, and a design change is not done until the `design/` area doc and any affected explainer are updated.
- Cheap CI checks that keep docs honest without new process: the site build (catches broken internal links), a markdown linter, and optionally a check that CLI help or reference matches the binary. Avoid anything that needs manual upkeep.
- Docs-as-code favours one plain-text format (markdown) for both `blueprint/` and `docs/`. Moving content from an explainer to a user page is then copy-and-adapt, with no format conversion.

### Gaps

- I did not collect other projects' written "docs in the same PR" rules (for example Django's patch review checklist or Kubernetes KEP doc requirements); only GitLab is sourced here.
- I found no 2024–2026 survey data on docs-as-code adoption.

## Deriving user docs from internal design docs and keeping them in sync

### Takeaway

Well-run projects keep design records and user docs separate and give them different lifecycles. Design proposals and decisions become frozen history, and the user docs (plus a short living architecture doc for contributors) are the canonical current description. Python's PEP process states this explicitly; rust-analyzer keeps a contributor architecture doc beside its user manual.

### Cited Findings

- PEP 1: "PEPs are no longer substantially modified after they have reached the Accepted, Final, Rejected or Superseded state. Once resolution is reached, a PEP is considered a historical document rather than a living specification" — [PEP 1](https://peps.python.org/pep-0001/)
- PEP 1: "Formal documentation of the expected behavior should be maintained elsewhere, such as the Language Reference for core features, the Library Reference for standard library modules or the PyPA Specifications for packaging" — [PEP 1](https://peps.python.org/pep-0001/)
- rust-analyzer publishes its architecture document in the "contributing" part of its book, separate from the user material. The document has three parts: Bird's Eye View, Code Map and Cross-Cutting Concerns — [rust-analyzer architecture](https://rust-analyzer.github.io/book/contributing/architecture.html)
- rust-analyzer states invariants inline, for example "rust-analyzer is the only crate that knows about LSP and JSON serialization" and "Syntax tree is a value type ... it doesn't need global context" — [rust-analyzer architecture](https://rust-analyzer.github.io/book/contributing/architecture.html)
- TigerBeetle keeps an internals architecture document at `docs/internals/ARCHITECTURE.md`, next to its user docs in the same `docs/` tree. Found by search; not read in detail — [TigerBeetle ARCHITECTURE.md](https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/internals/ARCHITECTURE.md)
- Diátaxis treats design decisions, history and constraints as legitimate user-facing explanation content — [Diátaxis: explanation](https://diataxis.fr/explanation/)

### Inferences

A mapping from blueprint to user docs that keeps one source of truth per fact:

| Blueprint item | Relation to `docs/` |
| --- | --- |
| numbered decisions, PRDs | frozen history (PEP model); never copied verbatim |
| `design/` area docs | living; source for reference pages |
| explainers (`how-it-works.md`) | living; source for "About ..." explanation pages |
| agenda, ideas, discussion, research | private working notes; never published |
| (nothing) | tutorials and how-tos are written fresh in `docs/` |

- Sync rule, adapted from PEP 1: once a decision or PRD is done, the current truth lives in `design/` (for the developer) and `docs/` (for users). A decision is not edited to track later changes; a new decision supersedes it.
- Avoid two living copies of the same detail. Either the user doc is the canonical reference for user-visible behaviour (CLI flags, config keys) and the area doc links to it, or the reverse. Choosing "user-visible facts live in `docs/`; internals and why live in `blueprint/design/`" stops `design/` from going stale on details users care about.
- Explainers move well into user docs because Diátaxis explanation already allows design reasons and history. Derive by trimming internals (module names, invariants) and keeping the conceptual walkthrough and diagrams. The blueprint explainer stays the developer-facing version.
- A public contributor-facing ARCHITECTURE.md (matklad style) can be the published slice of `blueprint/design/`: a codemap plus invariants, regenerated by hand from the area docs a couple of times a year.

### Gaps

- I found no published case study of a project that systematically generates user docs from internal design docs. The pattern found is separation plus manual derivation, not generation.
- I did not verify the Rust RFC process's equivalent of PEP 1's "historical document" rule.

## matklad's ARCHITECTURE.md guidance

### Takeaway

matklad (2021, still the reference point) recommends a short ARCHITECTURE.md for projects of 10k–200k lines. It gives a bird's-eye view, a codemap of coarse modules, explicit invariants (often stated as absences), layer boundaries and crosscutting concerns. It names things but does not link them, does not try to stay in sync with code, and is revisited a couple of times a year.

### Cited Findings

- Target: projects of roughly "10k-200k lines of code", with the file placed next to README and CONTRIBUTING — [matklad: ARCHITECTURE.md](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- Why: "it takes 2x more time to write a patch if you are unfamiliar with the project, but it takes 10x more time to figure out *where* you should change the code" — [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- Keep it short: "Every recurring contributor will have to read it. Additionally, the shorter it is, the less likely it will be invalidated by some future change" — [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- Freshness: "Don't try to keep it synchronized with code"; review it "a couple of times a year" — [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- Content: start with a bird's-eye overview of the problem being solved. Then a codemap of "coarse-grained modules and how they relate to each other", answering "where's the thing that does X?" and "what does the thing that I am looking at do?" — [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- "Do name important files, modules, and types. Do *not* directly link them (links go stale)"; readers should use symbol search instead — [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- "Explicitly call-out architectural invariants. Often, important invariants are expressed as an *absence* of something." "Point out boundaries between layers and systems as well." Add a separate crosscutting-concerns section — [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- Leave out implementation details and how-to content — [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)
- matklad cites rust-analyzer's architecture doc as the example. It follows the shape: Bird's Eye View, Code Map with "Architecture Invariant" callouts, Cross-Cutting Concerns — [rust-analyzer architecture](https://rust-analyzer.github.io/book/contributing/architecture.html)

### Inferences

- matklad's model and the blueprint's `design/` tree differ in granularity. ARCHITECTURE.md is one short file at codemap level; `design/` has one document per area. They combine well: `how-it-works.md` plus a short index of areas is effectively the ARCHITECTURE.md (bird's-eye view plus codemap), and area docs hold the deeper content.
- The anti-staleness rules carry over directly to `design/` area docs:
  - name modules and types instead of linking to them;
  - describe coarse structure, not line-level detail;
  - state invariants, including absences such as "the detector never touches the parser";
  - review on a cadence rather than on every commit. This keeps the cost of the "same commit" docs rule low, because most code changes don't affect coarse descriptions.
- matklad's three sections line up with the other frameworks:
  - The bird's-eye view is arc42 section 1/3 and C4 context.
  - The codemap is arc42 section 5 level 1 and C4 containers.
  - Crosscutting concerns are arc42 section 8.
  - The tone is Diátaxis explanation and reference for contributors. ARCHITECTURE.md is therefore a sufficient lightweight subset of arc42 and C4 for a solo project.

### Gaps

- The post dates from 2021. I found no newer guidance from matklad that changes it, but did not search exhaustively.
- I did not survey a broad set of repositories that follow it; rust-analyzer (read) and TigerBeetle (found by search) are the confirmed examples here.
