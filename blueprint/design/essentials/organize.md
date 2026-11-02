# Design: organize

What a builder needs for the `organize` guide and its five operations, essentials' group for arranging anything with boundaries (D164); ideas not yet decided are in [../../ideas/organize.md](../../ideas/organize.md). Every section answers the same questions (D80): purpose, description, callers, flow, result, files, material, tests, open. "Open" means not designed yet.

the `organize` guide belongs to the essentials set (D152, D154, D164).

How guides reach each other here (D107, D186, D279, D281): essentials is the skill; its references are guides. The main skill’s guide map and name rule resolve a guide’s name to its file and parents. For another kind of work, use a skill in the harness’s list that covers it, if one fits. Otherwise use the fallback beside the call, under the `act` guide’s rules. Essentials names no other set.

```text
organize/    arranging things: the shared rules and the check
├── split/      one into several
├── merge/      several into one
├── compose/    a new parent above
├── normalize/  the shared part taken out into one place
└── cluster/    a view added, content unchanged; requested navigation tags may be written
```

## organize

- **Purpose:** arranging things: dividing, joining and grouping items so that every item has exactly one home (D61, D85). Each operation is a child guide, sorted by what happens to the items (D85, D112, D141). It works on any unit with boundaries (D86), and on wholes already written or still being planned, whose items are then what the whole must cover (D148).
- **Guide purpose** (D283): Arranges existing or planned parts without changing their meaning, and checks for missing or overlapping parts.
- **Guide shape** (D283, D287): Instructions opens with its goal and one clear instruction: build the map first, then change only what the user approved. The seven steps keep their order and numbers; each now says what goes wrong without it, with bullets for doing it well. Step 4 shows the before-and-after map, checked for gaps and overlaps, and ends the turn: a firm step, by rule 4. Child names stay bullets under step 3. Rules 1–10 keep their numbers. Step 6 returns the checked inventory as the before-and-after map (D293). The check is step 7, always last (D285).
- **Description:** "Arranging anything with boundaries: splitting, merging, putting a parent above, taking a shared part out, or indexing; every item in one home, its meaning unchanged, the plan and the result approved. Use when things are to be divided, joined, grouped or indexed, a whole not yet written is planned into parts, or existing parts are checked for overlaps and gaps." A draft (D107, D141, D148).
- **When to use** (D279): Use when existing or planned parts need arranging without changing what they mean. Also use to check for missing or overlapping parts, such as whether planned sections cover every requirement.
- **When not** (D279, D293):

  - Changing what the content says: use a skill in the harness’s list for editing documents or code, if one fits. Otherwise return the edit to the main task under the `act` guide. The `organize` guide preserves meaning.
  - Choosing the order of work steps: use the `devise-plan` guide. An arrangement of parts is not an execution plan.
  - Renaming, reordering or moving one item: do it as ordinary work under the `act` guide. One item has no parts to arrange.
  - Deleting items: use the `act-guardrails` guide. A deletion can lose what cannot be brought back.
  - Your own leftovers from the task: use the `act-cleanup` guide. They are not the user's material.
