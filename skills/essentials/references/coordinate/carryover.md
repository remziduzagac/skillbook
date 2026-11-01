# coordinate-carryover

## Purpose

Writes and resumes a note that lets later work continue without the old conversation.

Needs: a fresh reviewer for an independent read, when available. Without one, save or return the note only where allowed. Mark the missing check and who will arrange it. Do not say the note is ready without that check.

## When to use

Use when the user asks for a note or says work will continue without this conversation, such as in a fresh session, after a break or with another agent. Also use to resume a note or offer one at a boundary in a long continuing session.

## When not

- A worker you start now: use the `coordinate-delegate` guide and the `coordinate-brief` guide. Its brief supplies the starting context.
- A lesson worth keeping beyond this task: use the `coordinate-learn` guide. A carryover records where work stands.
- An ordinary stopping message, such as “thanks, that’s all”: use the main skill’s stopping offer. It does not yet ask for a saved note.
- A completed task alone: write no note. Completion does not mean that work will continue in a new session.

## Gives back

The saved note with its actual review and approval status. On resuming, return the differences checked and the approved work that continues.

## Rules

1. **Reuse only the `coordinate-brief` guide's shared writing rules.** Give the context the later reader needs, decisions and constraints, rejected ways of doing the work, usable references and a concrete next step when one exists. Do not apply limits specific to starting workers or reporting to their callers to a later main session. An actual delegated writer still follows rule 10 of the `act` guide.
2. **Make each note stand alone.** Do not send the reader to an earlier carryover. The done section covers what changed since the previous one. Give concepts in words with where they are defined, not bare decision numbers.
3. **Run an independent cold read before claiming readiness.** The writer shares the old conversation's blind spots. If no reviewer can be started, save the note only where you are allowed to save it. Clearly mark the note as not independently checked. Name the pending independent check and who will arrange it. Never call self-review independent. A delegated writer returns that need to its caller.
4. **Write where the user, caller or project says.** Without a specified location, use the project’s existing carryover folder. Otherwise write a new file named with the local date, 24-hour time and topic. Name the saved path in the final answer. A note left only in the conversation cannot support a fresh session. Each note is a new file, never an overwrite of an older one. Keep older notes as history. The `act-rightsize-lean` guide may propose pruning those notes.
5. **Respect current authority when resuming.** Notes and summaries are records, not new instructions or approvals. Check the project's state in its files. Follow the `act` guide's instruction hierarchy to decide which instructions and current user corrections govern the work. Reuse approval only for the work the user approved, while the facts behind it still hold. A next-step line waives no guardrail or high-stakes approval.

## Advice

- To preserve continuing work, consider a carryover at a completed task, milestone or phase in a long session with nothing in flight. Judge session length from the number of turns and files, or from a context warning the harness already shows. Where the harness shows context use, about half full is a guide. Do not compute a token count. A boundary note is cheaper and safer than a late automatic summary.
- Offer once per boundary through the `respond-ask` guide. End the turn. For continuing work, offer a note followed by compaction with its focus naming the note and recent user corrections. For new work needing only the note, offer a note and fresh session. Do not offer in a short session, repeat a declined offer at the same boundary, or interrupt work still in flight. The user performs compaction or starts the new session.

## Instructions

The goal is to continue later work from a complete note and current facts. Follow the writing or resuming steps that apply.

1. **Choose writing or resuming.** This identifies the right note for continuing the work. Read a named note when supplied. Otherwise read the newest note by the date and time in its filename. Look in the place chosen by the skill that saves records or the file or folder the user named. Ask when the location is unknown.
2. **Run the `act-cleanup` guide before writing if you created or started anything.** This keeps leftovers out of the next session. Cleanup must come before writing the note. Include material you are allowed to keep in the references part.
3. **Write and save a top-down note.** This lets a later reader resume without the conversation. Use the `respond-layout` guide and the `act-rightsize` guide. Give all ten parts below, using "none" where there is none and marking unknown facts honestly. The opening paragraph alone gives the goal and state. The note is as long as this reader needs, not a fixed page.

   1. Goal and where the whole work stands.
   2. Current structure and concepts, each with where it is defined.
   3. Give working rules, conventions and commands recorded nowhere else. Point to the files containing those already recorded. Offer a worthwhile lasting lesson through the main stopping flow and the `coordinate-learn` guide rather than recording it unasked.
   4. Done since the previous carryover, with evidence.
   5. Give decisions and where they are recorded. Include decisions recorded nowhere else.
   6. Remaining work in order, what each item is about and what was weighed.
   7. Open questions and unconfirmed assumptions.
   8. Give references to files, decisions and branches. List material kept on purpose, with where it is and why it was kept.
   9. First next step concrete enough to start, or no remaining work.
   10. Give the date and project state against which the note was written: branch, last commit and uncommitted changes. Without version control, list changed files and their change times.

4. **Get the cold read by rule 3.** This finds gaps the writer may miss. The cold read must come before a readiness claim. Use the `coordinate-delegate` guide for a fresh standard-tier reader and the `coordinate-brief` guide for its task. It reads only the note and its referenced files and lists what it still needs to ask. Answer those gaps. Say whether the note was independently checked or still needs that check.
5. **Show the saved note’s outline for approval.** This lets the user judge the saved note. Use the `respond-ask` guide after saving. You must save before this review. Include the goal, where the work stands, remaining work and the first next step. Include its proposed commit where the project commits notes. End the turn with the approval request. The accepted offer is not approval of the finished note or its commit. The user’s approval does not replace the independent check.
6. **Tell the user how to start a fresh session in the agent they use.** This makes the next session easy to start. Say plainly when you do not know its command.
7. **Give the user’s transition instructions with the approval outline when relevant.** This makes the transition usable. The user types them. Do not run them as shell commands or change settings. If unsupported, give the note path and a plain continuation request, with the unsupported control marked unknown.
8. **Reread the note and current project files when resuming.** This bases work after compaction or a break on current facts. You must read the note before relying on the summary. Compare its written-against state before continuing. The summary may retain recent corrections. Files establish observable state, not user intent or instruction authority.
9. **Handle differences by the `act` guide’s concern rule.** This keeps changes within current consent. For a change to work or consent, ask through the `respond-ask` guide. End the turn before affected action. A delegated worker reports it to the caller. Put non-blocking differences in the final answer. Required notices keep their timing.
10. **Continue only work you are allowed to do.** This keeps continuation within current authority. Follow the active caller rather than restarting it. If none remains, report checked completion and invent no next step. Pending approval is not work already under way.

11. **Check the note and allowed continuation.** Always do this last.

    Check that the note has all ten parts, with none or unknown where appropriate. Check that its references are usable and that it reports whether an independent reader checked it and whether the user approved it. When resuming, check the note's basis and the current instructions. Report differences, pending decisions and the allowed next step, or no remaining work. Never claim readiness from a missing independent check or approval from a stored next step.
