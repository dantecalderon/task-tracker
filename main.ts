#!/usr/bin/env -S node --experimental-strip-types --experimental-transform-types --no-warnings

import {
  addTask,
  deleteTask,
  listTasks,
  updateTask,
  updateTaskStatus,
} from "./src/task-utils.ts";
import { Command, TaskStatus } from "./src/task.interface.ts";

const commandsListener: Record<Command, Function> = {
  add: addTask,
  update: updateTask,
  "mark-done": (taskId: string) => updateTaskStatus(taskId, TaskStatus.Done),
  "mark-in-progress": (taskId: string) =>
    updateTaskStatus(taskId, TaskStatus.InProgress),
  delete: deleteTask,
  list: listTasks,
};

function main() {
  try {
    const command = process.argv[2];

    if (!Object.values(Command).includes(command as Command)) {
      throw new Error(
        `Command is not valid, use one of the next: ${Object.values(
          Command
        ).join(", ")}`
      );
    }

    const listener = commandsListener[command];

    if (!listener) {
      throw new Error(`Listener action not defined for ${command} command.`);
    }

    const commandArgs = process.argv.slice(3);

    console.debug("Executing command: ", {
      command,
      commandArgs,
    });

    listener(...commandArgs);
  } catch (error) {
    console.error("Error: ", error.message);
  }
}

main();
