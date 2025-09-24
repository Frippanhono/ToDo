import { Task } from "@/components/tests/tasks/Task";
import { countAll, countCompleted, countTodo } from "@/utils/Tasklist";

const make = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: "Default",
  category: "none",
  completed: false,
  date: new Date("2025-09-23T09:00:00Z"),
  ...overrides,
});

describe("countAll", () => {
  it("räknar antal tasks", () => {
    const input = [make(), make(), make()];
    const result = countAll(input);
    expect(result).toBe(3);
  });

  it("tom lista → 0", () => {
    expect(countAll([])).toBe(0);
  });
});

describe("countTodo", () => {
  it("räknar antal tasks som inte är gjorda", () => {
    const input = [
      make({ completed: true }),
      make({ completed: false }),
      make({ completed: false }),
    ];
    const result = countTodo(input);
    expect(result).toBe(2);
  });

  it("tom lista → 0", () => {
    expect(countTodo([])).toBe(0);
  });
});

describe("countCompleted", () => {
  it("räknar antal tasks som är klara", () => {
    const input = [
      make({ completed: true }),
      make({ completed: false }),
      make({ completed: false }),
    ];
    const result = countCompleted(input);
    expect(result).toBe(1);
  });

  it("tom lista → 0", () => {
    expect(countTodo([])).toBe(0);
  });
});
