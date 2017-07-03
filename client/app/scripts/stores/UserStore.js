import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

class UserStore extends EventEmitter {

  constructor() {
    super();
    this._user = null;
  }

  addChangeListener(fn) {
    this.on(CHANGE_EVENT, fn);
  }

  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }

  get user() {
    return this._user;
  }

  set user(newUser) {
    this._user = newUser;
    this.emit(CHANGE_EVENT);
  }

  save(data) {
    let user = this.user;
    data = data || user;
    $.ajax({
      url: `/api/users/${user._id}`,
      data: JSON.stringify(data),
      method: 'PUT',
      success: () => {
        data._id = user._id;
        this.user = data;
      }
    });
  }
}

let store = new UserStore();

AppDispatcher.register(action => {

  if (action.taskId) {
    var {contact, task} = findTask(action.taskId);
  }

  switch(action.type) {
    case UserConstants.BEGIN_TASK:
      task.started = new Date();

      var npg = '%0D%0A%0D%0A';

      switch (task.type) {
        case 'make-contact':
          var subject_line = 'Seeking your advice';
          var body_text = 'Dear <the contact>,' + npg +
                          'My name is <your name>, and I\'m researching my next career move; <your connection to this contact> suggested I get in touch.' + npg +
                          'Would you have a moment to discuss your experience with <target company>? I\'m looking to learn more about <X generic job description> in <Y industry> in <Z location> [OR] I\'m in the process of applying for an open <job title> position at <that firm> and your insight would be supremely helpful.' + npg +
                          'You may be quite busy at the moment, so if we don\'t connect by email, I\'ll try to reach you again next week to see whether that is more convenient.' + npg +
                          'Thanks for your time,%0D%0A<your first name>';
          break;
        case 'follow-up':
          var subject_line = 'Following up';
          var body_text = 'Dear <the contact>,' + npg +
                          'I thought to follow up on my email of <x days> ago.' + npg +
                          'I\'m sorry we were unablle to connect in the last week, and I thought to see whether the coming week woudl be a better time to talk about your experiences with <firm name>.' + npg +
                          'Please let me know if so, and thanks again for your time.' + npg +
                          'Kindest regards,%0D%0A<your first name>';
          break;
      }
      sendEmail(contact, subject_line, body_text);

      store.save();
      break;
    case UserConstants.COMPLETE_TASK:
      task.completed = new Date();
      task.result = action.result;
      store.save();
      break;
    case UserConstants.SAVE:
      store.save(action.user);
      break;
    case UserConstants.SET:
      store.user = action.user;
      break;
  }
});

function findTask(taskId) {
  let user = store.user;
  for (let company of user.companies) {
    for (let contact of company.contacts) {
      for (let task of contact.tasks) {
        if (task._id === taskId) {
          return {contact: contact, task: task};
        }
      }
    }
  }
  return {};
}

function sendEmail(contact, subject, message) {
  window.location.href = `mailto:${contact.emailAddress}?subject=${encodeURI(subject)}&body=${encodeURI(message)}`;
}

export default store;
