"use strict";

function addTodo(list, title, due) {
  return [...list, { id: list.length + 1, title, due: due || null, done: false }];
}

function completeTodo(list, id) {
  return list.map((t) => (t.id === id ? { ...t, done: true } : t));
}

// Todos with a due date come first, soonest first. Todos without one keep their order at the end.
function sortByDue(list) {
  return [...list].sort((a, b) => {
    if (!a.due) return b.due ? 1 : 0;
    if (!b.due) return -1;
    return a.due.localeCompare(b.due);
  });
}

module.exports = { addTodo, completeTodo, sortByDue };
