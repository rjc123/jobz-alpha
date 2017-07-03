import AppDispatcher from '../dispatcher/AppDispatcher';
import CompanyConstants from '../constants/CompanyConstants';
import { EventEmitter } from 'events';
import userStore from './UserStore';

const CHANGE_EVENT = 'change';

class CompanyStore extends EventEmitter {

  constructor() {
    super();
    this._companies = [];
    userStore.addChangeListener(this.retrieveCompanies.bind(this));
  }

  retrieveCompanies() {
    let user = userStore.user;
    $.ajax({
      url: `/api/users/${user._id}/companies`,
      method: 'GET',
      success: response => {
        this.companies = response.companies;
      }
    });
  }

  addChangeListener(fn) {
    this.on(CHANGE_EVENT, fn);
  }

  removeChangeListener(fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }

  getCompany(id) {
    return this._companies.some(company => {
      if (company._id === id) {
        return company;
      }
    });
  }

  get companies() {
    return this._companies;
  }

  set companies(newCompanies) {
    this._companies = newCompanies;
    this.emit(CHANGE_EVENT);
  }

  save(company) {
    let user = userStore.user;
    $.ajax({
      url: `/api/users/${user._id}/companies/${company._id}`,
      data: JSON.stringify(company),
      method: 'PUT',
      success: (response, data) => {
        console.log(response, data);
        console.log('TODO');
      }
    });
  }

  setCompanies(names) {
    let user = userStore.user;
    $.ajax({
      url: `/api/users/${user._id}/companies`,
      data: JSON.stringify({ companies: names.map(name => ({ name: name })) }),
      method: 'PUT',
      success: () => {
        this.retrieveCompanies();
      }
    });
  }
}

let store = new CompanyStore();

AppDispatcher.register(action => {

  switch(action.type) {
    case CompanyConstants.SAVE:
      store.save(action.company);
      break;
    case CompanyConstants.SET:
      store.setCompanies(action.names);
      break;
  }
});

export default store;
