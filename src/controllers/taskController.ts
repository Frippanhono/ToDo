import {
  addTask as addTaskToStorage,
  deleteTask as deleteTaskFromStorage,
  getUserTasks,
  toggleTaskCompletion,
  updateTask as updateTaskInStorage,
} from "../services/localStorage";

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  date: string;
  time?: string;
  allDay?: boolean;
  category?: string;
}

export function addTask(
  email: string,
  title: string,
  opts: {
    description?: string;
    category?: string;
    date?: string;
    time?: string;
    allDay?: boolean;
  } = {}
): { success: boolean; task?: Task; error?: string } {
  const category = opts.category ?? "none";
  const date = opts.date ?? new Date().toISOString().split("T")[0];

  const newTask: Task = {
    id: 0, // Will be set by localStorage service
    title,
    description: opts.description,
    completed: false,
    category,
    date,
    time: opts.time,
    allDay: opts.allDay,
  };

  return addTaskToStorage(email, newTask);
}

export function updateTask(
  email: string,
  id: number,
  patch: Partial<Omit<Task, "id">>
): { success: boolean; error?: string } {
  // --- Trimma title om den finns i patch ---
  if (patch.title !== undefined) {
    const trimmed = patch.title.trim();
    if (trimmed.length === 0) {
      return { success: false, error: "Title may not be empty" };
    }
    patch.title = trimmed;
  }

  return updateTaskInStorage(email, id, patch);
}

export function deleteTask(
  email: string,
  id: number
): { success: boolean; error?: string } {
  return deleteTaskFromStorage(email, id);
}

export function toggleTaskCompleted(
  email: string,
  id: number
): { success: boolean; error?: string } {
  return toggleTaskCompletion(email, id);
}

export function setTaskCompleted(
  email: string,
  id: number,
  completed: boolean
): { success: boolean; error?: string } {
  return updateTaskInStorage(email, id, { completed });
}

export function filterCompleted(email: string): Task[] {
  const user = getUserTasks(email);
  return user ? user.tasks.filter((t: Task) => t.completed) : [];
}

export function filterTodo(email: string): Task[] {
  const user = getUserTasks(email);
  return user ? user.tasks.filter((t: Task) => !t.completed) : [];
}

export function sortByTitle(email: string): Task[] {
  const user = getUserTasks(email);
  if (!user) return [];

  return [...user.tasks].sort(
    (a, b) => a.title.localeCompare(b.title) || a.id - b.id
  );
}

export function sortByDateAsc(email: string): Task[] {
  const user = getUserTasks(email);
  if (!user) return [];

  return [...user.tasks].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id
  );
}

export function sortByDateDesc(email: string): Task[] {
  const user = getUserTasks(email);
  if (!user) return [];

  return [...user.tasks].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() || a.id - b.id
  );
}

// --- Count-funktioner ---
export function countTasks(email: string): number {
  const user = getUserTasks(email);
  return user ? user.tasks.length : 0;
}

// alias för testerna (countAll används i testerna)
export const countAll = countTasks;

export function countCompleted(email: string): number {
  const user = getUserTasks(email);
  return user ? user.tasks.filter((t: Task) => t.completed).length : 0;
}

export function countTodo(email: string): number {
  const user = getUserTasks(email);
  return user ? user.tasks.filter((t: Task) => !t.completed).length : 0;
}

// --- Helper function to get all tasks for a user ---
export async function getAllTasks(email: string): Promise<Task[]> {
  const tasks = await getUserTasks(email);
  return tasks || [];
}
