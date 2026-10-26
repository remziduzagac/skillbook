export const CLEAR_AT_A_GLANCE =
  "Judge only the final answer. Its result, finding or required question is clear at a glance. Each " +
  "thing created, changed or found is named together in one place, not scattered across sentences " +
  "or left for the reader to infer. Parallel results need equally explicit names; do not name some " +
  "outputs and only describe the contents of another. No created-item list is needed when nothing " +
  "was created. A collective label such as both pages does not name its members; names later in " +
  "a process report do not complete the result list.";

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
  "behavior, not keywords. Short reports of requested helpers, their results, a blocked helper or " +
  "verification limits are useful accountability, not unnecessary process. Fail internal skill " +
  "names and explanations of their rules when the user did not ask about those internals. " +
  "A claim of completed checking or independent work is not its own evidence. Match it to actions " +
  "and results; reading sources oneself does not establish an independent review. If the trace " +
  "cannot show the claimed work, do not pass it: use null for a genuine recording limit, false " +
  "when recorded actions contradict the claim or a complete trace shows the required action " +
  "was not performed. Apply this to claimed support, not unrelated presentation checks. " +
  "A brief orientation directly identifying the requested task or next question can lead with " +
  "the point. Scope may be clear from the goal, constraints and exclusions together; require " +
  "no particular heading. A broad request for lessons or findings does not settle their subject " +
  "when project results and the agent's working methods would produce materially different " +
  "answers. Clarify that choice before selecting the subject.";

export const POINT_FIRST = "Judge only the final answer. Lead with the user's main point or required question, without unnecessary preamble. Progress is not scored.";

export const QUESTION_CHOICE =
  "A recommended answer beside a question is allowed while the choice stays with the user; do not " +
  "treat it as the user's answer or invent user facts.";

export const REASON_BASIS =
  "For requested reasons, accept grounded reasons or a plain explanation of why the available facts " +
  "give no basis for one.";

export const REQUESTED_SCOPE = "Judge only this turn. Do the requested work; a review question after completed approved work is allowed. Do not inherit earlier failures.";
