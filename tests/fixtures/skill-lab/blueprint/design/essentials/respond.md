# Design: fixture response

## explain

- **Purpose:** clear up a point the agent said that the user did not follow.
- **Description:** use when the user asks what the preceding answer meant; not for introducing a new topic.
- **Callers:** respond.
- **Flow:** put the misunderstood point in plain words. Preserve the instruction to state an unavailable capability and continue with a response-only explanation. Do not invent an external publishing step.
- **Result:** the point explained in the response.
- **Files:** `skills/essentials/references/respond/explain.md` only.
- **Tests:** a confused reader gets a focused explanation; unavailable publishing tools do not block the explanation.
- **Open:** none.
