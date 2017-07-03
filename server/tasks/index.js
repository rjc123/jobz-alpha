'use strict';

const co = require('co');
const log4js = require('log4js');
const os = require('os');
const Task = require('../models/task');

const logger = log4js.getLogger('tasks/index');
const hostname = os.hostname();

module.exports = function configureTasks() {
  setInterval(checkTasks, 600000);
  checkTasks();
};

function checkTasks() {
  logger.info('Finding tasks for host', hostname);
  co(function *() {
    let tasks = Task.findForExecution(hostname);
    for (let task of tasks) {
      if (!task.value) {
        break;
      }
      try {
        yield executeTask(task.value);
      } catch (err) {
        logger.error('Error executing task', task.value.name, err);
        task.locked = false;
        task.save();
      }
    }
  }).then(() => {
    logger.info('All tasks complete.')
  });
}

function executeTask(task) {
  logger.debug('Executing task', task.name);
  let taskFunction = require('./' + task.name);
  return taskFunction(task)
    .then(() => {
      logger.info(task.name, 'executed');
      task.markExecuted();
      return task.save();
    });
}

if (require.main === module) {
  checkTasks();
}
