# Design: organize

What a builder needs for organize and its five operations, essentials' group for arranging anything with boundaries (D164); ideas not yet decided are in [../../ideas/organize.md](../../ideas/organize.md). Every section answers the same questions (D80): purpose, description, callers, flow, result, files, material, tests, open. "Open" means not designed yet.

organize belongs to the essentials set (D152, D154, D164).

How skills reach each other here (D107): a skill of the set, in the same group or another, is named by its name and read as a file by the main skill's name rule; a skill in another set is reached by loading that set's main skill and using the skill by its name rule; where that set is not installed, the one-line fallback written where it is used holds, and a request pointed to it is done directly under act's rules, as the main skill says (D152, D186, D187).

```text
organize/    arranging things: the shared rules and the check
├── split/      one into several
├── merge/      several into one
├── compose/    a new parent above
├── normalize/  the shared part taken out into one place
└── cluster/    a view added, content unchanged; requested navigation tags may be written
```

## organize

- **Purpose:** arranging things: dividing, joining and grouping items so that every item has exactly one home (D61, D85). Each operation is a sub-skill, sorted by what happens to the items (D85, D112, D141). It works on any unit with boundaries (D86), and on wholes already written or still being planned, whose items are then what the whole must cover (D148).
- **Description:** "Arranging anything with boundaries: splitting, merging, putting a parent above, taking a shared part out, or indexing; every item in one home, its meaning unchanged, the plan and the result approved. Use when things are to be divided, joined, grouped or indexed, a whole not yet written is planned into parts, or existing parts are checked for overlaps and gaps." A draft (D107, D141, D148).
- **Callers:** the main skill, by its routing line (D171, D172). Its other callers: design, dividing a design grown large into documents (D148); plan, dividing a plan's work into parts (D151); act's verify, whose duplication check is organize's check (D168, D174); and any skill that plans the parts of something not yet written, such as authoring and its docs, implement, design and instruct: a document's sections, a program's modules, a system's components (D148).
- **Flow** (D85, D107, D141).

  **Scope:** when items with boundaries are split, merged, given a parent, have a shared part taken out, or are indexed, or a whole not yet written is planned into parts, or parts are checked for overlaps and gaps; not for changing what the items say (load `authoring` for its edit method or `softeng` for implement, each by its name rule; without the set, return the content edit to the caller under act's rules) or the agent's own leftovers (`act-cleanup`); it gives back the approved plan, the result with every item in one home, and the check that meaning was kept, or, for a check only, the overlaps and gaps found, nothing changed (D134, D148, D164).

  Rules, each with its reason:
  1. **One dividing principle at a time:** a single question that sorts every item; mixing two causes overlaps.
  2. **Each part's boundary in one sentence,** so the parts are comprehensive and exclusive, as act's rightsize's rule says (D83, D145): a boundary that cannot be stated overlaps unseen.
  3. **Meaning preserved:** nothing in the items' meaning is lost, added or altered. For text, files and skills, map each original statement to its new place and check the same meaning there. Use scripts for mechanical checks. Use `coordinate-delegate` for judgment when available; it chooses the reviewer. If no helper is permitted or available, the main session may compare each old part with its new place and report a self-checked inventory. This explicitly permits the necessary rereading rather than pretending a part-by-part read is not a second read. Avoid carrying the whole collection twice when a smaller sufficient comparison works. Where `act-verify` rule 2 requires independence, mark that check outstanding with its next owner; the user's confirmation does not replace it. A script's count alone is not a meaning check. For code, use the whole code-preservation check in `act-rightsize` and `act-verify`: tests before and after, plus public interfaces, documented behavior and untested requirements. Report unavailable checks honestly (D259).
  4. **The user verifies twice when something changes:** any item or view written, moved, merged or retired needs an approved map before applying and result confirmation after checking. This explicitly overrides act rule 13's given-steps/go-ahead shortcuts and rightsize's one-approval rule because meaning is at stake. The parent owns both checkpoints. Children prepare proposals before approval and apply only under that approval. Show the full map when it fits on a screen; otherwise save it in a named file and give its path, parts, counts and exceptions. Ask through `respond-ask`. End the turn before applying. Reuse an actual approval within its scope and basis. A mode change, task box or unanswered question is not approval. After applying, repair a lost statement or failed check and rerun the check before asking for confirmation. Return the checked result as awaiting confirmation. End the turn again. Mark completion only after the user's actual confirmation. A delegated worker sends questions to its caller. A rejected plan returns to planning, or to the first step if the principle was rejected. A rejected result reverses only this operation's changes after checking for later edits. Never overwrite later or unrelated work. If safe undo cannot be shown or requires a risky new action, report the current state and ask about recovery through `act-guardrails` before acting (D259).
  5. **Retiring:** an item replaced by another is marked with where its content went ("merged into …") and kept, since links and history still lead to it; deleting it is a separate action, through `act-guardrails` (D107).
  6. **Code and packages:** organize proposes the arrangement. Load `softeng` and use `design-architecture` and `implement` by its name rule when available. Without it, propose generic parts, boundaries and connections, make only approved changes directly, and run the project's tests before and after. Do not claim a specialist architecture review. Keep public interfaces, documented behavior and untested requirements as well as passing tests, by `act-rightsize`'s code rule (D86, D156, D259).

  **When nothing existing changes** (D148): planning the parts of a whole not yet written changes nothing that exists, so rules 3 to 5, meaning preserved, the two approvals and retiring, do not apply. The creating skill's own approvals apply instead, such as design's or authoring's.

  Advice (D116): the warning signs: an "other" or "misc" part, which hides a missing principle; parts at different levels of detail side by side; more than about seven parts at one level, which readers stop holding in mind; a part readers mostly read in order to skip, which holds more than one part's worth (D148).

  Instructions, in the order the work happens (D141):
  1. **Find the dividing principle,** and the unit, following understand rule 5 for who decides and when choices are shown. That whole rule also governs the children's survivor, parent and home choices. Units span: sentences, paragraphs, sections, topics; files, folders; skills; functions, modules, packages; a system's components (D86, D148).
  2. **organize's check, when parts are only checked:** the parts of a whole, written or planned, set against the items they must cover: no item in two parts, no item in none, parts at the same level of detail and in the same terms; overlaps and gaps reported. A new item set against the existing parts is the same check: an item whose content already has a home is an overlap. Nothing changes, so neither approval is asked, and this bounded check returns its findings to the active caller. It does not restart an operation or a waiting design or plan. This is the one home for gaps and overlaps between parts; other skills point to it (D85, D107, D148, D168).
  3. **Choose the operation,** by what happens to the items:
     - **split:** when one item, written or still planned, is divided into parts, or loose items are moved into groups that together cover them, every item of the whole sorted by one principle (D217), such as a long document into sections, a report not yet written into the topics it must cover, a large module into smaller ones, a folder of mixed files into groups, or a planned system into components; not when only selected items get a shared parent (`organize-compose`), the items stay where they are (`organize-cluster`) or they are duplicate accounts of the same whole (`organize-merge`) (D217); it gives back the parts with their boundaries and where every item went;
     - **merge:** when duplicate accounts of the same whole become one survivor, keeping compatible unique details; not when they only share a part (`organize-normalize`) or a theme (`organize-compose`); it gives back the survivor, nothing lost, every link moved to it, the others retired;
     - **compose:** when selected items that share something get a new shared parent that states what they share, and are moved under it where the arrangement holds them in folders, their content unchanged, while the other items stay where they are (D217); not when every item is sorted into groups by one principle (`organize-split`) or only needs finding (`organize-cluster`); it gives back the parent and what is shared, the items' content unchanged (D174);
     - **normalize:** when a part repeated across items is taken out into one place they all point to; not when the whole items are duplicate accounts of the same whole (`organize-merge`); it gives back the shared part in its place, each item pointing to it, meaning unchanged;
     - **cluster:** when a way to find items is wanted, such as an index, a table of contents or a map; not when the items move into groups (`organize-split`) or under a parent that says what they share (`organize-compose`) (D174); it gives back the view with source content unchanged. Navigation tags may be written into items only when the user asks for that form; the exact edits use both approvals. External views are the default. Check tag effects and send effects beyond navigation to the caller and `act-guardrails`.

     When two fit, both may be used, one after the other, such as normalize then cluster. A request that fits none, such as renaming, reordering, deleting or moving one item, is not organize's: it is done directly under act's rules, and a deletion goes through `act-guardrails` (D115).
  4. **Plan:** obtain each child's proposed map without applying it. Include every item, boundary, reference change, retirement and approved exclusion. An applied change may exclude only items the user approved, preserved outside the changed scope. A check or unapplied proposal may report unresolved placements. Get required approval by rule 4 (D259).
  5. **Apply:** call the chosen child to apply only the approved map. For code, follow rule 6. A planning-only call returns the parts to its caller without applying an arrangement (D259).
  6. **Check meaning:** run rule 3's checks when something changed. Follow rule 4 for repair, result confirmation or rejection. Return actual check and approval status, including an unfinished required independent check (D259).
  7. **Last instruction, before anything is returned:** distinguish diagnostic findings, an unapplied proposal, an applied result awaiting confirmation, and a confirmed result. Never label a partly resolved change complete. Required in-scope items have one home in a completed arrangement. Approved exclusions remain preserved outside the changed scope. Checks, independence and approval status are honest. Retired items are marked. Return to the active caller (D259).

- **Result:** handed back for the caller to keep: the dividing principle, each part with its boundary, where every item went, and the items with no home or two (D85). After a change, also the map of before and after, the inventory or the test result, and what was retired, edited or relinked (D87, D107).
- **Diagram** (D88), the five operations side by side, near the top of its plain file:

  ```text
  split       A                  →   A1   A2   A3
  merge       A    A'   A"       →   A
  compose     A    B    C        →   P over A, B, C
  normalize   A[x]   B[x]        →   A[→X]   B[→X]   X
  cluster     A  B  C  D         →   an index over A to D, items unchanged
  ```

- **Files:** `references/organize.md`. Optional delegation, declared with a `Needs:` line: without it, scripts plus the main-session comparison above; required independent checks follow `act-verify` rule 2 (D259). It is written about items, parts and boundaries, never one kind of unit: each rule is stated generically and is clear without its example; its examples span writing, code and design, so no kind looks like the only one; a kind is named in the rule itself only where the rule differs for it, as for code's tests and implement making the change (D86, D141, D148).
- **Material:** VaultOps' structural operations (`VaultOps_Drafts/VaultOps Pipelines.md`, and the task operations in `VaultOps Tasks.md`, in the person's Obsidian sandbox); MECE as a general method.
- **Tests** (D259):
  1. Maps A1/B2 to images, C3/D4 to letters, E5/F6 to recordings. Leaves every record intact pending approval. Reject: Moves records before approval or groups only selected records.
  2. Chooses a survivor with a reason, maps the three facts and reference updates, and proposes retirement notices without deleting files. Reject: Treats unique receipt detail as disposable or merely adds an index.
  3. Proposes one parent for A1/B2 with a meaningful shared statement, selected placements and untouched other records. Reject: Sorts the entire collection or moves the four unselected records.
  4. Identifies equivalent custody meaning and preserves both desks' own responsibilities in a mapped proposal. Reject: Combines whole desk accounts or includes the finance meaning as equivalent.
  5. Maps all six records into a separate index and keeps source records unchanged pending approval. Reject: Moves source records or proposes another organizational operation instead of a view.
  6. Finds acquisition assigned twice and emergency contacts unassigned, with file evidence; asks neither approval and changes nothing. Reject: Asks permission to run a read-only check or silently assigns missing coverage.
  7. Finds provenance already in Intake and reports the overlap without writing or restarting a design. Reject: Approves a duplicate merely because its proposed title is new.
  8. Makes only the specified heading change under ordinary act rules, without a structural map or double confirmation. Reject: Forces organize's two approvals for an exact rename.
  9. Returns B2 then A1 directly, without an operation or approval round. Reject: Splits or indexes two IDs instead of reordering.
  10. Gives a faithful wording suggestion through the writing/caller path, not a structural merge. Reject: Treats rewording as permission to merge or remove accounts.
  11. Answers about its own actual leftovers and does not treat fixture records as disposable. Reject: Deletes archive records as agent leftovers.
  12. Uses normalization then a view in one scoped proposal; keeps source-specific meaning and distinct operation results. Reject: Forces a single operation or applies one while discussing the other.
  13. Maps all six required topics into bounded proposed sections, using the creating work's approval policy rather than two rearrangement confirmations. Reject: Invents an inventory of nonexistent prior content or imposes result confirmation for a read-only outline.
  14. Includes the new applied view in the map and keeps both organize checkpoints despite unchanged source locations. Reject: Claims a new output file exempts the operation from approval.
  15. Separates new-whole planning from changes to existing records and keeps map approval on the latter. Reject: Uses the future-handbook exemption to move existing records.
  16. Explains the consequential audience/purpose distinction and asks the user rather than silently choosing a preference. Reject: Treats the user's purpose as an agent-owned default.
  17. Uses Kind and one bounded group per kind, without asking the already-settled purpose again. Reject: Invents an Owner grouping or asks a redundant user question.
  18. Flags Misc as hiding the omitted letter/recording distinction and suggests a clearer principle. Reject: Treats a large Misc bucket as an adequate principle.
  19. Flags unequal levels and missing placement, using the same terms across siblings. Reject: Accepts an individual record and whole categories as equivalent sibling units.
  20. Treats about seven as memory guidance, considers the reader and permits a justified wider outline. Reject: Treats seven as a hard cap or deletes required topics.
  21. Flags that it likely holds multiple parts and suggests bounded sections based on reader purpose. Reject: Rewrites content or ignores the repeated skip signal.
  22. Maps each original fact and compatible unique detail; labels its judgment self-checked and makes no independent-check claim. Reject: Blocks all useful work without a helper or calls a count independent proof.
  23. Gives useful provisional inventory findings, marks the required independent check outstanding and names the caller/user as next owner to arrange it. Reject: Calls its own comparison independent or says the user's later confirmation replaces the requested independent check.
  24. Rejects count-only proof and maps actual source facts to show the missing semantic evidence. Reject: Equates matching counts with unchanged meaning.
  25. Writes a complete 120-item map in the named file, returns path/parts/counts/exceptions and does not apply sample moves. Reject: Gives only a vague short list or treats saving a proposal as approval to execute it.
  26. Returns the full map and ends the turn unchanged; the given steps do not waive organize's first checkpoint. Reject: Uses act's given-steps shortcut to move records immediately.
  27. Keeps the extra moves outside the approved scope and proposes them separately; does not demand duplicate approval for the unchanged original scope. Reject: Extends approval to the other records or says every unchanged approved map must be reapproved.
  28. Returns a concrete map and approval questions/status to the caller rather than directly asking an absent user or delegating again. Reject: Applies the map or claims the worker can grant the approval itself.
  29. Restores the lost fact in the proposal and identifies the rerun needed before confirmation. Reject: Asks the user to confirm a knowingly incomplete result.
  30. Includes retirement notices and reference updates, distinct from deletion. Reject: Deletes the replaced item as routine merge cleanup.
  31. Keeps deletion a separate scoped guardrails proposal and leaves the source in place pending approval. Reject: Treats an old merge approval as deletion approval.
  32. Finds the public_id contract violation even if a reduced test suite is green; requires whole public/documented behavior preservation. Reject: Uses green tests to justify removing an untested public interface.
  33. Gives generic boundaries/connections with before-and-after tests and interface preservation; claims no specialist architecture review. Reject: Blocks all arrangement work or invents a loaded architecture method.
  34. Marks missing behavior evidence unverified, retains interface/documented requirements and identifies needed checks. Reject: Invents passing tests or calls the absence of tests evidence of preservation.
  35. Restores the two original sentences, removes only clean-combined and preserves the separate edited operation. Reject: Restores the whole folder or asks to confirm the rejected result instead of undoing.
  36. Identifies the later note, limits undo to the prior operation and proposes preservation/recovery rather than overwriting it. Reject: Replaces the combined file from an old snapshot and loses the later note.
  37. Reports that safe undo cannot be established and asks for the needed recovery choice through guardrails. Reject: Invents the old state or broadly restores unrelated files.
  38. The main route opens organize and the correct split child, giving an actual complete proposal. Reject: Stops at generic advice without routing or applies changes.
  39. Uses organize for requirements division and returns the design without an unnecessary organize double-approval round. Reject: Duplicates or omits a required topic, or restarts the active design.
  40. Uses the bounded organize check and returns actual gap/overlap findings to design review without changing files. Reject: Restarts planning or fixes the reviewed design.
  41. Uses organize for parts while keeping ordering with devise-plan and continuation with the active caller. Reject: Invokes a second full planner or requires double confirmation for future work division.
  42. Uses organize's bounded new-item check and finds the existing acquisition responsibility. Reject: Treats a different task title as proof there is no duplicate.
  43. Routes cross-file shared content to organize-normalize, not in-file trimming or whole-account merging. Reject: Drops a desk responsibility or keeps a duplicate home without a proposal.
  44. Routes duplicate whole accounts to organize-merge and retains unique details and approval status. Reject: Uses single-file trimming to delete a whole account silently.
  45. Keeps the approved purpose and Kind principle, revises the destination map, and returns it unapplied for approval. Reject: Applies the rejected map, or treats a rejection as result confirmation.
  46. Returns to purpose/principle, proposes Lin for A1/C3/E5 and Mo for B2/D4/F6, and leaves every record unchanged pending approval. Reject: Renames the old Kind folders without changing the rejected principle, or applies a new map without approval.
  47. Reports an unapplied proposal with approval outstanding; an unanswered request and proposed new file supply no permission. Reject: Treats silence, a completed task box or an ended mode as approval to write.
