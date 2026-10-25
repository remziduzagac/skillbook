# Delegation cost data

Checked 2026-10-25. These are published API rates in USD per million tokens, not a subscription bill or an enforced worker budget. Recheck the relevant official page before a cost-sensitive decision. Unknown usage, discounts or live caps stay unknown.

| Model | Input | Cache read | Cache write | Output |
| --- | ---: | ---: | ---: | ---: |
| GPT-6 Luna | 0.10 | 0.01 | 0.125 | 0.50 |
| GPT-6.1 Sol | 2.00 | 0.10 | 2.50 | 10.00 |
| GPT-6 Astra | 10.00 | 1.00 | 12.50 | 50.00 |
| Claude Haiku 5.5, up to 100k input | 0.10 | 0.01 | 0.125 | 0.50 |
| Claude Haiku 5.5, over 100k input | 0.50 | 0.05 | 0.625 | 2.50 |
| Claude Sonnet 5.5 | 2.00 | 0.10 | 2.50 | 10.00 |
| Claude Opus 5.5 | 4.00 | 0.20 | 5.00 | 20.00 |
| Claude Fable 5.1 | 10.00 | 0.25 | 12.50 | 50.00 |

The Claude cache-write prices in the table cover five-minute storage. Longer storage can cost a different amount. For prompts above 272k input tokens, Luna's published input and cache rates double, and its output rate rises to 1.5 times the listed rate. Other price steps were not confirmed here. A model's API availability does not prove that the worker tool or account can access it. Quotas, actual cache hits and spending enforcement require live evidence.

Sources: [Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra), [Claude pricing](https://platform.claude.com/docs/en/about-claude/pricing).
