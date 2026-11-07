# coordinate-setup

## Purpose

Checks skillbook installs and prepares approved pointers, settings and project setup, so agents can load the intended skills.

Needs: access to the named install and instruction files. If you cannot access those files or use the needed session controls, leave the affected check pending. Ask for the needed access through the `respond-ask` guide. Install or enable nothing to bypass a limit.

## When to use

Use when the user asks to set up skillbook on a machine or project, check its setup, or add or move its pointer. The pointer is the instruction that tells agents to load the essentials skill, in whatever words the user asks for it and in whatever file. Moving a pointer from a local file to a shared file is one example.

## When not

- An ordinary instruction rule: use the `coordinate-instruct` guide. It changes what agents follow, not how skillbook is installed.
- Making skills: use the project’s skill-making method, otherwise your judgment. Setup recommends existing skills.
- Setup the user did not ask for: run none. Setup changes the machine or project.

## Gives back

Approved changes and observed loading checks, recommendations, declined work and pending checks.

## Rules

1. **Recommend existing skills.** Making a new skill belongs to the project's skill-making method, otherwise judgment.
2. **Discover changes before applying them.** Setup changes can affect later sessions. Apply only approved work through the skill that owns it. Reuse approval only for the work the user approved, while the facts behind it still hold. A pointer the user asked for in a named shared file under version control is approved work, by rule 4.
3. **Put the pointer where the install belongs.** Personal installs use the user's own instruction files. Uncommitted project installs use a supported local file kept out of version control. An install committed for the team uses the shared instruction file. Use supported instruction files that preserve current project instructions. The installer does not write the pointer.
4. **Change a shared instruction file only when asked.** If skills are not committed, warn that teammates and their agents may lack them. Keep shared files to project facts every tool needs.
   - When the user names the shared file for the pointer and the project keeps it under version control, write the pointer there. Put the warning in your final answer. The request approves that exact work, and the edit stays in the user's copy until they commit it.
   - Without version control, such as a folder that syncs to others at once, warn and propose the pointer before writing. The change would reach teammates at once.
5. **Preserve existing settings and instructions.** Read them before preparing a merge. Recheck before writing. Add only approved entries and avoid duplicates. Remove only identified skillbook entries when asked. A managed restriction is not permission to bypass it.
6. **Call setup complete only after observing the required loading checks.** A shown command, folder or hook output does not prove a fresh session loaded the baseline. Return pending checks, declined changes and the next owner honestly.

## Instructions

Prepare the requested machine, project or pointer setup from the actual installation. Preserve existing guidance and distinguish changes made from loading behavior that was observed. **Discover the whole requested scope, propose it together, then apply approved work and report actual loading checks.**

1. **Identify the setup request using “When to use”.** Treating a check as a setup, or a pointer move as a new installation, can widen what you read or change.
   - Choose machine setup, project setup, a pointer move, or a check only. Leave already correct material unchanged on a repeat run.
   - A check only reads the install folders and the instruction files that hold the pointer, changes nothing, and skips steps 3 to 7. Report what you saw, what you recommend, and each check still to do, with who can run it and what access it needs.
2. **Check the actual install under “Needs”.** A guessed agent path can point later sessions to skills that are not there.
   - Use the current agent's real skill location. Leave inaccessible checks pending and ask for needed access through the `respond-ask` guide; bypass no restriction.
3. **Inspect in-scope agents for machine setup under rules 1–3 and 5.** An existing folder does not show that the selected agent can load the intended sets.
   - Follow installer detection or the user's explicit selection. Check requested sets, essentials first. Show missing-set installation instructions and obtain separate approval before installation.
   - Prepare the pointer through the `coordinate-instruct` guide. Where the agent needs them, also prepare a setting that lets it read the install folder, and a way to reload the essentials guides after compaction. Preserve current settings and avoid duplicates.
   - Default to no other harnesses or allow-list entry. For a named allowed harness, propose `Allowed delegation harnesses: <names>` in personal instructions. Explain how to name one in the final result.
4. **Read project purpose, tools and instruction files for project setup.** Generic setup can discard guidance teammates still need or recommend irrelevant skills.
   - Prepare instruction proposals through the `coordinate-instruct` guide. Keep repeated skillbook rules when team adoption is unknown and give that assumption in the final answer.
   - Recommend relevant existing sets and skills with reasons, using outside sources the user already uses. Place pointers by rule 3 and warn before a shared pointer when teammates may lack the skills.
5. **Prepare a missing project design record only through a fitting skill.** Setup should not invent a record-making method or destination.
   - Use a matching skill in the harness's list and follow its method, location and result defaults, including in another person's project. Include the proposed work in the combined scope.
   - Without a matching skill, start nothing and say nothing about its absence.
6. **Prepare a requested pointer move through the `coordinate-instruct` guide.** A copied pointer can leave two startup instructions that drift apart.
   - Include removal of the old pointer only within the approved move. Preserve unrelated instructions and leave no duplicate pointer.
7. **Obtain approval for the combined scope before applying, by rule 2.** This order is firm: setup changes what future sessions read and may affect the machine.
   - Finish discovery, prepare one combined proposal and follow current plan and choice rules. Ask through the `respond-ask` guide and end the turn for required approval.
   - A pointer the user asked for in a named shared file under version control is already approved, by rule 4. Write it, and give the warning in your final answer. Other parts of the setup still wait for approval.
   - Apply only approved work through its owner. Recheck settings and instructions before writing. Check the result through the `act-verify` guide.
   - Use only permitted controls for fresh-session checks, otherwise ask the user to start the session. Keep checks pending until observed. Offer other hooks only for recurring failure; approved essentials baseline reload support is the exception.

   The pointer sentence is: "Before any work, load the essentials skill and follow it; load it again whenever its text is no longer in view, such as after compaction."

8. **Check setup and “Gives back” before returning.** Always do this last. A shown command or hook output does not prove the baseline loaded in a fresh session.
   - Check pointer placement, duplicates, preserved settings and approved scope. Fix incorrect changes within that scope before returning.
   - Give evidence for actual changes and observed loading, recommendations with reasons, declined work and each pending check with who can run it and what access it needs. Report partial setup without claiming an unobserved loading pass.
