'use strict';

const log4js = require('log4js');
const moment = require('moment');

const logger = log4js.getLogger('routes/users/tasks');

function getTasks(req, res) {
  res.json(req.requestUser.renderTasks());
}

function updateTask(req, res, next) {
}

module.exports = {
  get: getTasks,
  update: updateTask
};