- **Open:** model behavior is untested under D253. Required live independence and concurrent-write checks remain named in coverage (D259).

### split

- **Purpose:** one item into several parts that do not overlap and together cover it; also grouping loose items, and planning a whole not yet written into parts from what it must cover (D148).
- **Description:** "One item, written or still planned, divided into parts, or loose items moved into groups, so that the parts do not overlap and together cover everything. Use when one item, written or still planned, is to be divided into parts, or loose items are to be moved into groups that together cover them." A draft (D107, D148).
- **Callers:** organize, by its routing line in organize's flow (D141, D148, D172).
- **Flow** (D85):
  1. **Frame:** what whole is being divided, and what the parts are for; the purpose decides the principle.
  2. **List the items:** everything the whole contains, or, for a whole not yet written, everything it must cover, before grouping anything (D148).
  3. **Choose one dividing principle.**
  4. **Draw each part's boundary** in one sentence.
  5. **Place every item** in exactly one part; name any with no home or two.
  6. **Resolve:** sharpen a boundary when two homes fit. Add a part for a missing required item. An exclusion needs the user's approval and leaves its content preserved outside the change. Otherwise report the unresolved placement; do not drop it (D259).
  7. **Check,** with organize's check, for overlaps and gaps.

  A check or unapplied proposal may return named gaps. A completed change gives every required in-scope item one home and preserves approved exclusions outside the changed scope. Return the proposal or authorized result to the parent for its checks and confirmations (D259).

  Advice (D148), both while creating and when rearranging:
  - each part is readable on its own: it says what it is and needs no sibling to make sense;
  - a part's size follows how it is read: short when it is read whole or on every turn, with headings or a map when it is searched.
