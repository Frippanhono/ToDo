import { sortByLabel, sortByDate } from "../utils/ToDoList";
import type { BaseTodo, DatedTodo } from "../utils/ToDoList";

describe("sortByLabel", () => {
  it("returnerar listan som den är (placeholder)", () => {
    const todos: BaseTodo[] = [
      { id: 1, label: "Banan", task: "Köp bananer" },
      { id: 2, label: "Äpple", task: "Köp äpplen" },
    ];
    expect(sortByLabel(todos)).toEqual(todos);
  });
});

describe("sortByDate", () => {
  it("returnerar lista sorterad från tidigaste datumet", () => {
    const todos: DatedTodo[] = [
      { id: 1, label: "Äpple", date: "2025-09-23" },
      { id: 2, label: "Banan", date: "2025-09-21" },
      { id: 3, label: "Citron", date: "2025-09-22" },
    ];
    const result = sortByDate(todos);
    expect(result.map(t => t.id)).toEqual([2, 3, 1]);
  });
});
