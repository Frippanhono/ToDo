export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export function addTask(tasks: Task[], title: string): Task[] {
  const newTask: Task = {
    id: Date.now(),
    title,
    completed: false,
  };
  return [...tasks, newTask];
}
