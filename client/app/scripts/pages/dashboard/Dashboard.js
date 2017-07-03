import React, {Component} from 'react';
import { Link } from 'react-router'
import moment from 'moment';

import Company from './Company';

import userStore from '../../stores/UserStore';
import taskStore from '../../stores/TaskStore';

export default class extends Component {

  constructor(props) {
    super(props);
    this.storeUpdated = this.storeUpdated.bind(this);
    this.state = {
      user: userStore.user,
      tasks: taskStore.tasks
    };
  }

  componentDidMount() {
    userStore.addChangeListener(this.storeUpdated);
    taskStore.addChangeListener(this.storeUpdated);
  }

  componentWillUnmount() {
    userStore.removeChangeListener(this.storeUpdated);
    taskStore.removeChangeListener(this.storeUpdated);
  }

  storeUpdated() {
    this.setState({
      user: userStore.user,
      tasks: taskStore.tasks
    });
  }

  render() {
    let {user, tasks} = this.state;
    if (!user) {
      return (<div />);
    }

    let tasksCompletedForToday = 0;

    let tasksForToday = [];
    let tasksForTheWeek = [];
    let tasksForNextWeek = [];

    let today = moment().startOf('day');
    let endOfTheWeek = moment().endOf('week').fromNow();
    let endOfNextWeek = moment(endOfTheWeek).add(7, 'days');

    for (let task of tasks) {
      let scheduled = moment(task.scheduled);
      if (scheduled.isBefore(today)) {
        if (!task.completed) {
          tasksForToday.push(tasks);
        }
      } else if (scheduled.isSame(today, 'day')) {
        tasksForToday.push(task);
        if (!!task.completed) {
          tasksCompletedForToday++;
        }
      } else if (scheduled.isBefore(endOfTheWeek)) {
        tasksForTheWeek.push(task);
      } else if (scheduled.isBefore(endOfNextWeek)) {
        tasksForNextWeek.push(task);
      }
    }

    return (
      <div id="dashboard">
        <section className="tasks">
          <div className="summary">
            {tasksCompletedForToday} of {tasksForToday.length} tasks completed
          </div>
          <div className="container">
            <h2>Upcoming tasks</h2>
            {this.renderTasks('Today', tasksForToday)}
            {this.renderTasks('Rest of this week', tasksForTheWeek)}
            {this.renderTasks('Next week', tasksForNextWeek)}
          </div>
        </section>
      </div>
    );
  }

  renderTasks(label, tasks) {
    return (
      <div className="row">
        <h3>{label}</h3>
        <ul>
          {tasks.map((task, i) => (
            <li key={i}>{this.renderTask(task)}</li>
          ))}
        </ul>
      </div>
    );
  }

  renderTask(task) {
    let component;

    switch (task.type) {
      case 'set-companies':
        component = (
          <Link to="/setup/companies">Add companies</Link>
        );
        break;
      case 'add-contacts':
        component = (
          <Link to="/setup/contacts">Add contacts</Link>
        );
        break;
      case 'make-contact':
        component = (
          <Link to="/setup/contacts">Add contacts</Link>
        );
        break;
      default:
        component = (<div/>);
    }

    return (
      <div className={!!task.completed ? 'completed' : ''}>
        {component}
      </div>
    );
  }
}
