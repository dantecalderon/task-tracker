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
  } catch {
    return [];
  }
}

function writeTasksFile(tasks: Task[]) {
  try {
    writeFileSync(DB_FILENAME, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error(`Error writting tasks to file ${DB_FILENAME}`)
  }
}

function generateNextId(tasks: Task[]): number {
  return Math.max(1,
                  Math.max(...tasks.map(task => task.id)) + 1
  );
}

function addTask(description: string) {
  if (!description) {
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

  console.log(`Task added successfully (ID: ${newTask.id})`)
}

function updateTask(taskIdString: string, description: string) {
  const taskId: number =  parseInt(taskIdString);

  if(isNaN(taskId) || !description) {
    throw new Error('Invalid taskId format or description');
  }

  const tasks = readTasksFromFile();

  const taskToUpdate = tasks.find(task => task.id === taskId);

  if (!taskToUpdate) {
    throw new Error('Task not found');
  }

  taskToUpdate.description = description;
  taskToUpdate.updatedAt = new Date();

  writeTasksFile(tasks);

  console.log(`Task updated successfully (ID: ${taskToUpdate.id})`)
}

function updateTaskStatus(taskIdString: string, status: TaskStatus) {
  const taskId: number =  parseInt(taskIdString);

  if(isNaN(taskId) || !status) {
    throw new Error('Invalid taskId format or status');
  }

  const tasks = readTasksFromFile();

  const taskToUpdate = tasks.find(task => task.id === taskId);

  if (!taskToUpdate) {
    throw new Error('Task not found');
  }

  taskToUpdate.status = status;
  taskToUpdate.updatedAt = new Date();

  writeTasksFile(tasks);

  console.log(`Task status updated successfully (ID: ${taskToUpdate.id})`)
}


function deleteTask(taskIdString: string) {
  const taskId: number =  parseInt(taskIdString);

  if(isNaN(taskId)) {
    throw new Error('Invalid taskId format or description');
  }

  const tasks = readTasksFromFile();

  const tasksWithoutDeleted = tasks.filter(task => task.id
    !== taskId);


  if (tasks.length === tasksWithoutDeleted.length) {
    throw new Error('Task not found');
  }

  writeTasksFile(tasksWithoutDeleted);

  console.log(`Task deleted successfully (ID: ${taskId})`)
}

function listTasks(status?: TaskStatus) {
  const tasks = readTasksFromFile()

  if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
    throw new Error(`Task status provided is invalid, use one of the next: ${Object.values(TaskStatus).join(', ')}`)
  }

  const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;

  console.table(filteredTasks);
}


const commandsListener: Record<Command, Function> = {
  add: addTask,
  update: updateTask,
  "mark-done": (taskId: string) => updateTaskStatus(taskId, TaskStatus.Done),
  'mark-in-progress': (taskId: string) => updateTaskStatus(taskId, TaskStatus.InProgress),
  delete: deleteTask,
  list: listTasks,
}

function main() {
  try {
    const command = process.argv[2];

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
