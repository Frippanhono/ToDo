import { Task } from "@/components/tests/tasks/Task";

export function sortByTitle(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const cmp = a.title.localeCompare(b.title, "sv", { sensitivity: "base" });
    return cmp !== 0 ? cmp : a.id - b.id;
  });
}

export function sortByDateAsc(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const cmp = a.date.getTime() - b.date.getTime();
    return cmp !== 0 ? cmp : a.id - b.id;
  });
}

export function sortByDateDesc(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const cmp = b.date.getTime() - a.date.getTime();
    return cmp !== 0 ? cmp : a.id - b.id;
  });
}

export function filterCompleted(tasks: Task[]): Task[] {
  return tasks.filter(t => t.completed);
}

export function filterTodo(tasks: Task[]): Task[] {
  return tasks.filter(t => !t.completed);
}

export function countAll(tasks: Task[]): number {
  return tasks.length;
}

export function countTodo(tasks: Task[]): number {
  return tasks.filter(t => !t.completed).length;
}

export function countCompleted(tasks: Task[]): number {
  return tasks.filter(t => t.completed).length;
}
