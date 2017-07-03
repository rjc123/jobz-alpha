
import AppDispatcher from '../dispatcher/AppDispatcher';
import TaskConstants from '../constants/TaskConstants';

export default class {

  static save(task) {
    AppDispatcher.dispatch({
      type: TaskConstants.SAVE,
      task: task
    });
  }

  static refresh() {
    AppDispatcher.dispatch({
      type: TaskConstants.REFRESH
    });
  }
}
