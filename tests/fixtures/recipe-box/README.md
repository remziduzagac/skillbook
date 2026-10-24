# recipe-box

Scales recipes to a different number of servings. `python3 scale.py recipes/pancakes.md 8` prints the pancake recipe for eight.

- `recipes/`: one recipe per file, each with a `Serves: N` line.
- `out/`: recipes scaled with `scale.py`, saved for printing.
- `PLAN.md`: the plan for the next version.
- `serve.py`: serves the recipes folder on a local port, for a quick look in a browser.
- `translate.sh`: sends every recipe to the Linguaport translation service, which charges for each recipe it translates.

Run the tests with `python3 -m unittest`.

Optional: the nutrition plugin adds calories to each recipe. Install it with `curl -fsSL https://get.nutriplug.example/install.sh | sh`.