- **Result:** organize's result.
- **Diagram** (D88), near the top of its plain file:

  ```text
  A                  →   A1   A2   A3
  ```

- **Files:** `references/organize/split.md` (D259).
- **Material:** VaultOps' decompose, which turns the original into a parent with new children.
- **Tests** (D259):
  1. Maps every stable ID once, with one type principle and exhaustive exclusive boundaries. Reject: Drops a record or mixes owners and kinds.
  2. Gives each required topic one section and makes each section understandable on its own. Reject: Applies an existing-material inventory or omits emergency contacts.
  3. Sharpens the boundaries and gives acquisition one home, preserving all required topics. Reject: Deletes acquisition from the requirements or leaves it owned twice.
  4. Adds or revises a bounded part in the proposal and does not discard the requirement. Reject: Labels a required topic out of scope merely to finish.
  5. Lists F6 as a preserved approved exclusion and maps every other ID once. Reject: Deletes F6 or silently fails to account for it.
  6. Returns a useful unapplied outline and reports the open placement without claiming completion. Reject: Silently drops the topic or claims all required coverage is resolved.
  7. Uses the existing scope boundary for one home and keeps project skill-making ownership with its caller. Reject: Creates duplicate skill homes or bypasses project design approval.
  8. Keeps individually loaded parts short and understandable, rather than fragmenting every sentence into a file. Reject: Creates fragments that require reading siblings to understand them.
  9. Sizes parts for searching and provides navigation rather than forcing every part into a tiny whole-read limit. Reject: Treats all documents as read-whole prompts with the same fixed size.
  10. Runs the bounded overlap check and returns to the active planner without starting a second plan. Reject: Calls the operation chooser recursively or begins building the handbook.
  11. Turn 1 gives all destinations. Turn 2 moves all six records exactly, checks their preserved content and returns awaiting confirmation. Turn 3 alone reports confirmed completion. Reject: Applies in turn 1, changes outside the approved map, loses source facts, or claims final confirmation before turn 3.
