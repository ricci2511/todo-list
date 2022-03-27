import {
  format, isToday, isThisWeek,
} from 'date-fns';
import Task from './Task';

export default class LocalStorage {
  constructor() {
    if (localStorage.getItem('tasks') == null) {
      this.getDefaultTask();
    } else {
      this.tasks = [...JSON.parse(localStorage.getItem('tasks'))] || [];
    }
  }

  getDefaultTask() {
    const defaultTask = new Task('default', 'default', format(new Date(), 'yyyy-MM-dd'), false);
    this.tasks = [];
    this.tasks.push(defaultTask);
    LocalStorage.updateStorage(this.tasks);
  }

  getTask(taskName) {
    return this.tasks.find((task) => task.title === taskName);
  }

  getTasksByDate(text) {
    if (text === 'Today') {
      return this.tasks.filter((task) => isToday(new Date(task.dueDate)));
    }

    if (text === 'This week') {
      return this.tasks.filter((task) => isThisWeek(new Date(task.dueDate)));
    }

    return this.tasks;
  }

  createTask(task) {
    // check if the created task already exists in LocalStorage
    if (!this.getTask(task.title)) {
      this.tasks.push(task);
      LocalStorage.updateStorage(this.tasks);
    } else {
      alert('This task already exists!');
    }
  }

  removeTask(iconEl) {
    const taskTitle = iconEl.parentNode.parentNode.firstElementChild.children[1].innerHTML.replaceAll('"', '');
    const taskToDelete = this.getTask(taskTitle);

    this.tasks.splice(this.tasks.indexOf(taskToDelete), 1);
    LocalStorage.updateStorage(this.tasks);
  }

  static updateStorage(data) {
    localStorage.setItem('tasks', JSON.stringify(data));
  }

  static clearStorage() {
    localStorage.clear();
  }
}
