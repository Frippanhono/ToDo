import { filterCompleted, filterTodo } from "@/controllers/taskController";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("filterCompleted", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial data with tasks
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify([
        {
          id: 1,
          email: "test@gmail.com",
          tasks: [
            {
              id: 2,
              title: "Handla",
              category: "none",
              date: "2025-09-23",
              completed: true,
            },
            {
              id: 1,
              title: "Städa",
              category: "none",
              date: "2025-09-23",
              completed: true,
            },
            {
              id: 3,
              title: "Tvätta",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
          ],
        },
      ])
    );
  });

  it("filtrerar ut de färdiga uppgifterna", async () => {
    const result = await filterCompleted("test@gmail.com");
    expect(result.map((t: any) => t.title)).toEqual(["Handla", "Städa"]);
  });

  it("returnerar tom array om användaren inte finns", async () => {
    const result = await filterCompleted("nonexistent@gmail.com");
    expect(result).toEqual([]);
  });
});

describe("filterTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial data with tasks
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify([
        {
          id: 1,
          email: "test@gmail.com",
          tasks: [
            {
              id: 2,
              title: "Handla",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
            {
              id: 1,
              title: "Städa",
              category: "none",
              date: "2025-09-23",
              completed: true,
            },
            {
              id: 3,
              title: "Tvätta",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
          ],
        },
      ])
    );
  });

  it("filtrerar ut de uppgifterna som ska göras", async () => {
    const result = await filterTodo("test@gmail.com");
    expect(result.map((t: any) => t.title)).toEqual(["Handla", "Tvätta"]);
  });

  it("returnerar tom array om användaren inte finns", async () => {
    const result = await filterTodo("nonexistent@gmail.com");
    expect(result).toEqual([]);
  });
});
