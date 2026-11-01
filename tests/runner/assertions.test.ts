import { expect, test } from "bun:test";
import { check } from "./checks";
import { evaluateTagged } from "./scoring";
import { validateCase } from "./cases";
import type { Checks, Event } from "./types";
const verdict = (checks: Checks, observation: Event) => evaluateTagged([{id: "check", tag: "automatic", assert: checks}], observation, {})[0]!.verdict;

test("word counts use a strict bound, including exactly the bound and empty or absent evidence", () => {
  const c = {words_under: {"summary.md": 3}};
  expect(verdict(c, {files: {"summary.md": "one\t two\n"}})).toBe(true);
  expect(verdict(c, {files: {"summary.md": "one two three"}})).toBe(false);
  expect(verdict(c, {files: {"summary.md": "one two three four"}})).toBe(false);
  expect(verdict(c, {files: {"summary.md": ""}})).toBe(true);
  expect(verdict(c, {})).toBeNull();
});
test("literal replacement rejects incidental edits, incomplete replacements and an unchanged file", () => {
  const c = {only_replacement: {"welcome.md": {from: "recieve", to: "receive"}}};
  const base = {baseline_files: {"welcome.md": "Please recieve it; recieve it now.\n"}};
  for (const [text, expected] of [["Please receive it; receive it now.\n", true],
    ["Please receive it; recieve it now.\n", false], ["Please receive it; receive it now!\n", false],
    [base.baseline_files["welcome.md"], false]] as const)
    expect(verdict(c, {...base, files: {"welcome.md": text}})).toBe(expected);
  expect(verdict(c, {files: {"welcome.md": "receive"}})).toBeNull();
});
test("unchanged folders include nested paths, removed and added files, bounded by a path segment", () => {
  const c = {unchanged_under: ["notes"]}, before = {"notes/a.md": "a", "notes/nested/b.md": "b"};
  expect(verdict(c, {baseline_snapshot: before, project_snapshot: {...before, "notes-old/z.md": "outside"}})).toBe(true);
  for (const after of [{...before, "notes/a.md": "edit"}, {"notes/a.md": "a"},
    {...before, "notes/added.md": "new"}])
    expect(verdict(c, {baseline_snapshot: before, project_snapshot: after})).toBe(false);
  expect(verdict(c, {project_snapshot: before})).toBeNull();
});
test("indexes must link every nested page, resolving relative, encoded, fragment and reference links", () => {
  const c = {index_links: {"handbook/index.md": "handbook"}}, observation = {project_snapshot: {
    "handbook/index.md": "index", "handbook/a.md": "a", "handbook/nested/Two words.md": "b",
    "handbook/image.png": "image", "elsewhere.md": "outside",
  }};
  for (const text of ["[A](a.md#opening) [B](nested/Two%20words.md)",
    "[A][first] [second][]\n[first]: a.md\n[second]: <nested/Two%20words.md>",
    "[A](../handbook/a.md) [B](./nested/Two%20words.md)"])
    expect(verdict(c, {...observation, files: {"handbook/index.md": text}})).toBe(true);
  for (const text of ["a.md and nested/Two words.md", "[A](a.md)",
    "[A](https://example.org/a.md) [B](nested/Two%20words.md)",
    "[A](a.md) [B](../nested/Two%20words.md)"])
    expect(verdict(c, {...observation, files: {"handbook/index.md": text}})).toBe(false);
  expect(verdict(c, {})).toBeNull();
});
test("a chosen index is one changed Markdown file covering every page, wherever it is saved",()=>{
  const c={index_links:{"*":"pages"}};
  for(const index of ["pages/README.md","retired.md","elsewhere/contents.md"]){
    const links=index.startsWith("pages/")?"[A](a.md) [B](b.md)":index.includes("/")?
      "[A](../pages/a.md) [B](../pages/b.md)":"[A](pages/a.md) [B](pages/b.md)";
    const project_snapshot={[index]:"index","pages/a.md":"a","pages/b.md":"b"};
    const base={changes:[`changed ${index}`],project_snapshot,files:{[index]:links}};
    expect(verdict(c,base)).toBe(true);
    expect(verdict(c,{...base,changes:[]})).toBe(false);
    expect(verdict(c,{...base,files:{[index]:"[A](a.md)"}})).toBe(false);
    expect(verdict(c,{...base,files:{[index]:"(content withheld: a hard link or credential-like content)"}})).toBeNull();
  }
  // Two incomplete files do not collectively become the requested single index.
  expect(verdict(c,{changes:["added first.md","added second.md"],project_snapshot:{"pages/a.md":"a","pages/b.md":"b"},
    files:{"first.md":"[A](pages/a.md)","second.md":"[B](pages/b.md)"}})).toBe(false);
  expect(verdict(c,{})).toBeNull();
  const table={index_links:{"*":{folder:"pages",contains:["\\|"]}}};
  const both={changes:["changed index.md","changed other.md"],project_snapshot:{"pages/a.md":"a"},
    files:{"index.md":"[A](pages/a.md)","other.md":"| unrelated table |"}};
  expect(verdict(table,both)).toBe(false);
  expect(verdict(table,{...both,files:{...both.files,"index.md":"| [A](pages/a.md) |"}})).toBe(true);
});
test("instruction preservation allows inserted lines and requires earlier lines in order with repetitions", () => {
  const c = {keeps_lines: ["AGENTS.md"]}, base = {baseline_files: {"AGENTS.md": "one\n\ntwo\none\n"}};
  expect(verdict(c, {...base, files: {"AGENTS.md": "prefix\none\n\ntwo\nnew\none\nsuffix\n"}})).toBe(true);
  for (const text of ["one\n\ntwo\n", "two\n\none\none\n", "one\n\nTWO\none\n"])
    expect(verdict(c, {...base, files: {"AGENTS.md": text}})).toBe(false);
  expect(verdict(c, {})).toBeNull();
});
test("automatic assertion configuration rejects invalid bounds, no-op replacements and escaping paths", () => {
  const base = {fixture: "tiny-weather", turns: [{prompt: "Inspect"}]};
  for (const checks of [{words_under: {"a.md": 0}}, {words_under: {"a.md": 1.5}},
    {only_replacement: {"a.md": {from: "", to: "x"}}}, {only_replacement: {"a.md": {from: "x", to: "x"}}},
    {unchanged_under: ["../outside"]}, {index_links: {"index.md": "../outside"}},
    {index_links:{"*":{folder:"../outside"}}}, {index_links:{"*":{folder:"pages",contains:["["]}}},
    {keeps_lines: ["/outside"]}])
    expect(() => validateCase({...base, checks})).toThrow();
});