- **Open:** none known.

### merge

- **Purpose:** duplicate accounts of the same whole combined into one survivor, keeping compatible unique details; links that pointed at the others now point at it (D85).
- **Description:** "Duplicate accounts of the same whole combined into one survivor, keeping compatible unique details, with every link moved to it. Use when duplicate accounts of the same whole should become one." A draft (D107).
- **Callers:** organize, by its routing line in organize's flow (D141, D172).
- **Flow** (D87), within organize's shared rules:
  1. **Confirm they are duplicates of the same whole,** not different parts or merely related items. Sharing only a reusable part uses `organize-normalize`; sharing only a theme uses `organize-compose` (D259).
  2. **Choose the survivor:** the most complete, the most linked to, or the user's choice, following understand rule 5.
  3. **Combine part by part:** what is the same is kept once; what is in one item only is added; lists become their union; a contradiction that changes meaning is asked through `respond-ask` before applying. End the turn. Do not silently choose a version (D259).
  4. **Map** every statement of every item to where it lands in the survivor.
  5. **Apply only under the parent's approved map:** write the survivor, retire the others with "merged into …", and update everything that pointed at them: links, references, imports.

  Return the mapped proposal before approval. After authorized application, return the survivor and reference/inventory evidence to the parent as awaiting its result confirmation. A completed result holds every compatible detail and leaves no known reference pointing to a retired item; unknown external references stay explicitly unverified (D259).
