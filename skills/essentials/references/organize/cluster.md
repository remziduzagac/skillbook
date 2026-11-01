# organize-cluster

## Purpose

Builds a view that helps readers find items while keeping source content unchanged apart from navigation tags the user requests.

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

Help readers find the items they need. Prepare a navigation view that preserves source content.

1. **Find who needs to find what.** This helps make the view useful to its readers. The readers' purpose determines the grouping.
2. **Use one grouping principle by the parent's rule.** This helps keep groups consistent. Give each item one main group. "See also" links are allowed.
3. **Choose the view's form by the parent's shared choice rule.** This helps fit the view to its destination. Use an index, table of contents, README map or external tag map as appropriate. Keep the view outside source items by default. Navigation tags may be written into items only when the user asks for that form. List the exact tag edits in the approved map. Check what tags actually do. Return effects on publishing, access, automation or other behavior beyond navigation to the caller and the `act-guardrails` guide. Do not silently treat such effects as navigation.
4. **Choose how the view stays current.** This helps keep the view accurate. Use a script or a check when items change. Check for omitted items and entries pointing to nothing.
5. **Write the view only under the parent's approved map.** This helps preserve the agreed source content. Check every in-scope item is reachable and every entry resolves. For requested in-item tags, check the exact edits and that all other content is unchanged.

6. **Return the view or proposal, its maintenance method and any exact requested tag edits.** Always do this last. Source content is otherwise unchanged. Follow the `organize` guide's inventory check and both approval checkpoints. Report missing items, entries that point to nothing and effects beyond navigation. Do not claim the view is complete when those problems remain.
