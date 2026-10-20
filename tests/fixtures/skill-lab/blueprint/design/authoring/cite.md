# Design: cite

## cite

- **Purpose:** make sure each quotation and each figure in a draft can be traced to a source.
- **Description:** use when a draft quotes people or gives figures and the user wants them checked; not for spelling or voice, which are proofread's.
- **Callers:** the user.
- **Flow:** it is to be ensured that every quotation and every figure appearing within the draft is matched by the agent against the source from which it was obtained, whereupon any quotation or figure for which no source can be located shall be listed together with the line on which it occurs; where a source is a web page it is opened with web access, and where web access is unavailable the quotations and figures are listed for the user to check by hand; wait for the user before any figure is replaced.
- **Result:** a list of the quotations and figures, each with its source or marked as having none found.
- **Files:** `skills/authoring/references/cite.md`; needs web access, with the hand-check list as the fallback without it.
- **Tests:** a press release with an invented percentage gets that figure listed with its line; a draft with no quotations or figures gets one line saying there is nothing to check; without web access, the claims are listed for a hand check rather than skipped.
- **Open:** a shared web-checking skill is not built yet; until it exists, the agent uses its own web access.
