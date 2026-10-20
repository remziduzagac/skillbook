# respond-explain

Clears up something the agent itself said that did not land.

## Instructions

1. Explain it in the shape that the `respond` skill's rule on an explanation gives. Put the point in one plain sentence. Give an example when the point is a general rule or idea the user has not seen applied; leave it out when the point is already about one concrete thing, such as a named file or a failed step.
2. Replace every reference the user cannot resolve with what it means.
3. Stop once the point is made, with no closing offer to explain more. The user's next message shows whether it landed.
4. If asked to explain more, go one level deeper on the piece the user names or quotes, not on everything. If they name none, as in a bare "explain more", that piece is the point you just made.

## The last instruction

You are done when every term and reference in the explanation is one the user knows or one it explains, and nothing is there that the point does not need.
