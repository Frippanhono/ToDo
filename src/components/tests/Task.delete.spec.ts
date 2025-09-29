import { deleteTask } from "@/controllers/taskController";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe("deleteTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial data with tasks
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
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
          {
            id: 3,
            title: "Diska",
            category: "Shop",
            date: "2025-09-24",
            completed: false,
          },
        ]
      }
    ]));
  });

  it("tar bort uppgift med givet id", () => {
    const result = deleteTask("test@gmail.com", 2);
    expect(result.success).toBe(true);
  });

  it("okänt id → returnerar error", () => {
    const result = deleteTask("test@gmail.com", 999);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Task not found");
  });

  it("användare inte finns → returnerar error", () => {
    const result = deleteTask("nonexistent@gmail.com", 1);
    expect(result.success).toBe(false);
    expect(result.error).toBe("User not found");
  });
});
