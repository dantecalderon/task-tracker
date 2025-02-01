import { readFileSync, writeFileSync } from "node:fs";
import type { Task } from "./task.interface.ts";
import { TaskStatus } from "./task.interface.ts";
import { DB_FILENAME } from "./task.constants.ts";

export function generateNextId(tasks: Task[]): number {
  return Math.max(1, Math.max(...tasks.map((task) => task.id)) + 1);
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
    console.error(`Error writting tasks to file ${DB_FILENAME}`);
  }
}

export function addTask(description: string) {
  if (!description) {
    throw new Error("Description for task is invalid");
  }

  const tasks = readTasksFromFile();

  const newTaskId = generateNextId(tasks);

  const newTask: Task = {
    id: newTaskId,
    description,
    status: TaskStatus.Todo,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  writeTasksFile([...tasks, newTask]);

  console.log(`Task added successfully (ID: ${newTask.id})`);
}

export function updateTask(taskIdString: string, description: string) {
  const taskId: number = parseInt(taskIdString);

  if (isNaN(taskId) || !description) {
    throw new Error("Invalid taskId format or description");
  }

  const tasks = readTasksFromFile();

  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (!taskToUpdate) {
    throw new Error("Task not found");
  }

  taskToUpdate.description = description;
  taskToUpdate.updatedAt = new Date();

  writeTasksFile(tasks);

  console.log(`Task updated successfully (ID: ${taskToUpdate.id})`);
}

export function updateTaskStatus(taskIdString: string, status: TaskStatus) {
  const taskId: number = parseInt(taskIdString);

  if (isNaN(taskId) || !status) {
    throw new Error("Invalid taskId format or status");
  }

  const tasks = readTasksFromFile();

  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (!taskToUpdate) {
    throw new Error("Task not found");
  }

  taskToUpdate.status = status;
  taskToUpdate.updatedAt = new Date();

  writeTasksFile(tasks);

  console.log(`Task status updated successfully (ID: ${taskToUpdate.id})`);
}

export function deleteTask(taskIdString: string) {
  const taskId: number = parseInt(taskIdString);

  if (isNaN(taskId)) {
    throw new Error("Invalid taskId format or description");
  }

  const tasks = readTasksFromFile();

  const tasksWithoutDeleted = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === tasksWithoutDeleted.length) {
    throw new Error("Task not found");
  }

  writeTasksFile(tasksWithoutDeleted);

  console.log(`Task deleted successfully (ID: ${taskId})`);
}

export function listTasks(status?: TaskStatus) {
  const tasks = readTasksFromFile();

  if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
    throw new Error(
      `Task status provided is invalid, use one of the next: ${Object.values(
        TaskStatus
      ).join(", ")}`
    );
  }

  const filteredTasks = status
    ? tasks.filter((task) => task.status === status)
    : tasks;

  console.table(filteredTasks);
}
