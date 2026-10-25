# coordinate-setup

Checks skillbook installs and prepares approved pointers, settings and project setup.

Needs: access to the named install and instruction files. If you cannot access those files or use the needed session controls, leave the affected check pending. Ask for the needed access through `respond-ask`. Install or enable nothing to bypass a limit.

## Rules

1. **Run setup only when the user asks.** Recommend existing skills. Making a skill belongs to the project's skill-making method, otherwise judgment.
2. **Discover changes before applying them.** Prepare one combined proposal for the requested scope. Follow the current plan and choice rules. Ask through `respond-ask` for required approval. End the turn. Apply only approved work through the skill that owns it. Reuse approval only within its scope and basis.
3. **Put the pointer where the install belongs.** Personal installs use the user's own instruction files. Uncommitted project installs use a supported local file kept out of version control. An install committed for the team uses the shared instruction file. Follow the harness child for supported files and limitations. The installer does not write the pointer.
4. **Change a shared instruction file only when asked.** If skills are not committed, warn that teammates may lack them before proposing a shared pointer. Keep shared files to project facts every tool needs.
5. **Preserve existing settings and instructions.** Read them before preparing a merge. Recheck before writing. Add only approved entries and avoid duplicates. Remove only identified skillbook entries when asked. A managed restriction is not permission to bypass it.
6. **Call setup complete only after observing the required loading checks.** A shown command, folder or hook output does not prove a fresh session loaded the baseline. Return pending checks, declined changes and the next owner honestly.

## Instructions

1. **Identify machine setup, project setup or a pointer move.** A repeat run leaves already correct material unchanged.
2. **Load only the child for the current harness when its details are needed.** Reading another harness's documentation does not authorize operating it.
3. **claude** (`coordinate-setup-claude`): Claude Code paths, permissions, approved settings merges and baseline reload instructions.
   - Not for: another harness, generic approval policy or bypassing managed restrictions.
   - Gives back: proposed or approved entries, actual check results and missing controls.
4. **codex** (`coordinate-setup-codex`): Codex instruction paths, install locations and loading checks.
   - Not for: another harness or replacing shared instructions without approval.
   - Gives back: supported destinations, override warnings and actual loading status.
5. **For a machine, inspect each agent the user uses.** Follow the installer's folder detection or an explicit agent selection. Check the requested sets, essentials first. Show installation instructions for missing sets. Do not install anything yourself without separate approval for that installation. Prepare the pointer through `coordinate-instruct`. Prepare needed read permission and baseline reload support through the child. Default to no other harnesses and no allow-list entry. Explain in the final result how the user can name an allowed harness.
6. **For a project, read its purpose, languages, tools and instruction files.** Prepare instruction proposals through `coordinate-instruct`. Keep repeated skillbook rules when team adoption is unknown. Put that harmless assumption in the final answer. Recommend relevant sets and existing skills with reasons, using only outside sources the user already uses. Prepare any project pointer by rule 3.
7. **Prepare blueprint work only when that set is installed and the project lacks one.** Load `blueprint` for its own start method and location choice, including a project the user does not own. Add its proposed work to the combined scope. Without the set, start nothing and say nothing about its absence. Follow each skill's normal result default.
8. **Prepare a pointer move through `coordinate-instruct` when requested.** Remove the old pointer only under the approved move. Leave no duplicate pointer and preserve unrelated instructions.
9. **Apply the approved proposal and check it through the child and `act-verify`.** For a fresh-session check, use only permitted controls. Otherwise ask the user to start the session. Keep a check pending until it has actually run. Offer other hooks only for a recurring failure; essentials baseline reload support is the approved exception.

The pointer sentence is: "Before any work, load the essentials skill and follow it; load it again whenever its text is no longer in view, such as after compaction."

## The last instruction

Return each approved change with its evidence, recommendations with reasons, and anything declined or still pending. Check pointer placement, absence of duplicates and preservation of existing settings. Full setup requires evidence that the session loaded the skills. You may return partial setup work without claiming that the loading check passed.
