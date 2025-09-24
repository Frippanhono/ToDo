import { Task } from "@/components/tests/tasks/Task";

export interface DatedTask extends Task {
  date: Date;
}

export function sortByTitle(tasks: DatedTask[]): DatedTask[] {
  return [...tasks].sort((a, b) => {
    const cmp = a.title.localeCompare(b.title, "sv", { sensitivity: "base" });
    return cmp !== 0 ? cmp : a.id - b.id;
  });
}

export function sortByDateAsc(tasks: DatedTask[]): DatedTask[] {
  return [...tasks].sort((a, b) => {
    const cmp = a.date.getTime() - b.date.getTime();
    return cmp !== 0 ? cmp : a.id - b.id;
  });
}

export function sortByDateDesc(tasks: DatedTask[]): DatedTask[] {
  return [...tasks].sort((a, b) => {
    const cmp = b.date.getTime() - a.date.getTime();
    return cmp !== 0 ? cmp : a.id - b.id;
  });
}

export function filterCompleted(tasks: DatedTask[]): DatedTask[] {
  return tasks.filter(t => t.completed);
}

export function filterTodo(tasks: DatedTask[]): DatedTask[] {
  return tasks.filter(t => !t.completed);
}

export function countAll(tasks: DatedTask[]): number {
  return tasks.length;
}

export function countTodo(tasks: DatedTask[]): number {
  return tasks.filter(t => !t.completed).length;
}

export function countCompleted(tasks: DatedTask[]): number {
  return tasks.filter(t => t.completed).length;
}
