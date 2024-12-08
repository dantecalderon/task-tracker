#!/usr/bin/env -S node --experimental-strip-types --experimental-transform-types --no-warnings

import { writeFileSync, readFileSync } from 'node:fs';

const DB_FILENAME = './my_tasks.json';

enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done'
}

interface Task {
  id: number; // A unique identifier for the task
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


function readTasksFromFile(): Task[] {
  try {
    const fileRaw = readFileSync(DB_FILENAME);

    return JSON.parse(fileRaw.toString());
  } catch (error) {

    console.warn('Warn: ', error.message);
    console.log('Starting a new list...');

    return [];
  }
}

function writeTasksFile(tasks: Task[]) {
  try {
    writeFileSync(DB_FILENAME, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error: ', `Error writting tasks to file ${DB_FILENAME}`)
  }
}

function generateNextId(tasks: Task[]): number {
  return Math.max(1,
                  Math.max(...tasks.map(task => task.id)) + 1
  );
}

function addTask(description: string) {
  if (!description || typeof description !== 'string') {
    throw new Error('Description for task is invalid');
  }

  const tasks = readTasksFromFile()

  const newTaskId = generateNextId(tasks);

  const newTask: Task = {
    id: newTaskId,
    description,
    status: TaskStatus.Todo,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  writeTasksFile([...tasks, newTask]);
}

function listTasks(status?: TaskStatus) {
  const tasks = readTasksFromFile()

  if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
    throw new Error(`Task status provided is invalid, use one of the next: ${Object.values(TaskStatus).join(', ')}`)
  }

  const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;

  console.table(filteredTasks);
}


const commandsListener: Partial<Record<Command, Function>> = {
  add: addTask,
  list: listTasks,
}

function main() {
  try {
    const command = process.argv[2];

    console.log('Command', command)

    if (!Object.values(Command).includes(command as Command)) {
      throw new Error(`Command is not valid, use one of the next: ${Object.values(Command).join(', ')}`)
    }

    const listener = commandsListener[command];

    if (!listener) {
      throw new Error(`Listener action not defined for ${command} command.`)
    }

    const commandArgs = process.argv.slice(3);

    console.debug('Executing command: ', {
      command,
      commandArgs
    });

    listener(...commandArgs);

  } catch(error) {
    console.error("Error: ", error.message);
  }
}

main();
