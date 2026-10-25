# Setup harness controls

Read official documentation on 2026-10-25. No real settings, hook or install was changed. No model was run.

[Claude hooks](https://code.claude.com/docs/en/hooks) documents `SessionStart` with `compact` and context output. Oversized context messages can become a file path plus preview. The selected helper therefore emits a bounded request naming installed baseline paths, rather than whole contents. This supports requesting reload; whether an agent actually reads all files after compaction remains unverified. The previous four-content-hook arrangement is not used.

[Claude memory](https://code.claude.com/docs/en/memory) and [settings](https://code.claude.com/docs/en/settings) describe instruction and settings scopes. Current defaults can load a local Claude file instead of a shared AGENTS file. Setup must preserve the project's instructions and inspect active configuration. The parent owns approval; documented paths are not permission to edit them. Managed restrictions and alternate configuration roots remain relevant.

[Codex instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md) documents the Codex home and the preference for an override over an AGENTS file in the same directory. [Skill discovery](https://learn.chatgpt.com/docs/build-skills) documents the skill directories. No safe universal additive local instruction file or agent-callable fresh-session control is established here. The child returns a limitation and approved alternative rather than hiding shared guidance.

Local script tests establish bounded payload generation, missing-file behavior and the consolidation contract. They do not establish live context loading, permissions, settings merges or model behavior. Those checks stay pending for the later validation round.
