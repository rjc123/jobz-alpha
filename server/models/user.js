'use strict';

const mongoose = require('mongoose');
const loadClass = require('mongoose-class-wrapper');
const findOrCreate = require('mongoose-findorcreate');

const Schema = mongoose.Schema;

let schema = new Schema({
  authentication: {
    provider: {type: String, required: true},
    id: {type: String, required: true},
    accessToken: {type: String, required: true},
    refreshToken: String,
    profile: Object
  },
  name: {type: String, required: true},
  emailAddress: {type: String, unique: true, required: true},
  profileImageUrl: {type: String },
  companies: [{
    name: String,
    contacts: [{
      firstName: String,
      lastName: String,
      emailAddress: String
    }]
  }],
  tasks: [{
    type: {type: String},
    scheduled: Date,
    started: Date,
    completed: Date,
    result: String,
    contact: {
      id: String,
      name: String
    }
  }]
});

class User {

  getTask(type) {
    let tasks = this.getTasks(type);
    if (tasks.length) {
      return tasks[0];
    }
    // TODO: error handling
    return null;
  }

  getTasks(type) {
    return this.tasks.filter(task => {
      if (task.type === type) {
        return task;
      }
    });
  }

  render() {
    return {
      _id: this.id,
      name: this.name,
      emailAddress: this.emailAddress,
      profileImageUrl: this.profileImageUrl
    };
  }

  renderCompanies() {
    return {
      companies: this.companies.map(company => ({
        _id: company.id,
        name: company.name,
        contacts: company.contacts.map(contact => ({
          _id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          emailAddress: contact.emailAddress
        }))
      }))
    };
  }

  renderContacts(company) {
    return {
      contacts: company.contacts.map(contact => ({
        _id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        emailAddress: contact.emailAddress
      }))
    };
  }

  renderTasks() {
    return {
      tasks: this.tasks.map(task => ({
        _id: task.id,
        type: task.type,
        scheduled: task.scheduled,
        started: task.started,
        completed: task.completed,
        result: task.result,
        contact: task.contact
      }))
    };
  }
}

schema.plugin(loadClass, User);
schema.plugin(findOrCreate, User);

module.exports = mongoose.model('User', schema);
