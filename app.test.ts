import assert from "node:assert";
import { describe, it } from "node:test";
import type { TestContext } from "node:test";
import { TaskStatus, type Task } from "./src/task.interface.ts";
import {
  addTask,
  deleteTask,
  filterTasksByStatus,
  generateNextId,
  updateTask,
  updateTaskStatus,
} from "./src/task-utils.ts";
import { isDate } from "node:util/types";

function mock<T>(value: Partial<T>): T {
  return value as T;
}

describe("generateNextId", () => {
  it("should generate the next id by incremeneting max across all taks", () => {
    const result = generateNextId([
      mock<Task>({
        id: 1,
      }),
      mock<Task>({
        id: 3,
      }),
      mock<Task>({
        id: 8,
      }),
    ]);

    assert.strictEqual(result, 9);
  });

  it("should return 1 when no tasks", () => {
    const result = generateNextId([]);

    assert.strictEqual(result, 1);
  });
});

describe(addTask.name, () => {
  it("should throw error if description not provided", (t: TestContext) => {
    t.plan(1);

    try {
      addTask([], undefined as any);
    } catch (error) {
      t.assert.strictEqual(error.message, "Description for task is invalid");
    }
  });

  it("should create and add new element with the description provided", () => {
    const tasks = addTask([], "New Task");

    assert.strictEqual(tasks.length, 1);
    const addedTask = tasks[0];
    assert.deepStrictEqual(addedTask.description, "New Task");
    assert.strictEqual(addedTask.id, 1);
    assert.strictEqual(isDate(addedTask.createdAt), true);
    assert.strictEqual(isDate(addedTask.updatedAt), true);
  });
});

describe(updateTask.name, () => {
  it("should throw error if task id is not a number or description is not provided", (t: TestContext) => {
    t.plan(2);

    try {
      updateTask([], "taskId", undefined as any);
    } catch (error) {
      t.assert.strictEqual(
        error.message,
        "Invalid taskId format or description"
      );
    }

    try {
      updateTask([], "not-number", "Update Task");
    } catch (error) {
      t.assert.strictEqual(
        error.message,
        "Invalid taskId format or description"
      );
    }
  });

  it("should update element with the description provided", () => {
    const mockCurrentTime = new Date("2025-01-01");

    const currentTasks = [
      {
        id: 1,
        description: "First Task",
        status: TaskStatus.Todo,
        createdAt: mockCurrentTime,
        updatedAt: mockCurrentTime,
      },
    ];

    const tasks = updateTask(currentTasks, "1", "New First Task");

    assert.strictEqual(tasks.length, currentTasks.length);
    const updatedTask = tasks[0];
    assert.deepStrictEqual(updatedTask.description, "New First Task");
    assert.strictEqual(updatedTask.id, 1);
    assert.strictEqual(updatedTask.createdAt, mockCurrentTime);
    assert.notStrictEqual(updatedTask.updatedAt, mockCurrentTime);
  });

  it("should throw error when task is not found", (t: TestContext) => {
    t.plan(1);

    try {
      const currentTasks = [
        {
          id: 1,
          description: "First Task",
          status: TaskStatus.Todo,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Call to update with non existent task id:
      updateTask(currentTasks, "999", "New First Task");
    } catch (error) {
      t.assert.strictEqual(error.message, "Task not found");
    }
  });
});

describe(updateTaskStatus.name, () => {
  it("should throw error if task id is not a number or status is not provided", (t: TestContext) => {
    t.plan(2);

    try {
      updateTaskStatus([], "taskId", undefined as any);
    } catch (error) {
      t.assert.strictEqual(error.message, "Invalid taskId format or status");
    }

    try {
      updateTaskStatus([], "not-number", TaskStatus.Done);
    } catch (error) {
      t.assert.strictEqual(error.message, "Invalid taskId format or status");
    }
  });

  it("should update element with the status provided", () => {
    const mockCurrentTime = new Date("2025-01-01");

    const currentTasks = [
      {
        id: 1,
        description: "First Task",
        status: TaskStatus.Todo,
        createdAt: mockCurrentTime,
        updatedAt: mockCurrentTime,
      },
    ];

    const tasks = updateTaskStatus(currentTasks, "1", TaskStatus.Done);

    assert.strictEqual(tasks.length, currentTasks.length);
    const updatedTask = tasks[0];
    assert.strictEqual(updatedTask.status, TaskStatus.Done);
    assert.strictEqual(updatedTask.id, 1);
    assert.strictEqual(updatedTask.createdAt, mockCurrentTime);
    assert.notStrictEqual(updatedTask.updatedAt, mockCurrentTime);
  });

  it("should throw error when item not found", (t: TestContext) => {
    t.plan(1);

    try {
      const currentTasks = [
        {
          id: 1,
          description: "First Task",
          status: TaskStatus.Todo,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Call to update with non existent task id:
      updateTaskStatus(currentTasks, "999", TaskStatus.Done);
    } catch (error) {
      t.assert.strictEqual(error.message, "Task not found");
    }
  });
});

describe(deleteTask.name, () => {
  it("should throw error if task id is not a number", (t: TestContext) => {
    t.plan(1);

    try {
      deleteTask([], "invalid-id");
    } catch (error) {
      t.assert.strictEqual(error.message, "Invalid taskId format");
    }
  });

  it("should delete task", () => {
    const currentTasks = [
      {
        id: 1,
        description: "First Task",
        status: TaskStatus.Todo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const tasks = deleteTask(currentTasks, "1");

    assert.strictEqual(tasks.length, 0);
  });

  it("should throw error if task not found", (t: TestContext) => {
    t.plan(1);

    try {
      const currentTasks = [
        {
          id: 1,
          description: "First Task",
          status: TaskStatus.Todo,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Call to update with non existent task id:
      deleteTask(currentTasks, "999");
    } catch (error) {
      t.assert.strictEqual(error.message, "Task not found");
    }
  });
});

describe(filterTasksByStatus.name, () => {
  it("should throw if stautus is not valid", (t: TestContext) => {
    try {
      filterTasksByStatus([], "invalid" as any);
    } catch (error) {
      t.assert.strictEqual(
        error.message,
        "Task status provided is invalid, use one of the next: todo, in-progress, done"
      );
    }
  });

  it("should filter tasks by status", () => {
    const currentTasks = [
      {
        id: 1,
        description: "First Task",
        status: TaskStatus.Todo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        description: "Second Task",
        status: TaskStatus.Done,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        description: "Third Task",
        status: TaskStatus.Todo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const tasks = filterTasksByStatus(currentTasks, TaskStatus.Todo);

    assert.strictEqual(tasks.length, 2);
  });

  it("should return all tasks if stauts not provided", () => {
    const currentTasks = [
      {
        id: 1,
        description: "First Task",
        status: TaskStatus.Todo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        description: "Second Task",
        status: TaskStatus.Done,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        description: "Third Task",
        status: TaskStatus.Todo,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const tasks = filterTasksByStatus(currentTasks);

    assert.strictEqual(tasks.length, 3);
  });
});