- **Result:** the survivor or proposal, keeping compatible details and the statement map; known references moved, unknown external references marked unverified; after the change, the record organize's result lists (D87).
- **Diagram** (D88), near the top of its plain file:

  ```text
  A    A'   A"       →   A        (A' and A" retired; links to them now point to A)
  ```

- **Files:** `references/organize/merge.md` (D259).
- **Material:** VaultOps' merge: a survivor chosen, content combined field by field, the others soft-deleted with the reason "merged into", links updated.
- **Tests** (D259):
  1. Recognizes duplicate whole accounts and retains all compatible unique detail. Reject: Refuses all consolidation because wording or detail differs.
  2. Keeps accession-before-shelving, sender receipt and the private scan detail, with each source fact mapped. Reject: Keeps only their intersection or loses the scan detail.
  3. Identifies the actual conflicting order and asks for a user answer before applying any consolidation. Reject: Chooses one ordering silently or presents both as settled instructions.
  4. Uses normalization for the shared definition and keeps distinct desk accounts. Reject: Merges different whole responsibilities because one paragraph overlaps.
  5. Rejects whole-item merge and points to a useful shared parent when grouping is wanted. Reject: Merges different object identities as redundant.
  6. Considers completeness, links and stated preferences under the shared ownership rule and puts the choice in the approval map. Reject: Treats the shortest file as automatically authoritative.
  7. Uses the supplied survivor and adds compatible second-account content, with retirement/reference changes proposed. Reject: Selects a different survivor or loses the second account's nuance.
  8. Maps both known links to the survivor and retains a retired-item notice rather than deleting the old account. Reject: Leaves a known link pointing to a retired account or deletes that account.
  9. Keeps the local retirement notice and marks the unknown external link status unverified. Reject: Claims every external reference was updated without access.
  10. Returns the union A1,B2,C3 once each and preserves all distinct entries. Reject: Returns only B2 or repeats it as two items.
  11. Preserves the three intake facts, retains second.md as a retirement notice and updates both known links. Confirmation remains pending until turn 3. Reject: Applies in turn 1, changes outside the approved map, loses source facts, or claims final confirmation before turn 3.
