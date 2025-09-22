import { addTask, Task } from "./Task";

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

  it("ska lägga till flera uppgifter", () => {
    const tasks: Task[] = [];
    const updatedTasks = addTask(tasks, "Köp mjölk");
    const updatedTasks2 = addTask(updatedTasks, "Städa");

    expect(updatedTasks2).toHaveLength(2);
    expect(updatedTasks2[1].title).toBe("Städa");
  });
});
