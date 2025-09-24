import { Task } from "@/components/tests/tasks/Task";
import { filterCompleted, filterTodo } from "@/utils/Tasklist";

const make = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  title: "Default",
  category: "none",
  completed: false,
  date: new Date("2025-09-23T09:00:00Z"),
  ...overrides,
});

describe("filterCompleted", () => {
  it("filtrerar ut de färdiga uppgifterna", () => {
    const input: Task[] = [
      make({ id: 2, title: "Handla", completed: true }),
      make({ id: 1, title: "Städa", completed: true }),
      make({ id: 3, title: "Tvätta", completed: false }),
    ];
    const result = filterCompleted(input);
    expect(result.map(t => t.title)).toEqual(["Handla", "Städa"]);
  });

  it("muterar inte originalarrayen", () => {
    const input = [make({ id: 1, title: "B" }), make({ id: 2, title: "A" })];
    const copy = [...input];
    const result = filterCompleted(input);
    expect(input).toEqual(copy);
    expect(result).not.toBe(input);
  });
});

describe("filterTodo", () => {
  it("filtrerar ut de uppgifterna som ska göras", () => {
    const input: Task[] = [
      make({ id: 2, title: "Handla", completed: false }),
      make({ id: 1, title: "Städa", completed: true }),
      make({ id: 3, title: "Tvätta", completed: false }),
    ];
    const result = filterTodo(input);
    expect(result.map(t => t.title)).toEqual(["Handla", "Tvätta"]);
  });

  it("muterar inte originalarrayen", () => {
    const input = [make({ id: 1, title: "B" }), make({ id: 2, title: "A" })];
    const copy = [...input];
    const result = filterTodo(input);
    expect(input).toEqual(copy);
    expect(result).not.toBe(input);
  });
});
