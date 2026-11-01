# organize-cluster

Builds a view that helps readers find items while keeping source content unchanged. Navigation tags may be written into items only when the user asks for that form.

## When to use

Use when readers need a view for finding items while their source content stays unchanged. A map or index is one example. Write navigation tags inside items only when the user asks for that form. Leave all other source content unchanged.

## When not

- Moving items into groups: use the `organize-split` guide. A navigation view leaves their source content in place.
- Adding a shared parent: use the `organize-compose` guide. A view need not add a content hierarchy.
- Effects beyond navigation: return them to the main task and the `act-guardrails` guide. Tags may also change publishing, access or automation.

## Gives back

The view, how it will stay current and any requested tag edits. All other source content stays unchanged.

```text
A B C → view over A, B, C (source content unchanged)
```

## Advice

- A map saves reading when agents often need the same items. The reader can open the needed part instead of searching everything.

## Instructions

1. To make the view useful to its readers, find who needs to find what. The readers' purpose determines the grouping.
2. To keep groups consistent, use one grouping principle by the parent's rule. Give each item one main group. "See also" links are allowed.
3. To fit the view to its destination, choose the view's form by the parent's shared choice rule. Use an index, table of contents, README map or external tag map as appropriate. Keep the view outside source items by default. Navigation tags may be written into items only when the user asks for that form. List the exact tag edits in the approved map. Check what tags actually do. Return effects on publishing, access, automation or other behavior beyond navigation to the caller and the `act-guardrails` guide. Do not silently treat such effects as navigation.
4. To keep the view accurate, choose how the view stays current. Use a script or a check when items change. Check for omitted items and entries pointing to nothing.
5. To preserve the agreed source content, write the view only under the parent's approved map. Check every in-scope item is reachable and every entry resolves. For requested in-item tags, check the exact edits and that all other content is unchanged.

## The last instruction

Return the view or proposal, its maintenance method and any exact requested tag edits. Source content is otherwise unchanged. Follow the `organize` guide's inventory check and both approval checkpoints. Report missing items, entries that point to nothing and effects beyond navigation. Do not claim the view is complete when those problems remain.
