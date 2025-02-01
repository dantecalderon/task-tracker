import assert from "node:assert";
import { describe, it } from "node:test";
import type { Task } from "./src/task.interface.ts";
import { generateNextId } from "./src/task-utils.ts";

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
