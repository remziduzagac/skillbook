# Decision records: ADRs and their variants

Context for the report writer: the developer's proposal records agreed decisions as numbered entries (D1, D2, ...) grouped in themed markdown files. Each entry has **Decision**, **Why**, optional **Not chosen**, and relationship notes added at the top later ("Superseded by D230", "Detailed by D210", "Amended by"). Proposals live in discussion notes; only agreed decisions become entries. About 200 decisions exist after a week of design work. Simplicity is the overriding constraint. Research done 2026-10-07.

## Nygard's original ADR format (2011)

### Takeaway

Nygard's format is five short sections (Title, Context, Decision, Status, Consequences), one or two pages, one file per decision with sequential numbers that are never reused. A reversed decision is kept and marked superseded, not deleted. His core argument is that small, modular documents get read and updated, large ones do not.

### Cited Findings

- The format has five parts. **Title**: a short noun phrase such as "ADR 1: Deployment on Ruby on Rails 3.0.10". **Context**: "the forces at play, including technological, political, social, and project local", in neutral, factual language. **Decision**: active voice, "We will …", full sentences. **Status**: "proposed", "accepted", or "deprecated"/"superseded" with a reference to the replacement. **Consequences**: all of them, positive, negative and neutral — [Nygard, Documenting Architecture Decisions (Cognitect, 2011-11-15)][nygard]
- Files live at `doc/arch/adr-NNN.md`, numbered sequentially, and numbers are not reused. He uses lightweight markup (Markdown) — [Nygard][nygard]
- "The whole document should be one or two pages long." — [Nygard][nygard]
- A reversed decision is kept in the repository with a superseded status rather than deleted, which preserves the history — [Nygard][nygard]
- His definition of architecturally significant decisions: those that affect "the structure, non-functional characteristics, dependencies, interfaces, or construction techniques" — [Nygard][nygard]
- On why: "Nobody ever reads large documents, either." "Large documents are never kept up to date. Small, modular documents have at least a chance at being updated." "Agile methods are not opposed to documentation, only to valueless documentation." — [Nygard][nygard]
- Experience report: positive early feedback from 6–10 developers rotating through projects, who valued the context. GitHub's markdown rendering made the records readable by non-developers — [Nygard][nygard]
- The adr-tools default template, built on Nygard's format, adds a `Date:` line under the title: `# NUMBER. TITLE` / `Date: DATE` / `## Status` / `## Context` / `## Decision` / `## Consequences`. — [adr-tools src/template.md][adrtools-template]

### Inferences

- The developer's **Decision** maps to Nygard's Decision, and **Why** covers part of Context plus Consequences. Nygard's format has no "alternatives" section; **Not chosen** comes from later formats (MADR, Y-statements).
- Nygard's **Status** mostly exists to carry "proposed". The developer only writes entries once they are agreed, so every live entry is implicitly accepted. The relationship notes already carry the only other status that matters (superseded). A separate Status field would add ceremony for no information.
- The main thing missing from the developer's format compared with Nygard is negative and neutral consequences: what the decision costs or makes harder. Nygard asks for "all consequences".

### Gaps

- The fetched page summary did not show whether Nygard's original template has a Date field. It appears in the adr-tools template, but that may be the tool's addition.

## MADR (Markdown Architectural Decision Records), current version

### Takeaway

MADR 4.0.0 (2024-09-17) is the current release and the repository is active. Its required core is small: title, Context and Problem Statement, Considered Options, Decision Outcome. Everything else, front matter included, is optional. It ships four templates (full, minimal, bare, bare-minimal) instead of the older "short vs long" split.

### Cited Findings

