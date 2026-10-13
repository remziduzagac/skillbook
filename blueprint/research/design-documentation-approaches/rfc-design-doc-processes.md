# RFC and design-document processes: what a solo markdown blueprint should borrow or avoid

Scope: how proposal/design-doc processes are structured (file layout, numbering, states, lifecycle, templates) and how accepted proposals relate to the living design. Reference point is the developer's draft: `prd/0003-<slug>/README.md` plus `tasks/T01-<slug>.md`, statuses draft/accepted/in-progress/implemented/rejected/superseded, and a "design delta" merged into a current-state `design/` tree on implementation, after which the PRD stays as history.

## Oxide Computer's RFD process (Requests for Discussion)

### Takeaway

Oxide uses one directory per RFD (`rfd/0042/README.adoc`) in a single git repo, a branch per RFD named by its number, PRs as the discussion venue, and six states. Unlike PEPs, a `committed` RFD is meant to describe how the system actually works, so the RFD itself doubles as the living design doc (updated rarely, via separate branches/PRs). At scale the git-only workflow needed custom tooling (CSV index, short URLs, search site).

### Cited Findings

- Six states, defined verbatim: `prediscussion` = "not yet ready for discussion, but … effectively a placeholder"; `ideation` = "contains only a description of the topic that the RFD will cover, providing an indication of the scope"; `discussion` = "a discussion is being had for the RFD in a Pull Request"; `published` = set "once (or if) discussion has converged and the Pull Request is ready to be merged … before merge"; `committed` = "once an idea has been entirely implemented"; `abandoned` = "if an idea is found to be non-viable" — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001)
- Committed means the doc now describes reality: "Once an RFD has become implemented — that is, once it is not an idea of some future state but rather an explanation of how a system works — its state should be moved to be `committed`." Updates to committed RFDs should be infrequent but are allowed — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001)
- Published is not frozen: "Just because something is in the `published` state does not mean that it cannot be updated and corrected." Each logically independent change goes on its own branch (e.g. `0001_rfd_modification`) with its own PR, original authors as reviewers — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001)
- Numbering: sequential, zero-padded to four digits. "You will first need to reserve the number … the next available RFD number from looking at the current `git branch -r` output"; check with `git branch -rl \*0042`, then `git checkout -b 0042` and create `rfd/0042/README.adoc` from the template — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001)
- Metadata header fields: `authors` (with emails), `state`, `discussion` (PR link), `labels` — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001)
- Content guidance: RFDs cover architecture, API changes, process, testing designs; include viable options with benefits/drawbacks, reasoning with data, customer impact — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001)
- Tooling: auto-generated `.helpers/rfd.csv` index, short URLs `{num}.rfd.oxide.computer`, chat bot with fuzzy matching, rendered site — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001); [Oxide blog, 24 Jul 2020](https://oxide.computer/blog/rfd-1-requests-for-discussion)
- Origins and purpose: modeled on IETF RFCs, Go proposals, Joyent RFDs, Rust RFCs and Kubernetes proposals; "Writing down ideas is important: it allows them to be rigorously formulated (even while nascent), candidly discussed and transparently shared"; deliberately encourages rough contributions — [Oxide blog, 24 Jul 2020](https://oxide.computer/blog/rfd-1-requests-for-discussion)
- Lessons at scale (2023): a git repo "doesn't provide the best reading experience, is limited in terms of AsciiDoc support, and is challenging to share externally"; creating an RFD requires "cloning a Git repo, running a script, committing, pushing, and making a PR"; discoverability needs "more tools to filter and tag RFDs". Oxide built an internal site with Meilisearch full-text search, inline PR discussion and inter-RFD link previews — [A Tool for Discussion, 2 Feb 2023](https://oxide.computer/blog/a-tool-for-discussion)
- Architecture today: content in a private `oxidecomputer/rfd` repo; `rfd-api` ingests RFDs into a DB and serves them with per-user access control; `rfd-site` (Remix) is the open-source front end — [oxidecomputer/rfd-site](https://github.com/oxidecomputer/rfd-site)

### Inferences

- Oxide's state model maps almost 1:1 onto the developer's list: prediscussion/ideation ≈ draft, published ≈ accepted, committed ≈ implemented, abandoned ≈ rejected. Oxide has no explicit "in-progress" or "superseded" state; the `discussion` state exists only because review is multi-person, which a solo developer can drop.
- The key difference: Oxide lets the committed RFD *be* the description of the system. The developer's design instead separates history (PRD) from current state (`design/`), which is closer to PEPs. The Oxide variant avoids a merge step but fragments "current design" across many RFDs; the developer's split is the better fit if a single current-state tree is wanted.
- Borrow: one folder per numbered doc with `README.md`, zero-padded numbers, a tiny header (state + date), and an index that is generated rather than hand-maintained. Avoid: branch-per-doc and PR-as-discussion (no reviewers solo), and anything that needs a site/search service to stay usable — plain `grep` over markdown suffices at solo scale.

### Gaps

- Did not find a published Oxide count of RFDs or a post-2023 retrospective on staleness of committed RFDs.
- RFD 1 does not (in the fetched text) define a "superseded" mechanism; unclear how Oxide links a replaced RFD.

## Rust RFCs

### Takeaway

Rust RFCs are single markdown files (`text/NNNN-name.md`, number = PR number) with a fixed nine-section template, a PR → FCP (10 days) → merge/close/postpone lifecycle and a separate tracking issue for implementation. Accepted RFCs are not kept current; the project learned the hard way that RFCs had become de facto documentation and added a rule (RFC 1636) that the Reference/book must be updated before stabilization.

### Cited Findings

- Start: copy `0000-template.md` to `text/0000-my-feature.md`; the number "is going to be the PR number and we'll rename the file accordingly if the RFC is accepted" — [rust-lang/rfcs README](https://github.com/rust-lang/rfcs/blob/master/README.md)
- FCP: a subteam member proposes a "motion for final comment period" with a disposition (merge, close, or postpone); "FCP lasts ten calendar days, so that it is open for at least 5 business days"; afterward the PR is merged or closed, with a rationale comment if unclear. "Postponed" means neither evaluating nor implementing "until some time in the future" — [rust-lang/rfcs README](https://github.com/rust-lang/rfcs/blob/master/README.md)
- Amendment rule: "In general, once accepted, RFCs should not be substantially changed. Only very minor changes should be submitted as amendments. More substantial changes should be new RFCs, with a note added to the original RFC" — [rust-lang/rfcs README](https://github.com/rust-lang/rfcs/blob/master/README.md)
- Template header: Feature Name, Start Date, RFC PR, Rust Issue (tracking issue). Sections: Summary; Motivation; Guide-level explanation ("Explain the proposal as if it was already included in the language"); Reference-level explanation; Drawbacks; Rationale and alternatives; Prior art; Unresolved questions; Future possibilities — [0000-template.md](https://github.com/rust-lang/rfcs/blob/master/0000-template.md)
- RFC 1636 (2016-06-03): "New language features are often documented *only* in the RFCs which propose them and the associated announcement blog posts", and the Reference "tends to be out of date". Adopted rule: language features must be added to the Reference (should be added to the book), std items need API docs, plus changelog and release notes; "Stabilization of a feature must not proceed until the requirements outlined in the **How We Teach This** section of the originating RFC have been fulfilled" — [RFC 1636](https://rust-lang.github.io/rfcs/1636-document_all_features.html)
- Nick Cameron (former core team member, 19 Feb 2022): RFCs "are a lot of effort to write … to manage … to read"; "one rigid template … for all RFCs, independent of the domain or the magnitude of the change"; "features often evolve during implementation and stabilisation. There is no explicit process for updating RFCs"; "It is impossible to tell from reading an accepted RFC whether it was implemented or stabilised, and if it was, whether the implementation matched the RFC or if it changed"; "There is no backpressure mechanism" — [We need to talk about RFCs](https://www.ncameron.org/blog/the-problem-with-rfcs/)
- Community view (search-snippet level, not read in full): RFCs "don't seem ideal for final documentation since they contain motivation and lots of discussion which is not relevant anymore" — [internals: Improve format of Rust RFC, like Python PEP](https://internals.rust-lang.org/t/improve-format-of-rust-rfc-like-python-pep/20180)

### Inferences

- Rust's single biggest lesson for the blueprint: an accepted proposal silently becomes the documentation unless there is a hard gate. RFC 1636 is exactly the developer's "merge the design delta into `design/` before marking implemented" rule, imposed after the fact. Make that gate part of the definition of `implemented`.
- Cameron's "impossible to tell … whether it was implemented … or if it changed" argues for (a) a status field that is actually updated and (b) a short "what actually shipped / deviations" note when closing a PRD. Rust stores status outside the file (PR state, tracking issue); a solo developer has no such external state, so status must live in the file header.
- The guide-level vs reference-level split is a useful idea: the "reference-level" part is what should flow into `design/`; motivation, alternatives and discussion stay in the PRD as history.
- Avoid: a rigid all-sections template for small changes, and an unbounded queue of accepted-but-unimplemented proposals.

### Gaps

- Did not verify current status of Rust's specification effort (RFC 3355, the FLS adoption) or whether it changed how RFCs relate to the Reference; treat as unverified.
- No fetched source describing how Rust's tracking-issue template links back to the RFC in 2024–2026.

## Python PEPs

### Takeaway

PEP 1 is the clearest statement of "the proposal is history, the reference is current": once Accepted/Final/Rejected/ Superseded, a PEP is "a historical document rather than a living specification", and formal documentation lives in the Language/Library Reference or PyPA specs. PEP 12 adds a `canonical-doc` banner pointing readers from the PEP to the current spec. Superseding is bidirectional via `Replaces` / `Superseded-By` headers.

### Cited Findings

- Three types: Standards Track (new features/implementations), Informational ("do not necessarily represent a Python community consensus … users and implementers are free to ignore"), Process (procedures; like Standards Track but for areas other than the language) — [PEP 1](https://peps.python.org/pep-0001/)
- Statuses: Draft, Accepted, Provisional (may be "Rejected or Withdrawn *even after the related changes have been included in a Python release*"), Final ("When the reference implementation is complete and incorporated into the main source code repository, the status will be changed to 'Final'"), Deferred, Rejected, Withdrawn, Superseded, Active (living documents like PEP 1 itself). Accepted can move to Rejected/Withdrawn only before release; "released changes must instead go through the regular deprecation process" — [PEP 1](https://peps.python.org/pep-0001/)
- Required preamble: PEP, Title (max 44 chars), Author, Status, Type, Created. Optional: Sponsor, PEP-Delegate, Discussions-To, Resolution (link to decision), Requires, Replaces, Superseded-By, Python-Version, Topic — [PEP 1](https://peps.python.org/pep-0001/)
- Superseding: "PEPs can also be superseded by a different PEP, rendering the original obsolete. This is intended for Informational PEPs, where version 2 of an API can replace version 1"; new PEP carries `Replaces`, old one gets `Superseded-By` — [PEP 1](https://peps.python.org/pep-0001/)
- Sections: Abstract (~200 words), Motivation, Rationale, Specification, Backwards Compatibility, Security Implications, How to Teach This, Reference Implementation, Rejected Ideas, Open Issues, Acknowledgements, Footnotes, Change History, Copyright — [PEP 1](https://peps.python.org/pep-0001/)
- History vs reference: "In general, PEPs are no longer substantially modified after they have reached the Accepted, Final, Rejected or Superseded state. Once resolution is reached, a PEP is considered a historical document rather than a living specification. Formal documentation of the expected behavior should be maintained elsewhere, such as the Language Reference … the Library Reference … or the PyPA Specifications" — [PEP 1](https://peps.python.org/pep-0001/)
- Banner: "PEPs are considered historical documents once marked Final, and their canonical documentation/specification should be moved elsewhere. To indicate this, use the `canonical-doc` directive" (subclasses `canonical-pypa-spec`, `canonical-typing-spec`), placed between headers and the Abstract; it renders "This PEP is a historical document. The up-to-date, canonical documentation can now be found at [link]" — [PEP 12](https://peps.python.org/pep-0012/)

### Inferences

- The developer's PRD → `design/` split is the PEP model. The cheapest high-value borrow is the PEP 12 banner: when a PRD reaches `implemented`, add one line at the top, e.g. "Historical. Current design: `design/<area>.md`." This prevents readers (and agents) from treating an old PRD as current truth.
- `Replaces` / `Superseded-By` as two header fields is the simplest superseding mechanism; both ends must be edited.
- "Rejected Ideas" and "Open Issues" are worth keeping as optional PRD sections; Type, Sponsor, PEP-Delegate, Discussions-To, Resolution, Copyright exist for multi-party governance and are noise for a solo developer.
- PEP's "Withdrawn" vs "Rejected" distinction (who decided) collapses when author = decider; one terminal "rejected" (or "dropped") state is enough. "Deferred" may be worth keeping only if parked ideas are kept at all (see Shape Up).

### Gaps

- PEP files are single `.rst` files (`peps/pep-NNNN.rst`); this layout detail was not re-verified in a fetched source this session.

## Kubernetes KEPs

### Takeaway

KEPs use a folder per enhancement (`keps/sig-xxx/NNNN-name/README.md` + `kep.yaml`), numbered by tracking-issue number, with machine-readable metadata split into `kep.yaml` so CI tooling (`kepval`) can validate it. Status values (provisional → implementable → implemented, plus deferred/rejected/withdrawn/replaced) are separate from feature maturity stages (alpha/beta/stable). A KEP is a long-lived document that is updated across releases; it is the heaviest process surveyed.

### Cited Findings

- Layout: KEPs live under `/keps`, in SIG subdirectories, as `keps/sig-xxx/NNNN-name/README.md`. KEP-0000 also mentions initial submission as `draft-YYYYMMDD-my-title.md` — [KEP-0000](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md); the current README says "KEPs are now prefixed with their associated tracking issue number. This gives both the KEP a unique identifier and provides an easy breadcrumb for people to find the issue where the current state of the KEP is being updated" — [keps/README.md](https://github.com/kubernetes/enhancements/blob/master/keps/README.md). (The draft-date naming appears to be older text superseded by issue-number prefixes.)
- Statuses verbatim: provisional "proposed and is actively being defined"; implementable "approvers have approved this KEP for implementation"; implemented "has been implemented and is no longer actively changed"; deferred "proposed but not actively being worked on"; rejected; withdrawn; replaced "replaced by a new KEP" — [KEP-0000](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)
- `kep.yaml` fields: title, kep-number, authors, owning-sig, participating-sigs, status, creation-date, reviewers, approvers, see-also, replaces, stage (alpha|beta|stable), latest-milestone, milestone {alpha, beta, stable}, feature-gates, disable-supported, metrics — [kep.yaml template](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/kep.yaml)
- README template sections: Release Signoff Checklist, Summary, Motivation (Goals, Non-Goals), Proposal, Design Details, Production Readiness Review Questionnaire, Implementation History ("Major milestones in the lifecycle of a KEP should be tracked in this section"), Drawbacks, Alternatives, Infrastructure Needed. Guidance: "Merge early and iterate. Avoid getting hung up on specific details and instead aim to get the goals of the KEP clarified and merged quickly"; "One KEP corresponds to one 'feature' or 'enhancement' for its whole lifecycle"; Non-Goals "helps to focus discussion and make progress" — [KEP README template](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
- Living vs history: KEP sections "can be merged into source control incrementally in order to support an iterative development process" — [KEP-0000](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md); the repo also aims to be "a structured historical record" — [keps/README.md](https://github.com/kubernetes/enhancements/blob/master/keps/README.md)
- Tooling: `kepval` checks KEP YAML metadata and runs in CI to block invalid KEPs; `kepctl`/`kepify` also exist — [docs/kepval.md](https://github.com/kubernetes/enhancements/blob/master/docs/kepval.md) (via search snippet); PRR checks were extended to implemented KEPs in [PR #3007](https://github.com/kubernetes/enhancements/pull/3007) (title only seen)

### Inferences

- The developer's `prd/0003-<slug>/README.md` folder is structurally a KEP folder; the KEP status set (provisional/implementable/implemented/deferred/rejected/withdrawn/replaced) is the closest existing match to the developer's set. Notably KEP has no "in-progress": `implementable` covers both approved and being built, and the tracking issue plus milestones carry progress. The developer could likewise let task files carry progress and drop `in-progress`, or keep it as the only status that is derivable from tasks.
- Splitting metadata into `kep.yaml` pays off only with validators and dashboards across thousands of KEPs; for a solo developer, YAML front matter (or a 3-line header) in `README.md` keeps one file per concept.
- Two-axis modelling (status vs stage) is unnecessary solo; Implementation History as a dated bullet list is a cheap borrow for recording when status changed.
- Avoid: signoff checklists, PRR questionnaires and owning/participating-group metadata.

### Gaps

- Did not fetch `kepval.md` directly; tooling description relies on search snippets.
- Whether KEPs are edited after `implemented` in practice (beyond the definition "no longer actively changed") was not measured.

## Google-style design docs (Malte Ubl, "Design Docs at Google")

### Takeaway

Google-style design docs are informal, trade-off-focused documents (Context and scope, Goals and non-goals, Design, Alternatives considered, Cross-cutting concerns), typically 10–20 pages for large projects or 1–3 page "mini design docs". They should be updated while the system is unshipped; afterward they drift and get "amendments", and the advice is to link amendments from the original.

### Cited Findings

- Purposes: "early identification of design issues when making changes is still cheap", "organizational consensus", cross-cutting concerns, scaling senior knowledge, "organizational memory around design decisions" — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
- Sections: Context and scope ("succinct", "objective background facts"); Goals and non-goals (non-goals are "things that could reasonably be goals, but are explicitly chosen not to be goals"); The actual design ("the place to write down the trade-offs"); Alternatives considered ("shows very explicitly why the selected solution is the best given the project goals"); Cross-cutting concerns (security, privacy, observability) — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
- Length: "sweet spot for a larger project seems to be around 10-20ish pages"; "mini design docs" of 1–3 pages "for incremental improvements or sub tasks in an agile project" — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
- When not to write: writing them is overhead; skip when "the solution to the design problem is not ambiguous"; a doc that reads like an "implementation manual" without "trade-offs, alternatives, and explaining decision making" is a warning sign — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
- Lifecycle: creation and rapid iteration → review (lightweight email or formal meeting) → implementation and iteration ("If the designed system hasn't shipped yet, then definitely update the doc") → maintenance and learning — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
- Staleness: docs "tend to get out of sync with reality over time"; changes spawn amendments, "more akin to the US constitution", and "links to such amendments from the original doc can be immensely helpful for the poor future maintenance programmer" — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
- Anti-staleness content rules: don't copy formal interface definitions or full schemas ("verbose, contain unnecessary detail and quickly get out of date"); "design docs should rarely contain code, or pseudo-code except in situations where novel algorithms are described" — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)

### Inferences

- Non-goals and Alternatives considered are the two sections with the best value-to-effort ratio; both belong in a PRD (history), not in `design/` (current state).
- "Update until shipped, then link amendments" is the same split the developer proposes, minus the explicit current-state tree. Rule of thumb for `design/`: never paste schemas/interfaces that the code already defines; link to the code instead, since those are the parts that go stale fastest.
- The "mini design doc" (1–3 pages) is the right default size for a solo PRD.

### Gaps

- Post date not captured from the fetch; no 2024–2026 update to Ubl's post found.

## Shape Up (Basecamp): pitches and the betting table

### Takeaway

A Shape Up pitch has five ingredients: Problem, Appetite, Solution, Rabbit holes, No-gos. Pitches are rough (fat-marker sketches, breadboards), bets are made per six-week cycle at a betting table, and there is deliberately no backlog — unchosen pitches are let go. For a solo developer, "appetite" and "no-gos" are the most portable ideas.

### Cited Findings

- Ingredients: Problem — "The raw idea, a use case, or something we've seen that motivates us to work on this"; Appetite — "How much time we want to spend and how that constrains the solution"; Solution — "The core elements we came up with, presented in a form that's easy for people to immediately understand"; Rabbit holes — details called out to avoid unforeseen complications; No-gos — "Anything specifically excluded from the concept: functionality or use cases we intentionally aren't covering to fit the appetite or make the problem tractable" — [Shape Up ch. 6](https://basecamp.com/shapeup/1.5-chapter-06)
- Form: fat-marker sketches and breadboards rather than wireframes, which over-specify; pitches are stored as Messages in a "Pitch" category, read asynchronously; comments "poke holes or contribute missing information" — [Shape Up ch. 6](https://basecamp.com/shapeup/1.5-chapter-06)
- No backlog: "Backlogs are a big weight we don't need to carry"; "The time spent constantly reviewing, grooming and organizing old ideas prevents everyone from moving forward"; unchosen pitch → "we let it go. There's nothing we need to track or hold on to"; "Really important ideas will come back to you" — [Shape Up ch. 7](https://basecamp.com/shapeup/2.1-chapter-07)
- Betting table: "Before each six-week cycle, we hold a betting table where stakeholders decide what to do in the next cycle"; meetings are "infrequent, short, and intensely productive" — [Shape Up ch. 7](https://basecamp.com/shapeup/2.1-chapter-07)

### Inferences

- Borrow for the PRD template: an explicit Appetite line (time budget that constrains scope) and a No-gos list; Rabbit holes maps to a short "Risks / unknowns" section. These keep PRDs small and give a natural stop condition.
- Borrow the no-backlog stance: do not let `draft` PRDs accumulate as an implicit backlog. Either keep drafts few, or delete/reject drafts that have sat untouched, relying on "important ideas come back".
- The betting table maps to a solo "pick the next PRD" moment; it doesn't need a document of its own.

### Gaps

- Shape Up is product-planning, not design-documentation; it has no notion of a living design tree or of what happens to a pitch after shipping.

## Other notable processes: Swift Evolution, Ember RFCs, Go proposals, HashiCorp PRD/RFC

### Takeaway

Swift and Go use single files numbered by sequence or issue (`proposals/NNNN-name.md`, `design/NNNN-shortname.md`). Ember is the most interesting for the "history vs living docs" question: its post-merge stages (Ready for Release → Released → Recommended) explicitly include integrating the feature into guides/docs. HashiCorp splits a problem doc (PRD, "problem requirements document") from a solution doc (RFC) and uses a time-based threshold for when to write.

### Cited Findings

- Swift: files `proposals/NNNN-name.md`; states Awaiting review, Scheduled for review, Active review, Returned for revision, Rejected, Withdrawn, Accepted ("either awaiting implementation or is actively being implemented"), Accepted with revisions, Previewing, Implemented (for a specific Swift version); informal forum pitch first; review manager; reviews last "at least ten days, covering at minimum two consecutive weekends" — [swift-evolution process.md](https://github.com/swiftlang/swift-evolution/blob/main/process.md)
- Ember stages: 0 Proposed, 1 Exploring, 2 Accepted ("fully specified … Waiting for or in the process of implementation"), 3 Ready for Release ("implementation is complete according to plan outlined in the RFC"), 4 Released, 5 Recommended, plus Discontinued ("A previously Accepted RFC may be discontinued at any point" when superseded or out of date). Advancement is done by PRs that update RFC frontmatter; filename gets the PR number. Recommended: "If appropriate, the feature is integrated into the tutorial and the guides prose. API documentation is polished" — [emberjs/rfcs README](https://github.com/emberjs/rfcs/blob/main/README.md)
- Go: brief issue first; triage to accept, decline, or request a design doc; design doc checked in as `design/NNNN-shortname.md` "where `NNNN` is the GitHub issue number"; states Incoming, Active, Likely Accept/Likely Decline, Accepted/Declined, Hold; after approval "the issue is repurposed to track the work of implementing the proposal" — [golang/proposal README](https://github.com/golang/proposal/blob/master/README.md)
- HashiCorp: PRD defines the "why" (research plan, problem statement, who is affected); RFC proposes a solution (background ~1 paragraph, proposal ~1 paragraph, implementation details "a couple of pages"); "If implementing your idea will take less time than writing it up, you can probably go ahead without an RFC"; docs kept in Google Drive with public templates — [HashiCorp: Writing practices and culture](https://www.hashicorp.com/en/how-hashicorp-works/articles/writing-practices-and-culture)
- HashiCorp (secondary source): "Most large projects start with a PRD to define the problem and are followed by an RFC to propose a solution"; PRD was renamed from product to problem requirements document; the introduction "should be authored last" — [Slab: How HashiCorp makes writing a priority](https://slab.com/blog/how-hashicorp-makes-writing-a-priority/) (search snippet); template at [HashiCorp PRD template](https://www.hashicorp.com/en/how-hashicorp-works/articles/prd-template)

### Inferences

- Note naming collision: the developer's "PRD" covers problem + solution + tasks, i.e. HashiCorp's PRD and RFC combined. That is fine solo, but the README could keep the HashiCorp ordering (problem section first, solution second) so a PRD can stop at "problem only" while still a draft.
- Ember shows the developer's `implemented` status can carry a docs gate, as Ember's Recommended stage does. Ember needs four post-accept stages because releases, guides and multi-RFC suites are separate concerns; a solo developer needs one (`implemented` = code merged and `design/` updated).
- HashiCorp's threshold ("faster to do than to write → don't write") is a simple, memorable rule for when a PRD is needed at all.

### Gaps

- React RFCs were not researched in this session (no fetched source).
- Did not verify HashiCorp's internal document tool (Hermes) or how HashiCorp marks docs obsolete; the fetched article says nothing about staleness or archiving.

## Common failure modes and how projects handle "the proposal is history, the reference is current"

### Takeaway

Every mature process either (a) declares accepted proposals frozen history and moves the canonical spec elsewhere (PEP, Rust after RFC 1636, Ember's Recommended stage), or (b) keeps the proposal as a living doc (Oxide committed RFDs, KEPs). The recurring failures are process weight, proposals silently becoming the only documentation, inability to tell whether a proposal shipped as written, and accumulating unbuilt proposals. The fixes that work are gates on status transitions and explicit "this is history, see X" pointers, not more metadata.

### Cited Findings

- Proposals become the docs by default: Rust features were "documented *only* in the RFCs"; fix was a stabilization gate tied to "How We Teach This" — [RFC 1636](https://rust-lang.github.io/rfcs/1636-document_all_features.html)
- Drift is invisible: "There is no explicit process for updating RFCs … It is impossible to tell from reading an accepted RFC whether it was implemented or stabilised, and if it was, whether the implementation matched the RFC" — [Nick Cameron, 2022](https://www.ncameron.org/blog/the-problem-with-rfcs/)
- Weight: effort to write/manage/read, rigid template regardless of magnitude, no backpressure — [Nick Cameron, 2022](https://www.ncameron.org/blog/the-problem-with-rfcs/); KEPs counter weight with "Merge early and iterate" — [KEP README template](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
- Explicit history/current split: PEPs become "a historical document rather than a living specification", with canonical docs elsewhere — [PEP 1](https://peps.python.org/pep-0001/); `canonical-doc` banner — [PEP 12](https://peps.python.org/pep-0012/)
- Living-doc alternative: committed RFD is "an explanation of how a system works", updated infrequently — [RFD 1](https://rfd.shared.oxide.computer/rfd/0001); KEP "implemented … no longer actively changed" — [KEP-0000](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)
- Staleness tolerated but linked: amendments linked from the original — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)
- Backlog rot: "The time spent constantly reviewing, grooming and organizing old ideas prevents everyone from moving forward" — [Shape Up ch. 7](https://basecamp.com/shapeup/2.1-chapter-07)
- Tooling creep: a git-based process at scale needed an index CSV, short URLs, a bot, a search site and an API — [A Tool for Discussion](https://oxide.computer/blog/a-tool-for-discussion)
- When not to write at all: unambiguous solutions — [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/); faster to do than write — [HashiCorp](https://www.hashicorp.com/en/how-hashicorp-works/articles/writing-practices-and-culture)

### Inferences

Comparison at a glance (derived from the findings above):

| Process | Unit / layout | Number from | After implementation |
| --- | --- | --- | --- |
| Oxide RFD | `rfd/NNNN/README.adoc` | next free branch | committed; doc = current design |
| Rust RFC | `text/NNNN-name.md` | PR number | frozen; Reference is canonical |
| PEP | one file per PEP | editor-assigned | Final = history; canonical-doc banner |
| KEP | `keps/sig/NNNN-name/` + yaml | tracking issue | implemented; not actively changed |
| Swift SE | `proposals/NNNN-name.md` | sequence | Implemented (Swift x.y) |
| Ember RFC | `text/NNNN-name.md` | PR number | Released → Recommended (docs gate) |
| Go | `design/NNNN-name.md` | issue number | issue tracks implementation |
| Google doc | loose doc | none | drifts; link amendments |

Synthesis for the developer's blueprint (inferences, not sourced claims):

- The developer's model (folder per numbered PRD, PRD = history, `design/` = current state) is well supported: it is the PEP/Rust-after-1636 model with a KEP-style folder. Keep it.
- Make `implemented` a gate, not a label: a PRD may only move to `implemented` once its design delta is merged into `design/` (Rust RFC 1636, Ember Recommended). This single rule addresses the most common failure mode.
- Add a one-line historical banner on implemented/superseded PRDs pointing to the canonical `design/` file(s) (PEP 12 `canonical-doc`). Cheap, and it is what readers and coding agents actually see first.
- Supersede with two fields, both edited: `superseded-by: 0007` on the old PRD and `replaces: 0003` on the new one (PEP 1; KEP `replaces`). No separate supersession log needed.
- Consider trimming states. Existing processes manage with: draft → accepted → implemented, plus terminal rejected and superseded. `in-progress` has no analogue in KEP/Swift (Swift's Accepted explicitly covers "being implemented"); it can be inferred from task files. `withdrawn`/`abandoned` vs `rejected` collapse when author = decider.
- Template: a 1–3 page "mini design doc" with Problem, Appetite, Goals/Non-goals (No-gos), Proposed design, Alternatives considered, Risks/rabbit holes, Design delta, and an "As shipped / deviations" note filled in at `implemented`. Make all but Problem and Design delta optional to avoid Rust's rigid-template problem.
- Keep metadata in the README header, not a sidecar YAML; KEP's `kep.yaml` exists to feed CI validators across thousands of docs.
- Keep the index generated (or skip it and use `ls prd/`): Oxide's experience shows hand-maintained link lists don't scale, but a solo repo with folder-name slugs is self-indexing.
- Avoid: branch-per-proposal and PR discussion, FCP-style waiting periods, review roles, signoff checklists, type/category taxonomies, pasting schemas/interfaces into `design/` (they go stale fastest), and letting drafts accumulate as a backlog.

### Gaps

- No quantitative evidence found (e.g. surveys) on how often design docs go stale or how much process overhead costs; the failure-mode evidence is qualitative and from practitioners/maintainers.
- ADR (Architecture Decision Record) practices, an obvious neighbour to this topic, were out of scope here and may be covered by another researcher.
