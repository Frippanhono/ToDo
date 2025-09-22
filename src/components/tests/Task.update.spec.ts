import { type Task, updateTask } from "./Task";

describe("updateTask", () => {
  const base: Task[] = [
    { id: 1, title: "Köp mjölk", completed: false },
    { id: 2, title: "Städa", completed: true },
  ];

  it("uppdaterar titel för rätt id", () => {
    const res = updateTask(base, 1, { title: "Köp havre" });
    expect(res).toHaveLength(2);
    expect(res[0].title).toBe("Köp havre");
    expect(res[0].completed).toBe(false);
    // andra uppgifter orörda
    expect(res[1]).toEqual(base[1]);
    // immutabelt: ny referens när ändring skett
    expect(res).not.toBe(base);
  });

  it("trimmar titel och kastar fel om tom", () => {
    const trimmed = updateTask(base, 1, { title: "  Ny titel  " });
    expect(trimmed[0].title).toBe("Ny titel");

    expect(() => updateTask(base, 1, { title: "   " })).toThrow(
      "Title may not be empty"
    );
  });

  it("kan toggla completed", () => {
    const res = updateTask(base, 2, { completed: false });
    expect(res[1].completed).toBe(false);
  });

  it("returenerar originalarrayen om id inte finns", () => {
    const res = updateTask(base, 999, { title: "X" });
    // exakt samma referens => lätt att memo-isera i UI
    expect(res).toBe(base);
  });

  it("gör ingen ändring om patch inte ändrar något", () => {
    const res = updateTask(base, 1, { title: "Köp mjölk", completed: false });
    expect(res).toBe(base);
  });
});
