import { type Task, setTaskCompleted, toggleTaskCompleted } from "./Task";

const fresh = (): Task[] => [
  { id: 1, title: "Köp mjölk", completed: false },
  { id: 2, title: "Städa", completed: true },
];

// --- toggle ---

it("toggle: växlar completed för rätt id", () => {
  const res = toggleTaskCompleted(fresh(), 1);
  expect(res[0].completed).toBe(true);
});

it("toggle: ändrar inte andra uppgifter", () => {
  const res = toggleTaskCompleted(fresh(), 1);
  expect(res[1]).toEqual({ id: 2, title: "Städa", completed: true });
});

it("toggle: okänt id -> inget ändras", () => {
  const start = fresh();
  const res = toggleTaskCompleted(start, 999);
  expect(res).toEqual(start);
});

// --- set explicit ---

it("set: kan sätta completed=true", () => {
  const res = setTaskCompleted(fresh(), 1, true);
  expect(res[0].completed).toBe(true);
});

it("set: kan sätta completed=false", () => {
  const res = setTaskCompleted(fresh(), 2, false);
  expect(res[1].completed).toBe(false);
});

it("set: samma värde -> inget ändras", () => {
  const start = fresh(); // task 2 är redan true
  const res = setTaskCompleted(start, 2, true);
  expect(res).toEqual(start);
});
