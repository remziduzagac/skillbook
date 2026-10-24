# act-cleanup

Removes what you created or started for a task and no longer need. Unused material must not keep holding disk, memory or CPU, or surprise the user later. This covers your leftovers, never tidying the user's work.

What counts, when you created or started it in this task:

- temporary files and folders, downloads, extracted archives, scratch output and run homes;
- clones and copied trees;
- background processes, dev servers, watchers, test runners left hanging, and ports held open;
- containers, with the images, volumes and networks built for the task;
- worktrees, local branches and stashes;
- agents, background tasks and panes;
- wake-ups, timers, scheduled jobs, monitors and loops;
- temporary edits in the work, such as debug output, a probe or a setting switched for a test;
- things outside the machine, such as a preview deployment, a cloud resource, a pushed branch or a temporary token.

## Rules

1. **Clean only your own leftovers without asking.** Report the cleanup. This covers:
   - what you created or started in this task that sits in a temporary or scratch place;
   - your own temporary edit in the work, which shows in the diff;
   - a local branch or worktree you made with nothing uncommitted or unmerged in it.

   Propose everything else through `act-guardrails`: things you did not create, things that may hold the user's work, and anything outside the machine. You know what you made. Anything else may be someone's work. For delegated work, follow the `act` skill's rule 10 for removal and reporting.
2. **Record each thing as you create or start it.** Give its identity, location and process ID where relevant. Untracked things get forgotten. Finding them later means guessing and risks removing others' work.
3. **Remove only exact paths or IDs from your record.** Never match a pattern beyond what you created, such as everything in a temporary folder or processes sharing a name. Wildcards and name matches can hit the user's files or processes.
4. **Clean each thing when it is no longer needed.** Do so by the response ending the task: answer, report or claim of done. Leftovers pile up in long tasks. A task is not done with its scaffolding running.
5. **Report what you keep, where and why.** Examples: a cache, a clone needed tomorrow or a server the user wants running. Unexplained leftovers look forgotten.
   - Keep only what the user asked to keep or a later step of this task will use again soon. That step must be one you do yourself.
   - Remove copies made for another agent or a later check, unless the user asked to keep them, by the `act` skill's rule 9. Say how to recreate them. They would outlive the task.
   - Remove temporary edits in the user's work except when they ask to keep them. Say how to add them back. Keeping them changes their work.
6. **Check cleanup through `act-verify`.** Confirm the process is gone and the path no longer exists. A kill can fail silently. A watcher can restart a stopped process.

## Advice

- **Keep temporary material in one place.** This is strong advice: depart only with a reason and say why. Use the harness's scratch folder if available, otherwise one folder per task. Cleanup then takes one exact path.
- **The harness's own means first:** its worktree tool, its background-task tool and its scratch folder track and clean up what they create.
- **Check size before a large copy or download.** A temporary tree may be held in memory. Use a shallow or partial clone to read another repository.
- **Make background processes findable.** Record their IDs. Give them a recognizable name or their own process group. Start a server or watcher with the command needing it so both stop together. Otherwise give it a timeout where available.
- **In a long task,** keep the record in a file in the scratch place, so it survives the conversation being compacted.
- **Don't clean what the task will need again soon,** because rebuilding it costs too.

## Instructions

1. **Before creating something:** choose its place and check its size, as the advice says.
2. **Record each thing as you create or start it.** Clean it when its job ends.
3. **Tell a delegated agent to clean up before reporting.** Say explicitly to remove what it made and stop what it started. Report fields alone do not instruct it. Ask it to report cleaned, kept and proposed items. On return, check each report against visible files or processes.
4. **List the contents of your usual places if the record is incomplete.** This includes after a crash or forgotten item. Propose anything not certainly yours. Do not remove it.
5. **Go through the record before ending the task or stopping.** Follow the `act` skill's rule 11, including a wrap-up offer or carryover. Clean your own items. Propose the rest through `act-guardrails` and `respond-ask`.
6. **Check** with `act-verify`.
7. **Report,** at the end of the response:

   ```text
   Cleaned:   each item and where it was, checked as gone; sizes for large ones
   Kept:      each item, where it is, and why
   Proposed:  each item not yours to remove, with why; it waits for the user
   ```

   - Say nothing when you created nothing.
   - Say one line when everything was cleaned and nothing is kept or proposed, such as "Cleaned up: the unpacked photo archive (640 MB) and the preview server".
   - Give the full report when something is kept or proposed.
   - Use the same three fields in a delegated report so the main agent checks one list. Put kept items in a carryover note when work continues later. Nothing else is kept: leftovers belong to the session, not the project.

## The last instruction

**Check the record before ending the task or stopping.** Every item is cleaned and checked as gone, kept with location and reason, or proposed. The report says which.
