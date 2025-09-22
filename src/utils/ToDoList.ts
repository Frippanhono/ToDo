export type BaseTodo = {
  id: number;
  label: string;
  task?: string;
};

export type DatedTodo = BaseTodo & {
  date: string;
};

export function sortByLabel(todos: BaseTodo[]): BaseTodo[] {
  return todos;
}

export function sortByDate(todos: DatedTodo[]): DatedTodo[] {
  return todos;
}
