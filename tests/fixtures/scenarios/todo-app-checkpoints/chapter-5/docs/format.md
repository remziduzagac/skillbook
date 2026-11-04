# The data file format

Jotdown keeps the list in one JSON file. This page describes the file, for anyone who wants to edit it by hand or read it with another tool.

The file is one JSON object with three keys.

| Key | Meaning |
| --- | --- |
| `version` | The format version, a whole number. It is 1. |
| `next_id` | The id the next new task gets. Ids are never used twice. |
| `tasks` | A list of tasks, oldest first. |

Each task is an object with these fields.

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | whole number | The task's number. The commands and the page use it. |
| `title` | text | What to do. |
| `done` | true or false | True once the task is finished. |
| `due` | date or null | The day the task is due, as `YYYY-MM-DD`. There is no time of day. |
| `tags` | list of text | The task's tags, in lowercase, without the `#`, sorted. |
| `repeat` | text or null | `daily`, `weekly` or null. |
| `scheduled` | date or null | For a repeating task: the date the repeat schedule gave this task. |
| `series` | object, optional | After one repeating task is edited alone: the `title` and `tags` the next task copies. |

An example with one task:

```json
{
  "version": 1,
  "next_id": 2,
  "tasks": [
    {
      "id": 1,
      "title": "renew passport",
      "done": false,
      "due": "2027-03-31",
      "tags": ["admin"],
      "repeat": null,
      "scheduled": null
    }
  ]
}
```

## Editing by hand

- Close the page and run no `jd` command while you edit.
- Keep `next_id` higher than every `id`.
- If the file stops being valid JSON, `jd` stops with an error and does not change it. Fix the file, or move it away to start a new list.
