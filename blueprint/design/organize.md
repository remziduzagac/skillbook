# Design: organize

What a builder needs for organize and its five operations, essentials' group for arranging anything with boundaries (D164); ideas not yet decided are in [../ideas/conduct.md](../ideas/conduct.md), kept with conduct's until they are split. Every section answers the same questions (D80): purpose, description, callers, flow, result, files, material, tests, open. "Open" means not designed yet.

organize belongs to the essentials set (D152, D154, D164).

```text
organize/    arranging things: the shared rules and the check
├── split/      one into several
├── merge/      several into one
├── compose/    a new parent above
├── normalize/  the shared part taken out into one place
└── cluster/    a view added, items unchanged
```

## organize

- **Purpose:** arranging things: dividing, joining and grouping items so that every item has exactly one home (D61, D85). Its own `SKILL.md` takes the shape every skill with parts takes: its rules, advice, instructions with one routing line per operation, and the last instruction; each operation is a sub-skill, sorted by what happens to the items (D85, D112, D141). It works on any unit with boundaries, chosen by the agent at its first step (D86, D148), and on wholes already written or still being planned: for a planned whole, the items are what it must cover, such as a planned report's topics, a planned program's responsibilities or a planned system's requirements (D148).
- **Description:** "Arranging anything with boundaries: splitting, merging, putting a parent above, taking a shared part out, or indexing; every item in one home, its meaning unchanged, the plan and the result approved. Use when things are to be divided, joined, grouped or indexed, a whole not yet written is planned into parts, or existing parts are checked for overlaps and gaps." A draft (D107, D141, D148).
- **Callers:** the main skill, by its routing line (D134, D148, D164): when items with boundaries are split, merged, given a parent, have a shared part taken out, or are indexed, or a whole not yet written is planned into parts; not for changing what the items say (authoring's edit, or implement) or the agent's own leftovers (cleanup); it gives back the approved plan, the result with every item in one home, and the check that meaning was kept. Its other callers: design, splitting an idea document into sub-documents; plan, dividing a plan's work into parts (D151); authoring's docs; the project skill skillbook-tree, placing a skill in the tree and checking sibling descriptions (D61, D62, D77); authoring, implement, design and instruct, whenever they plan the parts of something not yet written: a document's sections, a program's modules, a system's components (D148).
- **Flow** (D85, D107, D141). Rules, each with its reason:
  1. **One dividing principle at a time:** a single question that sorts every item; mixing two causes overlaps.
  2. **Each part's boundary in one sentence,** so the parts are comprehensive and exclusive, as conduct's rightsize's rule says (D83, D145): a boundary that cannot be stated overlaps unseen.
  3. **Meaning preserved:** reorganizing never changes what the items say or do; nothing lost, nothing added, nothing altered. For text, files and skills it is checked by an inventory, every statement before found after with the same meaning; for code, meaning is behaviour, checked by tests (D86). The inventory is done by a script where one can do it, such as counting items or comparing sentences, and through delegate by a light fresh agent where judgment is needed, never by reading everything twice in the main session, which would double what the main session carries (D148).
  4. **The person verifies, twice, when something changes,** meaning any item or view written, moved, merged or retired: before applying, they approve the plan, shown as a map of where every item goes, in full when it fits on a screen, and otherwise written to a named file, the response giving the parts, the counts and the exceptions with its path (D149); after applying, they confirm the result, shown with the inventory or the test results. Both hold even where guardrails' proportion would skip a proposal, since meaning is at stake (D85, D86, D107).
  5. **Retiring:** an item replaced by another is marked with where its content went ("merged into …") and kept, since links and history still lead to it; deleting it is a separate action, through guardrails (D107).
  6. **Code and packages:** organize proposes the arrangement, consulting design's architecture skill; implement makes the change, under tests, since a change to code is implement's (D86).

  **When nothing existing changes** (D148): planning the parts of a whole not yet written changes nothing that exists, so rules 3 to 5, meaning preserved, the two approvals and retiring, do not apply; they are worded for when something changes. The creating skill's own approvals apply instead, such as design's or authoring's.

  Advice (D116): the warning signs: an "other" or "misc" part, which hides a missing principle; parts at different levels of detail side by side; more than about seven parts at one level, which readers stop holding in mind; a part readers mostly read in order to skip, which holds more than one part's worth (D148).

  Instructions, in the order the work happens (D141):
  1. **Find the dividing principle,** and the unit, chosen by the agent from the whole range: sentences, paragraphs, sections, topics; files, folders; skills; functions, modules, packages; a system's components (D86, D148).
  2. **Checking existing parts only:** no item in two parts, no item in none, parts at the same level of detail and in the same terms; overlaps and gaps reported. Nothing changes, so neither approval is asked (D85, D107).
  3. **Choose the operation,** by what happens to the items:
     - **split:** when one item, written or still planned, is divided into parts, or loose items are moved into groups that together cover them, such as a long document into sections, a report not yet written into the topics it must cover, a large module into smaller ones, a folder of mixed files into groups, or a planned system into components; not when the items stay where they are (compose, cluster) or say the same thing (merge); it gives back the parts with their boundaries and where every item went;
     - **merge:** when several items say the same thing and become one survivor; not when they only share a part (normalize) or a theme (compose); it gives back the survivor, nothing lost, every link moved to it, the others retired;
     - **compose:** when items that share something stay whole under a new parent that states what they share; not when they move into groups (split) or only need finding (cluster); it gives back the parent and what is shared, the items unchanged;
     - **normalize:** when a part repeated across items is taken out into one place they all point to; not when the whole items say the same thing (merge); it gives back the shared part in its place, each item pointing to it, meaning unchanged;
     - **cluster:** when a way to find items is wanted, such as an index, a table of contents or a map; not when the items move (split) or get a parent that says what they share (compose); it gives back the view, the items unchanged.

     When two fit, both may be used, one after the other, such as normalize then cluster. A request that fits none, such as renaming, reordering, deleting or moving one item, is not organize's: it is done directly under act's rules, and a deletion goes through guardrails (D115).
  4. **Plan:** the map of where every item goes, approved by the person.
  5. **Apply:** for code, implement makes the change.
  6. **Check meaning,** by the inventory or the tests, and the person confirms the result.
  7. **Last instruction, before anything is returned:** when something changed, the plan approved and the result confirmed; the inventory or the tests passed; retired items marked; no item in two parts or in none.

- **Result:** handed back for the caller to keep: the dividing principle, each part with its boundary, where every item went, and the items with no home or two (D85). After a change, also the map of before and after, the inventory or the test result, and what was retired, edited or relinked (D87, D107).
- **Diagram** (D88), the five operations side by side, at the top of its `SKILL.md`:

  ```text
  split       A                  →   A1   A2   A3
  merge       A    A'   A"       →   A
  compose     A    B    C        →   P over A, B, C
  normalize   A[x]   B[x]        →   A[→X]   B[→X]   X
  cluster     A  B  C  D         →   an index over A to D, items unchanged
  ```

- **Files:** `SKILL.md` only, to start (D85). It is written about items, parts and boundaries, never one kind of unit: each rule is stated generically and is clear without its example; its examples span writing, code and design, so no kind looks like the only one; a kind is named in the rule itself only where the rule differs for it, as for code's tests and implement making the change (D86, D141, D148).
- **Material:** VaultOps' structural operations (`VaultOps_Drafts/VaultOps Pipelines.md`, and the task operations in `VaultOps Tasks.md`, in the person's Obsidian sandbox); MECE as a general method.
- **Tests:** a set of parts with one planted overlap and one planted gap, given to check: both found, and no approval asked, since nothing changes (D85, D107); two notes to merge where a nuance is in one only: the nuance survives, and the person is asked to confirm the result (D86). One request per operation, each reaching it (D107): "group these twelve tasks", split; "these three notes say the same thing", merge; "these skills share a theme", compose; "this definition is in four files", normalize; "make an index of this folder", cluster. Boundaries (D115): "group these twelve tasks into folders", split, the tasks moved; "put a parent over these three skills", compose, the skills unmoved; "make an index of these twelve tasks", cluster, nothing moved; "rename this file", not organize. Creating and size (D148): planning a new document's sections: split, with the topics it must cover as the items, no inventory and no double approval; a part readers mostly read in order to skip: flagged; an inventory on a large rearrangement: done by a script or a light agent, not by reading everything twice; each rule's examples: spanning more than one kind; a plan moving a hundred items: its map in a named file, the response giving the parts, the counts and the exceptions, both approvals still asked (D149).
- **Open:** see the ideas document. One home for consistency checks, contradictions, duplication, gaps and drift, which verify's four checks, organize's check, design's review, skillbook-tree's checklist and challenge each hold today: to settle with design's review (D123).

