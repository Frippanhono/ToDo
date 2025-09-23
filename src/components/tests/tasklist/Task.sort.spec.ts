import {
  type DatedTask,
  sortByDateAsc,
  sortByDateDesc,
  sortByTitle,
} from "@/utils/Tasklist";

const make = (overrides: Partial<DatedTask> = {}): DatedTask => ({
  id: 1,
  title: "Aplpha",
  completed: false,
  date: new Date("2025-09-23T09:00:00Z"),
  ...overrides,
});

describe("sortByTitle", () => {
  it("sorterar alfabetiskt (sv)", () => {
    const input: DatedTask[] = [
      make({ id: 2, title: "Handla" }),
      make({ id: 1, title: "Städa" }),
      make({ id: 3, title: "Tvätta" }),
    ];
    const result = sortByTitle(input);
    expect(result.map(t => t.title)).toEqual(["Handla", "Städa", "Tvätta"]);
  });

  it("muterar inte originalarrayen", () => {
    const input = [make({ id: 1, title: "B" }), make({ id: 2, title: "A" })];
    const copy = [...input];
    const result = sortByTitle(input);
    expect(input).toEqual(copy);
    expect(result).not.toBe(input);
  });

  it("tie-break på id när titlar är lika", () => {
    const input = [
      make({ id: 2, title: "Same" }),
      make({ id: 1, title: "Same" }),
    ];
    const result = sortByTitle(input);
    expect(result.map(t => t.id)).toEqual([1, 2]);
  });
});

describe("sortByDateAsc", () => {
  it("äldre datum först (stigande)", () => {
    const input = [
      make({ id: 1, date: new Date("2025-09-23") }),
      make({ id: 2, date: new Date("2025-09-21") }),
      make({ id: 3, date: new Date("2025-09-22") }),
    ];
    const result = sortByDateAsc(input);
    expect(result.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it("muterar inte originalarrayen", () => {
    const input = [
      make({ id: 1, date: new Date("2025-09-23") }),
      make({ id: 2, date: new Date("2025-09-22") }),
    ];
    const copy = [...input];
    const result = sortByDateAsc(input);
    expect(input).toEqual(copy);
    expect(result).not.toBe(input);
  });

  it("tie-break på id när datum är samma", () => {
    const input = [
      make({ id: 2, date: new Date("2025-09-20") }),
      make({ id: 3, date: new Date("2025-09-19") }),
      make({ id: 1, date: new Date("2025-09-20") }),
    ];
    const copy = [...input];
    const result = sortByDateAsc(input);
    expect(input).toEqual(copy);
    expect(result).not.toBe([3, 1, 2]);
  });
});

describe("sortByDateDesc", () => {
  it("nyast datum först och fallande ordning", () => {
    const input = [
      make({ id: 2, date: new Date("2025-09-23") }),
      make({ id: 3, date: new Date("2025-09-19") }),
      make({ id: 1, date: new Date("2025-09-20") }),
    ];
    const result = sortByDateDesc(input);
    expect(result.map(t => t.id)).toEqual([2, 1, 3]);
  });

  it("muterar inte originalarrayen", () => {
    const input = [
      make({ id: 1, date: new Date("2025-09-23") }),
      make({ id: 2, date: new Date("2025-09-22") }),
    ];
    const copy = [...input];
    const result = sortByDateDesc(input);
    expect(input).toEqual(copy);
    expect(result).not.toBe(input);
  });

  it("tie-break på id när datum är samma", () => {
    const input = [
      make({ id: 2, date: new Date("2025-09-20") }),
      make({ id: 3, date: new Date("2025-09-19") }),
      make({ id: 1, date: new Date("2025-09-20") }),
    ];
    const copy = [...input];
    const result = sortByDateDesc(input);
    expect(input).toEqual(copy);
    expect(result).not.toBe([1, 2, 3]);
  });
});
