export enum TaskStatus {
  Todo = "todo",
  InProgress = "in-progress",
  Done = "done",
}

export interface Task {
  id: number; // A unique identifier for the task
  description: string; // A short description of the task
  status: TaskStatus; // The status of the task (todo, in-progress, done)
  createdAt: Date; // The date and time when the task was created
  updatedAt: Date; // The date and time when the task was last updated
}

export enum Command {
  Add = "add",
  Update = "update",
  Delete = "delete",
  MarkInProgress = "mark-in-progress",
  MarkDone = "mark-done",
  List = "list",
}
