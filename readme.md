# Task Tracker

Sample solution for the [task-tracker](https://roadmap.sh/projects/task-tracker) challenge from roadmap.sh.

## Setting Up

Clone the repo:

```sh
git clone https://github.com/dantecalderon/task-tracker.git
cd task-tracker
```

Install dependencies:

```sh
npm ci
```

## Usage

You need to run the `main.ts` script like this:

```sh
./main.ts <command> [commandargs]
```

### Commands

| Command                            | Description                                       | Example                                      |
|------------------------------------|---------------------------------------------------|----------------------------------------------|
| `./main.ts add <description>`       | Add a new task                                   | `./main.ts add "Buy groceries"`               |
| `./main.ts update <task_id> <desc>` | Update an existing task                          | `./main.ts update 1 "Buy groceries and cook dinner"` |
| `./main.ts delete <task_id>`        | Delete a task                                    | `./main.ts delete 1`                          |
| `./main.ts mark-in-progress <task_id>` | Mark a task as in progress                       | `./main.ts mark-in-progress 1`                |
| `./main.ts mark-done <task_id>`     | Mark a task as done                              | `./main.ts mark-done 1`                       |
| `./main.ts list`                    | List all tasks                                   | `./main.ts list`                              |
| `./main.ts list <status>`           | List tasks by status (`done`, `todo`, `in-progress`) | `./main.ts list done`                        |