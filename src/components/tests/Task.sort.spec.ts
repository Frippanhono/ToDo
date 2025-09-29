import {
  sortByDateAsc,
  sortByDateDesc,
  sortByTitle,
} from "@/controllers/taskController";

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

describe("sortByTitle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial data with tasks
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
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
            completed: false,
          },
          {
            id: 3,
            title: "Tvätta",
            category: "none",
            date: "2025-09-23",
            completed: false,
          },
        ]
      }
    ]));
  });

  it("sorterar alfabetiskt (sv)", () => {
    const result = sortByTitle("test@gmail.com");
    expect(result.map(t => t.title)).toEqual(["Handla", "Städa", "Tvätta"]);
  });

  it("returnerar tom array om användaren inte finns", () => {
    const result = sortByTitle("nonexistent@gmail.com");
    expect(result).toEqual([]);
  });

  it("tie-break på id när titlar är lika", () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
      {
        id: 1,
        email: "test@gmail.com",
        tasks: [
          {
            id: 2,
            title: "Same",
            category: "none",
            date: "2025-09-23",
            completed: false,
          },
          {
            id: 1,
            title: "Same",
            category: "none",
            date: "2025-09-23",
            completed: false,
          },
        ]
      }
    ]));
    
    const result = sortByTitle("test@gmail.com");
    expect(result.map(t => t.id)).toEqual([1, 2]);
  });
});

describe("sortByDateAsc", () => {
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
            title: "Task 1",
            category: "none",
            date: "2025-09-23",
            completed: false,
          },
          {
            id: 2,
            title: "Task 2",
            category: "none",
            date: "2025-09-21",
            completed: false,
          },
          {
            id: 3,
            title: "Task 3",
            category: "none",
            date: "2025-09-22",
            completed: false,
          },
        ]
      }
    ]));
  });

  it("äldre datum först (stigande)", () => {
    const result = sortByDateAsc("test@gmail.com");
    expect(result.map(t => t.id)).toEqual([2, 3, 1]);
  });

  it("returnerar tom array om användaren inte finns", () => {
    const result = sortByDateAsc("nonexistent@gmail.com");
    expect(result).toEqual([]);
  });
});

describe("sortByDateDesc", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock initial data with tasks
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
      {
        id: 1,
        email: "test@gmail.com",
        tasks: [
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
            date: "2025-09-19",
            completed: false,
          },
          {
            id: 1,
            title: "Task 1",
            category: "none",
            date: "2025-09-20",
            completed: false,
          },
        ]
      }
    ]));
  });

  it("nyast datum först och fallande ordning", () => {
    const result = sortByDateDesc("test@gmail.com");
    expect(result.map(t => t.id)).toEqual([2, 1, 3]);
  });

  it("returnerar tom array om användaren inte finns", () => {
    const result = sortByDateDesc("nonexistent@gmail.com");
    expect(result).toEqual([]);
  });
});
