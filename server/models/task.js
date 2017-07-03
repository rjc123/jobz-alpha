'use strict';

const mongoose = require('mongoose');
const loadClass = require('mongoose-class-wrapper');

const Schema = mongoose.Schema;

let schema = new Schema({
  name: {type: String, required: true},
  hostname: {type: String},
  nextExecution: {type: Date},
  lastExecution: {type: Date},
  period: {type: Number, required: true},
  locked: {type: Boolean, default: false}
});

class Task {

  markExecuted() {
    this.lastExecution = this.nextExecution;
    this.nextExecution = new Date(this.nextExecution.getTime() + this.period);
    this.locked = false;
  }

  static *findForExecution(hostname) {
    while (true) {
      yield this.findOneAndUpdate({
        nextExecution: {$lt: Date.now},
        locked: false,
        $or: [{hostname: hostname}, {hostname: null}]
      }, {
        $set: {locked: true}
      }).exec();
    }
  }
}

schema.plugin(loadClass, Task);

module.exports = mongoose.model('Task', schema);