- Latest release is 4.0.0 (2024-09-17), after 4.0.0-beta (2024-09-02). The last commit was 2026-08-28. 2.5k stars, not archived. The unreleased changelog only rewords "Confirmation" and "Context and Problem Statement" — [GitHub API, adr/madr][madr]; [MADR CHANGELOG][madr-changelog]
- Four templates: `adr-template.md` (all sections, with explanations); `adr-template-minimal.md` ("only contains mandatory sections"); `adr-template-bare.md` (all sections, empty); `adr-template-bare-minimal.md` (mandatory sections, no explanations). Instructions: copy into `docs/decisions` as `nnnn-title.md` — [MADR README][madr]
- The minimal template holds: title ("short title, representative of solved problem and found solution"), **Context and Problem Statement** ("two to three sentences", optionally phrased as a question), **Considered Options** (list of titles), and **Decision Outcome** ("Chosen option: "{title}", because {justification}"). It also includes **Consequences** ("Good, because…" / "Bad, because…"), though that is marked optional — [adr-template-minimal.md][madr-minimal]
- Optional sections in the full template: Decision Drivers, Consequences, Confirmation (how compliance is checked, e.g. review or an ArchUnit test, "included in many ADRs"), Pros and Cons of the Options (Good / Neutral / Bad per option), and More Information (team agreement, when to revisit, "Links to other decisions") — [adr-template.md][madr-template]
- The front matter is labelled "optional metadata elements. Feel free to remove any of them." Fields: `status: "{proposed | rejected | accepted | deprecated | … | superseded by ADR-0123}"`; `date: {YYYY-MM-DD when the decision was last updated}`; `decision-makers`; `consulted`; `informed` — [adr-template.md][madr-template]
- History: in 3.0.0-beta (2022) the fields moved into YAML front matter, and "Links" became "More information". 3.0.0-beta.2 added `consulted`/`informed` (inspired by RACI). 4.0.0 renamed "Deciders" to `decision-makers`, renamed "Validation" to "Confirmation", and removed the link from the `status` field ("Only identifier should be put"). 4.0.0 also renamed the format from "Markdown Any Decision Records" back to "Markdown Architectural Decision Records". In 2.0.0 (2018), Status, Deciders and Date were already optional — [MADR CHANGELOG][madr-changelog]
- The format is described in the paper Kopp, Armbruster, Zimmermann, "Markdown Architectural Decision Records: Format and Tool Support", ZEUS 2018 — [MADR README][madr]
- Zimmermann's September 2026 review of common ADR mistakes recommends MADR (and YADR) because each has a dedicated "decision drivers" section — [Zimmermann, Ten Common Mistakes in ADRs (2026-09-12)][oz-mistakes]

### Inferences

- The developer's format is close to bare-minimal MADR with the headings renamed. **Decision** ≈ Decision Outcome, **Why** ≈ "because {justification}" plus Consequences, **Not chosen** ≈ Considered Options. The parts dropped are Context/Problem Statement and the Bad consequences.
- MADR's `date` means "last updated", not "decided". If the developer adds dates, they should choose one meaning and say which.
- MADR 4.0.0 changed `status` to hold only an identifier ("superseded by ADR-0123"), not a link. A plain ID such as "Superseded by D230" matches that and stays valid when files move between themes.
- Decision-makers, consulted and informed are team fields and add nothing for a solo developer.

### Gaps

- I found no MADR-specific guidance on grouping many records into one file. MADR assumes one file per decision.

## Y-statements and other one-sentence formats

### Takeaway

The Y-statement is a one-sentence template: context, concern, chosen option, rejected options, benefit, accepted downside. It was designed for brevity (slides, executive reviews, small teams). It is the closest established analogue to a one-paragraph decision entry and covers what the developer's format omits: the accepted downside.

### Cited Findings

- Template elements: "In the context of <use case/component>, facing <non-functional concern>, we decided for
  <option> and neglected <alternatives>, to achieve <benefits>, accepting that <drawbacks>". An optional
  "because <additional rationale>" clause can be added — [Zimmermann, Architectural Decisions — The Making Of (2020-04-27, updated 2026-09-12)][oz-making]
