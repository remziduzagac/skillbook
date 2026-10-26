import { resolve } from "node:path";
export const REPO = resolve(import.meta.dir, "../..");
export const CASES = resolve(REPO, "tests/cases");
export const FIXTURES = resolve(REPO, "tests/fixtures");
export const MARKER = "SKILLBOOK_TEST_RUN";
export const POINTER =
  "Before any work, load the essentials skill and follow it; " +
  "load it again whenever its text is no longer in view, such as after compaction.";
