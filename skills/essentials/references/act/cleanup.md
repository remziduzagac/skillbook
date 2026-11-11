# act-cleanup

## Purpose

Removes things created or started for a task when they are no longer needed, leaving a checked cleanup status.

## When to use

Use before ending a task if you created or started anything. Also use when writing an agent brief, before making something large, when disk or memory runs short, or when temporary material is no longer needed. Example: “remove what you left lying around”.

## When not

- Tidying the user’s work, such as “clean up this code”, or undoing a change: use a skill in the harness’s list for that work, if one fits. Otherwise return it to the main task. These are work changes, not your task leftovers.
- Things you did not create: use the `act-guardrails` guide, because they may hold the user’s work.
- Things the project’s tools keep, such as installed dependencies: handle them as project work under the main skill's step 5. They are not disposable task leftovers.
- Freeing space in general: follow the main skill's step 5 (propose a risky action first). The material may not be yours to remove.

## Gives back

What was removed, what was kept with its location and reason, and what still needs approval to remove.

What counts, when you created or started it in this task:

- Temporary files and folders, downloads, extracted archives, scratch output and run homes;
- Clones and copied trees;
- Background processes, dev servers, watchers, test runners left hanging, and ports held open;
- Containers, with the images, volumes and networks built for the task;
- Worktrees, local branches and stashes;
- Agents, background tasks and panes;
- Wake-ups, timers, scheduled jobs, monitors and loops;
- Temporary edits in the work, such as debug output, a probe or a setting switched for a test;
- Things outside the machine, such as a preview deployment, a cloud resource, a pushed branch or a temporary token.

## Rules

1. **Clean only your own leftovers without asking.** Report the cleanup. This covers:
   - what you created or started in this task that sits in a temporary or scratch place;
   - your own temporary edit in the work, which shows in the diff;
   - a local branch or worktree you made with nothing uncommitted or unmerged in it.

   Propose everything else through the `act-guardrails` guide: things you did not create, things that may hold the user's work, and anything outside the machine. You know what you made. Anything else may be someone's work. For delegated work, follow the main skill's rule on limits for a delegated worker for removal and reporting.
2. **Record each thing as you create or start it.** Give its identity, location and process ID where relevant. Untracked things get forgotten. Finding them later means guessing and risks removing others' work.
3. **Remove only exact paths or IDs from your record.** Never match a pattern beyond what you created, such as everything in a temporary folder or processes sharing a name. Wildcards and name matches can hit the user's files or processes.
4. **Clean each thing when it is no longer needed.** Do so by the response ending the task: answer, report or claim of done. Leftovers pile up in long tasks. A task is not done with its scaffolding running.
5. **Report what you keep, where and why.** Examples: a cache, a clone needed tomorrow or a server the user wants running. Unexplained leftovers look forgotten.
   - Keep only what the user asked to keep or a later step of this task will use again soon. That step must be one you do yourself.
   - Remove copies made for another agent or a later check, unless the user asked to keep them, by the main skill's rule on taking instructions only from the user, the loaded instruction files and the skill. Say how to recreate them. They would outlive the task.
   - Remove temporary edits in the user's work except when they ask to keep them. Say how to add them back. Keeping them changes their work.
6. **Check cleanup through the `act-verify` guide.** Confirm the process is gone and the path no longer exists. A kill can fail silently. A watcher can restart a stopped process.

## Advice

- **Keep temporary material in one place.** This is strong advice: depart only with a reason and say why. Use the harness's scratch folder if available, otherwise one folder per task. Cleanup then takes one exact path.
- **The harness's own means first:** its worktree tool, its background-task tool and its scratch folder track and clean up what they create.
- **Check size before a large copy or download.** A temporary tree may be held in memory. Use a shallow or partial clone to read another repository.
- **Make background processes findable.** Record their IDs. Give them a recognizable name or their own process group. Start a server or watcher with the command needing it so both stop together. Otherwise give it a timeout where available.
- **In a long task,** keep the record in a file in the scratch place, so it survives the conversation being compacted.
- **Don't clean what the task will need again soon,** because rebuilding it costs too.

## Instructions

Leave a checked account of task material that was removed, deliberately kept or needs approval to remove. Track exact identities from creation so cleanup never depends on guessing what belongs to you. **Record what you create, clean it when its job ends, then verify and report its final status.**

1. **Choose a temporary place and check size before creating large material, using Advice.** An unexpected large copy can exhaust disk or memory before the task is finished.
   - Prefer the harness's scratch and lifecycle tools, otherwise one task folder. Use shallow or partial clones for reading where suitable and explain a departure from the one-place advice.
2. **Record each created or started thing under rules 2–4.** Forgotten files or processes can keep consuming resources, and later cleanup by name can hit the user's work.
   - Record identity, exact location and process ID where relevant. Make processes findable and give them a shared lifetime or timeout where available.
   - In long work, keep the record in the scratch place. Clean items when no longer needed rather than accumulating them until the end.
3. **Tell each worker in its brief to clean and check its own material, through the `coordinate-brief` guide.** Report fields alone do not tell a worker to stop its server or remove a temporary copy.
   - Explicitly ask it to remove what it made, stop what it started and report cleaned, kept and proposed items. Check the report against visible files or processes when it returns.
4. **Recover an incomplete record by listing the usual task places.** A crash or forgotten entry does not make every nearby item yours to remove.
   - Identify only what you can establish as this task's material. Propose uncertain items rather than removing them.
5. **Review the record before ending the task or stopping, under rules 1, 4 and 5.** A finished answer can leave scaffolding running and surprise the user later.
   - Remove only exact recorded paths or IDs within your authority. Propose others' material and outward removal through the `act-guardrails` and `respond-ask` guides; end the turn for required approval.
   - Keep only user-requested material or items your own next step will use soon. Do not keep copies for another agent or later check without the user's request; say how to recreate them.
   - Remove temporary work edits unless the user asked to keep them, and say how to add them back.
6. **Verify removal through the `act-verify` guide, by rule 6.** A kill can fail or a watcher can restart a process after an apparent success.
   - Check removed paths no longer exist and stopped processes are gone. Report a failed check rather than assuming cleanup succeeded.
7. **Prepare the cleanup report at the end of the response, using “Gives back”.** Unexplained leftovers look forgotten, and proposed removal is not completed cleanup.

   ```text
   Cleaned:   items and locations, checked as gone; sizes for large ones
   Kept:      items, locations and reasons
   Proposed:  items needing approval and why; awaiting the user
   ```

   - Say nothing if nothing was created. Use one line if all material was cleaned and none kept or proposed; otherwise use the full report.
   - Use the same fields in a worker report. Put permitted kept items in a carryover when work continues later, rather than making a project record of session leftovers.
8. **Check the record, report and “Gives back” before ending.** Always do this last. An item without a final status may still consume resources after the task closes.
   - Check each recorded item is removed and verified, kept with location and reason, or proposed for approval. Check the report matches actual files and processes.
   - Fix unaccounted items or failed cleanup within your authority before returning. Keep pending removal visible rather than reporting it as done.
