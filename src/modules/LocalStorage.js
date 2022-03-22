import { format } from 'date-fns';
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
    const taskObj = this.getTask(taskTitle);

    this.tasks.pop(taskObj);
    LocalStorage.updateStorage(this.tasks);
  }

  static updateStorage(data) {
    localStorage.setItem('tasks', JSON.stringify(data));
  }

  static clearStorage() {
    localStorage.clear();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }
}