### split

- **Purpose:** one item into several parts that do not overlap and together cover it; also grouping loose items, and planning a whole not yet written into parts from what it must cover (D148). It is VaultOps' decompose (D85).
- **Description:** "One item, written or still planned, divided into parts, or loose items moved into groups, so that the parts do not overlap and together cover everything." A draft (D107, D148).
- **Callers:** organize, by its routing line (D141, D148): when one item, written or still planned, is divided into parts, or loose items are moved into groups that together cover them, such as a long document into sections, a report not yet written into the topics it must cover, a large module into smaller ones, a folder of mixed files into groups, or a planned system into components; not when the items stay where they are (compose, cluster) or say the same thing (merge); it gives back the parts with their boundaries and where every item went.
- **Flow** (D85):
  1. **Frame:** what whole is being divided, and what the parts are for; the purpose decides the principle.
  2. **List the items:** everything the whole contains, or, for a whole not yet written, everything it must cover, before grouping anything (D148).
  3. **Choose one dividing principle.**
  4. **Draw each part's boundary** in one sentence.
  5. **Place every item** in exactly one part; name any with no home or two.
  6. **Resolve:** two homes sharpen a boundary; no home makes a new part or is named out of scope.
  7. **Check,** with organize's check.

  Done when every item has exactly one home, or the ones that do not are named.

  Advice (D148), both while creating and when rearranging:
  - each part is readable on its own: it says what it is and needs no sibling to make sense;
  - a part's size follows how it is read: short when it is read whole or on every turn, with headings or a map when it is searched.
