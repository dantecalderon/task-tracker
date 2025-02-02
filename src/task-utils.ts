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

export function addTask(tasks: Task[], description: string): Task[] {
  if (!description) {
    throw new Error("Description for task is invalid");
  }

  const newTaskId = generateNextId(tasks);

  const newTask: Task = {
    id: newTaskId,
    description,
    status: TaskStatus.Todo,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log(`Task created successfully (ID: ${newTask.id})`);

  return [...tasks, newTask];
}

export function handleAddTask(description: string) {
  const tasks = readTasksFromFile();

  const newTasks = addTask(tasks, description);

  writeTasksFile(newTasks);
}

export function updateTask(
  tasks: Task[],
  taskIdString: string,
  description: string
): Task[] {
  const taskId: number = parseInt(taskIdString);

  if (isNaN(taskId) || !description) {
    throw new Error("Invalid taskId format or description");
  }

  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (!taskToUpdate) {
    throw new Error("Task not found");
  }

  taskToUpdate.description = description;
  taskToUpdate.updatedAt = new Date();

  console.log(`Task updated successfully (ID: ${taskToUpdate.id})`);

  return tasks;
}

export function handleUpdateTask(taskIdString: string, description: string) {
  const tasks = readTasksFromFile();

  const newTasks = updateTask(tasks, taskIdString, description);

  writeTasksFile(newTasks);
}

export function updateTaskStatus(
  tasks: Task[],
  taskIdString: string,
  status: TaskStatus
): Task[] {
  const taskId: number = parseInt(taskIdString);

  if (isNaN(taskId) || !status) {
    throw new Error("Invalid taskId format or status");
  }

  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (!taskToUpdate) {
    throw new Error("Task not found");
  }

  taskToUpdate.status = status;
  taskToUpdate.updatedAt = new Date();

  console.log(`Task status updated successfully (ID: ${taskToUpdate.id})`);

  return tasks;
}

export function handleUpdateTaskStatus(
  taskIdString: string,
  status: TaskStatus
) {
  const tasks = readTasksFromFile();

  const newTasks = updateTaskStatus(tasks, taskIdString, status);

  writeTasksFile(newTasks);
}

export function deleteTask(tasks: Task[], taskIdString: string) {
  const taskId: number = parseInt(taskIdString);

  if (isNaN(taskId)) {
    throw new Error("Invalid taskId format");
  }

  const tasksWithoutDeleted = tasks.filter((task) => task.id !== taskId);

  if (tasks.length === tasksWithoutDeleted.length) {
    throw new Error("Task not found");
  }

  console.log(`Task deleted successfully (ID: ${taskId})`);

  return tasksWithoutDeleted;
}

export function handleDeleteTask(taskIdString: string) {
  const tasks = readTasksFromFile();

  const newTasks = deleteTask(tasks, taskIdString);

  writeTasksFile(newTasks);
}

export function filterTasksByStatus(tasks: Task[], status?: TaskStatus) {
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

  return filteredTasks;
}

export function handleListTasks(status?: TaskStatus) {
  const tasks = readTasksFromFile();

  const filteredTasks = filterTasksByStatus(tasks, status);

  console.table(filteredTasks);
}
