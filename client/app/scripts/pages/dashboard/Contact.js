import React, {Component} from 'react';
import _ from 'underscore';

import UserActions from '../../actions/UserActions';

export default class extends Component {

  handleOutcome() {

  }

  handleStart() {
    let {company, contact} = this.props;
    UserActions.beginTask({
      type: 'make-contact',
      companyId: company._id,
      contactId: contact._id,
      started: new Date()
    });
  }

  render() {
    let {tasks, contact} = this.props;
    let task = _.findWhere(tasks, { contactId: contact._id });

    let cta;
    if (task && !task.complete) {
      cta = (<a onClick={this.handleOutcome.bind(this)}>Outcome</a>);
    } else {
      cta = (<a onClick={this.handleStart.bind(this)}>Start</a>);
    }

    return (
      <li>
        {contact.firstName}
        {cta}
      </li>
    );
  }
}
