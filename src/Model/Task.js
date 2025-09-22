export default class Task {
  constructor(id, title, date, time, description, completed = false) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.time = time;
    this.description = description;
    this.completed = completed;
  }

  toggleCompletion() {
    this.completed = !this.completed;
  }
}
