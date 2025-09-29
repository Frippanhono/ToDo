const STORAGE_KEY = "user_tasks_data";
let isInitialized = false;

const initializeStorage = async () => {
  if (isInitialized) return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    try {
      const userTasksData = await import("../Data/user_tasks.json");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userTasksData.default));
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }
  isInitialized = true;
};

const getAllData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const saveAllData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getUserTasks = async (email: string) => {
  // Ensure storage is initialized before reading
  await initializeStorage();
  const data = getAllData();
  const userData = data.find(
    (user: any) => user.email.toLowerCase() === email.toLowerCase()
  );
  return userData ? userData.tasks || [] : [];
};

// ===== CRUD =====
export const addTask = (email: string, task: any) => {
  const data = getAllData();
  const userIndex = data.findIndex(
    (user: any) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userIndex !== -1) {
    const maxId = Math.max(
      ...data.flatMap((user: any) => user.tasks.map((t: any) => t.id)),
      0
    );

    const newTask = {
      ...task,
      id: maxId + 1,
    };

    data[userIndex].tasks.push(newTask);
    clearAllData();
    saveAllData(data);
    return { success: true, task: newTask };
  }
  return { success: false, error: "User not found" };
};

export const updateTask = (email: string, taskId: number, updates: any) => {
  const data = getAllData();
  const userIndex = data.findIndex(
    (user: any) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userIndex !== -1) {
    const taskIndex = data[userIndex].tasks.findIndex(
      (task: any) => task.id === taskId
    );

    if (taskIndex !== -1) {
      data[userIndex].tasks[taskIndex] = {
        ...data[userIndex].tasks[taskIndex],
        ...updates,
      };
      clearAllData();
      saveAllData(data);
      return { success: true };
    }
    return { success: false, error: "Task not found" };
  }
  return { success: false, error: "User not found" };
};

export const deleteTask = (email: string, taskId: number) => {
  const data = getAllData();
  const userIndex = data.findIndex(
    (user: any) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userIndex !== -1) {
    const initialLength = data[userIndex].tasks.length;
    data[userIndex].tasks = data[userIndex].tasks.filter(
      (task: any) => task.id !== taskId
    );

    if (data[userIndex].tasks.length < initialLength) {
      clearAllData();
      saveAllData(data);
      return { success: true };
    }
    return { success: false, error: "Task not found" };
  }
  return { success: false, error: "User not found" };
};

export const toggleTaskCompletion = (email: string, taskId: number) => {
  const data = getAllData();
  const user = data.find(
    (user: any) => user.email.toLowerCase() === email.toLowerCase()
  );
  const task = user?.tasks.find((t: any) => t.id === taskId);

  if (task) {
    return updateTask(email, taskId, { completed: !task.completed });
  }
  return { success: false, error: "Task not found" };
};

export const exportData = () => {
  const data = getAllData();
  return JSON.stringify(data, null, 2);
};

// Initialize storage on module load
initializeStorage();
