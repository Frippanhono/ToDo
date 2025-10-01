import {
  getAllTasks,
  setTaskCompleted,
  toggleTaskCompleted,
} from "@/controllers/taskController";

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

describe("toggleTaskCompleted", () => {
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
              id: 1,
              title: "Köp mjölk",
              category: "Shop",
              date: "2025-09-24",
              completed: false,
            },
            {
              id: 2,
              title: "Städa",
              category: "Shop",
              date: "2025-09-24",
              completed: true,
            },
          ],
        },
      ])
    );
  });

  it("växlar completed för rätt id", () => {
    const result = toggleTaskCompleted("test@gmail.com", 1);
    expect(result.success).toBe(true);
  });

  it("okänt id → returnerar error", () => {
    const result = toggleTaskCompleted("test@gmail.com", 999);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Task not found");
  });
});

describe("setTaskCompleted", () => {
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
              id: 1,
              title: "Köp mjölk",
              category: "Shop",
              date: "2025-09-24",
              completed: false,
            },
            {
              id: 2,
              title: "Städa",
              category: "Shop",
              date: "2025-09-24",
              completed: true,
            },
          ],
        },
      ])
    );
  });

  it.each([
    { id: 1, to: true },
    { id: 2, to: false },
  ])("sätter completed (id=$id → $to)", ({ id, to }) => {
    const result = setTaskCompleted("test@gmail.com", id, to);
    expect(result.success).toBe(true);
  });

  it("okänt id → returnerar error", () => {
    const result = setTaskCompleted("test@gmail.com", 999, true);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Task not found");
  });
});
