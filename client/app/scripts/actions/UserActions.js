
import AppDispatcher from '../dispatcher/AppDispatcher';
import UserConstants from '../constants/UserConstants';

export default class {

  static save(user) {
    AppDispatcher.dispatch({
      type: UserConstants.SAVE,
      user: user
    });
  }

  static set(user) {
    AppDispatcher.dispatch({
      type: UserConstants.SET,
      user: user
    });
  }

  static beginTask(taskId) {
    AppDispatcher.dispatch({
      type: UserConstants.BEGIN_TASK,
      taskId: taskId
    });
  }

  static completeTask(taskId, result) {
    AppDispatcher.dispatch({
      type: UserConstants.COMPLETE_TASK,
      taskId: taskId,
      result: result
    });
  }
}