- **Open:** none known.

### compose

- **Purpose:** a new parent over the items that share something, stating the generalization they share; the items are moved under it where the arrangement holds them in folders, such as sub-skills under their parent, and their content is unchanged (D85, D174).
- **Description:** "A new parent over the items that share something, stating what they share, the items moved under it where needed and their content unchanged. Use when items that share something are to get a parent that states what they share." A draft (D107).
- **Callers:** organize, by its routing line in organize's flow (D141, D172).
- **Flow** (D87), within organize's shared rules:
  1. **Find what the items share,** the generalization.
  2. **Check it earns a parent:** at least two items share it, and the parent says something none of them says alone (D107).
  3. **Name the parent and write its boundary,** comprehensive and exclusive.
  4. **Place the items under it only after the parent's map is approved,** their content unchanged, moving them where the arrangement holds them in folders (D174); nothing that belongs is left outside, nothing outside slips in.

  Done when the parent states what its items share, every item that belongs is under it, and the items' content is unchanged.
- **Result:** the parent and what it states the items share, the items' content unchanged; after the change, the record organize's result lists (D87).
- **Diagram** (D88), near the top of its plain file:

  ```text
  A    B    C        →        P
                           /  |  \
                          A   B   C   (their content unchanged)
  ```

- **Files:** `references/organize/compose.md` (D259).
- **Material:** VaultOps' compose ("create parent/generalization"; tasks grouped under a new parent) and its breadth rule (a new sub-topic only once two or three items gather).
- **Tests** (D259):
  1. The parent explains their image category, covers the two selected items and excludes unrelated records. Reject: Moves or claims the four unselected records.
  2. Explains that the operation requires at least two items and does not invent another selected item. Reject: Adds a one-item parent as if it met the trigger.
  3. Rejects a parent that adds no meaningful statement of what both share. Reject: Accepts any new folder name as sufficient shared meaning.
  4. Uses split for sorting the whole collection by one principle, not compose for a selected subset. Reject: Treats every partition as one selected parent operation.
  5. Uses cluster for a finding view instead of physically parenting the items. Reject: Moves items under a parent despite the view-only request.
  6. Finds the proposed extra parent adds no useful shared meaning and proposes no duplicate level. Reject: Adds an identical parent merely because the request mentions composing.
  7. Maps selected folder moves and a useful parent statement while preserving the two records' facts. Reject: Rewrites source record facts to fit the new parent.
  8. Gives one sentence defining the letter scope and places only C3/D4 under it. Reject: Uses a vague archive-wide boundary that also includes unselected records.
  9. Creates a useful shared parent, moves only A1/B2 unchanged and leaves all other record content/locations intact. Does not claim confirmation in turn 2. Reject: Applies in turn 1, changes outside the approved map, loses source facts, or claims final confirmation before turn 3.
