import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";
import { check, headings } from "./checks";
import { snapshot, changes } from "./files";
import { FIXTURES } from "./paths";
import { normalize, validateCase, loadCases } from "./cases";
import { parseArgs, selectCases } from "./cli";
import { runOne, planRuns } from "./run";
import { recheckScenario, requireSavedCases } from "./recheck";
import { judgeEvidence } from "./scenario";
import { summarize } from "./reports";
import { scoresByCase, scoreRuns } from "./scoring";
import { missingPrograms, missingMessage, runTestCommands,
  unittestCounts } from "./project-evidence";
import { reachableGuides, ALWAYS_NEEDED } from "./needs";
import { validateRubricFixtures, type RubricBook } from "./rubric-fixtures";
import { traceObservation, traceChecks } from "./trace-checks";
import { resultChecks, ruleChecks } from "./rule-checks";
import type { Case, Checks, Event } from "./types";

const one = (checks: Checks, observation: Event) => {
  const verdicts = Object.values(check(checks, observation));
  expect(verdicts).toHaveLength(1);
  return verdicts[0];
};
const scratch = (name: string) => mkdtempSync(join(tmpdir(), `turn-checks-${name}-`));
const git = (work: string, ...args: string[]) => {
  const ran = spawnSync("git", ["-c", "user.name=T", "-c", "user.email=t@example.invalid", ...args],
    { cwd: work, env: { PATH: process.env.PATH, HOME: work, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" },
      encoding: "utf8" });
  if (ran.status !== 0) throw Error(ran.stderr);
  return ran.stdout.trim();
};

test("tests_pass reads the runner's own run of that exact command", () => {
  const c = {tests_pass: "python3 -m unittest"}, run = {command: "python3 -m unittest", status: 0};
  expect(one(c, {test_runs: [run]})).toBe(true);
  expect(one(c, {test_runs: [{...run, status: 1}]})).toBe(false);
  expect(one(c, {test_runs: [{...run, status: null, timed_out: true}]})).toBe(false);
  for (const observation of [{}, {test_runs: []}, {test_runs: [{...run, command: "python3 -m pytest"}]},
    {test_runs: [{...run, status: null, error: "spawn failed"}]}])
    expect(one(c, observation)).toBeNull();
});
test("heading_once counts files with the exact ATX heading across named files and Markdown under folders", () => {
  const c = {heading_once: {heading: "Where your data lives", in: ["README.md", "docs"]}};
  const files = {"README.md": "# Jotdown\n\n## Install\n", "docs/install.md": "# Install\n", "docs/usage.md": "# Usage\n",
    "notes.md": "## Where your data lives\n"};
  const at = (extra: Record<string, string>) => ({files: {...files, ...extra}, project_snapshot: {...files, ...extra}});
  expect(one(c, at({"docs/usage.md": "# Usage\n\n### Where your data lives ###\n"}))).toBe(true);
  expect(one(c, at({}))).toBe(false);
  expect(one(c, at({"README.md": "## Where your data lives\n", "docs/install.md": "## Where your data lives\n"}))).toBe(false);
  expect(one(c, at({"docs/usage.md": "```\n## Where your data lives\n```\n"}))).toBe(false);
  expect(one(c, at({"docs/usage.md": "## Where your data lives now\n"}))).toBe(false);
  expect(one(c, at({"docs/usage.md": "## Where your data lives\n", "docs/install.md": "(content withheld: a hard link)"})))
    .toBeNull();
  expect(one(c, {})).toBeNull();
  expect(headings("#NoSpace\n####### Seven\n  ## Indented ##\n## C#\n#\n")).toEqual(["Indented", "C#", ""]);
});
test("tree_lacks reads every file under the folder after the turn, written or not", () => {
  const c = {tree_lacks: {jotdown: ["Overdue"]}};
  const project = {"jotdown/cli.py": "print('Late')\n", "jotdown/store.py": "pass\n", "tests/test_summary.py": "Overdue"};
  const at = (files: Record<string, string>) => ({files, project_snapshot: files, changes: []});
  expect(one(c, at(project))).toBe(true);
  expect(one(c, at({...project, "jotdown/web/page.py": "title = 'Overdue'"}))).toBe(false);
  expect(one(c, at({...project, "jotdown/data.bin": "(binary file, sha256 00)\n"}))).toBeNull();
  expect(one(c, {})).toBeNull();
  // Patterns are case-insensitive like every other; a (?-i:...) group makes one exact.
  expect(one(c, at({...project, "jotdown/store.py": "def overdue(): pass"}))).toBe(false);
  expect(one({tree_lacks: {jotdown: ["(?-i:Overdue)"]}}, at({...project, "jotdown/store.py": "def overdue(): pass"})))
    .toBe(true);
});
test("tree_lacks checks exact files beside folders, without matching neighboring names", () => {
  const c = {tree_lacks: {"README.md": ["old location"], docs: ["old location"]}};
  const files = {"README.md": "New location", "docs/usage.md": "New location", "docs-old/usage.md": "old location",
    "README.md.old": "old location"};
  const at = (extra: Record<string, string>) => ({files: {...files, ...extra}, project_snapshot: {...files, ...extra}});
  expect(Object.values(check(c, at({})))).toEqual([true, true]);
  expect(Object.values(check(c, at({"README.md": "old location"})))).toEqual([false, true]);
  expect(Object.values(check(c, at({"docs/install.md": "old location"})))).toEqual([true, false]);
  expect(Object.values(check(c, at({"README.md": "(content withheld: a hard link)"})))).toEqual([null, true]);
});
test("paths_lack matches made or changed paths only", () => {
  const c = {paths_lack: ["\\.py$"]};
  expect(one(c, {changes: ["changed DESIGN.md", "removed prototype/old.py"]})).toBe(true);
  expect(one(c, {changes: ["changed DESIGN.md", "added jotdown/cli.py"]})).toBe(false);
  expect(one(c, {changes: ["changed jotdown/store.py"]})).toBe(false);
  expect(one(c, {})).toBeNull();
});
test("only_new_files allows up to the limit of new matching files and nothing else", () => {
  const c = {only_new_files: {matching: "\\.md$", at_most: 1}};
  expect(one(c, {changes: []})).toBe(true);
  expect(one(c, {changes: ["added questions.md"]})).toBe(true);
  for (const delta of [["added a.md", "added b.md"], ["added notes.txt"], ["added a.md", "changed DESIGN.md"],
    ["removed old.md"]]) expect(one(c, {changes: delta})).toBe(false);
  expect(one(c, {})).toBeNull();
});
test("unchanged_under may except named files, which may change, appear or go", () => {
  const c = {unchanged_under: [{folder: "jotdown", except: ["jotdown/cli.py"]}]};
  const before = {"jotdown/cli.py": "a", "jotdown/store.py": "b"};
  expect(one(c, {baseline_snapshot: before, project_snapshot: {...before, "jotdown/cli.py": "edited"}})).toBe(true);
  expect(one(c, {baseline_snapshot: before, project_snapshot: {"jotdown/store.py": "b"}})).toBe(true);
  for (const after of [{...before, "jotdown/store.py": "edited"}, {...before, "jotdown/summary.py": "new"},
    {"jotdown/cli.py": "a"}]) expect(one(c, {baseline_snapshot: before, project_snapshot: after})).toBe(false);
  expect(one(c, {project_snapshot: before})).toBeNull();
  expect(Object.keys(check(c, {}))).toEqual(["every file under jotdown unchanged except jotdown/cli.py"]);
});
test("compare_to picks the chapter's checkpoint or the turn's start for every comparison, and each default stays", () => {
  // Checkpoint: cli.py says Overdue. An earlier turn of the chapter changed it to Late; this turn changed nothing.
  const checkpoint = {"jotdown/cli.py": "Overdue\n", "README.md": "readme\n"};
  const start = {"jotdown/cli.py": "Late\n", "README.md": "readme\n"};
  const observation = {baseline_files: checkpoint, baseline_snapshot: checkpoint, start_files: start, start_snapshot: start,
    files: start, project_snapshot: start, changes: []};
  // unchanged defaults to the turn's start; the others default to the checkpoint.
  expect(one({unchanged: ["jotdown/cli.py"]}, observation)).toBe(true);
  expect(one({unchanged: ["jotdown/cli.py"], compare_to: "checkpoint"}, observation)).toBe(false);
  expect(one({unchanged: ["README.md"], compare_to: "checkpoint"}, observation)).toBe(true);
  expect(one({unchanged_under: ["jotdown"]}, observation)).toBe(false);
  expect(one({unchanged_under: ["jotdown"], compare_to: "turn"}, observation)).toBe(true);
  expect(one({keeps_lines: ["jotdown/cli.py"]}, observation)).toBe(false);
  expect(one({keeps_lines: ["jotdown/cli.py"], compare_to: "turn"}, observation)).toBe(true);
  const replace = {only_replacement: {"jotdown/cli.py": {from: "Overdue", to: "Late"}}};
  expect(one(replace, observation)).toBe(true);
  expect(one({...replace, compare_to: "checkpoint"}, observation)).toBe(true);
  expect(one({...replace, compare_to: "turn"}, observation)).toBe(false);
  expect(one({shorter: ["jotdown/cli.py"], compare_to: "turn"}, observation)).toBe(false);
  expect(one({shorter: ["jotdown/cli.py"]}, observation)).toBe(true);
  for (const checks of [{unchanged_under: ["jotdown"], compare_to: "turn"}, {keeps_lines: ["jotdown/cli.py"], compare_to: "turn"},
    {unchanged: ["jotdown/cli.py"], compare_to: "checkpoint"}] as Checks[])
    expect(one(checks, {files: start, project_snapshot: start, changes: []})).toBeNull();
  expect(Object.keys(check({unchanged: ["a.md"]}, {}))).toEqual(["unchanged a.md"]);
  expect(Object.keys(check({unchanged: ["a.md"], compare_to: "checkpoint"}, {}))).toEqual(["unchanged a.md (against the checkpoint)"]);
});
test("snapshots skip Python caches and keep files the project's .gitignore ignores", () => {
  const work = scratch("snapshot");
  try {
    for (const [p, text] of Object.entries({".gitignore": "my-todos.txt\ndata/\n__pycache__/\n", "my-todos.txt": "[ ] fix bike\n",
      "data/tasks.json": "[]\n", "jotdown/cli.py": "pass\n", "jotdown/__pycache__/cli.cpython-312.pyc": "cache",
      "stray.pyc": "cache", ".git/config": "x"})) {
      mkdirSync(join(work, p, ".."), {recursive: true}); writeFileSync(join(work, p), text);
    }
    const before = snapshot(work);
    expect(Object.keys(before).sort()).toEqual([".gitignore", "data/tasks.json", "jotdown/cli.py", "my-todos.txt"]);
    writeFileSync(join(work, "jotdown/__pycache__/store.cpython-312.pyc"), "new cache");
    writeFileSync(join(work, "jotdown/__pycache__/cli.cpython-312.pyc"), "changed cache");
    expect(changes(before, snapshot(work))).toEqual([]);
    expect(check({no_changes: true}, {changes: changes(before, snapshot(work))})).toEqual({"no changes": true});
    const evidence = judgeEvidence([{turn: 1, files: {"a.py": "x", "__pycache__/a.pyc": "c"},
      file_diffs: {"b.pyc": "d"}, changes: ["added b.pyc", "changed a.py"]}], {"x/__pycache__/y.pyc": "c", "x.md": "m"});
    expect(JSON.stringify(evidence)).not.toContain(".pyc");
    expect(evidence.turns[0]!.changes).toEqual(["changed a.py"]);
  } finally { rmSync(work, {recursive: true, force: true}); }
});

test("case validation checks requires and the new checks' patterns, bounds and paths", () => {
  const base = {fixture: "tiny-weather", turns: [{prompt: "Inspect"}]};
  expect(() => validateCase({...base, requires: ["python3"], turns: [{prompt: "x", checks: {
    tests_pass: "python3 -m unittest",
    heading_once: {heading: "Where your data lives", in: ["README.md", "docs"]}, tree_lacks: {jotdown: ["Overdue"]},
    paths_lack: ["\\.py$"], only_new_files: {matching: "\\.md$", at_most: 1}, compare_to: "checkpoint",
    unchanged_under: ["vendor/tinydate", {folder: "jotdown", except: ["jotdown/cli.py"]}]}}]})).not.toThrow();
  for (const value of [{...base, requires: ["/usr/bin/python3"]}, {...base, requires: ["python3 -m"]},
    ...([{tests_pass: " "}, {heading_once: {heading: "", in: ["a.md"]}},
      {heading_once: {heading: "A", in: []}}, {heading_once: {heading: "A", in: ["/etc"]}}, {tree_lacks: {"../x": ["a"]}},
      {tree_lacks: {x: ["["]}}, {paths_lack: ["("]}, {only_new_files: {matching: "\\.md$", at_most: -1}},
      {only_new_files: {matching: "\\.md$", at_most: 1.5}}, {only_new_files: {matching: "[", at_most: 1}},
      {compare_to: "yesterday"}, {unchanged_under: [{folder: "jotdown", except: ["tests/x.py"]}]},
      {unchanged_under: [{folder: "../jotdown"}]}] as unknown as Checks[]).map(checks => ({...base, checks}))])
    expect(() => validateCase(value)).toThrow();
});
test("requires probes each program once and names the cases that need a missing one", () => {
  const missing = missingPrograms([{id: "a/one", requires: ["git", "skillbook-no-such-program"]},
    {id: "a/two", requires: ["skillbook-no-such-program"]}, {id: "a/three"}]);
  expect(missing).toEqual([{program: "skillbook-no-such-program", cases: ["a/one", "a/two"]}]);
  expect(missingMessage(missing)).toContain("missing program: skillbook-no-such-program");
  expect(missingMessage(missing)).toContain("a/one, a/two");
  expect(missingPrograms([{id: "a/one", requires: ["git"]}])).toEqual([]);
});

test("the test command runs in a copy of the project with its own fresh home and records status, counts and failures",
  async () => {
  const work = scratch("tests"), root = scratch("root");
  try {
    mkdirSync(join(work, "tests"));
    writeFileSync(join(work, "tests/__init__.py"), "");
    // Each run's home starts empty, so a test that uses the default data path finds nothing from the agent or an
    // earlier run, and what it writes there is gone afterwards.
    writeFileSync(join(work, "tests/test_ok.py"), "import unittest, pathlib, os\n" +
      "class T(unittest.TestCase):\n  def test_a(self):\n    home = pathlib.Path.home()\n" +
      "    self.assertEqual(os.listdir(home), [])\n    (home / '.jotdown').mkdir()\n" +
      "    (home / '.jotdown' / 'tasks.json').write_text('[]')\n    pathlib.Path('made-by-tests.txt').write_text(str(home))\n" +
      "  def test_b(self): self.assertTrue(os.environ.get('PYTHONDONTWRITEBYTECODE'))\n");
    const before = snapshot(work);
    const [passing, again] = await runTestCommands(["python3 -m unittest", "python3 -m unittest -q"], work, root);
    for (const run of [passing, again]) expect(run).toMatchObject({status: 0, timed_out: false, tests_run: 2, failures: 0,
      errors: 0, failed: []});
    expect(passing!.command).toBe("python3 -m unittest");
    expect(snapshot(work)).toEqual(before);
    expect(existsSync(join(work, "made-by-tests.txt"))).toBe(false);
    expect(readdirSync(root)).toEqual([]);
    writeFileSync(join(work, "tests/test_bad.py"), "import unittest\nclass B(unittest.TestCase):\n" +
      "  def test_fail(self): self.assertEqual(1, 2)\n  def test_error(self): raise RuntimeError('boom')\n");
    const [failing] = await runTestCommands(["python3 -m unittest"], work, root);
    expect(failing).toMatchObject({status: 1, tests_run: 4, failures: 1, errors: 1});
    expect(failing!.failed!.join("\n")).toContain("test_fail");
    expect(one({tests_pass: "python3 -m unittest"}, {test_runs: [failing]})).toBe(false);
    const [slow] = await runTestCommands(["sleep 5"], work, root, 0.3);
    expect(slow).toMatchObject({status: null, timed_out: true});
    expect(one({tests_pass: "sleep 5"}, {test_runs: [slow]})).toBe(false);
    expect(readdirSync(root)).toEqual([]);
    expect(unittestCounts("Ran 0 tests in 0.000s\n\nNO TESTS RAN\n")).toEqual({tests_run: 0, failures: 0, errors: 0, failed: []});
    expect(unittestCounts("no unittest output")).toEqual({tests_run: null, failures: null, errors: null, failed: []});
  } finally { for (const p of [work, root]) rmSync(p, {recursive: true, force: true}); }
}, 30000);

const encode = (text: string) => ({stdout: [{type: "item.completed", item: {type: "agent_message", text}},
  {type: "turn.completed", usage: {input_tokens: 10, output_tokens: 2}}].map(e => JSON.stringify(e)).join("\n"),
  stderr: "", status: 0, left: [], left_why: null, tmp: null, tmp_paths: []});
test("a live chaptered run records the new evidence after each turn and a recheck reproduces every verdict", async () => {
  const root = mkdtempSync(join(FIXTURES, "unit-turn-checks-")), out = scratch("out");
  try {
    for (const [p, text] of Object.entries({"base/AGENTS.md": "Run python3 -m unittest.\n", "base/jotdown/__init__.py": "",
      "base/jotdown/cli.py": "HEADING = 'Overdue'\n", "base/jotdown/store.py": "PATH = 'data'\n",
      "base/tests/__init__.py": "", "base/tests/test_cli.py": "import unittest, pathlib\nfrom jotdown import cli\n" +
        "class T(unittest.TestCase):\n  def test_heading(self): self.assertIn(cli.HEADING, ['Overdue', 'Late'])\n" +
        // A test that uses the default data path, which must not reach the agent's home.
        "  def test_store(self):\n    data = pathlib.Path.home() / '.jotdown'\n    data.mkdir(exist_ok=True)\n" +
        "    (data / 'tasks.json').write_text('written by the checker')\n",
      "home/.jotdown/tasks.json": "[\"renew passport\"]\n",
      "base/config/reminders.env": "SMTP_PASSWORD=plum\n", "base/my-todos.txt": "[ ] renew passport\n"})) {
      mkdirSync(join(root, p, ".."), {recursive: true}); writeFileSync(join(root, p), text);
    }
    const base = relative(FIXTURES, join(root, "base")), home = relative(FIXTURES, join(root, "home"));
    const c = normalize({fixture: base, requires: ["python3"], gitignore: ["my-todos.txt", "data/", "__pycache__/"],
      chapters: [{number: 1, start_turn: 1, checkpoint: {fixture: base, untracked: ["config/reminders.env"], home: [home]}}],
      turns: [
        {prompt: "Change the heading", checks: {tests_pass: "python3 -m unittest", tree_lacks: {jotdown: ["(?-i:Overdue)"]},
          unchanged: ["my-todos.txt"]}},
        {prompt: "Inspect config", checks: {unchanged: ["config/reminders.env"]}},
        {prompt: "Add notes", checks: {only_new_files: {matching: "\\.md$", at_most: 1},
          unchanged_under: [{folder: "jotdown", except: ["jotdown/cli.py"]}], compare_to: "turn"}},
        {prompt: "Restore", checks: {compare_to: "checkpoint", tests_pass: "python3 -m unittest",
          only_replacement: {"jotdown/cli.py": {from: "Overdue", to: "Late"}}, unchanged_under: ["jotdown"]}},
      ]}, "essentials/turn-checks-unit");
    let turns = 0;
    const result = await runOne(c, "codex", "gpt-6.1-sol", 1, parseArgs(["--agents", "codex", "--yes"]), out, 1,
      async (_cmd, work, env) => {
        const turn = turns++, tasks = join(env.HOME!, ".jotdown/tasks.json");
        // The checkpoint's home files are in place before the first agent call; the runner's test run, after turn 1,
        // leaves the agent's home as the agent left it.
        expect(readFileSync(tasks, "utf8")).toBe(turn === 0 ? "[\"renew passport\"]\n" : "changed by the agent\n");
        if (turn === 0) {
          writeFileSync(tasks, "changed by the agent\n");
          // The checkpoint leaves the password file untracked, as a file the user never added.
          expect(git(work, "status", "--porcelain")).toBe("?? config/");
          writeFileSync(join(work, "jotdown/cli.py"), "HEADING = 'Late'\n");
          spawnSync("python3", ["-m", "unittest"], {cwd: work});
          expect(existsSync(join(work, "jotdown/__pycache__"))).toBe(true);
        }
        if (turn === 2) writeFileSync(join(work, "notes.md"), "# Notes\n");
        if (turn === 3) rmSync(join(work, "notes.md"));
        return encode(`Done ${turn + 1}.`);
      });
    expect(result.error).toBeNull();
    const verdicts = Object.entries(result.checks).filter(([name]) => !name.startsWith("answer"));
    expect(Object.fromEntries(verdicts)).toEqual({
      "turn 1: unchanged my-todos.txt": true, "turn 1: tests pass: python3 -m unittest": true,
      "turn 1: every file under jotdown lacks /(?-i:Overdue)/": true,
      "turn 2: unchanged config/reminders.env": true,
      "turn 3: every file under jotdown unchanged except jotdown/cli.py (against the turn's start)": true,
      "turn 3: only new files matching /\\.md$/, at most 1": true,
      "turn 4: jotdown/cli.py changes only \"Overdue\" to \"Late\" (against the checkpoint)": true,
      "turn 4: every file under jotdown unchanged (against the checkpoint)": false,
      "turn 4: tests pass: python3 -m unittest": true,
    });
    const [first, second, third] = result.turns;
    expect(first.changes).toEqual(["changed jotdown/cli.py"]);
    expect(first.test_runs).toMatchObject([{command: "python3 -m unittest", status: 0, tests_run: 2}]);
    expect(turns).toBe(4);
    expect(second.test_runs).toBeUndefined();
    expect(third.start_snapshot).toEqual(second.project_snapshot);
    // The runner's own evidence never reaches a judge.
    const evidence = JSON.stringify(judgeEvidence(result.turns, result.chapter_checkpoints[1].sources));
    for (const key of ["test_runs", "start_snapshot"]) expect(evidence).not.toContain(key);
    const saved = structuredClone(result);
    for (const t of saved.turns) { delete t.start_snapshot; delete t.start_files; }
    for (const replay of [recheckScenario(result, c), recheckScenario(saved, c)])
      expect(replay.checks).toEqual(result.checks);
  } finally { rmSync(root, {recursive: true, force: true}); rmSync(out, {recursive: true, force: true}); }
}, 60000);

test("checkpoint home folders fill the agent's home in order at each chapter, also when a run starts at a later one",
  async () => {
  const root = mkdtempSync(join(FIXTURES, "unit-home-")), out = scratch("out");
  try {
    for (const [p, text] of Object.entries({"base/README.md": "readme\n",
      "one/.jotdown/tasks.json": "chapter 1\n", "one/.legacy": "only in chapter 1\n",
      "two/.jotdown/tasks.json": "chapter 2, first folder\n", "two/.jotdown/settings.json": "{}\n",
      "three/.jotdown/tasks.json": "chapter 2, second folder\n"})) {
      mkdirSync(join(root, p, ".."), {recursive: true}); writeFileSync(join(root, p), text);
    }
    const at = (name: string) => relative(FIXTURES, join(root, name));
    const file = (first: string[]) => ({fixture: at("base"), chapters: [
      {number: 1, start_turn: 1, checkpoint: {fixture: at("base"), home: first}},
      {number: 2, start_turn: 2, checkpoint: {fixture: at("base"), home: [at("two"), at("three")]}},
    ], turns: [{prompt: "One"}, {prompt: "Two"}]});
    const c = normalize(file([at("one")]), "essentials/home-unit");
    const seen: Record<string, string>[] = [];
    const driver = async (_cmd: string[], _work: string, env: NodeJS.ProcessEnv) => {
      const home = env.HOME!, files: Record<string, string> = {};
      for (const name of [".jotdown/tasks.json", ".jotdown/settings.json", ".jotdown/added.txt", ".legacy", ".mine"])
        if (existsSync(join(home, name))) files[name] = readFileSync(join(home, name), "utf8");
      expect(existsSync(join(home, ".codex"))).toBe(true);
      seen.push(files);
      // The agent changes the checkpoint's files and adds its own.
      writeFileSync(join(home, ".jotdown/tasks.json"), "changed\n"); writeFileSync(join(home, ".jotdown/added.txt"), "x");
      writeFileSync(join(home, ".mine"), "the agent's own\n");
      return encode("Done.");
    };
    const all = await runOne(c, "codex", "gpt-6.1-sol", 1, parseArgs(["--agents", "codex", "--yes"]), out, 1, driver);
    expect(all.error).toBeNull();
    expect(seen).toEqual([
      {".jotdown/tasks.json": "chapter 1\n", ".legacy": "only in chapter 1\n"},
      // Later folders win; files from an earlier chapter's home folders, and the agent's changes to them, are gone.
      {".jotdown/tasks.json": "chapter 2, second folder\n", ".jotdown/settings.json": "{}\n", ".mine": "the agent's own\n"},
    ]);
    seen.length = 0;
    const later = await runOne(c, "codex", "gpt-6.1-sol", 1, parseArgs(["--agents", "codex", "--yes", "--chapter", "2"]),
      out, 1, driver);
    expect(later.error).toBeNull();
    expect(seen).toEqual([{".jotdown/tasks.json": "chapter 2, second folder\n", ".jotdown/settings.json": "{}\n"}]);
    // Validation: each home entry names an existing fixture folder that supplies no agent settings and no .git.
    expect(() => validateCase(file([at("one"), at("three")]))).not.toThrow();
    mkdirSync(join(root, "agent/.codex"), {recursive: true}); writeFileSync(join(root, "agent/.codex/config.toml"), "");
    for (const [home, message] of [[[at("missing")], "no checkpoint fixture"], [[at("base/README.md")], "fixture folder"],
      [[at("agent")], "cannot supply .codex"], [["../outside"], "inside its root"]] as [string[], string][])
      expect(() => validateCase(file(home))).toThrow(message);
  } finally { rmSync(root, {recursive: true, force: true}); rmSync(out, {recursive: true, force: true}); }
}, 60000);

function twoCases() {
  const root = scratch("cases");
  mkdirSync(join(root, "essentials"));
  const turn = (prompt: string, criterion: string) => ({prompt, rubric: [{id: "result", tag: "task", criterion}]});
  writeFileSync(join(root, "essentials/alpha.yaml"), JSON.stringify({fixture: "tiny-weather", turns: [turn("A", "Alpha result")]}));
  writeFileSync(join(root, "essentials/todo-unit.yaml"), JSON.stringify({fixture: "tiny-weather", requires: ["python3"],
    turns: [turn("B", "Todo result"), turn("C", "Todo follow-up")]}));
  return root;
}
const book = (c: Case): RubricBook => ({scope: "active", sources: {[c.id]: {"source.md": "facts"}},
  traces: Object.fromEntries(c.turns.flatMap((_, i) => ["good", "wrong"].map(kind =>
    [`${c.id}:t${i + 1}:${kind}`, {case: c.id, prior: [], observation: {turn: i + 1, final_answer: `${kind} answer`}}]))),
  checks: c.turns.flatMap((t, i) => (t.rubric ?? []).map(r => ({case: c.id, turn: i + 1, id: r.id, tag: r.tag,
    criterion: r.criterion, positive: `${c.id}:t${i + 1}:good`, negative: `${c.id}:t${i + 1}:wrong`})))});
test("two cases side by side: selection, plans, books, saved runs and separate scores", () => {
  const root = twoCases();
  try {
    const all = loadCases("", root);
    expect(all.map(c => c.id)).toEqual(["essentials/alpha", "essentials/todo-unit"]);
    expect(selectCases(all, parseArgs(["--case", "todo-unit"])).map(c => c.id)).toEqual(["essentials/todo-unit"]);
    expect(selectCases(all, parseArgs([])).map(c => c.id)).toHaveLength(2);
    const plan = planRuns(all, parseArgs(["--agents", "codex", "--dry-run"]));
    expect(plan.map(([c]) => c.id)).toEqual(["essentials/alpha", "essentials/todo-unit"]);
    const [alpha, todo] = all as [Case, Case];
    expect(todo.requires).toEqual(["python3"]);
    // Each case's book covers its own case; checked against both cases, one book is incomplete.
    expect(validateRubricFixtures(book(todo), [todo])).toBe(2);
    expect(validateRubricFixtures(book(alpha), [alpha])).toBe(1);
    expect(() => validateRubricFixtures(book(alpha), [alpha, todo])).toThrow("uncovered checks");
    expect(() => validateRubricFixtures(book(alpha), [todo])).toThrow("current criterion");
    const run = (c: Case, verdict: boolean) => ({case: c.id, agent: "codex", model: "m", user_mode: "fixed", run: 1, error: null,
      cost: 0, checks: {}, turns: c.turns.map((t, i) => ({turn: i + 1, scripted_message: t.prompt, final_answer: "x",
        tagged_checks: [], judgments: [{id: "result", tag: "task", verdict}]}))});
    const runs = [run(alpha, true), run(todo, false)];
    requireSavedCases(runs, new Map(all.map(c => [c.id, c])));
    expect(scoresByCase(runs)).toEqual({"essentials/alpha, codex/m/fixed": scoreRuns([runs[0]!])["codex/m/fixed"],
      "essentials/todo-unit, codex/m/fixed": scoreRuns([runs[1]!])["codex/m/fixed"]});
    expect(scoresByCase([runs[0]])).toEqual(scoreRuns([runs[0]!]));
    const report = summarize(runs, 0);
    expect(report).toContain("## Scores: essentials/alpha, codex/m/fixed");
    expect(report).toContain("## Scores: essentials/todo-unit, codex/m/fixed");
    expect(report).toContain("## essentials/todo-unit — codex (m)");
  } finally { rmSync(root, {recursive: true, force: true}); }
});

test("a book's library covers exactly the returns its case's turns can reach", () => {
  const rules = ruleChecks(), parts = resultChecks().filter(p => !p.exclusion);
  const naming = rules.find(r => r.required_skill === "understand-naming")!;
  const c = normalize({fixture: "tiny-weather", turns: [
    {prompt: "Name it", skill_needs: [{skill: "understand-naming", deadline: "answer"}],
      rubric: [{id: "result", tag: "task", criterion: "A name"}]},
    {prompt: "Maybe split", if_taken: [{skill: "organize-split", deadline: "first change", path: "split"}],
      rule_marks: [{id: rules.find(r => r.required_skill === "coordinate-brief")!.id, applies: true, deadline: "answer"},
        {id: rules.find(r => r.required_skill === "understand-brainstorm")!.id, applies: false, near_miss: true,
          deadline: "answer"}],
      rubric: [{id: "stakes", tag: "rule", criterion: `check:${rules.find(r => r.required_skill === "act-stakes")!.key}`},
        {id: "near", tag: "rule", criterion: `check:${rules.find(r => r.required_skill === "understand-brainstorm")!.key}`}]},
  ]}, "essentials/reach-unit");
  const guides = new Set([...reachableGuides(c.turns[0]!, rules), ...reachableGuides(c.turns[1]!, rules)]);
  for (const guide of [...ALWAYS_NEEDED, "understand", "understand-naming", "organize", "organize-split", "coordinate",
    "coordinate-brief", "act-stakes"]) expect(guides.has(guide)).toBe(true);
  for (const guide of ["coordinate-setup", "organize-merge", "understand-clarify", "understand-brainstorm"])
    expect(guides.has(guide)).toBe(false);
  const reached = parts.filter(p => guides.has(p.skill));
  const b = book(c);
  b.traces[`${c.id}:t2:good`] = {case: c.id, prior: [], observation: {turn: 2, final_answer: "good answer"}};
  b.traces[`${c.id}:t2:wrong`] = {case: c.id, prior: [], observation: {turn: 2, final_answer: "wrong answer"}};
  for (const part of reached) {
    for (const kind of ["good", "wrong"]) b.traces[`${part.id}:${kind}`] = {case: c.id, prior: [], observation: {turn: 1,
      final_answer: `${kind} return`}};
    (b.library ??= []).push({case: c.id, turn: 1, id: part.id, tag: `result:${part.skill}`, criterion: part.expected,
      positive: `${part.id}:good`, negative: `${part.id}:wrong`});
  }
  // No rule needs a criterion of its own, such as the naming rule this case never states.
  expect(c.turns.some(t => t.rubric?.some(r => r.source_check === naming.key))).toBe(false);
  expect(validateRubricFixtures(b, [c])).toBe(3 + reached.length);
  const short = structuredClone(b); short.library!.pop();
  expect(() => validateRubricFixtures(short, [c])).toThrow("uncovered result");
  const setup = parts.find(p => p.skill === "coordinate-setup")!, extra = structuredClone(b);
  extra.library!.push({case: c.id, turn: 1, id: setup.id, tag: `result:${setup.skill}`, criterion: setup.expected,
    positive: `${reached[0]!.id}:good`, negative: `${reached[1]!.id}:wrong`});
  expect(() => validateRubricFixtures(extra, [c])).toThrow("current criterion");
});

test("trace evidence fields drive the new checks exactly as live evidence does, and missing fields stay unknown", () => {
  const c = normalize({fixture: "tiny-weather", chapters: [{number: 1, start_turn: 1, checkpoint: {fixture: "tiny-weather"}}],
    turns: [{prompt: "Change the heading"}]}, "essentials/trace-unit");
  const b: RubricBook = {scope: "active", sources: {}, chapter_sources: {[`${c.id}:1`]: {
    "jotdown/cli.py": "Overdue\n", "README.md": "# Jotdown\n", "config/reminders.env": "SMTP_PASSWORD=x\n"}},
  traces: {
    "t1:correct": {case: c.id, chapter: 1, prior: [], observation: {turn: 1, chapter: 1, final_answer: "Changed the heading.",
      files_changed: {"jotdown/cli.py": "Late\n", "CHANGELOG.md": "## 1.0\n", "jotdown/__pycache__/cli.pyc": "cache"},
      test_runs: [{command: "python3 -m unittest", status: 0, tests_run: 3, failures: 0, errors: 0}],
      left_running: [], tmp_paths: []}},
    "t1:wrong": {case: c.id, chapter: 1, base: "t1:correct", prior: [], observation: {
      test_runs: [{command: "python3 -m unittest", status: 1, tests_run: 3, failures: 1, errors: 0}] }},
    "t1:bare": {case: c.id, chapter: 1, prior: [], observation: {turn: 1, chapter: 1, final_answer: "Done.",
      files_changed: {"jotdown/cli.py": "Late\n"}}},
  }, checks: []};
  const checks: Checks = {tests_pass: "python3 -m unittest",
    tree_lacks: {jotdown: ["(?-i:Overdue)"]}, paths_lack: ["\\.pyc$"], nothing_left_running: true,
    heading_once: {heading: "1.0", in: ["CHANGELOG.md", "README.md"]},
    only_replacement: {"jotdown/cli.py": {from: "Overdue", to: "Late"}}, compare_to: "checkpoint"};
  const verdicts = (ref: string) => Object.values(traceChecks(checks, ref, b));
  expect(verdicts("t1:correct").every(v => v === true)).toBe(true);
  const wrong = traceChecks(checks, "t1:wrong", b);
  expect(Object.entries(wrong).filter(([, v]) => v === false).map(([k]) => k)).toEqual(["tests pass: python3 -m unittest"]);
  const bare = traceChecks(checks, "t1:bare", b);
  for (const key of ["tests pass: python3 -m unittest", "nothing left running"]) expect(bare[key]).toBeNull();
  const observation = traceObservation("t1:correct", b, checks);
  expect(observation.changes).toEqual(["added CHANGELOG.md", "changed jotdown/cli.py"]);
  expect(Object.keys(observation.files)).not.toContain("jotdown/__pycache__/cli.pyc");
  // The same evidence in a live-shaped record gives the same verdicts.
  const live = {...observation, test_runs: observation.test_runs};
  expect(check(checks, live, null, [])).toEqual(traceChecks(checks, "t1:correct", b));
});
