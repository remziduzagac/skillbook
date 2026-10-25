# coordinate

Routes work with other agents now and work carried to later sessions.

## Instructions

- **delegate** (`coordinate-delegate`): when work goes to an agent, or several agents should answer, search or change things. Follow the main skill's delegation advice.
  - Not for: writing the brief (`coordinate-brief`), continuing later (`coordinate-carryover`), or choosing whether an independent check is needed (`act-verify`, which calls delegate to start it).
  - Gives back: actual work and verification status, cost where needed, task status and cleanup results.
- **brief** (`coordinate-brief`): when writing what a worker starting now needs, fork or fresh.
  - Not for: choosing the agent, model or cost (`coordinate-delegate`), or recording state for later (`coordinate-carryover`).
  - Gives back: the brief and the report it asks the worker to return.
- **carryover** (`coordinate-carryover`): when writing or resuming state for a later session or agent. Its boundary offer also applies during a long continuing session.
  - Not for: starting a worker now (`coordinate-delegate` and `coordinate-brief`) or recording a lasting lesson (the caller).
  - Gives back: the note and its actual review/approval status, or checked differences and authorized continuation.

For instruction documents, setup or lessons, use judgment under the `act` skill and the project's conventions. A skill's design/files use the project's skill-making method, otherwise judgment. A setup request is distinct from adding a rule to an instruction file. Moving an installed skillbook pointer is setup work. Record lessons only when asked or the user accepts the main skill's stopping offer. A request fitting no route uses judgment under the `act` skill. Return each result to its caller.

## The last instruction

Apply the last instruction of each child used. Keep its actual status and return its result without restarting the caller.
