export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

/**export function addTask(tasks: Task[], title: string): Task[] {
  const newTask: Task = {
    id: Date.now(),
    title,
    completed: false,
  };
  return [...tasks, newTask];
}*/

/**
 * Uppdaterar en uppgift immutabelt.
 * - patch kan innehålla title och/eller completed.
 * - Trimmar title och kastar fel om den blir tom.
 * - Hittas inte id -> returnerar originalarrayen (samma referens).
 */
export function updateTask(
  tasks: Task[],
  id: number,
  patch: Partial<Pick<Task, "title" | "completed">>
): Task[] {
  let changed = false;

  const next = tasks.map(t => {
    if (t.id !== id) return t;

    let newTitle = patch.title ?? t.title;
    if (typeof patch.title === "string") {
      newTitle = patch.title.trim();
      if (newTitle.length === 0) {
        throw new Error("Title may not be empty");
      }
    }

    const updated: Task = {
      ...t,
      title: newTitle,
      completed: patch.completed ?? t.completed,
    };

    // markera om något faktiskt ändrats
    if (updated.title !== t.title || updated.completed !== t.completed) {
      changed = true;
    }
    return updated;
  });

  return changed ? next : tasks; // ingen träff/ändring => samma referens
}

/**
 * Tar bort en uppgift med givet id, immutabelt.
 * - Returnerar en NY array om något togs bort.
 * - Returnerar SAMMA arrayreferens om ingen uppgift matchade id.
 */
export function deleteTask(tasks: Task[], id: number): Task[] {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return tasks; // ingen träff -> samma referens

  // skapa ny array utan elementet, återanvänd referenser för övriga objekt
  return [...tasks.slice(0, idx), ...tasks.slice(idx + 1)];
}

/** Växlar completed för en uppgift med givet id. */
export function toggleTaskCompleted(tasks: Task[], id: number): Task[] {
  let changed = false;
  const next = tasks.map(t => {
    if (t.id !== id) return t;
    changed = true;
    return { ...t, completed: !t.completed };
  });
  return changed ? next : tasks; // ingen träff -> samma referens
}

/** Sätter completed explicit (true/false) för en uppgift med givet id. */
export function setTaskCompleted(
  tasks: Task[],
  id: number,
  completed: boolean
): Task[] {
  let changed = false;
  const next = tasks.map(t => {
    if (t.id !== id) return t;
    if (t.completed === completed) return t; // ingen faktisk ändring
    changed = true;
    return { ...t, completed };
  });
  return changed ? next : tasks;
}
