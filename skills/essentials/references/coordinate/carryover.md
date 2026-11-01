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

Let later work continue from a complete note and current facts rather than an old conversation. A saved next step records state; it does not grant authority to act. **For writing, clean up and save a standalone note; for resuming, compare its basis with current files and instructions before continuing.**

1. **Choose writing or resuming using “When to use”.** Reading the wrong note can revive obsolete work or miss the latest correction.
   - For resuming, read the named note, otherwise the newest by filename date and time. Look in the user-named place or the place chosen by the skill that saves records; ask if unknown.
2. **Run the `act-cleanup` guide before writing if this task created or started anything.** This order is firm: an inaccurate note can send the next session to removed material or leave unwanted processes running.
   - Clean what is no longer needed before the note is written. Include permitted kept material in its references with location and reason.
3. **Write and save a standalone top-down note under rules 1, 2 and 4.** A reader sent to old conversations or earlier notes cannot resume from this note alone.
   - Use the `respond-layout` and `act-rightsize` guides. Give all ten parts below, using “none” where appropriate and marking unknowns honestly. The opening alone gives the goal and state.

   1. Goal and where the whole work stands.
   2. Current structure and concepts, with where each is defined.
   3. Working rules, conventions and commands not recorded elsewhere; pointers for those already recorded. Offer lasting lessons through the normal stopping flow and the `coordinate-learn` guide rather than saving them unasked.
   4. Done since the previous note, with evidence.
   5. Decisions and where they are recorded, including those recorded nowhere else.
   6. Remaining work in order, what each item concerns and what was weighed.
   7. Open questions and unconfirmed assumptions.
   8. References to files, decisions and branches, plus permitted kept material with where and why.
   9. A concrete first next step, or no remaining work.
   10. Date and written-against state: branch, last commit and uncommitted changes; without version control, changed files and their change times.

   - Use the specified destination, otherwise the existing carryover folder or a new local-date, 24-hour-time and topic filename. Make a new note rather than overwriting an older one.
4. **Get the independent cold read under rule 3 before claiming readiness.** The writer can overlook context they remember but never wrote down.
   - Use the `coordinate-delegate` guide and the `coordinate-brief` guide for a fresh standard-tier reader. It reads only the note and references, then lists what it still needs to ask. Answer those gaps.
   - Without a reviewer, save or return only where allowed. Mark the note not independently checked and name the pending check and who will arrange it.
5. **Show the saved note's outline for approval through the `respond-ask` guide.** This order is firm: the user needs a real saved result to judge.
   - Include goal, state, remaining work, first step and proposed commit where the project commits notes. End the turn with the approval request.
   - An accepted offer does not approve the finished note or its commit. User approval does not replace the cold read.
6. **Tell the user how to start a fresh session in their agent.** A note without a usable transition can leave the user unsure how to continue.
   - Say plainly when the command is unknown rather than inventing one.
7. **Give relevant transition instructions with the approval outline.** Instructions hidden elsewhere are hard to use at the handover.
   - The user performs compaction or starts the session. Run no transition command and change no settings.
   - If unsupported, give the note path and a plain continuation request; mark the unsupported control unknown.
8. **Reread the note and current files before resuming under rule 5.** A summary or recorded next step can be stale after a break.
   - Read the note before relying on a summary. Compare its written-against state with current project files.
   - Keep recent user corrections and current instruction authority distinct from observable file state.
9. **Handle differences through the `act` guide's concern rule.** Continuing past a changed basis can act outside current consent.
   - Ask through the `respond-ask` guide and end the turn before action affected by changed work or consent. A worker returns that need to its caller.
   - Put non-blocking differences in the final answer and keep required notices at their required timing.
10. **Continue only allowed work under rule 5.** A stored next step cannot waive an approval or guardrail.
    - Reuse approval only for the approved work while its basis still holds. Follow the active caller without restarting it.
    - If no work remains, report checked completion. Invent no next step or work from pending approval.
11. **Check the note, continuation and “Gives back” before returning.** Always do this last. Saving a note alone establishes neither readiness nor permission.
    - Check all ten parts, usable references, independent review and actual user approval status. Fix missing parts or false status before returning the saved path.
    - When resuming, check current instructions and basis, differences, pending decisions and the allowed next step, or no remaining work. Claim no readiness from a missing independent check.