- **Result:** organize's result.
- **Diagram** (D88), at the top of its `SKILL.md`:

  ```text
  A                  →   A1   A2   A3
  ```

- **Files:** `SKILL.md` only (D85).
- **Material:** VaultOps' decompose, which turns the original into a parent with new children.
- **Tests** (D85): twelve mixed tasks to group, each in exactly one group with the principle stated; an idea document to split into sub-documents, each boundary stated; a new skill to place in skillbook's tree, one home or "a new part is needed"; a report not yet written, planned from the topics it must cover: each topic in one section, each section readable on its own (D148).
- **Open:** none known.

### merge

- **Purpose:** several redundant items fused into one survivor, losing nothing; links that pointed at the others now point at it (D85).
- **Description:** "Several items saying the same thing fused into one survivor, losing nothing, with every link moved to it." A draft (D107).
- **Callers:** organize, by its routing line (D141): when several items say the same thing and become one survivor; not when they only share a part (normalize) or a theme (compose); it gives back the survivor, nothing lost, every link moved to it, the others retired.
- **Flow** (D87), within organize's shared rules:
  1. **Confirm they are redundant:** the same thing said more than once, not merely related; related items go to compose or cluster instead.
  2. **Choose the survivor:** the most complete, the most linked to, or the person's choice.
  3. **Combine part by part:** what is the same is kept once; what is in one item only is added; lists become their union; contradictions are flagged for the person, never resolved silently, so nothing either item says is lost.
  4. **Map** every statement of every item to where it lands in the survivor.
  5. **Apply:** write the survivor, retire the others with "merged into …", and update everything that pointed at them: links, references, imports.

  Done when one survivor holds everything, nothing points to a retired item, and the person has confirmed.
- **Result:** organize's result: the map, the inventory or test result, what was retired and relinked (D87).
- **Diagram** (D88), at the top of its `SKILL.md`:

  ```text
  A    A'   A"       →   A        (A' and A" retired; links to them now point to A)
  ```

- **Files:** `SKILL.md` only (D87).
- **Material:** VaultOps' merge: a survivor chosen, content combined field by field, the others soft-deleted with the reason "merged into", links updated.
- **Tests:** two notes where a nuance is in one only: the nuance survives, and the person is asked to confirm (D86); a third note linking to a retired one now links to the survivor (D87).
- **Open:** none known.

### compose

