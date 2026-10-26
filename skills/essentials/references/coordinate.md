# coordinate

Routes delegation, brief writing, carryovers, agent instructions, skillbook setup and session lessons.

## Instructions

- **delegate** (`coordinate-delegate`): **Read `coordinate-delegate` when you start another agent now, or several agents should answer, search or change things.** Follow the main skill’s delegation advice.
  - Not for: writing the brief (`coordinate-brief`), continuing later (`coordinate-carryover`), or choosing whether an independent check is needed (`act-verify`, which calls delegate to start it).
  - Gives back: actual work and verification status, cost where needed, task status and cleanup results.
- **brief** (`coordinate-brief`): **Read `coordinate-brief` when you write instructions for an agent you are starting now, whether forked or fresh.**
  - Not for: choosing the agent, model or cost (`coordinate-delegate`), or recording state for later or an agent the user starts (`coordinate-carryover`).
  - Gives back: the brief and the report it asks the worker to return.
- **carryover** (`coordinate-carryover`): **Read `coordinate-carryover` when the user asks for a note, says work will continue in a fresh session, after a break or with another agent, or you resume a note or offer one at a boundary in a long continuing session.**
  - Not for: a worker you start now (`coordinate-delegate` and `coordinate-brief`) or recording a lasting lesson (`coordinate-learn`).
  - Gives back: the note with its actual review and approval status, or the differences checked on resumption and the authorized work that continues.

- **instruct** (`coordinate-instruct`): **Read `coordinate-instruct` when you add, update or prune instructions that agents read.**
  - Not for: skill files or designs (the project's skill-making method), installed pointer placement (`coordinate-setup`), or a later-session note (`coordinate-carryover`).
  - Gives back: the proposed or approved document, its location and actual save status.
- **setup** (`coordinate-setup`): **Read `coordinate-setup` when the user asks to set up skillbook on a machine or project, check its setup, or move its installed pointer.**
  - Not for: adding an ordinary instruction rule (`coordinate-instruct`) or making skills (the project's skill-making method).
  - Gives back: approved changes, checked loading, recommendations and pending work.
- **learn** (`coordinate-learn`): **Read `coordinate-learn` when the user asks what a session taught, or accepts the lesson part of the stopping offer.**
  - Not for: unasked recording, a decision recorded as work happens (the caller), or carrying state forward (`coordinate-carryover`).
  - Gives back: approved promotions and their destinations, dropped highlights and pending decisions.

For a skill's design or files, use the project's method for making skills, otherwise judgment. A request fitting no route uses judgment under the `act` skill. Return each result to its active caller.

## The last instruction

Apply the last instruction of each child used. Report the actual status of the child's work. Return the result without restarting the caller's work.
