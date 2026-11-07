"use strict";
const fs = require("node:fs");
const { addTodo, completeTodo, sortByDue } = require("./todo.js");

const FILE = "todos.json";

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function save(list) {
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2) + "\n");
}

const [command, ...args] = process.argv.slice(2);
let list = load();

if (command === "add") {
  save(addTodo(list, args[0], args[1]));
} else if (command === "done") {
  save(completeTodo(list, Number(args[0])));
} else if (command === "list") {
  for (const t of sortByDue(list)) {
    console.log(`${t.done ? "[x]" : "[ ]"} ${t.id} ${t.title}${t.due ? " (due " + t.due + ")" : ""}`);
  }
} else {
  console.log("usage: node src/cli.js add TITLE [YYYY-MM-DD] | done ID | list");
}