- Example: "In the context of the Web shop service, facing the need to keep user session data consistent and current across shop instances, we decided for the Database Session State Pattern and neglected Client Session State or Server Session State to achieve cloud elasticity, accepting that a session database needs to be designed, implemented, and replicated." — [Zimmermann, The Making Of][oz-making]
- Origin: around 2012, in enterprise and IoT cloud projects where stakeholders asked for concise, slide-friendly formats. Presented at SATURN 2012 ("Making Architectural Knowledge Sustainable"). Recommended "when brevity matters": executive reviews, resource-constrained teams, knowledge sharing across projects — [Zimmermann, The Making Of][oz-making]
- Zimmermann's WICSA 2015 comparison of seven templates found Y-statements "much leaner" than five-section formats (Nygard, arc42) — [Zimmermann, The Making Of][oz-making]; the comparison paper is also referenced on [adr.github.io][adr-org]
- The same page advises recording only architecturally significant decisions, picking one template and using it consistently, and avoiding "pseudo rationale". Per the fetched summary it also gives a target of "fewer than 100 records" (wording not verified verbatim) — [Zimmermann, The Making Of][oz-making]
- Thoughtworks' "Lightweight Architecture Decision Records" blip moved from Trial (Nov 2016) to Adopt (Nov 2017, May 2018). It recommends storing records "in source control … instead of a wiki or website, as then they can provide a record that remains in sync with the code itself" — [Thoughtworks Technology Radar][tw-radar]

### Inferences

- A Y-statement fits the developer's entry granularity (~200 small decisions) better than a multi-section ADR. Mapping: "we decided for" = **Decision**, "neglected" = **Not chosen**, "to achieve" / "because" = **Why**. The format adds "accepting that" (the cost) and "in the context of / facing" (the problem). Adding a one-line "Accepting" or "Cost" to the **Why** convention would borrow the useful part without new sections.
- For small decisions a prose-paragraph style may beat headings: one sentence in Y-statement order is easy to skim and fits inside a themed file.

### Gaps

- The canonical Medium post ([medium.com/olzzio/y-statements-10eb07b5a177][y-medium]) returned HTTP 403. The template text above comes from Zimmermann's own ozimmer.ch mirror. I found no other widely adopted one-sentence format.

## Tools: what they automate and whether they are maintained

### Takeaway

The tools automate four things: the next number, reciprocal supersede/link notes in both files, an index or table of contents, and a static site. The best-known CLI (adr-tools) is unmaintained since 2018–2020. log4brains has been quiet since December 2024. MADR itself and the template collections remain active. Every mainstream tool assumes one file per decision, so none fits a themed multi-entry file without adaptation.

### Cited Findings

- **adr-tools (npryce)**: Bash. `adr init`, `adr new` (numbered file, opens editor), `adr new -s 9` ("flagged as superceding ADR 9, and changes the status of ADR 9"), `adr link`, `adr list`, `adr generate toc|graph`. The `-l TARGET:LINK:REVERSE-LINK` option writes a link into both records. 5.7k stars; last release 3.0.0 (2018-07-25); last commit 2020-03-30; 69 open issues; not archived — [adr-tools README][adrtools]; [adr-new source][adrtools-new]; GitHub API
- adr-tools' own test shows the link convention: `adr link 3 Amends 1 "Amended by"` and `adr link 3 Clarifies 2 "Clarified by"`. These put "Amended by `[3. Third Record](…)`" and "Clarified by `[…]`" into the old records' `## Status` sections, and "Amends […]" / "Clarifies […]" into the new one. The relationship notes sit at the top, under Status — [adr-tools tests/linking.expected][adrtools-linking]
- **log4brains (thomvaill)**: TypeScript/npm. Local preview with hot reload, static-site generation (GitHub/GitLab Pages, S3), MADR as the default template. "No required file numbering schema … avoids git merge issues": files are date-prefixed, such as `20200102-…md`. It supports "global" and package-specific ADRs in a monorepo. It states "an ADR is immutable. Only its status can change." Latest release v1.1.0 and last commit both 2024-12-17; 1.6k stars; 57 open issues — [log4brains README][log4brains]; GitHub API
- **dotnet-adr (endjin)**: a .NET global tool for multiple templates. The last default-branch commit is a dependency bump (2025-07-23), the repository was last pushed 2026-07-15, and it has 137 stars. Low activity but not abandoned — [dotnet-adr][dotnet-adr]; GitHub API
- **ADR Manager (adr org)**: a web UI that connects to GitHub for form-based MADR editing, plus a VS Code extension. Last release v2.0.0 (2023-12-05); the last commit is a README edit (2026-05-18) — [adr-manager][adr-manager]; [adr.github.io tooling][adr-tooling]
- **adr-log**: a CLI that keeps an `index.md` listing the ADRs. Last release 2.2.0 (2020-10-21), last commit 2022 — effectively unmaintained — [adr-log][adr-log]; GitHub API
- The adr.github.io tooling list also includes: ADG (Go, modeling and reusing decisions), ReflectRally and adr.zone (web), Backstage ADR plugin, pyadr, Hugo Markdown ADR tools, adr-viewer (Python, generates a website), Talo (ADRs, RFCs and design docs), Loqbooq (commercial, Slack), E-ADR (Java annotations), and ports of adr-tools (Rust `adrs`, Go, Java, PHP, PowerShell, Python, Node). It lists ADMentor, eadlsync and SE Repo as unmaintained — [adr.github.io/adr-tooling][adr-tooling]
- **E-ADR** (decisions as Java annotations) released 2.0.0 on 2025-10-12 — [adr/e-adr][e-adr]; GitHub API
- **joelparkerhenderson/architecture-decision-record**: a collection of templates and examples, not a tool. 17.1k stars, commits as of 2026-10-06 — [repo][jph]; GitHub API

