import { addTask } from "@/controllers/taskController";

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

describe("addTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial data
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify([
        {
          id: 1,
          email: "test@gmail.com",
          tasks: [],
        },
      ])
    );
  });

  it("ska skapa en ny uppgift", () => {
    const newTitle = "Köp mjölk";
    const email = "test@gmail.com";

    const result = addTask(email, newTitle);

    expect(result.success).toBe(true);
    expect(result.task).toBeDefined();
    expect(result.task?.title).toBe(newTitle);
    expect(result.task?.completed).toBe(false);
    expect(result.task?.id).toBeDefined();
  });

  it("ska returnera error om användaren inte finns", () => {
    const newTitle = "Köp mjölk";
    const email = "nonexistent@gmail.com";

    const result = addTask(email, newTitle);

    expect(result.success).toBe(false);
    expect(result.error).toBe("User not found");
  });
});
