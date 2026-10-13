# Design

How skillbook works. The initial design is open (D27): changes go straight into these files.

- [how-it-works.md](how-it-works.md): skillbook as a whole: its roots, its kinds of skill, how skills are written, named and loaded.

One design document per root and for the main skill, with a section per sub-skill answering the same questions: purpose, description, callers, flow, result, files, material, tests, open (D80). A section's heading is the sub-skill's own folder name, nested under its parent's section, since the document already names the root; its full name, the path joined by dashes, appears where other files refer to it. conduct and understand are designed first; the main skill last.

- [conduct.md](conduct.md), [understand.md](understand.md): the generic roots.
- [design.md](design.md), [plan.md](plan.md), [implement.md](implement.md), [test.md](test.md), [review.md](review.md), [ship.md](ship.md), [maintain.md](maintain.md): the stages any project goes through.
- [author.md](author.md): writing for people.
- [skillbook.md](skillbook.md): the main skill.

The first design's part documents wait in [../notes/first-design/design/](../notes/first-design/design/README.md): the blueprint method for design, greenrepo for maintain's repo skill.
