# Design: blueprint

What a builder needs for the blueprint set: its main skill, its recording steps and the form of each document (D46, D47, D154); ideas not yet decided are in [../../ideas/design.md](../../ideas/design.md). Until it is designed, this repository's blueprint follows the method in [../../notes/first-design/design/blueprint.md](../../notes/first-design/design/blueprint.md). Every section answers the same questions (D80); an empty field is not designed yet. In the tree, the steps are named design-start and so on until names are settled with the install routes.

The blueprint set keeps carryovers, as their keeper (D156), in a `carryovers/` folder at the blueprint's top, beside `notes/`: one file per carryover, never written over, named by the date and time it was written, then a short topic, such as `2026-10-17-1530-open-topics.md`, the newest resumed. It is not a recording step of its own, since carryover says what goes in; the folder layout, settled with start, names it (D162).

As the keeper for essentials' skills (D156), the blueprint set says where each of their results goes, so none of them names a blueprint step or file (D163). A decision goes in the decisions log through decide, its reason naming what its skill gave: the options weighed and why the chosen one beat the next best, the weaknesses considered and how each was met, the case for the chosen option, or the rejected words for a name. A discussion, brainstorm or challenge as it went, a frame with the discussion it opens, a full comparison and a session's insights go in the session notes through discuss. Options left open, parked or set aside go in the topic's ideas file, and a large brainstorm becomes that file rather than a new kind of document. A weakness left open goes in the design's Open field or the topic's ideas file. Research goes in the research strand as a note on its topic, through the research step, with any small experiment it ran; a decision resting on it links to it; the strand holds what was learned from sources, claims about the world included. A claim checked by verify goes in the evidence log through the evidence step (D90). A carryover goes in `carryovers/`. In a project the person does not own, start asks where the blueprint lives: in the person's own folder for that project, or in the checkout, kept out of git through `.git/info/exclude`; the glossary goes where it put the blueprint (D117). Each is settled further when its step is designed.

```text
blueprint/
├── start/
├── discuss/
├── research/
├── decide/
├── evidence/
├── write/
├── workstream/
├── tasks/
├── work/
├── sync/
├── consolidate/
├── parallel/
├── check/
├── publish/
└── forms/
```

## blueprint

- **Purpose:** the blueprint set's main skill: a project's spec-to-dev flow and its records, from the idea to the hand-over to code, its files and folders, the procedures that keep them intact, and the form of each document (D46, D47, D154).
- **Description:**
- **Callers:**
- **Flow:** not designed yet, except that its rules hold the name rule, worded exactly as in essentials' main skill: "Names: a skill named `a-b-c` is the file `references/a/b/c.md` inside this skill's folder; read the whole file to use it. Read each file on the path you have not read yet, top-down." Calls inside the set name the skill and nothing more (D186, D188).
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### start

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### discuss

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### research

- **Purpose:** the filing only: understand's research finds out, and this step files its result in the blueprint's research strand as a note on its topic, in the form the blueprint set holds for each document; a decision that rests on it links to it (D59, D128).
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** its name is to settle, since research also names understand's skill (D128).

### decide

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:** VaultOps' "converge": commit to a path, recording its reasons and tradeoffs.
- **Tests:**
- **Open:** converge, a decision recorded with its reasons, takes understand's weigh's result: the decision's "why" names the options weighed and why the chosen one beat the next best; the full comparison goes in the session notes; an option set aside for later goes to the topic's ideas file (D121).


### evidence

- **Purpose:** an evidence entry recorded in the blueprint: the claim, what was run or seen, who verified it, what it supports (D90).
- **Description:**
- **Callers:** the skill that made a claim worth keeping, with the result verify handed back to it, where the project keeps a blueprint (D90, D107).
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### write

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### workstream

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### tasks

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### work

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### sync

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### consolidate

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### parallel

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### check

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### publish

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:**

### forms

- **Purpose:**
- **Description:**
- **Callers:**
- **Flow:**
- **Result:**
- **Files:**
- **Material:**
- **Tests:**
- **Open:** the decision format, "Decision" and "Why", carries weigh's comparison: the options weighed and why the chosen one won (D121).
