import { type Task, deleteTask } from "./Task";

describe("deleteTask", () => {
  const base: Task[] = [
    { id: 1, title: "Köp mjölk", completed: false },
    { id: 2, title: "Städa", completed: true },
    { id: 3, title: "Diska", completed: false },
  ];

  it("tar bort uppgift med rätt id och minskar längden", () => {
    const res = deleteTask(base, 2);
    expect(res).toHaveLength(2);
    expect(res.map(t => t.id)).toEqual([1, 3]); // ordningen bevaras
  });

  it("är immutabel: originalarrayen ändras inte", () => {
    const copy = [...base];
    const res = deleteTask(base, 1);
    expect(base).toEqual(copy); // original kvar
    expect(res).not.toBe(base); // ny referens
  });

  it("återanvänder referenser för kvarvarande objekt", () => {
    const res = deleteTask(base, 2);
    // samma objektinstanser för de som inte togs bort
    expect(res[0]).toBe(base[0]);
    expect(res[1]).toBe(base[2]);
  });

  it("returenerar samma referens om id inte finns", () => {
    const res = deleteTask(base, 999);
    expect(res).toBe(base);
  });

  it("fungerar för första och sista elementet", () => {
    const noFirst = deleteTask(base, 1);
    expect(noFirst.map(t => t.id)).toEqual([2, 3]);

    const noLast = deleteTask(base, 3);
    expect(noLast.map(t => t.id)).toEqual([1, 2]);
  });
});
