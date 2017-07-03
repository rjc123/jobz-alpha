import React, {Component} from 'react';
import _ from 'underscore';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import UserActions from '../../actions/UserActions';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  showOutcomes() {
    this.setState({
      showModal: true
    });
  }

  handleOutcome(result) {
    let {contact} = this.props;
    let tasks = contact.tasks;
    let task = findCurrentTask(tasks);

    if (result !== 'cancel') {
      UserActions.completeTask(task._id, result);
    }

    this.setState({
      showModal: false
    });
  }

  handleStart() {
    let {contact} = this.props;
    let tasks = contact.tasks;
    let task = findCurrentTask(tasks);
    UserActions.beginTask(task._id);
  }

  render() {
    let {contact, offset} = this.props;
    let {showModal} = this.state;
    let tasks = contact.tasks;
    let task = findCurrentTask(tasks);
    let nextTask = findNextTask(tasks);
    let overdue = !!task && !!nextTask && new Date() > new Date(nextTask.scheduled);

    let completedTasks = tasks.map(task => !!task.completed ? 1 : 0).reduce((a, b) => a + b);
    let totalTasks = tasks.length;

    if (completedTasks !== totalTasks && !!task.started) {
      completedTasks += 0.5;
    }

    let percentageComplete = completedTasks / totalTasks * 100;

    let cta;

    if (task && new Date() > new Date(task.scheduled)) {
      if (!task.started) {
        switch (task.type) {
          case 'make-contact':
            cta = (<a onClick={this.handleStart.bind(this)}>Send message</a>);
            break;
          case 'follow-up':
            cta = (<a onClick={this.handleStart.bind(this)}>Follow up</a>);
            break;
        }
      } else {
        cta = (<a onClick={this.showOutcomes.bind(this)}>Outcome</a>);
      }
    }

    return (
      <li className={{ overdue: overdue }}>
        <div className="col-xs-12 col-sm-2">
          {contact.firstName} {contact.lastName}
        </div>
        <div className={`col-xs-6 col-xs-offset-${offset} col-sm-4 col-sm-offset-${offset}`}>
          <div className="progress">
            <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{ width: `${percentageComplete}%` }} />
          </div>
        </div>
        <div className="col-xs-12 col-sm-2">
          {cta}
        </div>
        <Modal show={showModal} onHide={this.handleOutcome.bind(this, 'cancel')} backdrop={true}>
          <Modal.Header>
            <Modal.Title>Select an outcome</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button onClick={this.handleOutcome.bind(this, 'no-reply')}>No reply</Button>
            <Button onClick={this.handleOutcome.bind(this, 'meeting')}>Meeting</Button>
            <Button onClick={this.handleOutcome.bind(this, 'cancel')}>Cancel</Button>
          </Modal.Body>
        </Modal>
      </li>
    );
  }
}

function findCurrentTask(tasks) {
  for (let task of tasks) {
    if (!task.completed) {
      return task;
    }
  }
  return null;
}

function findNextTask(tasks) {
  for (let task of tasks) {
    if (!task.started) {
      return task;
    }
  }
  return null;
}
