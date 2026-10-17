---
status: current
created: "2026-10-17"
---

# Research: what an agent's work costs in tokens

What an agent's work costs, and what that means for delegating: whether to delegate, to a fork or a fresh agent, and how much to split. The mechanism is how model providers bill, read in their pricing pages; the two numbers the fork-or-fresh comparison rests on were measured by running Claude Code. Provenance as in the blueprint's conventions: *read*, *ran*, *summary*, *memory*, *ours*.

## Summary

- **Every turn pays for the whole context again,** so whatever enters an agent's context is paid for on every later turn, and a long session costs more than its length suggests.
- **The cache makes that cheaper, not free:** the unchanged part is read at a tenth of the input price, or a twentieth on Opus 5.5 and Sonnet 5.5 (*read*).
- **The real saving of delegating is a small main context:** what a delegated agent reads stays out of the main session, where it would be paid for on every later turn.
- **A fork is cheap to start and costly to keep going;** a fresh agent costs more to start and less on each turn. A fork's first call read the whole conversation from cache (*ran*); a fresh agent's start-up was about 14,700 tokens (*ran*). Over a few turns the fork wins; over many, whichever carries the smaller context.
- **Long sessions dominate:** in this design session, carrying the context and writing it to cache were about four-fifths of the cost; in a single turn that thinks a lot, output dominates, and effort is its lever, since thinking is paid at output price (*ran*, [Measured](#measured)).
- **Agents judge signs, not token counts:** most harnesses do not show an agent its context size, and the crossover depends on more than that size ([Signs, not thresholds](#signs-not-thresholds)).

## The four facts

1. **Every turn pays for the whole context again.** A model keeps nothing between calls. Each call, every reply and every tool call, is billed for the whole context at that moment: the system prompt, the tools, every skill loaded, the conversation and every tool result so far. Turn 100 pays for everything turns 1 to 99 added.
2. **The cache makes that cheaper, not free** (*read*). The part of the context unchanged since the previous call is read from a cache; new tokens are written to it. Anthropic prices a five-minute cache write at "1.25 times the base input tokens price", a one-hour write at "2 times", and a read at "0.1 times", except 0.05 times on Opus 5.5 and Sonnet 5.5, and 0.025 times on Fable 5.1 and Mythos 5.1. OpenAI prices cached input at 10% of the input price for most current models (*summary*). The cache matches only an identical beginning: a different model, a changed effort or an edited system prompt starts it again (*memory*). After a pause longer than the cache lives, the next turn writes the whole context again, 12 to 20 times what a cached turn costs at a read of 0.1 times.
3. **Output costs several times input:** five times on every model Anthropic lists, such as Sonnet 5.5 at US$2 per million input tokens and US$10 per million output tokens (*read*). Replies, thinking, briefs and files the agent writes are all output. A brief that pastes a file is paid as output by its writer and as input by its reader, who reads the file anyway.
4. **The model sets the price of every token,** input, output and cache alike (*read*, [pricing](https://platform.claude.com/docs/en/about-claude/pricing), 2026-10-17). Per million tokens, input then output: Haiku 5.5 US$0.10 and US$0.50 for prompts up to 100,000 tokens, US$0.50 and US$2.50 above; Haiku 4.5 US$1 and US$5; Sonnet 5.5 US$2 and US$10; Opus 5.5 US$4 and US$20; Fable 5.1 US$10 and US$50. So a fresh agent on Haiku 5.5 pays about a fortieth of what an Opus 5.5 main agent pays per token, and Haiku 5.5 costs a twentieth of Sonnet 5.5, which costs half of Opus 5.5: most of the saving is in the light tier. Haiku 5.5 has a **price step:** once a prompt passes 100,000 tokens, every token costs five times as much, so a light agent's part is sized to stay under it. Model names and prices differ by provider and change, so skills name tiers and each harness's reference file holds the names, prices and steps.

## What they mean for delegating

- **The main session:** a 30,000-token file read in the main session is read again from cache on every later turn; over 50 turns, at a read of 0.1 times, that is about five times what reading it once cost. If an agent reads it and sends back a 1,000-token report, only the report stays. That is the saving: the main context stays small.
- **A fresh agent** pays once to start: its own system prompt and tools, about 14,700 tokens for Claude Code's general-purpose agent and 12,600 for its Explore agent in an empty folder, more where a project has instruction files ([Measured](#measured)); the brief, written by the main agent at output price; and finding again what it needs, such as reading the files. After that each turn re-sends only its own small context, and it can run on a lighter model. Its report is paid by the main session on every later turn.
- **A fork** starts with the whole conversation. Claude Code ties a fork to the main agent's model and effort, and its first call read the parent's whole conversation from cache, writing only 78 new tokens ([Measured](#measured)): starting a fork is cheap while the cache is warm, and it is warm whenever a fork starts, since the main agent's call that starts it has just used the same beginning (*ours*, an inference). But each of its turns re-sends the whole conversation, at the main model's price, and in a long conversation it starts near the context limit. A fork costs about what doing the task in the main session would, except that the leftovers do not stay in the main context.
- **Several agents** each pay a start-up, a brief and a report the main session carries. A five-subagent fanout cost the main agent about US$0.35 to US$0.45 in briefing, reports and consolidating, against about US$0.03 for the subagents' reading ([../evidence.md](../evidence.md), E9); where a search could find the answers, the main agent searching alone cost half as much as delegating the reading (E8). Splitting pays only when the parts are large, since one agent working through them in turn carries every earlier part on each later turn; when independence or different lenses improve the result; when time matters and the cost is accepted; or when one agent's context would fill up.
- **Effort:** thinking is output, paid at output price, so how hard an agent thinks costs as much as how much it writes. A lower effort thinks less on every turn: it suits mechanical work and work a later step checks, and in a fanout its saving multiplies by the agents. A fork keeps the main session's effort and model, and the main session's own effort is the person's. The model and the effort are different dials: the model is what an agent can get right at all, the effort how much it thinks on each step, so they are chosen apart; a sweep with a validator behind it needs neither a strong model nor deep thought, while a tricky function that tests will check needs thought but not the strongest model (*ours*).

## Fork or fresh, by cost

On every turn a fork re-sends the conversation; a fresh agent re-sends its start-up, the brief and what it read again. The fresh agent pays once to write those to the cache, and the main agent pays to write the brief as output. So over a few turns the fork's cheap start wins, and over many the smaller context wins. With C the conversation, S the start-up, B the brief, R what the fresh agent reads again and r the cache's read price as a fraction of the input price, both on the same model, the fork is cheaper while:

```text
turns < [1.25 (S + B + R) + 5 B − r C] / [r (C − S − B − R)]
```

Worked figures (*ours*), with the measured start-up of 14,700 tokens, 20,000 tokens read again and a brief of about 1,500 tokens, the cache warm:

- **At a read of 0.1 times,** the rate on most models:
  - a 30,000-token conversation: the fork is cheaper for a task of any length, since the fresh agent would carry about as much;
  - 80,000 tokens: the fork is cheaper up to about ten tool calls;
  - 150,000 tokens: up to about three.
- **At a read of 0.05 times,** Opus 5.5 and Sonnet 5.5, which most main sessions run on: up to about 22 tool calls at 80,000 tokens, and about 8 at 150,000. On those models a fork stays cheaper for about twice as long.

A lighter model for the fresh agent shifts each figure towards fresh, since every token it pays for is cheaper. A cold cache shifts them towards fresh too, since the fork's first call then writes the whole conversation. A fresh agent whose start-up an earlier agent of its type has just written reads it from cache, which shifts them slightly towards fresh. Independence needs a fresh agent whatever the cost.

The earlier advice had this backwards: it gave a fresh agent the case where "a long conversation would be costly to carry for a small task". A long conversation is cheap to carry for a few turns and costly for many.

## Signs, not thresholds

A rule such as "below 30,000 tokens, fork" would go unused or force a guess:

- **Most harnesses do not show the agent its context size.** Claude Code records each call's tokens in the session's transcript, but reading it costs a tool call and its format can change between versions; the person sees the size in a status line or a command. Some harnesses warn the model near the limit, which varies by harness (*memory*).
- **The crossover depends on more than the conversation's size:** how many turns the task takes, how large the start-up is, how much must be read again, the cache's read price and the models' prices; each changes with the harness, the version and the model.

So delegate's advice gives the agent signs it can judge, each line with an example: the list of what the agent needs from the conversation, which it would write in a brief anyway, short or long; whether the task's answer is known and only has to be carried out, or has to be found first; whether it reads or produces a lot; whether a lighter model fits. Where the judgment is hard, the two choices cost about the same, so a rough judgment is enough. The window's fullness is used only where the harness shows it to the agent without extra work.

## Other levers

- **Fewer turns:** independent tool calls sent together in one turn, since every turn re-sends everything.
- **Reading less:** a search before reading (E8); line ranges, not whole files; parts small enough to be read alone, which organize decides.
- **Writing less:** short replies and reports; pointers instead of pasted text.
- **Skills loaded:** a skill loaded stays in context for the rest of the session and is paid for on every turn, so short `SKILL.md` files and loading only the part a request needs matter, for skillbook's own baseline most of all, since it loads in every session.
- **Long sessions and pauses:** the cost of a turn grows with the session; after a long pause the first turn writes everything again. A handoff and a fresh session reset both, as the harness's compaction does.

## Measured

Claude Code 2.1.302, headless, with `claude-haiku-5-5` as the main agent, since the mechanism is the same for every model (*ran*, 2026-10-17, about US$0.21 in all). Each call's input, cache reads, cache writes and output were read from the session's transcripts, the subagents' calls from their own transcripts beside it. Forks work headless.

- **A fork's first call reads the parent's conversation from cache** (one run, the parent at about 176,700 tokens):
  - the parent's call that started the fork: input 2, cache read 176,654, cache write 78;
  - the fork's first call: input 2, cache read 176,654, cache write 78, output 16;
  - the fork's second call: cache read 176,732, cache write 487.

  So 99.96% of the fork's first call was read from cache: its request began exactly as the parent's did. The fork started seconds after the parent's turn, so the cache was warm; a cold cache was not tested. A cold start does not arise in practice: a fork is always started by a call of the main agent's that has just read or written the same beginning, so the cache is warm when the fork's first call comes (*ours*, an inference, not a measurement).
- **A fresh agent's start-up,** in an empty folder with no instruction files (three runs):
  - two general-purpose agents started in one message each wrote 14,675 tokens to the cache; neither read the other's;
  - two Explore agents started in one message each wrote 12,609;
  - two general-purpose agents started one after the other each read 14,675 from cache, written by an earlier run about 40 seconds before, in another session.

  So each type of agent has its own start-up, shared only with agents of its type, and agents started in the same message did not share it. That is a finding, not a rule for delegate, since the saving is small beside a task's own cost.
- **This design session's own costs,** read from its transcript (Claude Code with `claude-opus-5-5`), priced at Opus 5.5's API prices with the one-hour cache write this session uses:
  - one turn, the one where the cost was discussed: the call carried about 85,500 tokens, about 83,800 read from cache and 1,700 newly written, and its reply was about 18,700 tokens of output, thinking included; output was 93% of that turn's cost, about US$0.37 of US$0.40;
  - the whole session up to the effort discussion, 1,411 calls by the main agent: cache reads 557 million tokens, about US$111 (56%); cache writes 5.7 million, about US$46 (23%); output, meaning thinking, replies, scripts and edits, 2.2 million, about US$43 (22%). The average call carried about 395,000 tokens, since the conversation grew long before it was compacted.

  So long sessions dominate: carrying the context and writing it were about four-fifths of the cost, while in a single turn that thinks a lot, output dominates. Since output costs five times input, carrying outweighs a turn's output once the context is about 100 times that output at a cache read of 0.05 times, or 50 times at 0.1 times.

## Gaps

- **Not tested:** whether agents started in parallel ever share a start-up, since each pair ran once; a start-up in a project with instruction files, which adds to it. A fork after the cache has expired is closed by reasoning, not a test: a fork always starts right after a main-agent call that used the cache (*ours*).
- **Not known:** how usage limits on subscription plans weigh cached and output tokens; Codex's billing beyond the cached-input price, and whether and how it forks.
- **Read through a summary:** OpenAI's pricing page came through the fetch tool's summary, not the page itself.

## Sources

- Anthropic, [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching): cache write and read prices, read 2026-10-17.
- Anthropic, [pricing](https://platform.claude.com/docs/en/about-claude/pricing): input and output prices per model, read 2026-10-17.
- OpenAI, [API pricing](https://developers.openai.com/api/docs/pricing): cached input price, through the fetch tool's summary, 2026-10-17.
- The measurements: [../evidence.md](../evidence.md), E10 and E11, run 2026-10-17.
- Delegation overhead: [../evidence.md](../evidence.md), E8 and E9, from [skill-loading.md](skill-loading.md), "Delegating wide reading".
