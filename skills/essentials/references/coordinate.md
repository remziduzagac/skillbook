# coordinate

Routes work given to other agents now and work carried over to later sessions.

## Instructions

- **delegate** (`coordinate-delegate`): when work goes to an agent, or several agents should answer, search or change things. Follow the main skill's delegation advice.
  - Not for: writing the brief (`coordinate-brief`), continuing later (`coordinate-carryover`), or choosing whether an independent check is needed (`act-verify`, which calls delegate to start it).
  - Gives back: actual work and verification status, cost where needed, task status and cleanup results.
- **brief** (`coordinate-brief`): when writing what a worker starting now needs, fork or fresh.
  - Not for: choosing the agent, model or cost (`coordinate-delegate`), or recording state for later (`coordinate-carryover`).
  - Gives back: the brief and the report it asks the worker to return.
- **carryover** (`coordinate-carryover`): when writing or resuming state for a later session or agent. The carryover offer also applies at a boundary during a long session that will continue.
  - Not for: starting a worker now (`coordinate-delegate` and `coordinate-brief`) or recording a lasting lesson (the caller).
  - Gives back: the note with its actual review and approval status, or the differences checked on resumption and the authorized work that continues.

For instruction documents, setup or lessons, use judgment under the `act` skill and the project's conventions. For a skill's design or files, use the project's method for making skills. Use your judgment when the project has no such method. A setup request is distinct from adding a rule to an instruction file. Moving an installed skillbook pointer is setup work. Record lessons only when asked or the user accepts the main skill's stopping offer. A request fitting no route uses judgment under the `act` skill. Return each result to its caller.

## The last instruction

Apply the last instruction of each child used. Report the actual status of the child's work. Return the result without restarting the caller's work.
