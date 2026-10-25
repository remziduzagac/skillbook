# organize-cluster

Builds a finding view with source content unchanged. Navigation tags may be written into items only when the user asks for that form.

```text
A B C → view over A, B, C (source content unchanged)
```

## Advice

- A map pays for items agents read often. The reader can open the needed part instead of searching everything.

## Instructions

1. **Find who needs to find what.** The readers' purpose determines the grouping.
2. **Use one grouping principle by the parent's rule.** Give each item one main group. "See also" links are allowed.
3. **Choose the view's form by the parent's shared choice rule.** Use an index, table of contents, README map or external tag map as appropriate. Keep the view outside source items by default. Navigation tags may be written into items only when the user asks for that form. List the exact tag edits in the approved map. Check what tags actually do. Return effects on publishing, access, automation or other behavior beyond navigation to the caller and `act-guardrails`. Do not silently treat such effects as navigation.
4. **Choose how the view stays current.** Use a script or a check when items change. Check for omitted items and entries pointing to nothing.
5. **Write the view only under the parent's approved map.** Check every in-scope item is reachable and every entry resolves. For requested in-item tags, check the exact edits and that all other content is unchanged.

## The last instruction

Return the view or proposal, its maintenance method and any exact requested tag edits. Source content is otherwise unchanged. Keep the parent's inventory and both approval checkpoints. Report missing items, dead entries and effects beyond navigation rather than claiming a complete finding view.
