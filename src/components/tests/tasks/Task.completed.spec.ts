import { type Task, setTaskCompleted, toggleTaskCompleted } from "./Task";

const fresh = (): Task[] => [
  {
    id: 1,
    title: "Köp mjölk",
    category: "Shop", //lagt till category och date - inget annat ändrat
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
];

describe("toggleTaskCompleted", () => {
  it("växlar completed för rätt id", () => {
    const res = toggleTaskCompleted(fresh(), 1);
    expect(res[0].completed).toBe(true);
  });

  it("okänt id → inget ändras", () => {
    const start = fresh();
    const res = toggleTaskCompleted(start, 999);
    expect(res).toEqual(start);
  });
});

describe("setTaskCompleted", () => {
  it.each([
    { id: 1, to: true, idx: 0 },
    { id: 2, to: false, idx: 1 },
  ])("sätter completed (id=$id → $to)", ({ id, to, idx }) => {
    const res = setTaskCompleted(fresh(), id, to);
    expect(res[idx].completed).toBe(to);
  });

  it("samma värde → inget ändras", () => {
    const start = fresh(); // task 2 är redan true
    const res = setTaskCompleted(start, 2, true);
    expect(res).toEqual(start);
  });
});
