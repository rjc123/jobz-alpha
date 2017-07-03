import AppDispatcher from '../dispatcher/AppDispatcher';
import ContactConstants from '../constants/ContactConstants';
import { EventEmitter } from 'events';
import co from 'co';
import userStore from './UserStore';
import companyStore from './CompanyStore';

const CHANGE_EVENT = 'change';

class ContactStore extends EventEmitter {

  constructor() {
    super();
    this._contacts = {};
    companyStore.addChangeListener(this.retrieveContacts.bind(this));
  }

  retrieveContacts() {
    let _this = this;
    co(function*() {
      let user = userStore.user;
      let companies = companyStore.companies;
      for (let company of companies) {
        let response = yield $.ajax({
          url: `/api/users/${user._id}/companies/${company._id}/contacts`,
          method: 'GET'
        });
        _this._contacts[company._id] = response.contacts;
      }
      _this.emit(CHANGE_EVENT);
    });
  }

  addChangeListener(fn) {
    this.on(CHANGE_EVENT, fn);
  }

  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }

  setContacts(company, contacts) {
    let _this = this;
    co(function*() {
      let user = userStore.user;
      try {
        yield $.ajax({
          url: `/api/users/${user._id}/companies/${company._id}/contacts`,
          method: 'PUT',
          data: JSON.stringify({ contacts: contacts })
        });
        _this._contacts[company._id] = contacts;
        _this.emit(CHANGE_EVENT);
      } catch (e) {
        console.log('Error setting contacts', e);
      }
    });
  }
}

let store = new ContactStore();

AppDispatcher.register(action => {

  switch(action.type) {
    case ContactConstants.SET:
      store.setContacts(action.company, action.contacts);
      break;
  }
});

export default store;
