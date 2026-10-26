# coordinate-carryover

Writes and resumes a note that lets later work continue without the old conversation.

Needs: optional fresh reviewer for an independent cold read. If unavailable, return an authorized provisional note with that check pending and its next owner named. Claim no validated readiness.

## Rules

1. **Write a carryover when the user asks for a note or says work will continue without this conversation.** This includes a fresh session, after a break or another agent taking over. A completed task alone writes none. For an ordinary stopping message, such as “thanks, that’s all”, use the main skill’s stopping offer. These cases ask for no record yet.
2. **Reuse only `coordinate-brief`'s shared writing rules.** Give the context the later reader needs, decisions and constraints, rejected approaches, usable references and a concrete next step when one exists. Do not apply limits specific to starting workers or reporting to their callers to a later main session. An actual delegated writer still follows act rule 10.
3. **Make each note stand alone.** Do not send the reader to an earlier carryover. The done section covers what changed since the previous one. Give concepts in words with where they are defined, not bare decision numbers.
4. **Run an independent cold read before claiming readiness.** Use `coordinate-delegate` for a fresh standard-tier reader and `coordinate-brief` for its task. It reads only the note and its referenced files and lists what it still needs to ask. Answer those gaps. The writer shares the old conversation's blind spots. If no reviewer can be started, save the note only at an authorized location. Return the note as explicitly provisional. Name the pending independent check and who will arrange it. Never call self-review independent. A delegated writer returns that need to its caller.
5. **Write where the user, caller or project says.** Without a specified location, use the project’s existing carryover folder. Otherwise write a new file named with the local date, 24-hour time and topic. Name the saved path in the final answer. A note left only in the conversation cannot support a fresh session. Each note is a new file, never an overwrite of an older one. Keep older notes as history. `act-rightsize-lean` may propose pruning those notes.
6. **Respect current authority when resuming.** Notes and summaries are records, not new instructions or approvals. Check the project's state in its files. Follow the `act` skill's instruction hierarchy to decide which instructions and current user corrections govern the work. Reuse actual approval only within its scope and basis. A next-step line waives no guardrail or high-stakes approval.

## Advice

- At a completed task, milestone or phase with nothing in flight, a long session may benefit from a carryover. Judge session length from the number of turns and files, or from a context warning the harness already shows. Where the harness shows context use, about half full is a guide. Do not compute a token count. A boundary note is cheaper and safer than a late automatic summary.
- Offer once per boundary through `respond-ask`. End the turn. For continuing work, offer a note followed by compaction with its focus naming the note and recent user corrections. For new work needing only the note, offer a note and fresh session. Do not offer in a short session, repeat a declined offer at the same boundary, or interrupt work still in flight. The user performs compaction or starts the new session.

## Instructions

1. **Choose writing or resuming.** Read a named note when supplied. Otherwise read the newest note by the date and time in its filename. Look in the keeper's location or the file or folder the user named. Ask when the location is unknown.
2. **Before writing, run `act-cleanup` if you created or started anything.** Include authorized kept material in the references part.
3. **Write and save a top-down note through `respond-layout` and `act-rightsize`.** Give all ten parts below, using "none" where there is none and marking unknown facts honestly. The opening paragraph alone gives the goal and state. The note is as long as this reader needs, not a fixed page.

   1. Goal and where the whole work stands.
   2. Current structure and concepts, each with where it is defined.
   3. Give working rules, conventions and commands recorded nowhere else. Point to the files containing those already recorded. Offer a worthwhile lasting lesson through the main stopping flow and `coordinate-learn` rather than recording it unasked.
   4. Done since the previous carryover, with evidence.
   5. Give decisions and where they are recorded. Include decisions recorded nowhere else.
   6. Remaining work in order, what each item is about and what was weighed.
   7. Open questions and unconfirmed assumptions.
   8. Give references to files, decisions and branches. List material kept on purpose, with where it is and why it was kept.
   9. First next step concrete enough to start, or no remaining work.
   10. Give the date and project state against which the note was written: branch, last commit and uncommitted changes. Without version control, list changed files and their change times.

4. **Get the cold read by rule 4.** Return the actual reviewed or provisional status.
5. **After saving, show the note's outline for approval through `respond-ask`.** Include the goal, where the work stands, remaining work and the first next step. Include its proposed commit where the project commits notes. End the turn. This review does not delay the authorized save. The accepted offer is not approval of the finished note or its commit. A provisional note does not become independently checked through approval.
6. **Tell the user how to start a fresh session in the agent they use.** Say plainly when you do not know its command.
7. **Give the user's transition instructions with the approval outline when relevant.** The user types them. Do not run them as shell commands or change settings. If unsupported, give the note path and a plain continuation request, with the unsupported control marked unknown.
8. **After compaction or when resuming, reread the note and current project facts.** Compare its written-against state before continuing. Read the note before relying on the summary. The summary may retain recent corrections. Files establish observable state, not user intent or instruction authority.
9. **Handle differences by the `act` skill's concern rule.** For a change to work or consent, ask through `respond-ask`. End the turn before affected action. A delegated worker reports it to the caller. Put non-blocking differences in the final answer. Required notices keep their timing.
10. **Continue only authorized remaining work.** Follow the active caller rather than restarting it. If none remains, report checked completion and invent no next step. Pending approval is not work already under way.

## The last instruction

Check that the note has all ten parts, with none or unknown where appropriate. Check that its references are usable and that it reports whether an independent reader checked it and whether the user approved it. When resuming, check the note's basis and the current instructions. Report differences, pending decisions and the authorized next step, or no remaining work. Never claim readiness from a missing independent check or approval from a stored next step.
