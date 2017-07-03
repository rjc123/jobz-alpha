import AppDispatcher from '../dispatcher/AppDispatcher';
import TaskConstants from '../constants/TaskConstants';
import { EventEmitter } from 'events';
import userStore from './UserStore';
import companyStore from './CompanyStore';
import contactStore from './ContactStore';

const CHANGE_EVENT = 'change';

class TaskStore extends EventEmitter {

  constructor() {
    super();
    this._tasks = [];
    this.retrieveTasks = this.retrieveTasks.bind(this);
    userStore.addChangeListener(this.retrieveTasks);
    companyStore.addChangeListener(this.retrieveTasks);
    contactStore.addChangeListener(this.retrieveTasks);
  }

  retrieveTasks() {
    let user = userStore.user;
    $.ajax({
      url: `/api/users/${user._id}/tasks`,
      method: 'GET',
      success: response => {
        this.tasks = response.tasks;
      }
    });
  }

  addChangeListener(fn) {
    this.on(CHANGE_EVENT, fn);
  }

  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }

  getTask(id) {
    return this._tasks.some(task => {
      if (task._id === id) {
        return task;
      }
    });
  }

  get tasks() {
    return this._tasks;
  }

  set tasks(newTasks) {
    this._tasks = newTasks;
    this.emit(CHANGE_EVENT);
  }

  save(tasks) {
    let user = userStore.user;
    $.ajax({
      url: `/api/users/${user._id}/taskss/${tasks._id}`,
      data: JSON.stringify(tasks),
      method: 'PUT',
      success: (response, data) => {
        console.log(response, data);
        console.log('TODO');
      }
    });
  }
}

let store = new TaskStore();

AppDispatcher.register(action => {

  switch(action.type) {
    case TaskConstants.SAVE:
      store.save(action.company);
      break;
    case TaskConstants.REFRESH:
      store.retrieveTasks();
      break;
  }
});

export default store;
