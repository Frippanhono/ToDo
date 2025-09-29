import { updateTask } from "@/controllers/taskController";

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

describe("updateTask", () => {
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
        ]
      }
    ]));
  });

  it("uppdaterar titel för rätt id", () => {
    const result = updateTask("test@gmail.com", 1, { title: "Köp havre" });
    expect(result.success).toBe(true);
  });

  it("trimmar titel", () => {
    const result = updateTask("test@gmail.com", 1, { title: "  Ny titel  " });
    expect(result.success).toBe(true);
  });

  it("tom titel returnerar error", () => {
    const result = updateTask("test@gmail.com", 1, { title: "   " });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Title may not be empty");
  });

  it("kan ändra completed", () => {
    const result = updateTask("test@gmail.com", 2, { completed: false });
    expect(result.success).toBe(true);
  });

  it("okänt id → returnerar error", () => {
    const result = updateTask("test@gmail.com", 999, { title: "X" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Task not found");
  });

  it("användare inte finns → returnerar error", () => {
    const result = updateTask("nonexistent@gmail.com", 1, { title: "X" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("User not found");
  });
});