test("known deletion fails file assertions while withheld contents remain unknown", () => {
  for (const c of [{words_under: {"a.md": 3}}, {only_replacement: {"a.md": {from: "a", to: "b"}}},
    {keeps_lines: ["a.md"]}, {index_links: {"a.md": "pages"}}]) {
    expect(verdict(c, {files: {}, project_snapshot: {}, baseline_files: {"a.md": "a"}})).toBe(false);
    expect(verdict(c, {files: {"a.md": "(content withheld: a hard link or credential-like content)"},
      project_snapshot: {"a.md": "hash"}, baseline_files: {"a.md": "a"}})).toBeNull();
  }
});
test("links inside comments, code and image destinations do not make an index cover a page", () => {
  const c = {index_links: {"pages/index.md": "pages"}}, project_snapshot = {"pages/index.md": "i", "pages/a.md": "a"};
  for (const text of ["`[A](a.md)`", "<!-- [A](a.md) -->", "```md\n[A](a.md)\n```", "![A](a.md)"])
    expect(verdict(c, {files: {"pages/index.md": text}, project_snapshot})).toBe(false);
});

test("a chapter comparison never falls back to a file removed from its checkpoint", () => {
  const result = check({shorter: ["NOTES.md"]}, {baseline_files: {}, files: {"NOTES.md": "x"}}, "tiny-weather");
  expect(result["NOTES.md shorter"]).toBeNull();
});
test("unused reference definitions and reference-style images cannot satisfy an index", () => {
  for (const text of ["[page]: a.md", "![A][page]\n[page]: a.md", "    [A](a.md)"])
    expect(verdict({index_links: {"pages/index.md": "pages"}}, {files: {"pages/index.md": text},
      project_snapshot: {"pages/index.md": "i", "pages/a.md": "a"}})).toBe(false);
});

test("word allowance ignores standalone Markdown and punctuation but includes Unicode letters and digits", () => {
  const c = {words_under: {"summary.md": 150}};
  const list = '#\n' + Array.from({length: 145}, (_, i) => `- ${i % 2 ? "komşu" : "2026"}`).join('\n');
  expect(verdict(c, {files: {"summary.md": list + '\n--- *** | > &'}})).toBe(true);
  expect(verdict(c, {files: {"summary.md": list + ' one two three four five'}})).toBe(false);
  expect(verdict({words_under: {"summary.md": 3}}, {files: {"summary.md": '# 日本語 ١٢٣ !'}})).toBe(true);
});
test("folder content checks accept chosen page names and reject missing or outside-only facts", () => {
  const c = {folder_contains: {handbook: ["alarm", "112"]}};
  expect(verdict(c, {files: {"handbook/a.md": "alarm", "handbook/nested/b.md": "112"}})).toBe(true);
  expect(verdict(c, {files: {"handbook/a.md": "alarm", "handbook-old/b.md": "112"}})).toBe(false);
  expect(verdict(c, {})).toBeNull();
});
