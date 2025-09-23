import { addTask, Task } from "../../AddTaskCard";

describe("addTask", () => {
  it("ska skapa en ny uppgift", () => {
    const tasks: Task[] = [];
    const newTitle = "Köp mjölk";

    const updatedTasks = addTask(tasks, newTitle);

    expect(updatedTasks).toHaveLength(1); // listan växer
    expect(updatedTasks[0].title).toBe(newTitle); // rätt titel
    expect(updatedTasks[0].completed).toBe(false); // default status
    expect(updatedTasks[0].id).toBeDefined(); // id sätts
  });
});
