
import UserActions from '../actions/UserActions';
import userStore from '../stores/UserStore';

class Auth {

  init(callback) {
    $.get('/api/users/current')
      .then(user => {
        UserActions.set(user);
        callback(null, user);
      }, err => {
        callback(err);
      });
  }

  isAuthenticated() {
    return !!userStore.user;
  }
}

export default new Auth();
