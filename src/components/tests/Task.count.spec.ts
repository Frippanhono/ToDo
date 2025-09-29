import {
  countAll,
  countCompleted,
  countTodo,
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

describe("countAll", () => {
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
              title: "Task 1",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
            {
              id: 2,
              title: "Task 2",
              category: "none",
              date: "2025-09-23",
              completed: true,
            },
            {
              id: 3,
              title: "Task 3",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
          ],
        },
      ])
    );
  });

  it("räknar antal tasks", async () => {
    const result = await countAll("test@gmail.com");
    expect(result).toBe(3);
  });

  it("tom lista → 0", async () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify([
        {
          id: 1,
          email: "test@gmail.com",
          tasks: [],
        },
      ])
    );
    expect(await countAll("test@gmail.com")).toBe(0);
  });

  it("användare inte finns → 0", async () => {
    expect(await countAll("nonexistent@gmail.com")).toBe(0);
  });
});

describe("countTodo", () => {
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
              title: "Task 1",
              category: "none",
              date: "2025-09-23",
              completed: true,
            },
            {
              id: 2,
              title: "Task 2",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
            {
              id: 3,
              title: "Task 3",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
          ],
        },
      ])
    );
  });

  it("räknar antal tasks som inte är gjorda", async () => {
    const result = await countTodo("test@gmail.com");
    expect(result).toBe(2);
  });

  it("tom lista → 0", async () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify([
        {
          id: 1,
          email: "test@gmail.com",
          tasks: [],
        },
      ])
    );
    expect(await countTodo("test@gmail.com")).toBe(0);
  });

  it("användare inte finns → 0", async () => {
    expect(await countTodo("nonexistent@gmail.com")).toBe(0);
  });
});

describe("countCompleted", () => {
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
              title: "Task 1",
              category: "none",
              date: "2025-09-23",
              completed: true,
            },
            {
              id: 2,
              title: "Task 2",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
            {
              id: 3,
              title: "Task 3",
              category: "none",
              date: "2025-09-23",
              completed: false,
            },
          ],
        },
      ])
    );
  });

  it("räknar antal tasks som är klara", async () => {
    const result = await countCompleted("test@gmail.com");
    expect(result).toBe(1);
  });

  it("tom lista → 0", async () => {
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify([
        {
          id: 1,
          email: "test@gmail.com",
          tasks: [],
        },
      ])
    );
    expect(await countCompleted("test@gmail.com")).toBe(0);
  });

  it("användare inte finns → 0", async () => {
    expect(await countCompleted("nonexistent@gmail.com")).toBe(0);
  });
});
