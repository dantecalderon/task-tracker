#!/usr/bin/env -S node --experimental-strip-types --experimental-transform-types --no-warnings

import { randomUUID } from 'node:crypto';
import { readFileSync } from 'fs';

const DB_FILENAME = './tasks.json';

enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done'
}

interface Task {
  id: string; // A unique identifier for the task
  description: string; // A short description of the task
  status: TaskStatus; // The status of the task (todo, in-progress, done)
  createdAt: Date, // The date and time when the task was created
  updatedAt: Date; // The date and time when the task was last updated
}


enum Command {
  Add = 'add',
  Update = 'update',
  Delete = 'delete',
  MarkInProgress = 'mark-in-progress',
  MarkDone = 'mark-done',
  List = 'list'
}


function readTasksFromFile() {
  const file = readFileSync(DB_FILENAME);

  console.log(file)
}



function listTasks(status?: TaskStatus) {

}


function main() {
  try {
    const command = process.argv[2];

    if (!(command in Command)) {
      throw new Error(`Command is not valid, use one of the next: ${Object.values(Command).join(', ')}`)
    }





  } catch(error) {
    console.error("Error: ", error.message);
  }
}

main();
