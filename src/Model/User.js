import Task from "./Task";

export default class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.tasks = [];
  }

  addTask(task) {
    if (task instanceof Task) {
      this.tasks.push(task);
    }
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  getTasks() {
    return this.tasks;
  }
}
