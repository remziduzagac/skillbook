"use strict";
const test = require("node:test");
const assert = require("node:assert");
const { addTodo, completeTodo, sortByDue } = require("../src/todo.js");

test("addTodo numbers the new todo after the last one", () => {
  const list = addTodo(addTodo([], "pay rent"), "buy stamps");
  assert.strictEqual(list[1].id, 2);
  assert.strictEqual(list[1].done, false);
});

test("completeTodo marks only that todo done", () => {
  const list = completeTodo(addTodo(addTodo([], "pay rent"), "buy stamps"), 1);
  assert.deepStrictEqual(list.map((t) => t.done), [true, false]);
});

test("sortByDue puts the soonest due date first and undated todos last", () => {
  let list = [];
  list = addTodo(list, "pay rent", "2026-11-20");
  list = addTodo(list, "buy stamps");
  list = addTodo(list, "book dentist", "2026-11-09");
  assert.deepStrictEqual(sortByDue(list).map((t) => t.title), ["book dentist", "pay rent", "buy stamps"]);
});
