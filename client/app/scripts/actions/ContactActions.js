
import AppDispatcher from '../dispatcher/AppDispatcher';
import ContactConstants from '../constants/ContactConstants';

export default class {

  static set(company, contacts) {
    AppDispatcher.dispatch({
      type: ContactConstants.SET,
      company: company,
      contacts: contacts
    });
  }
}