### Inferences

- For about 200 entries in themed files, the useful automation reduces to: (1) next free D-number, (2) checking that every "Superseded by Dn" has a matching back-reference and points to an existing ID, and (3) a generated index (ID, one-line title, status, file). A short script (grep for headings and relation lines) covers all three. Adopting a tool would force one-file-per-decision and tool-specific front matter.
- log4brains dropped numbers (date prefixes) to avoid merge conflicts between parallel branches. A solo developer rarely creates decisions in parallel branches, so sequential D-numbers are fine. Concurrent agent sessions writing decisions would be the exception.

### Gaps

- I did not verify whether the Rust `adrs` port or pyadr are currently maintained.

## Many small decisions vs few big ones: logs, grouping, granularity

### Takeaway

Mainstream guidance holds one decision per record and says to record "architecturally significant" decisions. In practice there is tension: Spotify says to write one "almost always" and keep it lightweight, while Zimmermann warns against both mega-ADRs and logging insignificant detail. A "decision log" usually means the collection of ADRs plus a one-line index. Microsoft's playbook uses a markdown table as that summary. Grouping by theme has a precedent (log4brains' global vs package-specific records), but putting many entries in one file has little formal guidance.

### Cited Findings

- adr.github.io defines the **decision log** as the collection of ADRs kept over a project's life — [adr.github.io][adr-org]
- AWS: the ADRs together form the decision log. "Project members skim the headlines of each ADR to get an overview of the project context," then read individual ADRs to go deeper. Scope is every "architecturally significant decision", using Richards & Ford's categories: structure, non-functional requirements, dependencies, interfaces, construction techniques — [AWS Prescriptive Guidance, ADR process][aws]
- Spotify (2020-04-14): "An ADR should be written whenever a decision of significant impact is made; it is up to each team to align on what defines a significant impact." For small decisions: "ADRs can be lightweight"; small decisions compound into duplicated effort or competing solutions, so record them. The diagram's summary: "When should I write an Architecture Decision Record? Almost always!" For large changes Spotify runs an RFC first and then records the conclusion in an ADR — [Spotify Engineering, When Should I Write an ADR][spotify]
- Microsoft's Code-With Engineering Playbook keeps `doc/decision-log.md`, a **markdown table** of executive summaries of ADRs (number, title, date, status, context, decision, consequences), alongside the full ADRs in `doc/adr/` — [Microsoft Engineering Playbook, Decision Log][ms-log]
- Zimmermann's good practice is to "select by priority and significance". His anti-patterns include **Mega-ADR** (multiple pages of detailed architecture stuffed into one ADR), **Novel/Epic** (a whole architecture document squeezed into one ADR), and **Blueprint/Policy in disguise** (a commanding, cookbook tone instead of a journal) — [Zimmermann, How to create ADRs — and how not to (2023-04-03)][oz-create]
- Zimmermann 2026: many reviewed ADRs "do not even cover architecturally significant design concerns", and implementation-level details belong in separate design specifications — [Zimmermann, Ten Common Mistakes][oz-mistakes]
- bool.dev lists as an anti-pattern "Combining multiple decisions into one ADR". Decisions should stay separate "unless they're tight corollaries changing together". It also warns against using ADRs as developer documentation or architecture overviews — [bool.dev, 10 ADR Anti-Patterns (Artem Polishchuk, 2026-06-21)][booldev]
- log4brains groups records by scope: "global ADRs" in `docs/adr` and package-specific ones in `packages/<name>/docs/adr` — [log4brains README][log4brains]
- Fowler (2026-03-24): one file per decision, numbered with a descriptive name (e.g. `0001-HTMX-for-active-web-pages`) in `doc/adr`. "Keep the ADR short and to the point - typically a single page." — [Fowler, bliki: Architecture Decision Record][fowler]

