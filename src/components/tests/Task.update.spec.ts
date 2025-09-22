import { type Task, updateTask } from "./Task";

const base = (): Task[] => [
  { id: 1, title: "Köp mjölk", completed: false },
  { id: 2, title: "Städa", completed: true },
];

describe("updateTask (lean)", () => {
  it("uppdaterar titel för rätt id", () => {
    const res = updateTask(base(), 1, { title: "Köp havre" });
    expect(res[0].title).toBe("Köp havre");
  });

  it("trimmar titel", () => {
    const res = updateTask(base(), 1, { title: "  Ny titel  " });
    expect(res[0].title).toBe("Ny titel");
  });

  it("tom titel kastar fel", () => {
    expect(() => updateTask(base(), 1, { title: "   " })).toThrow(
      "Title may not be empty"
    );
  });

  it("kan ändra completed", () => {
    const res = updateTask(base(), 2, { completed: false });
    expect(res[1].completed).toBe(false);
  });

  it("okänt id → inget ändras (samma referens)", () => {
    const start = base();
    const res = updateTask(start, 999, { title: "X" });
    expect(res).toBe(start);
  });

  it("patch utan faktisk ändring → samma referens", () => {
    const start = base();
    const res = updateTask(start, 1, { title: "Köp mjölk", completed: false });
    expect(res).toBe(start);
  });
});
