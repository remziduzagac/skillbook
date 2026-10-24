# Plan: recipe-box 1.1

Decision: every recipe states its servings on one line, written exactly `Serves: N`, because `scale.py` reads that line and nothing else.

Decision: recipes stay plain Markdown with no front matter block (`---` lines at the top), because the print shop's converter prints such a block as text.

1. [x] Fix the usage line in the README.
2. [ ] Give every recipe in `recipes/` a servings line.
3. [ ] Add a test for a recipe with no servings line.
4. [ ] Give every recipe its cooking time.
