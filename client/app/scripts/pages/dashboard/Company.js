import React, {Component} from 'react';
import _ from 'underscore';

import Tasks from './Tasks';

import userStore from '../../stores/UserStore';

export default class extends Component {

  render() {
    let {company} = this.props;
    let user = userStore.user;
    let components = [];

    if (!(company.contacts && company.contacts.length)) {
      // TODO: figure out index
      //components = [(
      //  <a key="0" href={`/users/${user._id}/company/0`}>Add some contacts</a>
      //)];
    } else {
      let start;
      let offset = 0;
      for (let contact of company.contacts) {
        let tasks = contact.tasks;
        if (!start) {
          if (tasks[0].started) {
            start = tasks[0].started;
          } else {
            start = new Date();
          }
        }
        components.push((
          <div key={components.length} className="row">
            <Tasks contact={contact} start={start} offset={offset} />
          </div>
        ));
        offset++;
      }
    }

    return (
      <div className="company">
        <div className="row">
          <h2>{company.name}</h2>
        </div>
        <ol className="tasks">
          {components}
        </ol>
      </div>
    );
  }
}
