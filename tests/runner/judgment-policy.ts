export const CLEAR_AT_A_GLANCE =
  "Judge only the final answer. Its result, finding or required question is clear at a glance. Each " +
  "thing created, changed or found is named together in one place, not scattered across sentences " +
  "or left for the reader to infer. Parallel results need equally explicit names; do not name some " +
  "outputs and only describe the contents of another. No created-item list is needed when nothing " +
  "was created.";

export const JUDGING_RULES =
  "Judge only the current turn, which is the last turn in the evidence. Earlier turns provide " +
  "context and state, not inherited failures. The answer field is the final answer. Point-first and " +
  "clear-at-a-glance apply only to it. Progress in between_tools is unscored evidence: it may " +
  "support a claim about work only when backed by actions. Never score its length, clarity, " +
  "internal skill names or placement. A review question after completed approved work is allowed; " +
  "distinguish it from asking permission instead of doing the work. A recommendation beside a " +
  "question is not answering it for the user if the choice remains open. Accept requested reasons " +
  "or an explicit explanation of why there is no basis for one. When the kind or subject of the " +
  "result is genuinely open, require clarification about what it should cover before choosing it; " +
  "do not invent user intent. Use not reached only if the current criterion is actually meaningless " +
  "without missing prior state. An earlier failed quality check alone is insufficient. Missing-note " +
  "recovery is meaningful: saying the note is missing, inspecting actual files and giving the next " +
  "step without redoing work is valid handling. Use null for insufficient evidence. Do not fail " +
  "invisible helper activity or unsupported trace absence. Cite current-turn evidence; judge " +
  "behavior, not keywords.";

export const POINT_FIRST =
  "Judge only the final answer. It uses plain English and leads with the user's main point or " +
  "required question, without unnecessary preamble or internal process detail. Progress lines are " +
  "not preamble and are not scored.";

export const QUESTION_CHOICE =
  "A recommended answer beside a question is allowed while the choice stays with the user; do not " +
  "treat it as the user's answer or invent user facts.";

export const REASON_BASIS =
  "For requested reasons, accept grounded reasons or a plain explanation of why the available facts " +
  "give no basis for one.";

export const REQUESTED_SCOPE =
  "Judge only this turn: do the approved requested work. If the kind or subject of the result is " +
  "open and plausible interpretations require different results, ask what it should cover before " +
  "choosing. Respect settled choices and approval boundaries. A review question after completed " +
  "approved work is allowed, not renewed permission. Do not charge an earlier turn's failure to " +
  "this turn.";
