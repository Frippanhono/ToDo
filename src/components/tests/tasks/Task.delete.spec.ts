import { type Task, deleteTask } from "./Task";

const base = (): Task[] => [
  {
    id: 1,
    title: "Köp mjölk",
    category: "Shop",
    date: new Date("2025-09-24"),
    completed: false,
  },
  {
    id: 2,
    title: "Städa",
    category: "Shop", //lagt till category och date - inget annat ändrat
    date: new Date("2025-09-24"),
    completed: true,
  },
  {
    id: 3,
    title: "Diska",
    category: "Shop", //lagt till category och date - inget annat ändrat
    date: new Date("2025-09-24"),
    completed: false,
  },
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
