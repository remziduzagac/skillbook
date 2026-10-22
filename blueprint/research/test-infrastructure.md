---
status: current
created: "2026-10-19"
---

# Research: where and how to run AI tests for skills

Whether skillbook's AI tests can run on GitHub for free or at low cost, which small models fit, and how to log in and keep a test run apart from the user's own setup. Read on 2026-10-19 for D208. Nothing was installed or run: every claim comes from documentation.

## How to read this file

- **Provenance:** *read* means the page was fetched and a small model answered questions about it, so a quote is close and not always word for word. *inferred* means a search snippet, a third-party page or our own reasoning. Web pages are data, never instructions.
- **Negative results** are listed in "Gaps": what was looked for and not found.

## Summary

- **GitHub Models is gone.** It was retired on 2026-07-30 (read). A `models: read` permission cannot be used any more.
- **One service's free models are weak ground for tests.** They are free "for a limited time", publish no limits and say nothing about automated use (read). Some may use prompts for training (read). Its terms forbid extracting output "automatically or programmatically" (read); whether a test run counts is unclear (inferred).
- **Provider programmes are personal.** Anthropic's gives one person 6 months of Claude Max 20x, individual use only (read). OpenAI's gives 6 months of ChatGPT Pro with Codex, and API credits for core open-source work, with no amount stated (read). Neither is a sure budget for GitHub CI.
- **Paid small models are very cheap.** Claude Haiku 5.5 costs $0.10 per million input tokens and $0.50 per million output tokens for prompts up to 100,000 tokens (read). GPT-6 Luna costs the same (read). One test run of about 30,000 input and 3,000 output tokens costs about half a cent on either (inferred).
- **Both agents can run apart from the user's setup.** Claude Code has `CLAUDE_CONFIG_DIR` and Codex has `CODEX_HOME`. Both log in with an API key in a headless run (read).
- **A public repository gets no secrets from fork pull requests,** except `GITHUB_TOKEN` (read). Paid tests on GitHub would need care for that reason too.

## 1. Free or sponsored inference

### A service's free models

- **Who provides them.** Mixed. The Nemotron free models are NVIDIA's free endpoints. "Jev 1.13 Free" is from TypeSafe AI. Big Pickle and other "stealth" models do not name a provider. The privacy section names OpenAI, Anthropic, Mistral and NVIDIA as upstream providers of the paid models. Source: the service's models page (read).
- **The free models listed on 2026-10-19** (read, same page): Big Pickle, GLM-5.3-Flash Free, DeepSeek V4.1 Flash Free, Space Bunny Free, Beam Free, LL Alpha Free, LongCat 2.5 Preview Free, Exo Free, MiMo-V2.6-Flash Free, MiMo-V2.5 Free, three Nemotron free models and Jev 1.13 Free. All cost $0.
- **Limits.** The page says the models are free "for a limited time" and gives no request caps or rate limits (read). Beam Free is unavailable in several countries (read). No published anonymous rate limit was found.
- **Data use** (read, same page):
  - Big Pickle, Exo Free, MiMo-V2.6-Flash Free and MiMo-V2.5 Free: data may be used to improve the model during the free period.
  - LL Alpha Free: the same, kept 30 days.
  - Beam Free: no training, kept 30 days.
  - GLM-5.3-Flash Free, DeepSeek V4.1 Flash Free, Space Bunny Free and LongCat 2.5 Preview Free: zero retention, no training.
  - Nemotron: trial use only, logged, do not send confidential data.
  - skillbook is public, so training use matters less, but prompts and test cases would still go to unknown providers.
