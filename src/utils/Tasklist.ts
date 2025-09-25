export interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: string;
  date: Date;
}

export function addTask(
  tasks: Task[],
  title: string,
  opts: { category?: string; date?: Date } = {}
): Task[] {
  const category = opts.category ?? "none";
  const date = opts.date ?? new Date();
  const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

  const newTask: Task = { id, title, completed: false, category, date };
  return [...tasks, newTask];
}

export function updateTask(
  tasks: Task[],
  id: number,
  patch: Partial<Omit<Task, "id">>
): Task[] {
  let changed = false;

  const updated = tasks.map(task => {
    if (task.id !== id) return task;

    let next: Task = { ...task, ...patch };

    // --- Trimma title om den finns i patch ---
    if (patch.title !== undefined) {
      const trimmed = patch.title.trim();
      if (trimmed.length === 0) {
        throw new Error("Title may not be empty");
      }
      next.title = trimmed;
    }

    if (
      next.title !== task.title ||
      next.completed !== task.completed ||
      next.category !== task.category ||
      next.date.getTime() !== task.date.getTime()
    ) {
      changed = true;
      return next;
    }
    return task;
  });

  return changed ? updated : tasks;
}

export function deleteTask(tasks: Task[], id: number): Task[] {
  const filtered = tasks.filter(task => task.id !== id);
  return filtered.length === tasks.length ? tasks : filtered;
}

export function toggleTaskCompleted(tasks: Task[], id: number): Task[] {
  let changed = false;

  const updated = tasks.map(task => {
    if (task.id !== id) return task;
    changed = true;
    return { ...task, completed: !task.completed };
  });

  return changed ? updated : tasks;
}

export function setTaskCompleted(
  tasks: Task[],
  id: number,
  completed: boolean
): Task[] {
  let changed = false;

  const updated = tasks.map(task => {
    if (task.id !== id) return task;
    if (task.completed === completed) return task;
    changed = true;
    return { ...task, completed };
  });

  return changed ? updated : tasks;
}

export function filterCompleted(tasks: Task[]): Task[] {
  return tasks.filter(t => t.completed);
}

export function filterTodo(tasks: Task[]): Task[] {
  return tasks.filter(t => !t.completed);
}

export function sortByTitle(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => a.title.localeCompare(b.title) || a.id - b.id
  );
}

export function sortByDateAsc(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => a.date.getTime() - b.date.getTime() || a.id - b.id
  );
}

export function sortByDateDesc(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => b.date.getTime() - a.date.getTime() || a.id - b.id
  );
}

// --- Count-funktioner ---
export function countTasks(tasks: Task[]): number {
  return tasks.length;
}

// alias för testerna (countAll används i testerna)
export const countAll = countTasks;

export function countCompleted(tasks: Task[]): number {
  return tasks.filter(t => t.completed).length;
}

export function countTodo(tasks: Task[]): number {
  return tasks.filter(t => !t.completed).length;
}
