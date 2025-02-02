#!/usr/bin/env -S node --experimental-strip-types --experimental-transform-types --no-warnings

import {
  handleAddTask,
  handleDeleteTask,
  handleListTasks,
  handleUpdateTask,
  handleUpdateTaskStatus,
} from "./src/task-utils.ts";
import { Command, TaskStatus } from "./src/task.interface.ts";

// Map command names to handlers
const commandsListener: Record<Command, Function> = {
  add: handleAddTask,
  update: handleUpdateTask,
  "mark-done": (taskId: string) =>
    handleUpdateTaskStatus(taskId, TaskStatus.Done),
  "mark-in-progress": (taskId: string) =>
    handleUpdateTaskStatus(taskId, TaskStatus.InProgress),
  delete: handleDeleteTask,
  list: handleListTasks,
};

function main() {
  try {
    // Get the command
    const command = process.argv[2];

    // Get list of command arguments
    const commandArgs = process.argv.slice(3);

    if (!Object.values(Command).includes(command as Command)) {
      throw new Error(
        `Command is not valid, use one of the next: ${Object.values(
          Command
        ).join(", ")}`
      );
    }

    const commandHandler = commandsListener[command];

    if (!commandHandler) {
      throw new Error(`Handler action not defined for ${command} command.`);
    }

    console.debug("Executing command: ", {
      command,
      commandArgs,
    });

    // Execute command handler
    commandHandler(...commandArgs);
  } catch (error) {
    console.error("Error: ", error.message);
  }
}

main();
