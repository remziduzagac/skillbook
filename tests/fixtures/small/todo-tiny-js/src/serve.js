"use strict";
const fs = require("node:fs");
const http = require("node:http");
const { sortByDue } = require("./todo.js");

const PORT = 8123;

http
  .createServer((req, res) => {
    let list = [];
    try {
      list = JSON.parse(fs.readFileSync("todos.json", "utf8"));
    } catch {}
    const rows = sortByDue(list)
      .map((t) => `<li>${t.done ? "<s>" : ""}${t.title}${t.due ? " (due " + t.due + ")" : ""}${t.done ? "</s>" : ""}</li>`)
      .join("\n");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!doctype html><title>Todos</title><ul>\n${rows}\n</ul>\n`);
  })
  .listen(PORT, () => console.log(`Todo page on http://localhost:${PORT}`));