### Inferences

- The developer's model already separates proposals from decisions, as Spotify does with RFCs and ADRs. Discussion notes are the RFC layer, and only conclusions become entries. This matches standard practice and removes the need for a "proposed" status.
- Global IDs with themed files work like a decision log grouped by area, similar to log4brains' scopes. The global ID is what keeps a record stable. Entries should be referenced only by ID, never by file, so that re-theming a decision does not break links.
- 200 entries in a week is far above what ADR guidance expects (Zimmermann's reported "<100" target is for a whole project). This is fine only because the entries are short, Y-statement-sized. The risk Zimmermann and bool.dev name is that design detail and specification creep into the log. A test such as "would someone plausibly re-argue this?" helps decide what earns an entry.
- With ~200 entries, a one-line-per-decision index (ID, title, status, theme) follows the Microsoft/AWS "skim the headlines" pattern and gives agents a cheap entry point.

### Gaps

- I found no authoritative source endorsing many decisions per file as the primary format. The Microsoft table is a summary of separate ADRs. Secondary blogs describe single-page decision logs, but I found no primary project documenting that practice at scale.

## Superseding, amending, linking; status values; dates

### Takeaway

The dominant rule is that accepted records are immutable apart from status. A changed decision gets a new record, and the old one gets "Superseded by X". Relationship notes are written in both directions, near the top (the Status section in adr-tools, front matter in MADR). "Amends/Amended by" and "Clarifies/Clarified by" are precedented in adr-tools. Zimmermann is more relaxed about revising records.

### Cited Findings

- AWS: "When the team accepts an ADR, it becomes immutable. If new insights require a different decision, the team proposes a new ADR. When the team accepts the new ADR, it supersedes the previous ADR." On acceptance the owner "adds a timestamp, version, and list of stakeholders" — [AWS][aws]
- Fowler: "Once an ADR is accepted, it should never be reopened or changed - instead it should be superseded." His statuses are proposed, accepted, superseded — [Fowler][fowler]
- log4brains: "an ADR is immutable. Only its status can change. Thanks to this, your documentation is never out-of-date! … it was at least true one day!" — [log4brains README][log4brains]
- adr-tools automates the reciprocal notes. `-s` inserts "Supersedes" in the new record and changes the old record's status. `adr link` writes custom pairs such as Amends/Amended by and Clarifies/Clarified by into both Status sections — [adr-tools tests/linking.expected][adrtools-linking]; [adr-new][adrtools-new]
- MADR puts the relation in front matter (`status: "superseded by ADR-0123"`, identifier only since 4.0.0) and sends other links to "More Information" — [MADR template][madr-template]; [MADR CHANGELOG][madr-changelog]
- Zimmermann takes a softer line: "Be ready to revise an AD as the design work evolves … once revised and agreed upon, the ADR turns into a contract". You may "mark certain ADRs as outdated and superseded by other ones (or even delete them from your log)" — [Zimmermann, How to create ADRs][oz-create]
- bool.dev lists "Editing ADRs when decisions change" as an anti-pattern. The fix is a new ADR with the old one marked Superseded. It recommends linking related ADRs rather than merging them — [bool.dev][booldev]
- Status vocabularies:
  - Nygard: proposed, accepted, deprecated, superseded — [Nygard][nygard]
  - MADR: proposed, rejected, accepted, deprecated, … superseded by ADR-NNNN — [MADR template][madr-template]
  - AWS: Proposed, Accepted, Rejected, Superseded — [AWS][aws]
  - Microsoft playbook: Proposed, Accepted, Deprecated, Superseded — [ms-log][ms-log]
  - bool.dev: Draft, Proposed, Accepted, Rejected, Superseded — [bool.dev][booldev]
- Date conventions:
  - adr-tools: `Date:` line at creation — [adr-tools template][adrtools-template]
  - MADR: `date: YYYY-MM-DD` = last updated — [MADR template][madr-template]
  - log4brains: date-prefixed filenames instead of numbers — [log4brains][log4brains]
  - bool.dev: record both the decision date and the documentation date, and flag reconstructed (after-the-fact) records — [bool.dev][booldev]
- For agents, a September 2026 post recommends a visible status with reciprocal links ("Status: Superseded by ADR 0024"). Never delete or rewrite old ADRs, so that agents "follow the current decision deterministically" — [dev.to, ADRs for AI coding agents (2026-09-19)][devto-agents]

### Inferences

- The developer's relationship notes at the top of each entry closely match adr-tools' convention. There the links go in the Status section near the top, in both directions, with free-form verbs. "Amended by" has a precedent. "Detailed by" has none in the standard tools, but adr-tools' free-form link pairs show the pattern is accepted. Keeping a small fixed vocabulary of pairs (Supersedes/Superseded by, Amends/Amended by, Details/Detailed by) makes a lint script trivial.
- The strict schools (AWS, Fowler, log4brains) would say "Amended by" should be rare. If an amendment changes the decision, it is effectively a supersede. If it only adds detail, "Detailed by" covers it. Reserving "Amended by" for small additive changes keeps the semantics clear.
- The only status the developer needs is "superseded/active", and the presence of a "Superseded by" line already encodes it. No separate field is needed.
- Dates are optional for a solo log kept in git. Git history records when each line was written. Adding a date only helps when reading outside git, or for agents asked "what changed recently".

### Gaps

- I found no source that defines "Detailed by" as a standard relation. Its standing is inferred from adr-tools' free-form links.

## Criticisms and failure modes; keeping ADRs lightweight

### Takeaway

The documented failure modes are records that are too big or too many, sales-pitch records without tradeoffs or real alternatives, edited history, ADRs used as general documentation, and drift between record and code. Remedies: keep each record short and consistent, always record the rejected option and the cost, supersede rather than edit, and add a confirmation or check where it is cheap.

### Cited Findings

- Nygard's original motivation: "Large documents are never kept up to date." — [Nygard][nygard]
- Zimmermann's anti-patterns: **Fairy Tale** (only pros), **Sales Pitch** (marketing adjectives), **Free Lunch Coupon** (ignores hard long-term consequences), **Dummy Alternative** (non-viable straw-man options), **Sprint** (one option, short-term view), **Tunnel Vision**, **Maze** (topic drift), **Blueprint in disguise**, **Mega-ADR**, **Novel/Epic**, **Magic Tricks** (false urgency, pseudo-accurate scoring). Good practices: watch word count ("sometimes one slide suffices"), capture decisions promptly, and disclose your confidence level ("It is ok to be in doubt") — [Zimmermann, How to create ADRs][oz-create]
- Zimmermann's ten mistakes (2026-09-12) include missing alternatives ("A decision that does not identify alternatives and chooses one of them is not a decision"), unexplained rejections ("The reasons to reject certain options often are as interesting as the justification for the chosen option"), a redundant decision section ("must be more elaborate than the title"), no negative consequences ("there are no free design lunches"), inconsistent template use, and unvetted AI-generated content — [Zimmermann, Ten Common Mistakes][oz-mistakes]
- bool.dev: don't use ADRs as developer documentation or architecture overviews, don't merge decisions, don't edit them, and don't write them long after the fact. If you do, note the reconstruction — [bool.dev][booldev]
- On drift: MADR's optional **Confirmation** section asks how compliance will be checked ("automated or manual fitness function", e.g. an ArchUnit test) — [MADR template][madr-template]. An agent-focused vendor post goes further and wants every ADR to "ship with an executable check: a grep, a lint rule, a command" — [actual.ai, Agent-optimized ADRs][actual]
- Thoughtworks' rationale: records in source control "remain in sync with the code itself", unlike a wiki — [Thoughtworks Radar][tw-radar]

### Inferences

- For the developer's format, Zimmermann's mistakes #4–#7 are the relevant ones. **Not chosen** being optional invites "not a decision" entries, and nothing in the format asks for the downside. A cheap fix: when there was a real alternative, name it in a few words; always state the cost or "accepting that" in **Why**. Skip both for genuinely forced choices.
- Avoid letting entries turn into specifications (the "Blueprint in disguise" and "developer documentation" anti-patterns). Detail belongs in design docs that the decision points to, which is what "Detailed by" seems meant for.
- Consistent ordering (Zimmermann's mistake #9) is easy to keep with only three fields. It is worth enforcing because both humans and agents skim by position.

### Gaps

- Search summaries attributed phrases such as "we have 200 ADRs, and nobody reads them" and "documentation theater" to unnamed sources (likely catio.tech or withstoa.com marketing blogs). I could not confirm their origin, so they are not cited as findings.
- A search surfaced a GitHub issue arguing that solo developers should prefer Nygard's four sections over MADR because "low activation energy is what makes ADR #6 actually get written" ([Furiduri/PetMePhone#8][petme]). It is a single small-project opinion of unknown authorship (possibly AI-written), so treat it as anecdote only.
- I found no empirical study measuring how often ADRs are read or how fast they go stale.

## ADRs written with or read by AI coding agents

### Takeaway

2025–2026 guidance converges on four points. Keep records short and in the repository. Give agents an index and a pointer from CLAUDE.md or AGENTS.md rather than loading every record. Make status and supersede links visible and reciprocal so agents do not follow stale decisions. Have humans vet any AI-drafted record. Most of these sources are blogs or vendor posts, plus one position paper. None is an empirical study.

### Cited Findings

- Recommended layout: `docs/adr/` with a `README.md` index table (number, status, area, decision summary) for scanning without loading full records. CLAUDE.md, AGENTS.md or Cursor rules hold a pointer such as "Before changing service boundaries, persistence, … search `docs/adr/` for relevant accepted decisions." The post warns that loading whole ADR directories "burns context and makes unrelated decisions compete for attention". Test retrieval with "a fresh agent session, not the one that created the ADR" — [dev.to, ADRs for AI coding agents (2026-09-19)][devto-agents]
- A vendor post (marketing, no measurements) recommends stable IDs, `applies_to` file globs in front matter so only relevant records load, imperative MUST/SHOULD rules, an executable verification check, and append-only supersession "to prevent agent confusion from contradictory versions". Compile one source of truth into CLAUDE.md, AGENTS.md and Cursor rules. It cites Anthropic guidance to keep context files under about 200 lines. It warns: "If two rules contradict each other, the model may pick one arbitrarily." — [actual.ai, Agent-optimized ADRs][actual]
- Zimmermann's mistake #10, "Unvetted AI-Generated Content": "AI has taken over, but its output is used without quality check." — [Zimmermann, Ten Common Mistakes][oz-mistakes]. bool.dev's #8 is "Letting AI make the final call": use AI to draft and widen options, but humans own the tradeoffs — [bool.dev][booldev]
- Konrad et al., "Architecture Without Architects: How AI Coding Agents Shape Software Architecture" (arXiv 2604.04990, 2026-04-05), is a position paper with an illustrative case study, not an experiment. It argues agents make implicit architectural decisions ("vibe architecting"), that "Prompt choices and agent decisions also belong in ADRs", and proposes generating ADRs from agent reasoning traces. In the case study, three prompt variants for the same chatbot produced 141–827 lines and 2–6 files — [arXiv 2604.04990][arxiv]
- "Agent Decision Records (AgDR)" is a proposed ADR extension in which the agent writes a small markdown record when it makes a call and commits it alongside the code — [me2resh/agent-decision-record][agdr] (search snippet only; repository not inspected)

### Inferences

- The developer's format already suits agents: short entries, stable IDs, and relations at the top of each entry where an agent sees them first. The main additions worth borrowing are a generated one-line index (ID, title, superseded-or-active, theme file) and a CLAUDE.md pointer saying when to consult it. A superseded entry should say so on its first line, since agents may read an entry in isolation.
- Contradictions are the main agent-specific risk. With ~200 entries, a missing "Superseded by" back-link leaves two live, conflicting rules. The cheapest safeguard is a lint check for reciprocal relations.
- Proposals stay in discussion notes and only agreed entries enter the log. This also protects agents from following unagreed ideas, so it is worth keeping explicit, e.g. a CLAUDE.md line saying discussion notes are not decisions.

### Gaps

- I found no controlled evidence on whether agents follow ADRs better in one-file-per-decision form or in a grouped log. Agent-specific advice is practitioner and vendor opinion from 2026.
- I did not inspect the AgDR repository or the braingrid.ai post ([braingrid.ai][braingrid]) beyond search snippets.

[nygard]: https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions
[adrtools-template]: https://github.com/npryce/adr-tools/blob/master/src/template.md
[madr]: https://github.com/adr/madr
[madr-changelog]: https://github.com/adr/madr/blob/develop/CHANGELOG.md
[madr-minimal]: https://github.com/adr/madr/blob/develop/template/adr-template-minimal.md
[madr-template]: https://github.com/adr/madr/blob/develop/template/adr-template.md
[oz-mistakes]: https://ozimmer.ch/practices/2026/09/12/ADRMistakes.html
[oz-making]: https://www.ozimmer.ch/practices/2020/04/27/ArchitectureDecisionMaking.html
[oz-create]: https://ozimmer.ch/practices/2023/04/03/ADRCreation.html
[adr-org]: https://adr.github.io/
[tw-radar]: https://www.thoughtworks.com/radar/techniques/lightweight-architecture-decision-records
[y-medium]: https://medium.com/olzzio/y-statements-10eb07b5a177
[adrtools]: https://github.com/npryce/adr-tools
[adrtools-new]: https://github.com/npryce/adr-tools/blob/master/src/adr-new
[adrtools-linking]: https://github.com/npryce/adr-tools/blob/master/tests/linking.expected
[log4brains]: https://github.com/thomvaill/log4brains
[dotnet-adr]: https://github.com/endjin/dotnet-adr
[adr-manager]: https://github.com/adr/adr-manager
[adr-tooling]: https://adr.github.io/adr-tooling/
[adr-log]: https://github.com/adr/adr-log
[e-adr]: https://github.com/adr/e-adr
[jph]: https://github.com/joelparkerhenderson/architecture-decision-record
[aws]: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html
[spotify]: https://engineering.atspotify.com/2020/04/when-should-i-write-an-architecture-decision-record
[ms-log]: https://microsoft.github.io/code-with-engineering-playbook/design/design-reviews/decision-log/
[booldev]: https://bool.dev/blog/detail/10-adr-antipatterns
[fowler]: https://martinfowler.com/bliki/ArchitectureDecisionRecord.html
[devto-agents]: https://dev.to/naman_here/adrs-for-ai-coding-agents-how-to-make-every-agent-read-architecture-decisions-3he4
[actual]: https://actual.ai/blog/agent-optimized-adrs
[arxiv]: https://arxiv.org/html/2604.04990
[agdr]: https://github.com/me2resh/agent-decision-record
[braingrid]: https://www.braingrid.ai/blog/architecture-decision-records-for-ai-coding-agents
[petme]: https://github.com/Furiduri/PetMePhone/issues/8
