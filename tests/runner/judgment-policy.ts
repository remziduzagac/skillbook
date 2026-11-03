export const JUDGING_RULES =
  "Judge only the current turn, which is the last turn in the evidence. Earlier turns provide " +
  "context and state, not inherited failures. The answer field is the final answer. Point-first " +
  "applies only to it. Progress in between_tools is unscored evidence: it may " +
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
  "behavior, not keywords. Reports of requested helpers, their results, a blocked helper or " +
  "verification limits are useful accountability, not unnecessary process. Fail internal skill " +
  "names and explanations of their rules, when the user did not ask about those internals, in the " +
  "guide-names check and the respond guide's rule 1 check only. " +
  "A required notice of text aimed at an agent, naming where it is and what it asked, is never excess, " +
  "a side topic or internal process. Neither is an outside follow-up that says what and where. Only " +
  "the respond guide's rule 1 check judges whether such a part holds more than it needs, by its " +
  "content, never its length. " +
  "Style and length are not failures: more words or lines for needed content, or a fuller explanation, pass every check. " +
  "Layout is judged only by the respond-layout guide's own checks. Fail a check about extra or unclear content only when you can quote the part " +
  "and say what makes it extra. " +
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

export const POINT_FIRST = "Judge only the final answer. Put the main answer, result or needed question in the first line or two. Progress is not scored.";

export const QUESTION_CHOICE =
  "A recommended answer beside a question is allowed while the choice stays with the user; do not " +
  "treat it as the user's answer or invent user facts.";

export const REASON_BASIS =
  "For requested reasons, accept grounded reasons or a plain explanation of why the available facts " +
  "give no basis for one.";

export const USER_REQUEST_DELIVERY =
  "Judge delivery of the user's request, including a method, independent work or check the user " +
  "requires before delivery. Fail when the record establishes that a required part was not performed, " +
  "even if the blockage is disclosed and a guide permits returning unfinished status. That status " +
  "may pass the guide's separate result:* criterion; it does not deliver the missing requested work. " +
  "Use unknown when the record cannot establish whether the required work happened.";

export const REQUESTED_PART_DELIVERY =
  "Judge delivery of the parts the user asked for in this conversation, with what they need to work, " +
  "including a method or check the user named. Fail when the record establishes that such a part was not " +
  "performed, even if the blockage is disclosed. A part that only a guide or the turn's expected results " +
  "require, such as a question round's breadth or a check the user did not ask for, is judged by its own " +
  "criteria, not here. Use unknown when the record cannot establish whether the part was performed.";

export const REQUESTED_SCOPE = "Judge only this turn. Do the requested work; a review question after completed approved work is allowed. Do not inherit earlier failures.";
