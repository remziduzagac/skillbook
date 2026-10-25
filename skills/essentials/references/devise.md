# devise

Chooses the method for deciding what work will be or how its steps run.

## Instructions

Choose by the request's main question. Start with design when the user asks to design and build a whole. A plan may later need a design for one part. Return that design to the skill that asked for it. Do not restart that skill.

- **design** (`devise-design`): when the shape of something is open, or a design or design review is requested.
  - Not for: one open choice (`understand`'s who-decides rule), an unclear goal (`understand-clarify`), arranging existing material, a reader document, or the steps of settled work (`devise-plan`). Use judgment for arrangement. Use an installed writing set for a reader document, otherwise the `act` skill.
  - Gives back: a short or full design with its actual approval status, or ranked review findings. A full design includes its review status.
- **plan** (`devise-plan`): when the main question is multipart work to do or steps given to follow.
  - Not for: an exact single-step action, one risky action (`act-guardrails`), a single choice (`understand`), or a view asked for (`act` rule 2). A view may use a read-only plan. An open shape within a plan uses `devise-design`.
  - Gives back: the one-line or full plan, its actual approval status and the checklist followed where execution was authorized.

Use judgment under the `act` skill when neither method fits. Design and plan may call each other for a different part of the work. Return the result to the skill that called it. Do not start that skill again.

## The last instruction

Apply the chosen child's last instruction before returning its result.
