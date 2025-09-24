import { type Task, deleteTask } from "./Task";

const base = (): Task[] => [
  { id: 1, title: "Köp mjölk", completed: false },
  { id: 2, title: "Städa", completed: true },
  { id: 3, title: "Diska", completed: false },
];

describe("deleteTask", () => {
  it("tar bort uppgift med givet id", () => {
    const res = deleteTask(base(), 2);
    expect(res.map(t => t.id)).toEqual([1, 3]);
  });

  it("okänt id → inget ändras", () => {
    const start = base();
    const res = deleteTask(start, 999);
    expect(res).toEqual(start); // samma innehåll räcker
  });
});
