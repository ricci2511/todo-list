export default class Task {
  constructor(title, description, dueDate, checked) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.checked = checked;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  getDescription() {
    return this.description;
  }

  setDescription(description) {
    this.description = description;
  }

  getDate() {
    return this.dueDate;
  }

  setDate(dueDate) {
    this.dueDate = dueDate;
  }
}
