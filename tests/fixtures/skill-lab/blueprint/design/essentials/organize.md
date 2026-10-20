# Design: fixture routing

## arrange

- **Purpose:** choose how to group documents.
- **Description:** use when arranging a collection; not for rewording its documents.
- **Callers:** the user.
- **Flow:**
  - alpha: when selected documents share a topic, put them under one shared parent; this may move files.
  - beta: whenever a file moves, choose beta and sort the whole collection by one principle.
- **Result:** a proposed arrangement only.
- **Files:** none in this exercise.
- **Tests:** moving selected documents under one parent selects alpha.
- **Open:** none.
