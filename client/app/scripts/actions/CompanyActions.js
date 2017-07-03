
import AppDispatcher from '../dispatcher/AppDispatcher';
import CompanyConstants from '../constants/CompanyConstants';

export default class {

  static save(company) {
    AppDispatcher.dispatch({
      type: CompanyConstants.SAVE,
      company: company
    });
  }

  static set(names) {
    AppDispatcher.dispatch({
      type: CompanyConstants.SET,
      names: names
    });
  }
}
