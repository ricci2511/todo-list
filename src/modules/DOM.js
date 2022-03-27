import {
  isPast, isValid,
} from 'date-fns';
import DOMPurify from 'dompurify';
import LocalStorage from './LocalStorage';
import Task from './Task';

const myStorage = new LocalStorage();

/* DOM FUNCTIONS */
const displayTaskElements = (tasksArr = []) => {
  const tasksList = document.querySelector('.tasks-list');

  tasksList.innerHTML = tasksArr.map((task, i) => `
        <div class="task" data-index=${i}>
            <div class="left-task-options">
                <input type="checkbox" name="task-${i}" class="isChecked" ${task.checked ? 'checked' : ''}>
                <label for="task-${i}" class="task-title">${task.title}</label>
            </div>
            <div class="right-task-options">
                <p class="task-duedate">${task.dueDate}</p>
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `).join('');
};

const displayTaskDetails = (task) => {
  const {
    title, description, dueDate, checked,
  } = task;
  const taskIndex = myStorage.tasks.indexOf(task);

  const taskDetailsPopup = document.createElement('div');
  taskDetailsPopup.classList.add('task-details-popup');

  taskDetailsPopup.innerHTML = `
            <input type="text" id="task-details-title" data-index=${taskIndex} value="${title}"/>
            <textarea id="task-details-description" data-index=${taskIndex}>${description}</textarea>
            <input type="date" id="task-details-dueDate" data-index=${taskIndex} value="${dueDate}"/>
            <div class="task-details-popup-checkbox">
                <input type="checkbox" id="isDone" ${checked ? 'checked' : ''}>
                <label for="isDone">Done?</label>
            </div>
            <div class="task-details-popup-buttons">
                <button id="save-edit-button">Save</button>
                <button id="cancel-edit-button">Cancel</button>
            </div>
    `;

  DOMPurify.sanitize(taskDetailsPopup);
  document.querySelector('main').appendChild(taskDetailsPopup);
};

const checkActiveTabAndDisplayTasks = () => {
  const activeTab = document.querySelector('.active').textContent;
  displayTaskElements(myStorage.getTasksByDate(activeTab));
};

const editTask = () => {
  const taskTitle = document.querySelector('#task-details-title').value;
  const taskDescription = document.querySelector('#task-details-description').value;
  const taskDueDate = document.querySelector('#task-details-dueDate').value;
  const isTaskDone = document.querySelector('#isDone').checked;
  // eslint-disable-next-line prefer-destructuring
  const index = document.querySelector('#task-details-title').dataset.index;
  const taskToEdit = myStorage.tasks[index];

  taskToEdit.title = taskTitle;
  taskToEdit.description = taskDescription;
  taskToEdit.dueDate = taskDueDate;
  taskToEdit.checked = isTaskDone;

  LocalStorage.updateStorage(myStorage.tasks);
  checkActiveTabAndDisplayTasks();
};

const isTaskInputValid = (title, dueDate) => {
  if (title === '') {
    alert('Please enter a title');
    return false;
  }

  if (dueDate === '') {
    alert('Please select a date');
    return false;
  }

  if (isPast(new Date(dueDate)) || !isValid(new Date(dueDate))) {
    alert('Please select a valid date');
    return false;
  }

  return true;
};

/* EVENT DELEGATION FACTORY FUNCTIONS */
const defaultListButtonsEvent = (e) => {
  if (e.target.matches('.default-list-button')) {
    const defaultListButtons = document.querySelectorAll('.default-list-button');
    defaultListButtons.forEach((button) => button.classList.remove('active'));
    document.querySelector('.tasks-list').textContent = '';
    e.target.classList.add('active');
    document.querySelector('#project-title').textContent = e.target.textContent;
    checkActiveTabAndDisplayTasks();
  }
};

const clearTasksButtonEvent = (e) => {
  if (e.target.matches('#clear-task-button')) {
    LocalStorage.clearStorage();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }
};

const addTaskPopupEvent = (e) => {
  if (
    e.target.matches('#add-task-button')
    || e.target.matches('#add-project-button')
  ) {
    document.querySelector('#add-task-button').classList.add('hidden');
    document.querySelector('#clear-task-button').classList.add('hidden');
    document.querySelector('.add-task-popup').classList.remove('hidden');
  }
};

const addTaskPopupButtonEvent = (e) => {
  if (e.target.matches('.add-task-popup-button')) {
    const taskTitle = document.querySelector('#task-title').value;
    const taskDescription = document.querySelector('#task-description').value;
    const taskDate = document.querySelector('#task-date').value;

    if (isTaskInputValid(taskTitle, taskDate)) {
      myStorage.createTask(new Task(taskTitle, taskDescription, taskDate));
      checkActiveTabAndDisplayTasks();
    }
  }
};

const cancelTaskPopupButtonEvent = (e) => {
  if (e.target.matches('.cancel-task-popup-button')) {
    document.querySelector('#add-task-button').classList.remove('hidden');
    document.querySelector('#clear-task-button').classList.remove('hidden');
    document.querySelector('.add-task-popup').classList.add('hidden');
  }
};

const saveEditButtonEvent = (e) => {
  if (e.target.matches('#save-edit-button')) {
    editTask();
    e.target.parentElement.parentElement.remove();
  }
};

const cancelEditButtonEvent = (e) => {
  if (e.target.matches('#cancel-edit-button')) { e.target.parentElement.parentElement.remove(); }
};

const tasksCheckboxesEvent = (e) => {
  if (e.target.matches('.isChecked')) {
    const taskObj = myStorage.getTask(e.target.nextElementSibling.innerText);
    taskObj.checked = !taskObj.checked;
    LocalStorage.updateStorage(myStorage.tasks);
    checkActiveTabAndDisplayTasks();
  }
};

const taskTitlesEvent = (e) => {
  if (e.target.matches('.task-title')) {
    if (document.querySelector('.task-details-popup')) {
      return;
    }

    const task = myStorage.getTask(e.target.textContent);
    displayTaskDetails(task);
  }
};

const deleteIconsEvent = (e) => {
  if (e.target.matches('.fa-xmark')) {
    myStorage.removeTask(e.target);
    e.target.parentElement.parentElement.remove();
  }
};

const loadContent = () => {
  document.addEventListener('click', (e) => {
    defaultListButtonsEvent(e);
    clearTasksButtonEvent(e);
    addTaskPopupEvent(e);
    addTaskPopupButtonEvent(e);
    cancelTaskPopupButtonEvent(e);
    saveEditButtonEvent(e);
    cancelEditButtonEvent(e);
    tasksCheckboxesEvent(e);
    taskTitlesEvent(e);
    deleteIconsEvent(e);
  });

  checkActiveTabAndDisplayTasks();
};

export default loadContent;