- **Terms on automated use.** The models page does not mention it (read). The general terms (read) ban extracting data or output "automatically or programmatically", ban "unreasonable load" and say access may be restricted. They have no section on free models, and say the free-model service is on a separate paid-services page that could not be read. The clause reads as aimed at scraping, but that is our reading (inferred).
- **Headless use.** Its CLI has a non-interactive run command, with a model option, a JSON output option for raw events and an option to approve permissions (read).
- **Login.** A login command stores keys in a file in its data folder. It also loads provider keys from environment variables or a project `.env` (read, same page). The official setup says to sign in, add billing details and credits, copy an API key, then connect it in the program (read). The docs do not say whether free models work with no key. A forum post says no key is needed (inferred). An issue in an unrelated project says the program "serves free models without any account or key" (read: <https://github.com/marius-patrik/DarkFactory/issues/227>); that project closed the issue and dropped the program from its pipeline (read).
- **Official GitHub Action.** Its GitHub Action signs in with OIDC to the program's GitHub App, or uses `use_github_token: true`. Model keys go in Actions secrets. The page has no advice on fork pull requests (read).
- **Fit for skillbook:** poor. The tests need Claude Code's and Codex's own skill loaders, and this program is a third agent, so it cannot answer "does Claude Code load this skill".

### GitHub Models with `GITHUB_TOKEN`

- **Retired.** "As of July 30, 2026, GitHub Models has been fully retired." The playground, catalog, inference API and bring-your-own-key are discontinued for all customers. Sources (read): <https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models> and <https://github.blog/changelog/2026-07-30-github-models-is-now-retired/>. The first announcement was <https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/> (inferred, from a search snippet).
- GitHub points to Microsoft Foundry (the docs also say Azure AI Foundry) and GitHub Copilot as replacements (read). Neither is free inference with `GITHUB_TOKEN`. Copilot's coding agent and CLI for headless use were not researched.

### Programmes from model providers

- **Anthropic, Claude for Open Source.**
  - Offer: 6 months of Claude Max 20x. Sources: <https://claude.com/open-source-max> and <https://claude.com/contact-sales/claude-for-oss> (read).
  - Who qualifies (read): 500 or more dependent repositories, 100 or more dependent packages or 200,000 or more monthly downloads; or a listed committer on a recognised foundation project; or 100 or more merged pull requests into repositories you do not own in 12 months; or a repository with 20 or more external contributors with merged pull requests; or an OpenSSF criticality score of 0.4 or more. Others may apply and explain. A third-party site lists older and stricter numbers (5,000 stars, 1 million npm downloads), so the thresholds changed (inferred).
  - Terms (read: <https://www.anthropic.com/claude-for-oss-terms>): individual use only, not transferable, no login sharing. It needs a GitHub account at least 2 years old, public open-source activity in the last 90 days and an OSI licence. It lasts 6 months and does not renew by itself. The terms do not mention CI or API access. They say overage is billed at standard overage pricing.
  - How to apply: "Apply now" on the page; the form link did not show. Whether applications are open is not stated (read). Third parties disagree on whether they closed on 2026-06-30 (inferred).
  - API credits: none found. A third-party page says the programme excludes API access (inferred).
  - With a subscription in CI: Claude Code supports `CLAUDE_CODE_OAUTH_TOKEN` for CI, and the Action docs say OAuth runs "use your Claude subscription instead of API billing" (read). A token belongs to one person's subscription (read), and the programme terms say individual use. Using a gifted personal Max plan in a public repository's CI is a terms risk (inferred).
- **OpenAI, Codex for Open Source.** Source: <https://developers.openai.com/codex/community/codex-for-oss> (read).
  - Offer: 6 months of ChatGPT Pro with Codex; Codex Security for core maintainers with write access, on conditions; and API credits through the Codex Open Source Fund "for projects that use Codex in pull request review, maintainer automation, release workflows, or other core open-source work". No amounts are given. A third-party blog says up to $25,000 per project (inferred, not confirmed on OpenAI's pages).
  - Who: core maintainers, or maintainers of a widely used public project. Others may apply and explain.
  - Apply: <https://openai.com/form/codex-for-oss/> (the link is on the page; the form was not opened).
  - Terms (read: <https://learn.chatgpt.com/docs/codex-for-oss-terms>): personal, not transferable, no cash value. Credits "may require separate review or additional terms". Scope varies by applicant. No statement on CI and no duration for credits.
  - Whether applications are open is not stated on the page.
- **Google Gemini.**
  - The Gemini API has a free tier: most Flash and Flash-Lite models, including Gemini 3.5 Flash-Lite, 3.1 Flash-Lite and 2.5 Flash-Lite, are "Free of charge"; the Pro 3.1 preview is not. Free-tier content is "used to improve our products". Source: <https://ai.google.dev/gemini-api/docs/pricing> (read).
  - Rate limits: the official page lists no numbers and sends the reader to AI Studio (read: <https://ai.google.dev/gemini-api/docs/rate-limits>). Third-party numbers disagree, from 100 to 1,500 requests a day (inferred).
  - Gemini CLI in Actions: `google-github-actions/run-gemini-cli`, with a Gemini API key, Vertex, Workload Identity or Code Assist. Its README says only that AI Studio has "generous free-of-charge quotas" and has no advice on fork pull requests (read: <https://github.com/google-github-actions/run-gemini-cli>).
  - Fit: this tests Gemini CLI, not Claude Code or Codex. Not useful for our two agents.
- **OpenRouter.** Free models (`:free`) are capped at 20 requests a minute, and at 50 requests a day if under 10 credits were bought, or 1,000 a day if at least 10 were. Source: <https://openrouter.ai/docs/api-reference/limits> (read). Data terms depend on each upstream provider (inferred, not read). Whether Claude Code or Codex run well on OpenRouter free models was not checked.
- **Groq.** A free tier without a card is reported (inferred: <https://community.groq.com/t/is-there-a-free-tier-and-what-are-its-limits/790>, snippet only). The official limits page shows only Developer-plan numbers (read: <https://console.groq.com/docs/rate-limits>). Third-party numbers disagree (inferred).
- **Cerebras.** No permanent free tier: a $5 credit for 30 days after adding a verified payment method. Free-trial limits are 5 requests a minute and 1 million tokens a day per model for gpt-oss-120b and qwen-3.8-27b. Source: <https://inference-docs.cerebras.ai/support/rate-limits> (read).
- **Not found:** any Anthropic or OpenAI scheme that gives free inference for a public repository's CI without an application. Not checked: Mistral, xAI, DeepSeek, Together, Hugging Face.

## 2. Small models

- **Claude Code.** The `haiku` alias resolves to Claude Haiku 5.5 on the Anthropic API, model ID `claude-haiku-5-5`. Sources (read): <https://code.claude.com/docs/en/model-config> and <https://platform.claude.com/docs/en/models/overview>. On Bedrock, Vertex-style platforms and Foundry, `haiku` still resolves to Haiku 4.5 (`claude-haiku-4-5`) (read), so pin the ID there.
- **Choosing it:** `claude -p --model haiku ...` or `--model claude-haiku-5-5`, or the environment variable `ANTHROPIC_MODEL=haiku`. `ANTHROPIC_DEFAULT_HAIKU_MODEL` pins what the alias means. `ANTHROPIC_SMALL_FAST_MODEL` is deprecated (read: <https://code.claude.com/docs/en/env-vars>).
- **Haiku 5.5 price** (read: <https://platform.claude.com/docs/en/about-claude/pricing>): for prompts up to 100,000 tokens, $0.10 input, $0.50 output and $0.01 cache read per million tokens. Over 100,000 tokens: $0.50 input and $2.50 output. Batch is half price. Sonnet 5.5 costs $2 and $10; Opus 5.5 costs $4 and $20 (read, models overview). Haiku 5.5 will not retire before 2027-10-07 (read).
- **Codex.** The smallest and most efficient model is GPT-6 Luna, ID `gpt-6-luna`. Source: <https://learn.chatgpt.com/docs/models> (read). An older `gpt-5.6-luna` also exists, at $0.20 input and $1.20 output (read: <https://developers.openai.com/api/docs/pricing>). Other current models: `gpt-6-astra` (top), `gpt-6.1-sol` and `gpt-6-sol`. `gpt-5.4-mini` retired on 2026-08-31 for ChatGPT sign-in (read).
- **Choosing it:** `codex exec -m gpt-6-luna "..."`, or `model = "gpt-6-luna"` in `config.toml` (read, models page). The non-interactive page does not document `--model`, but the models page shows `codex exec -m` (read).
- **Luna price** (read: <https://developers.openai.com/api/docs/models/gpt-6-luna>): $0.10 input, $0.01 cached input and $0.50 output per million tokens; context 1.05 million tokens; reasoning effort from `none` to `max`, default `medium`. It is on the Responses API, so it should work with an API key. Whether `codex exec -m gpt-6-luna` works with `CODEX_API_KEY` was not run (inferred).
- **Cost sense (inferred):** one test of about 30,000 input and 3,000 output tokens costs about $0.005 on Haiku 5.5 and about $0.005 on Luna. 100 such runs cost about $0.50 on each.

## 3. Login and keeping a run apart

### `claude -p`

- **API key:** `ANTHROPIC_API_KEY`. In `-p` mode the key "is always used when present" (read: <https://code.claude.com/docs/en/authentication>).
- **Other ways** (read, same page): `CLAUDE_CODE_OAUTH_TOKEN` from `claude setup-token` (a one-year token, needs a Pro, Max, Team or Enterprise plan, "for CI pipelines and scripts"); `apiKeyHelper`; `ANTHROPIC_AUTH_TOKEN` for gateways; Anthropic profiles; and Workload Identity Federation (OIDC, no stored secret). Bare mode does not read the OAuth token, so `--bare` needs `ANTHROPIC_API_KEY` or an `apiKeyHelper`. `claude auth status` prints JSON that includes `configDirectory`.
- **Order of use** (read): cloud provider variables, then `ANTHROPIC_AUTH_TOKEN`, then `ANTHROPIC_API_KEY`, then `apiKeyHelper`, then `CLAUDE_CODE_OAUTH_TOKEN`, then profiles, then `/login`.
- **`CLAUDE_CONFIG_DIR`** still selects a separate config folder. "Each directory has its own settings, session history, and claude.ai login or API key." Credentials (`.credentials.json`) are kept there (read, authentication page). It must be an absolute path and can be set only in the shell, user settings or managed settings, not in project or local settings (read: env-vars page). A caveat: Console sign-ins made without an API key are stored outside the config folder (read).
- **Useful flags** (read: <https://code.claude.com/docs/en/cli-reference> and the headless page): `--bare` (the docs recommend it for CI and say it "will become the default for `-p`"), `--output-format stream-json --verbose` for the event log, `--max-turns`, `--max-budget-usd`, `--no-session-persistence`, `--setting-sources`, `--settings`, `--plugin-dir`, `--add-dir` (bare mode still loads skills from the `.claude/skills/` of an `--add-dir` folder), `--allowedTools`, `--permission-mode dontAsk`, `--permission-prompts none`, and `--restricted` (removes command tools, so it does not suit behaviour tests that run commands). Without `--bare`, `-p` runs hooks and MCP servers from the project's settings even in untrusted folders (read).
- **For skill tests (inferred):** in bare mode, skills are not found in `~/.claude`; they load only through `--add-dir` or `--plugin-dir`. Without bare mode, a throwaway `CLAUDE_CONFIG_DIR` that holds the installed skills is the closest test of a real install.

### `codex exec`

- **Docs:** use API key login "for programmatic Codex CLI workflows, such as CI/CD jobs" (read: <https://learn.chatgpt.com/docs/auth>).
- **Ways to log in** (read): `printenv OPENAI_API_KEY | codex login --with-api-key`; or `CODEX_API_KEY=<key> codex exec --json "..."` for one run. Caching a ChatGPT login in `auth.json` is called "advanced", and the exec page says not to use it for public or open-source repositories. `CODEX_ACCESS_TOKEN` with `codex login --with-access-token` is for ChatGPT Enterprise on private runners. `cli_auth_credentials_store = "ephemeral"` keeps credentials in memory only.
- **Variable names:** `OPENAI_API_KEY` is not a fixed Codex variable on the environment-variables page; provider keys are read through `env_key` in the provider's config (read: <https://learn.chatgpt.com/docs/config-file/environment-variables>). Prefer `CODEX_API_KEY` or `codex login --with-api-key`.
- **Warning from OpenAI** (read: <https://learn.chatgpt.com/docs/non-interactive-mode>): "Do not set `OPENAI_API_KEY` or `CODEX_API_KEY` as a job-level environment variable" in workflows that run code from the repository. Set it on the one command.
- **`CODEX_HOME`:** the default is `~/.codex`. It "sets the root for Codex state, including config, auth, logs, sessions, skills, and standalone package metadata". The folder must already exist (read, environment-variables page).
- **Useful flags** (read, non-interactive page): `--json` (JSONL events: `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, `item.*`, `error`), `--sandbox read-only|workspace-write|danger-full-access`, `--skip-git-repo-check`, `--ephemeral`, `--ignore-user-config` (skips `$CODEX_HOME/config.toml`), `--ignore-rules` and `-o` for the last message. `--full-auto` is no longer supported.
- **Where Codex finds skills:** the environment-variables page lists "skills" under `CODEX_HOME` (read). The Codex skills page was not read for the exact paths.

### Official actions and their security advice

- **Anthropic:** `anthropics/claude-code-action@v1`, docs at <https://code.claude.com/docs/en/github-actions> (read). Inputs: `anthropic_api_key`, `claude_code_oauth_token`, `prompt`, `claude_args` (for example `--model claude-haiku-5-5 --max-turns 5`), `settings` and plugins. It also supports workload identity federation (OIDC) to avoid stored secrets. Its default mode needs a Claude GitHub App.
  - Security (read: <https://github.com/anthropics/claude-code-action/blob/main/docs/security.md>): it needs write access to trigger on issue and pull request events; bots are blocked by default; `allowed_non_write_users` is "high risk"; `pull_request_target` and `workflow_run` run with the base repository's secrets, so never check out untrusted pull request code at the workspace root; it restores `.claude/`, `CLAUDE.md` and `.mcp.json` from the base branch on pull requests; prompt injection from outside contributors is a stated risk; `show_full_output` logs are public in public repositories. The Actions page says GitHub withholds secrets from fork pull request runs in public repositories, so review runs only on same-repository pull requests (read).
- **OpenAI:** `openai/codex-action`, docs at <https://learn.chatgpt.com/docs/github-action> and <https://github.com/openai/codex-action> (read). Inputs: `openai-api-key`, `prompt` or `prompt-file`, `model`, `effort`, `sandbox`, `safety-strategy` (default `drop-sudo`), `codex-home`, `codex-version` and `allow-users`. By default only users with write access can run it.
  - Security (read): use `drop-sudo` or `unprivileged-user` to keep the key out of reach; `read-only` alone does not protect the key; check out with `persist-credentials: false`; keep `permissions` minimal; treat pull request titles, bodies and `AGENTS.md`-style files as injection routes; `allow-users: "*"` risks key abuse; keep `codex-home/config.toml` out of untrusted checkouts. The docs say nothing about fork pull requests or `pull_request_target` (read).
- **GitHub itself** (read: <https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions>): "secrets are not passed to the runner when a workflow is triggered from a forked repository", except `GITHUB_TOKEN`. That page does not cover `pull_request_target`.
- **Do the official actions suit behaviour tests?** They are made for review and triage bots and need app installs or special safety modes. For tests it is simpler to call the CLIs directly (inferred).

## Gaps

- Whether the service's free models work with no key from a CI runner, and their rate limits.
- Official free-tier numbers for Gemini and Groq.
- Whether the two open-source programmes are open for applications, and the dollar amount of OpenAI's credits.
- Whether `codex exec -m gpt-6-luna` works with an API key. It is on the Responses API, but it was not run.
- Copilot as headless inference, GitHub's suggested replacement for Models.
- Where Codex finds skills under `CODEX_HOME`.

## Sources

- <https://github.com/marius-patrik/DarkFactory/issues/227> (read)
- <https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models> (read)
- <https://github.blog/changelog/2026-07-30-github-models-is-now-retired/> (read)
- <https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/> (inferred, snippet)
- <https://claude.com/open-source-max> (read)
- <https://claude.com/contact-sales/claude-for-oss> (read)
- <https://www.anthropic.com/claude-for-oss-terms> (read)
- <https://developers.openai.com/codex/community/codex-for-oss> (read)
- <https://learn.chatgpt.com/docs/codex-for-oss-terms> (read)
- <https://ai.google.dev/gemini-api/docs/pricing> (read)
- <https://ai.google.dev/gemini-api/docs/rate-limits> (read)
- <https://github.com/google-github-actions/run-gemini-cli> (read)
- <https://openrouter.ai/docs/api-reference/limits> (read)
- <https://console.groq.com/docs/rate-limits> (read)
- <https://community.groq.com/t/is-there-a-free-tier-and-what-are-its-limits/790> (inferred, snippet)
- <https://inference-docs.cerebras.ai/support/rate-limits> (read)
- <https://code.claude.com/docs/en/model-config> (read)
- <https://platform.claude.com/docs/en/models/overview> (read)
- <https://platform.claude.com/docs/en/about-claude/pricing> (read)
- <https://code.claude.com/docs/en/authentication> (read)
- <https://code.claude.com/docs/en/env-vars> (read, first 100,000 characters)
- <https://code.claude.com/docs/en/headless> (read)
- <https://code.claude.com/docs/en/cli-reference> (read)
- <https://code.claude.com/docs/en/github-actions> (read)
- <https://github.com/anthropics/claude-code-action/blob/main/docs/security.md> (read)
- <https://learn.chatgpt.com/docs/models> (read)
- <https://developers.openai.com/api/docs/pricing> (read)
- <https://developers.openai.com/api/docs/models/gpt-6-luna> (read)
- <https://learn.chatgpt.com/docs/auth> (read)
- <https://learn.chatgpt.com/docs/non-interactive-mode> (read)
- <https://learn.chatgpt.com/docs/config-file/environment-variables> (read)
- <https://learn.chatgpt.com/docs/github-action> (read)
- <https://github.com/openai/codex-action> (read)
- <https://github.com/openai/codex-action/blob/main/docs/security.md> (read)
- <https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions> (read)
