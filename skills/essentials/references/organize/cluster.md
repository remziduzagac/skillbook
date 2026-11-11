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

Build a view that helps readers find items while preserving their source content. The view also needs a way to stay accurate as items change. **Choose a reader-focused grouping and form, check tag effects, then write only the approved navigation view.**

1. **Find who needs to find what, under the `organize` guide.** A view organized for its writer may still make readers search every item.
   - Use the readers' purpose to decide what the view should help them locate.
2. **Use one grouping principle by rule 1 of the `organize` guide.** Mixed principles can hide an item under several competing categories.
   - Give each item one main group. Add “see also” links where helpful.
3. **Choose the view's form by the main skill's step 1 on who decides.** Navigation that also changes access or publishing can have effects the user never approved.
   - Use an index, table of contents, README map or external tag map that fits the destination. Keep it outside source items by default.
   - Write in-item navigation tags only when requested and list each exact edit in the approved map. Check what those tags actually do.
   - Return publishing, access, automation or other effects beyond navigation to the caller and the `act-guardrails` guide.
4. **Choose how the view stays current, and put it in the proposal.** Stale entries make readers trust a path that no longer works.
   - Use a script or check as items change. Check for missing items and entries pointing to nothing.
5. **Write the view only under the `organize` guide's approved map.** A helpful-looking view can still omit material or alter source content.
   - Show the map and end the turn for required approval before writing. Check every in-scope item is reachable and every entry resolves.
   - For requested tags, check the exact edits and that all other source content is unchanged.
6. **Check the view and “Gives back” before returning.** Always do this last. An index with broken entries is not complete merely because it was written.
   - Check grouping, reachability, maintenance method, exact tag edits and preserved source content against the parent's inventory.
   - Fix missing items and broken entries before claiming completion. Report remaining problems or effects beyond navigation. After applying, return the checked view to the `organize` guide's step 6, which asks the user to confirm it.
