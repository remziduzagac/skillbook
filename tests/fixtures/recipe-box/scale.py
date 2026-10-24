"""Scales a recipe to a different number of servings."""

import re
import sys


def scale(amount, serves, wanted):
    """The amount of an ingredient for `wanted` servings, from a recipe that serves `serves`."""
    return amount * serves / wanted


def scale_recipe(text, wanted):
    serves = int(re.search(r"^Serves: (\d+)", text, re.M).group(1))
    lines = []
    for line in text.splitlines():
        match = re.match(r"^- (\d+(?:\.\d+)?) (.*)$", line)
        if match:
            line = f"- {scale(float(match.group(1)), serves, wanted):g} {match.group(2)}"
        elif line.startswith("Serves:"):
            line = f"Serves: {wanted}"
        lines.append(line)
    return "\n".join(lines) + "\n"


def main():
    path, wanted = sys.argv[1], int(sys.argv[2])
    with open(path) as f:
        print(scale_recipe(f.read(), wanted), end="")


if __name__ == "__main__":
    main()