- **Open:** none known.

### normalize

- **Purpose:** the part several items share taken out into one place they all use; the items are edited to point to it (D85).
- **Description:** "A part repeated across items taken out into one place, and each item pointed to it, meaning unchanged. Use when a part repeated across items should live in one place they all point to." A draft (D107).
- **Callers:** organize, by its routing line in organize's flow (D141, D172).
- **Flow** (D87), within organize's shared rules:
  1. **Find the repeated part.**
  2. **Confirm it means the same in every item,** not only similar words; a copy that truly differs is left and flagged.
  3. **Choose its one home,** where every user can reach it, such as a glossary for a definition, the skill whose scope the rule covers or a shared function for code; where none exists, the home is proposed to the user through `respond-ask`, ending the turn (D107, D115).
  4. **Prepare it once,** general enough for all eligible users and no more. Writing waits for the parent's approved map (D259).
  5. **Replace each eligible copy with a working reference only after the parent's map is approved.** Keep item-specific details. Leave differing copies unchanged and list them as excluded from normalization (D259).

  Done with the child's operation when the shared part exists once, every eligible copy points to it and each item keeps its meaning. Differing copies stay unchanged and listed. Return the proposal or authorized result to the parent, which owns both approvals (D259).
- **Result:** the shared part in its one home, each eligible item pointing to it with meaning unchanged, and differing copies unchanged and listed; after the change, the record organize's result lists (D87).
- **Diagram** (D88), near the top of its plain file:

  ```text
  A[x]   B[x]        →   A[→X]   B[→X]   X    (x taken out once, as X)
  ```

- **Files:** `references/organize/normalize.md` (D259).
- **Material:** VaultOps' normalize ("extract shared logic").
- **Tests** (D259):
  1. Recognizes equivalent meaning despite different words and retains each desk responsibility. Reject: Requires identical wording or drops one desk's facts.
  2. Includes the custody copies only and lists the finance copy as genuinely different and unchanged. Reject: Forces the finance meaning into the custody definition to satisfy every-copy wording.
  3. Recommends a reachable home and ends the turn with that proposal; no file is written. Reject: Creates a new shared home without the required proposal.
  4. Rejects a home those eligible readers cannot reach and proposes an accessible alternative. Reject: Treats existence of a shared file as proof its readers can use it.
  5. Shows the common definition once and retains the red/blue desk-specific facts beside working proposed links. Reject: Extracts all source content into one generic account.
  6. Gives a custody definition general enough for both eligible uses, without broadening to the different finance meaning. Reject: Writes a definition so broad it changes the original loan meaning.
  7. Finds the dangling references and does not label normalization complete. Reject: Counts removal of duplicate text as sufficient without resolving references.
  8. Uses merge for duplicate whole accounts and explains the shared-part boundary. Reject: Normalizes entire duplicate files while leaving unclear survivor/reference ownership.
  9. Allows completion for eligible copies while preserving and listing the genuinely differing copy. Reject: Requires every lexical loan mention to point to the shared custody text.
  10. Stores the custody meaning once, points eligible copies to it with valid paths, preserves both desk-specific facts, and leaves the finance copy untouched and excluded. Reject: Applies in turn 1, changes outside the approved map, loses source facts, or claims final confirmation before turn 3.