- **Callers:** the main skill, from the main map, with its parent path read first (D279). Its other callers: the `devise-design` guide, dividing a grown design into documents (D148); the `devise-plan` guide, dividing a plan’s work into parts (D151); the `act-verify` guide, whose duplication check is the `organize` guide’s check (D168, D174); and any guide or skill that plans the parts of something not yet written, such as a document’s sections, a program’s modules or a system’s components (D148, D281).
- **Flow** (D85, D107, D141).

  **Scope:** when items with boundaries are split, merged, given a parent, have a shared part taken out, or are indexed, or a whole not yet written is planned into parts, or parts are checked for overlaps and gaps; not for changing what the items say (use a skill in the harness’s list for editing documents or code, if one fits; without a matching skill, return the content edit to the caller under the `act` guide's rules) or the agent's own leftovers (the `act-cleanup` guide); it gives back the approved plan, the result with every item in one home, and the check that meaning was kept, or, for a check only, the overlaps and gaps found, nothing changed (D134, D148, D164).

  Rules, each with its reason, numbered as in the file (D293):
  1. **One dividing principle at a time:** a single question that sorts every item; mixing two causes overlaps.
  2. **Each part's boundary in one sentence,** so the parts are comprehensive and exclusive, as the `act-rightsize` guide's rule says (D83, D145): a boundary that cannot be stated overlaps unseen.
  3. **Meaning preserved:** nothing in the items' meaning is lost, added or altered, since a statement lost in a move is hard to see once the move is done. Before any change, map every original statement, or each section that moves unchanged, to its new place; this map is the inventory, and it is the map shown for approval. After the change, check the result against the inventory, by step 6. A script's count alone is not a meaning check: the same number of lines can hide one changed rule. Call the check independent only by the `act-verify` guide's rule 2. Where that rule requires independence and the check cannot run, mark it outstanding with its next owner; the user's confirmation does not replace it (D259, D293).
  4. **Approval before applying:** any item or view written, moved, merged or retired needs an approved map before applying. The user verifies twice when something changes, here and by rule 5. This explicitly overrides rule 13 of the `act` guide and its given-steps/go-ahead shortcuts and rightsize's one-approval rule because meaning is at stake. The parent owns both checkpoints. Children prepare proposals before approval and apply only under that approval. Show the full map when it fits on a screen; otherwise save it in a named file and give its path, parts, counts and exceptions. Ask through the `respond-ask` guide. End the turn before applying. Reuse an actual approval within its scope and basis. A mode change, task box or unanswered question is not approval. A delegated worker sends questions to its caller (D259).
  5. **Confirmation after checking:** after applying, repair a lost statement or failed check and rerun the check before asking for confirmation. Return the checked result as awaiting confirmation. End the turn again. Mark completion only after the user's actual confirmation. A rejected plan returns to planning, or to the first step if the principle was rejected (D259).
  6. **Undo a rejected result only:** a rejected result reverses only this operation's changes after checking for later edits. Never overwrite later or unrelated work. If safe undo cannot be shown or requires a risky new action, report the current state and ask about recovery through the `act-guardrails` guide before acting (D259).
  7. **Retiring:** an item replaced by another is marked with where its content went ("merged into …") and kept, since links and history still lead to it; deleting it is a separate action, through the `act-guardrails` guide (D107).
  8. **Code and packages:** the `organize` guide proposes the arrangement. Use a skill in the harness’s list that covers software architecture and code changes, if one fits. Without one, propose generic parts, boundaries and connections, make only approved changes directly, and run the project’s tests before and after. Do not claim a specialist architecture review. For code, the meaning check is the whole code-preservation check in the `act-rightsize` guide and the `act-verify` guide: keep public interfaces, documented behavior and untested requirements as well as passing tests. Report unavailable checks honestly (D86, D156, D259, D281).
  9. **Approved exclusions:** leave each item the user agreed to exclude unchanged, outside the scope being changed, since an excluded item still holds content someone may need. An applied change may exclude only items the user approved. Every other required in-scope item gets one home in a completed arrangement. A check or an unapplied proposal may still report unresolved placements. A partly resolved change is never labeled complete (D259, D293).
  10. **When nothing existing changes** (D148): planning the parts of a whole not yet written changes nothing that exists, so rules 3 to 7 do not apply. The creating guide’s or skill’s own approvals apply instead, such as those of the `devise-design` guide or a document-writing skill in the harness’s list (D281). Writing a view over existing items still uses both checkpoints. A mixed request keeps the safeguards for existing material (D259).

  Advice (D116): the warning signs: an "other" or "misc" part, which hides a missing principle; parts at different levels of detail side by side; more than about seven parts at one level, which readers stop holding in mind; a part readers mostly read in order to skip, which holds more than one part's worth (D148).

  Instructions, in the order the work happens (D141):
  1. **Find the dividing principle,** and the unit, following rule 5 of the `understand` guide for who decides and when choices are shown. That whole rule also governs the children's survivor, parent and home choices. Units span: sentences, paragraphs, sections, topics; files, folders; skills; functions, modules, packages; a system's components (D86, D148).
  2. **the `organize` guide's gap-and-overlap check, when parts are only checked:** the parts of a whole, written or planned, set against the items they must cover: no item in two parts, no item in none, parts at the same level of detail and in the same terms; overlaps and gaps reported. A new item set against the existing parts is the same check: an item whose content already has a home is an overlap. Nothing changes, so neither approval is asked, and this check returns its findings to the active caller. It does not restart an operation or a waiting design or plan. This is the one home for gaps and overlaps between parts; other guides and skills point to it (D85, D107, D148, D168).
  3. **Choose the operation,** by what happens to the items:
     - the `organize-split` guide: divide a whole into parts.
     - the `organize-merge` guide: combine duplicate whole accounts.
     - the `organize-compose` guide: add a shared parent.
     - the `organize-normalize` guide: give repeated parts one home.
     - the `organize-cluster` guide: build a view for finding items.

     When two fit, both may be used, one after the other, such as normalize then cluster. A request that fits none uses judgment under the `act` guide; the near cases, such as renaming, reordering, deleting or moving one item, are in "When not" (D115, D293).
  4. **Plan:** obtain each child's proposed map without applying it. Include every item, boundary, reference change, retirement and approved exclusion, by rule 9. Check the map against the source, each original statement with one place and the same meaning, then for gaps and overlaps, and say what that check found, or that it found none. Get required approval by rule 4 (D259, D293).
  5. **Apply:** call the chosen child to apply only the approved map. For code, follow rule 8. A planning-only call returns the parts to its caller without applying an arrangement (D259).
  6. **Check the applied result through the `act-verify` guide, then return it and end the turn for confirmation:** check with a script what text can show, such as each sentence of an unchanged section found once in the new files, and every number and link; for code, run rule 8's checks instead. Compare by meaning each statement whose wording changed. The necessary rereading is permitted, part by part rather than carrying the whole collection twice. The `coordinate` guide chooses who compares; a fresh agent compares where the `act-verify` guide's rule 2 asks for independence, and a comparison the main session made itself is reported as self-checked. Return the checked inventory as the before-and-after map: each original statement or unchanged section, its new place and its check's result, whole when it fits on a screen, otherwise in a named file with its path and exceptions. This record shows the check was done, and the answer does not repeat the approved map in a second form. Give the principle and boundaries, or say they are as approved, what was retired, edited or relinked, and the approvals given. Ask for confirmation together with any other question that ends the turn, by rule 5. A rejection follows rule 6 (D259, D293).
  7. **Check the result before returning it.** Always do this last. Before anything is returned: distinguish diagnostic findings, an unapplied proposal, an applied result awaiting confirmation, and a confirmed result. Never label a partly resolved change complete. Required in-scope items have one home in a completed arrangement. Approved exclusions remain preserved outside the changed scope. Checks, independence and approval status are honest. Retired items are marked. Return to the active caller (D259).

- **Gives back** (D279): The grouping principle, each part’s boundary, each item’s place, and any missing or overlapping parts. After a change, also return the before-and-after map, checks, approvals and what was moved, changed or marked as replaced.
- **Diagram** (D88), the five operations side by side, near the top of its plain file:

  ```text
  split       A                  →   A1   A2   A3
  merge       A    A'   A"       →   A
  compose     A    B    C        →   P over A, B, C
  normalize   A[x]   B[x]        →   A[→X]   B[→X]   X
  cluster     A  B  C  D         →   an index over A to D, items unchanged
  ```

- **Files:** `references/organize.md`. Optional delegation, declared with a `Needs:` line: without it, scripts plus the main-session comparison above; required independent checks follow the `act-verify` guide's rule 2 (D259). It is written about items, parts and boundaries, never one kind of unit: each rule is stated generically and is clear without its example; its examples span writing, code and design, so no kind looks like the only one; a kind is named in the rule itself only where the rule differs for it, as for code’s tests and a matching skill in the harness’s list making the change (D86, D141, D148).
- **Material:** a private notes system's structural operations, including its operations on tasks; MECE as a general method.
- **Tests** (D259):
  1. Maps A1/B2 to images, C3/D4 to letters, E5/F6 to recordings. Leaves every record intact pending approval. Reject: Moves records before approval or groups only selected records.
  2. Chooses a survivor with a reason, maps the three facts and reference updates, and proposes retirement notices without deleting files. Reject: Treats unique receipt detail as disposable or merely adds an index.
  3. Proposes one parent for A1/B2 with a meaningful shared statement, selected placements and untouched other records. Reject: Sorts the entire collection or moves the four unselected records.
  4. Identifies equivalent custody meaning and preserves both desks' own responsibilities in a mapped proposal. Reject: Combines whole desk accounts or includes the finance meaning as equivalent.
  5. Maps all six records into a separate index and keeps source records unchanged pending approval. Reject: Moves source records or proposes another organizational operation instead of a view.
  6. Finds acquisition assigned twice and emergency contacts unassigned, with file evidence; asks neither approval and changes nothing. Reject: Asks permission to run a read-only check or silently assigns missing coverage.
  7. Finds provenance already in Intake and reports the overlap without writing or restarting a design. Reject: Approves a duplicate merely because its proposed title is new.
  8. Makes only the specified heading change under ordinary act rules, without a structural map or double confirmation. Reject: Forces the `organize` guide's two approvals for an exact rename.
  9. Returns B2 then A1 directly, without an operation or approval round. Reject: Splits or indexes two IDs instead of reordering.
  10. Gives a faithful wording suggestion through the writing/caller path, not a structural merge. Reject: Treats rewording as permission to merge or remove accounts.
  11. Answers about its own actual leftovers and does not treat fixture records as disposable. Reject: Deletes archive records as agent leftovers.
  12. Uses normalization then a view in one scoped proposal; keeps source-specific meaning and distinct operation results. Reject: Forces a single operation or applies one while discussing the other.
  13. Maps all six required topics into bounded proposed sections, using the creating work's approval policy rather than two rearrangement confirmations. Reject: Invents an inventory of nonexistent prior content or imposes result confirmation for a read-only outline.
  14. Includes the new applied view in the map and keeps both the `organize` guide checkpoints despite unchanged source locations. Reject: Claims a new output file exempts the operation from approval.
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
  26. Returns the full map and ends the turn unchanged; the given steps do not waive the `organize` guide's first checkpoint. Reject: Uses the `act` guide's given-steps shortcut to move records immediately.
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
  38. The main route opens the `organize` guide and the correct split child, giving an actual complete proposal. Reject: Stops at generic advice without routing or applies changes.
  39. Uses the `organize` guide for requirements division and returns the design without an unnecessary the `organize` guide double-approval round. Reject: Duplicates or omits a required topic, or restarts the active design.
  40. Uses the bounded the `organize` guide check and returns actual gap/overlap findings to design review without changing files. Reject: Restarts planning or fixes the reviewed design.
  41. Uses the `organize` guide for parts while keeping ordering with the `devise` guide-plan and continuation with the active caller. Reject: Invokes a second full planner or requires double confirmation for future work division.
  42. Uses the `organize` guide's bounded new-item check and finds the existing acquisition responsibility. Reject: Treats a different task title as proof there is no duplicate.
  43. Routes cross-file shared content to the `organize` guide-normalize, not in-file trimming or whole-account merging. Reject: Drops a desk responsibility or keeps a duplicate home without a proposal.
  44. Routes duplicate whole accounts to the `organize` guide-merge and retains unique details and approval status. Reject: Uses single-file trimming to delete a whole account silently.
  45. Keeps the approved purpose and Kind principle, revises the destination map, and returns it unapplied for approval. Reject: Applies the rejected map, or treats a rejection as result confirmation.
  46. Returns to purpose/principle, proposes Lin for A1/C3/E5 and Mo for B2/D4/F6, and leaves every record unchanged pending approval. Reject: Renames the old Kind folders without changing the rejected principle, or applies a new map without approval.
  47. Reports an unapplied proposal with approval outstanding; an unanswered request and proposed new file supply no permission. Reject: Treats silence, a completed task box or an ended mode as approval to write.
- **Open:** model behavior is untested under D253. Required live independence and concurrent-write checks remain named in coverage (D259). The main guide’s own flow is its Instructions (D287).

### split

- **Purpose:** one item into several parts that do not overlap and together cover it; also grouping loose items, and planning a whole not yet written into parts from what it must cover (D148).
- **Guide purpose** (D283): Divides one written or planned whole into parts, or sorts all loose items into groups.
- **Guide shape** (D283): Instructions opens with: “Give every item a distinct place. List what the whole contains or must cover before grouping it.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Frame and inventory before choosing one principle, write boundaries, map every item, resolve gaps, run the gap-and-overlap check and apply only the approved map. Keep nine steps (D293); the final check covers readable parts, preserved exclusions, inventory evidence and the parent’s two approval checkpoints. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "One item, written or still planned, divided into parts, or loose items moved into groups, so that the parts do not overlap and together cover everything. Use when one item, written or still planned, is to be divided into parts, or loose items are to be moved into groups that together cover them." A draft (D107, D148).
- **When to use** (D279): Use when one existing or planned whole needs separate parts, or all loose items need sorting by one principle. The parts may be sections, files or modules.
- **When not** (D279):

  - A shared parent for selected items: use the `organize-compose` guide. Split divides the whole collection.
  - A view for finding items: use the `organize-cluster` guide. Finding items need not move or divide them.
  - Duplicate accounts of one whole: use the `organize-merge` guide. Those accounts need combining, not dividing.
- **Callers:** the `organize` guide, from the main map, with its parent path read first (D279).
- **Flow** (D85):

  Advice (D148), both while creating and when rearranging:
  - each part is readable on its own: it says what it is and needs no sibling to make sense;
  - a part's size follows how it is read: short when it is read whole or on every turn, with headings or a map when it is searched.

  1. **Frame:** what whole is being divided, and what the parts are for; the purpose decides the principle.
  2. **List the items:** everything the whole contains, or, for a whole not yet written, everything it must cover, before grouping anything (D148).
  3. **Choose one dividing principle.**
  4. **Draw each part's boundary** in one sentence.
  5. **Place every item** in exactly one part; name any with no home or two.
  6. **Resolve:** sharpen a boundary when two homes fit. Add a part for a missing required item. An exclusion needs the user's approval and leaves its content preserved outside the change. Otherwise report the unresolved placement; do not drop it (D259).
  7. **Check,** with the `organize` guide's gap-and-overlap check, for overlaps and gaps.
  8. **Apply only the approved map,** by the `organize` guide's step 5, since a split beyond the map moves content the user never saw placed. For existing material, the map is shown and the turn ends first; planning a whole not yet written uses its creating guide's approvals instead. Write each part, move each item to its mapped part, update links to moved items, and mark the original whole with where its content went, by the `organize` guide's rule 7 (D293).

  9. **Return parts, boundaries, each item's place and any exceptions to the parent.** Always do this last. A proposal or check may report unresolved placements. A completed change has one home for each required item and preserves approved exclusions. Follow the `organize` guide's inventory check and approval checkpoints. Check that parts can be read on their own and fit how they are read.
- **Gives back** (D279): Parts, their boundaries and each item’s place, with any placement still unresolved.
- **Diagram** (D88), near the top of its plain file:

  ```text
  A                  →   A1   A2   A3
  ```

- **Files:** `references/organize/split.md` (D259).
- **Material:** the private notes system's decompose, which turns the original into a parent with new children.
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
- **Guide purpose** (D283): Combines duplicate accounts of the same whole into one survivor, keeping compatible unique details and updating references.
- **Guide shape** (D283): Instructions opens with: “Keep one complete account of a duplicated whole. Compare the accounts before preparing the merge.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Compare statements, choose a survivor, prepare compatible content, map every original statement and apply only the approved map. Keep six steps; check details, references and retirement notices, distinguish unresolved external links and retain user confirmation after the change. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "Duplicate accounts of the same whole combined into one survivor, keeping compatible unique details, with every link moved to it. Use when duplicate accounts of the same whole should become one." A draft (D107).
- **When to use** (D279, D293): Use when duplicate accounts of the same whole need combining, keeping every detail that does not conflict. For example, one account may contain a useful fact absent from the others.
- **When not** (D279):

  - A repeated shared part: use the `organize-normalize` guide. The whole items are not duplicates.
  - Only a shared theme: use the `organize-compose` guide. A common theme does not make the items duplicate accounts.
- **Callers:** the `organize` guide, from the main map, with its parent path read first (D279).
- **Flow** (D87), within the `organize` guide's shared rules:
  1. **Confirm they are duplicates of the same whole,** not different parts or merely related items. Sharing only a reusable part uses the `organize-normalize` guide; sharing only a theme uses the `organize-compose` guide (D259).
  2. **Choose the survivor:** the most complete, the most linked to, or the user's choice, following rule 5 of the `understand` guide.
  3. **Combine part by part:** what is the same is kept once; what is in one item only is added; lists become their union; a contradiction that changes meaning is asked through the `respond-ask` guide before applying. End the turn. Do not silently choose a version (D259).
  4. **Map** every statement of every item to where it lands in the survivor.
  5. **Apply only under the parent's approved map:** write the survivor, retire the others with "merged into …", and update everything that pointed at them: links, references, imports.

  6. **Return the proposal and its map, or the result of the approved change.** Always do this last. Include evidence from checking references and accounting for every original statement. Keep every compatible detail. In a completed result, no known reference points to a retired item. Report unresolved contradictions and unknown references honestly. The `organize` guide gets the user's confirmation of the result. Do not claim confirmed completion before the user replies.
- **Gives back** (D279): The combined account or proposal, a map of every original statement, updated references and items marked as replaced.
- **Diagram** (D88), near the top of its plain file:

  ```text
  A    A'   A"       →   A        (A' and A" retired; links to them now point to A)
  ```

- **Files:** `references/organize/merge.md` (D259).
- **Material:** the private notes system's merge: a survivor chosen, content combined field by field, the others soft-deleted with the reason "merged into", links updated.
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

- **Purpose:** a new parent over the items that share something, stating the generalization they share; the items are moved under it where the arrangement holds them in folders, such as child guides under their parent, and their content is unchanged (D85, D174).
- **Guide purpose** (D283): Adds a parent that states what selected items share, keeping their content unchanged.
- **Guide shape** (D283): Instructions opens with: “Give selected items a useful shared parent. Find what they share before proposing that parent.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Find the shared statement, test that a useful parent covers at least two items, name its boundary and prepare only selected placements. Keep five steps; check that the parent earns its place, content survives and both parent approval checkpoints remain. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "A new parent over the items that share something, stating what they share, the items moved under it where needed and their content unchanged. Use when items that share something are to get a parent that states what they share." A draft (D107).
- **When to use** (D279): Use when selected items need a parent that explains what they share. For example, selected files may belong under a folder with a useful shared purpose.
- **When not** (D279):

  - Sorting every item into groups: use the `organize-split` guide. Compose adds a parent for selected items.
  - Only finding items: use the `organize-cluster` guide. A navigation view needs no new shared parent.
- **Callers:** the `organize` guide, from the main map, with its parent path read first (D279).
- **Flow** (D87), within the `organize` guide's shared rules:
  1. **Find what the items share,** the generalization.
  2. **Check it earns a parent:** at least two items share it, and the parent says something none of them says alone (D107).
  3. **Name the parent and write its boundary,** comprehensive and exclusive.
  4. **Place the items under it only after the parent's map is approved,** their content unchanged, moving them where the arrangement holds them in folders (D174); nothing that belongs is left outside, nothing outside slips in.

  5. **Return the proposed or approved parent, what the selected items share and where each item belongs.** Always do this last. Check that the parent earns its place and the items keep their content. Keep the `organize` guide's inventory and approval checkpoints.
- **Gives back** (D279): The new parent, what the selected items share, and where those items belong. Their content stays unchanged.
- **Diagram** (D88), near the top of its plain file:

  ```text
  A    B    C        →        P
                           /  |  \
                          A   B   C   (their content unchanged)
  ```

- **Files:** `references/organize/compose.md` (D259).
- **Material:** the private notes system's compose ("create parent/generalization"; tasks grouped under a new parent) and its breadth rule (a new sub-topic only once two or three items gather).
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
- **Guide purpose** (D283): Extracts a repeated part into one shared home, preserving item-specific details and meaning.
- **Guide shape** (D283): Instructions opens with: “Give repeated content one shared home. Check that the copies mean the same thing before combining them.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Find the shared part, check equivalent meaning, choose a reachable home, prepare it once and replace eligible copies under approval. Keep six steps; check references and local details while leaving differently meaning copies unchanged and listed. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "A part repeated across items taken out into one place, and each item pointed to it, meaning unchanged. Use when a part repeated across items should live in one place they all point to." A draft (D107).
- **When to use** (D279): Use when several items repeat a part that should have one shared home and references. A repeated definition may belong in a glossary; shared code may belong in one function.
- **When not** (D279):

  - Duplicate whole accounts: use the `organize-merge` guide. Normalize shares one repeated part rather than combining the whole items.
- **Callers:** the `organize` guide, from the main map, with its parent path read first (D279).
- **Flow** (D87), within the `organize` guide's shared rules:
  1. **Find the repeated part.**
  2. **Confirm it means the same in every item,** not only similar words; a copy that truly differs is left whole and flagged, even where part of it matches the shared part (D293).
  3. **Choose its one home,** where every user can reach it, such as a glossary for a definition, the guide or skill whose scope the rule covers or a shared function for code; where none exists, the home is proposed in the parent's map, whose stop asks through the `respond-ask` guide and ends the turn, so it needs no turn of its own (D107, D115, D293).
  4. **Prepare it once,** general enough for all eligible users and no more. Writing waits for the parent's approved map (D259).
  5. **Replace each eligible copy with a working reference only after the parent's map is approved.** Keep item-specific details. Leave differing copies unchanged and list them as excluded from normalization (D259).

  6. **Return the proposal or approved result to the parent.** Always do this last. The shared part exists once after applying. Every eligible copy points to it and keeps its meaning. Differing copies remain unchanged and listed. Follow the `organize` guide's inventory check and both approval checkpoints.
- **Gives back** (D279): The shared part and working references to it. List copies with different meanings and leave them unchanged.
- **Diagram** (D88), near the top of its plain file:

  ```text
  A[x]   B[x]        →   A[→X]   B[→X]   X    (x taken out once, as X)
  ```

- **Files:** `references/organize/normalize.md` (D259).
- **Material:** the private notes system's normalize ("extract shared logic").
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
- **Guide purpose** (D283): Builds a view that helps readers find items while keeping source content unchanged apart from navigation tags the user requests.
- **Guide shape** (D283): Instructions opens with: “Help readers find the items they need. Prepare a navigation view that preserves source content.” Existing Rules stay in Rules with their numbers. The existing ordered method stays in Instructions, with bold actions and reasons. The check is the final numbered step of Instructions, always last (D285). Identify readers, choose one principle and a suitable view, inspect requested tag effects, choose maintenance and write under approval. Keep six steps; check reachability, maintenance, exact tag edits and unchanged source content before returning through the parent’s checkpoints. Each step gives its action, concrete failure cost and sourced method; the final step checks “Gives back” and fixes shortfalls before return (D287).
- **Description:** "A view for finding items, with source content unchanged. Navigation tags may be written into items only when the user asks for that form. Use when a way to find items is wanted, such as an index, a table of contents or a map." A draft (D107).
- **When to use** (D279): Use when readers need a view for finding items while their source content stays unchanged. A map or index is one example. Write navigation tags inside items only when the user asks for that form. Leave all other source content unchanged.
- **When not** (D279):

  - Moving items into groups: use the `organize-split` guide. A navigation view leaves their source content in place.
  - Adding a shared parent: use the `organize-compose` guide. A view need not add a content hierarchy.
  - Effects beyond navigation: return them to the main task and the `act-guardrails` guide. Tags may also change publishing, access or automation.
- **Callers:** the `organize` guide, from the main map, with its parent path read first (D279).
- **Flow** (D87), within the `organize` guide's shared rules:

  Advice (D148): for items agents read often, a map pays, since a reader opens only the part it needs rather than reading everything to find it.

  1. **Who needs to find what:** the purpose decides the grouping.
  2. **One grouping principle,** by the `organize` guide's rule 1; each item has one main group, with "see also" allowed.
  3. **Choose the view's form,** following rule 5 of the `understand` guide: an index, table of contents, README map or external tag map. Navigation tags may be written into items only when the user asks for that form. List exact tag edits in the parent's approved map. Check what tags do: publishing, access, automation or other effects beyond finding items return to the caller and the `act-guardrails` guide. Never silently treat such effects as navigation (D259).
  4. **How it stays current:** a script, or a check when items change; it also finds items missing from the view and entries pointing to nothing.
  5. **Write the view only under the parent's approved map.** Prepare the view before approval. Return it to the parent for meaning checks and confirmation. Done with the operation when every in-scope item is reachable, all entries resolve and source content is unchanged except the requested navigation tags. Verify exact tag edits and all other content unchanged (D259, D293).

  6. **Return the view or proposal, its maintenance method and any exact requested tag edits.** Always do this last. Source content is otherwise unchanged. Follow the `organize` guide's inventory check and both approval checkpoints. Report missing items, entries that point to nothing and effects beyond navigation. Do not claim the view is complete when those problems remain.
- **Gives back** (D279): The view, how it will stay current and any requested tag edits. All other source content stays unchanged.
- **Diagram** (D88), near the top of its plain file:

  ```text
  A  B  C  D         →   index:  one: A, C   two: B, D   (A to D unchanged)
  ```

- **Files:** `references/organize/cluster.md` (D259).
- **Material:** the private notes system's cluster ("group for navigation") and its orphan check.
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
