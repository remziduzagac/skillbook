# act-cleanup

Removes what you created or started for a task and no longer need, so nothing unused keeps holding disk, memory or CPU, and nothing you left behind surprises the user later. Only your own leftovers; never tidying the user's work.

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

1. **Only your own is cleaned without asking,** and reported:
   - what you created or started in this task that sits in a temporary or scratch place;
   - your own temporary edit in the work, which shows in the diff;
   - a local branch or worktree you made with nothing uncommitted or unmerged in it.

   Propose anything else through `act-guardrails`: what you did not create, what may hold the user's work, and anything outside the machine. You know what you made; anything else may be someone's work. As a delegated agent, the `act` skill's rule 10 says what you remove and what goes into your report.
2. **Track as you go:** for everything you create or start, note what it is, where it is, and a process's ID. What is not tracked gets forgotten, and finding it later means guessing, which risks removing what is not yours.
3. **Exact targets only:** remove by the exact path or ID from your record, never by a pattern that could reach beyond what you created, such as everything in the temporary folder, or every process with one name. A wildcard or a name match can hit the user's files or processes.
4. **Clean a thing once it is no longer needed,** at the latest before the response that ends the task, whether it is an answer, a report or a claim of done. Leftovers pile up in long tasks, and a task is not done while its scaffolding is still running.
5. **Say what you keep on purpose, with where and why,** such as a cache, a clone needed tomorrow or a server the user wants left running. An unexplained leftover looks like a forgotten one. Keep only what the user asked to keep or the task will use again soon. "Used again soon" means by a later step of this task that you do yourself. What another agent or a later check might use is not: remove it, and say how to make it again, because a copy kept for someone else's check outlives the task. Keep your temporary edit in the user's work only when the user asks, because it changes their work: remove it, and say how to add it back.
6. **Check "cleaned" through `act-verify`:** the process is gone and the path no longer exists. A kill can fail silently, and a watcher can restart what was stopped.

## Advice

- **One place,** as strong advice: follow it unless the case gives a reason not to, and say when you depart from it. Keep all temporary material in the harness's scratch folder where it offers one, otherwise in one folder per task, so cleaning up is one exact path.
- **The harness's own means first:** its worktree tool, its background-task tool and its scratch folder track and clean up what they create.
- **Before a large copy:** check the size before copying or downloading a large tree into a temporary place, which may be held in memory. To read another repository, make a shallow or partial clone.
- **Processes you can find again:** record a background process's ID, and give it a recognizable name or its own process group. Start a server or watcher together with the command that needs it, so it stops when that command ends; otherwise give it a timeout, where the tool allows.
- **In a long task,** keep the record in a file in the scratch place, so it survives the conversation being compacted.
- **Don't clean what the task will need again soon,** because rebuilding it costs too.

## Instructions

1. **Before creating something:** choose its place and check its size, as the advice says.
2. **While working:** record each thing as you make or start it, and clean it when its job ends.
3. **When you write a brief for another agent:** say in words that it removes what it made and stops what it started before it reports, because report fields alone don't tell it to. Ask it to report what it cleaned, kept and proposed. When the work comes back, check each report against what you can see, such as files still there or processes still running.
4. **When the record is incomplete,** such as after a crash or something forgotten: look in the places you use and list what is there. Propose anything you cannot be sure is yours; don't remove it.
5. **Before the response that ends the task,** by the `act` skill's rule 11, **or before stopping,** such as at the wrap-up offer or when work is carried over to a later session: go through the record, clean your own, and propose the rest through `act-guardrails` and `respond-ask`.
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
   - A delegated agent's report back carries the same three fields, so the main agent checks one list. When work is carried over to a later session, what is kept goes into that note. Nothing else is kept, because leftovers belong to the session, not the project.

## The last instruction

Before the response that ends the task, or before you stop, check: every item in the record is cleaned and checked as gone, kept with where and why, or proposed, and the report says which.