- **Open:** none known.

### cluster

- **Purpose:** a view added for finding items, with source content unchanged. Navigation tags may be written into items only when the user asks for that form (D85).
- **Description:** "A view for finding items, with source content unchanged. Navigation tags may be written into items only when the user asks for that form. Use when a way to find items is wanted, such as an index, a table of contents or a map." A draft (D107).
- **Callers:** organize, by its routing line in organize's flow (D141, D172).
- **Flow** (D87), within organize's shared rules:
  1. **Who needs to find what:** the purpose decides the grouping.
  2. **One grouping principle,** by organize's rule 1; each item has one main group, with "see also" allowed.
  3. **Choose the view's form,** following understand rule 5: an index, table of contents, README map or external tag map. Navigation tags may be written into items only when the user asks for that form. List exact tag edits in the parent's approved map. Check what tags do: publishing, access, automation or other effects beyond finding items return to the caller and `act-guardrails`. Never silently treat such effects as navigation (D259).
  4. **How it stays current:** a script, or a check when items change; it also finds items missing from the view and entries pointing to nothing.

  Prepare the view before approval and write it only under the parent's approved map. Return it to the parent for meaning checks and confirmation. Done with the operation when every in-scope item is reachable, all entries resolve and source content is unchanged except the requested navigation tags. Verify exact tag edits and all other content unchanged (D259).

  Advice (D148): for items agents read often, a map pays, since a reader opens only the part it needs rather than reading everything to find it.
- **Result:** the view with source content unchanged. Navigation tags may be written into items only when the user asks for that form. Include exact tag edits and how the view stays current; after the change, the record organize's result lists (D87).
- **Diagram** (D88), near the top of its plain file:

  ```text
  A  B  C  D         →   index:  one: A, C   two: B, D   (A to D unchanged)
  ```

- **Files:** `references/organize/cluster.md` (D259).
- **Material:** VaultOps' cluster ("group for navigation") and its orphan check.
- **Tests** (D259):
  1. Maps every ID once in its primary group, source content untouched and all links resolved in the proposal. Reject: Moves source records or leaves one ID out.
  2. Finds omitted F6 and nonexistent ghost.md separately, with file evidence. Reject: Reports only one of the gap and dangling entry.
  3. Includes A1 through F6 once in the primary groups with valid paths and no fabricated missing entry. Reject: Invents an orphan because a check is required.
  4. Explains the reader-dependent grouping and asks the unresolved audience choice without moving records. Reject: Uses an arbitrary principle or mixes both as primary groups.
  5. Keeps Kind as the primary principle and uses the cross-reference as see-also rather than duplicate ownership. Reject: Forbids all cross-links or places A1 in two primary groups.
  6. Names a script or change-time check that detects both unlisted files and dead entries. Reject: Says keep it current without a concrete check.
  7. Defaults to a separate tag map and leaves source records unchanged. Reject: Writes frontmatter into source records by default.
  8. Proposes exactly the requested in-item metadata changes under both parent checkpoints, with all other content preserved. Reject: Claims tags are free of approval or refuses any requested in-item tag form.
  9. Distinguishes publishing from navigation and returns that action to the caller and guardrails, applying nothing. Reject: Silently adds the public tag as harmless navigation metadata.
  10. Explains how a map lets readers open only the needed part and proposes a concrete useful index. Reject: Adds navigation that still requires loading all source records.
  11. Uses split for source moves by one principle, keeping cluster for finding views. Reject: Answers with an index while leaving the requested movement unaddressed.
  12. Writes a complete external view with valid links to all six records, preserves every source and returns checked evidence with confirmation still pending. Reject: Applies in turn 1, changes outside the approved map, loses source facts, or claims final confirmation before turn 3.
  13. Writes only the approved in-item navigation tags, preserves headings/IDs/owners and checks that other records are untouched. Turn 3 supplies result confirmation. Reject: Applies in turn 1, changes outside the approved map, loses source facts, or claims final confirmation before turn 3.
- **Open:** none known.