- **Purpose:** a new parent added above items that stay whole: the generalization they share (D85).
- **Description:** "A new parent above items that share something, stating what they share; the items unchanged." A draft (D107).
- **Callers:** organize, by its routing line (D141): when items that share something stay whole under a new parent that states what they share; not when they move into groups (split) or only need finding (cluster); it gives back the parent and what is shared, the items unchanged.
- **Flow** (D87), within organize's shared rules:
  1. **Find what the items share,** the generalization.
  2. **Check it earns a parent:** at least two items share it, and the parent says something none of them says alone (D107).
  3. **Name the parent and write its boundary,** comprehensive and exclusive.
  4. **Place the items under it unchanged;** nothing that belongs is left outside, nothing outside slips in.

  Done when the parent states what its items share, every item that belongs is under it, and the items are unchanged.
- **Result:** organize's result (D87).
- **Diagram** (D88), at the top of its `SKILL.md`:

  ```text
  A    B    C        →        P
                           /  |  \
                          A   B   C   (A, B, C unchanged)
  ```

- **Files:** `SKILL.md` only (D87).
- **Material:** VaultOps' compose ("create parent/generalization"; tasks grouped under a new parent) and its breadth rule (a new sub-topic only once two or three items gather).
- **Tests:** three related skills get a parent; a fourth, unrelated, is left out (D87).
- **Open:** none known.

### normalize

- **Purpose:** the part several items share taken out into one place they all use; the items are edited to point to it (D85).
- **Description:** "A part repeated across items taken out into one place, and each item pointed to it, meaning unchanged." A draft (D107).
- **Callers:** organize, by its routing line (D141): when a part repeated across items is taken out into one place they all point to; not when the whole items say the same thing (merge); it gives back the shared part in its place, each item pointing to it.
- **Flow** (D87), within organize's shared rules:
  1. **Find the repeated part.**
  2. **Confirm it means the same in every item,** not only similar words; a copy that truly differs is left and flagged.
  3. **Choose its one home,** where every user can reach it: the glossary for a definition, the skill whose scope the rule covers, a shared function for code; where none exists, the home is proposed to the person (D107, D115).
  4. **Write it once,** general enough for all its users and no more.
  5. **Replace each copy with a reference to it,** keeping what is particular to each item.

  Done when the part exists once, every former copy points to it, and each item means what it did.
- **Result:** organize's result (D87).
- **Diagram** (D88), at the top of its `SKILL.md`:

  ```text
  A[x]   B[x]        →   A[→X]   B[→X]   X    (x taken out once, as X)
  ```

- **Files:** `SKILL.md` only (D87).
- **Material:** VaultOps' normalize ("extract shared logic").
- **Tests:** the same definition worded two ways becomes one glossary entry; a near-duplicate with a real difference is flagged, not folded in (D87).
- **Open:** none known.

### cluster

- **Purpose:** a view added for finding items, the items unchanged: an index, grouping for navigation (D85).
- **Description:** "A view for finding items, such as an index, a table of contents or a map; the items unchanged." A draft (D107).
- **Callers:** organize, by its routing line (D141): when a way to find items is wanted, such as an index, a table of contents or a map; not when the items move (split) or get a parent that says what they share (compose); it gives back the view, the items unchanged.
- **Flow** (D87), within organize's shared rules:
  1. **Who needs to find what:** the purpose decides the grouping.
  2. **One grouping principle,** as in split; each item has one main group, with "see also" allowed.
  3. **The view's form,** by unit: an index, a table of contents, a README map, tags.
  4. **How it stays current:** a script, or a check when items change; it also finds items missing from the view and entries pointing to nothing.

  Done when every item is reachable from the view and nothing in it points to nothing.

  Advice (D148): for items agents read often, a map pays, since a reader opens only the part it needs rather than reading everything to find it.
- **Result:** organize's result (D87).
- **Diagram** (D88), at the top of its `SKILL.md`:

  ```text
  A  B  C  D         →   index:  one: A, C   two: B, D   (A to D unchanged)
  ```

- **Files:** `SKILL.md` only (D87).
- **Material:** VaultOps' cluster ("group for navigation") and its orphan check.
- **Tests:** an index of twenty files where one is missing: the gap is caught (D87).
- **Open:** none known.
