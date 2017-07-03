'use strict';

const express = require('express');
const log4js = require('log4js');
const user = require('./user');
const companies = require('./companies');
const contacts = require('./contacts');
const tasks = require('./tasks');

const logger = log4js.getLogger('routes/users/index');

const User = require('../../models/user');

module.exports = function configureRoutes(baseRouter) {

  let router = express.Router();
  baseRouter.use('/users', router);

  router.param('userId', loadUser);
  router.param('companyId', loadCompany);
  router.param('taskId', loadTask);

  router.get('/:userId', user.get);
  router.post('/:userId', user.update);

  router.get('/:userId/companies', companies.get);
  router.put('/:userId/companies', companies.set);
  router.post('/:userId/companies/:companyId', companies.update);

  router.get('/:userId/companies/:companyId/contacts', contacts.get);
  router.put('/:userId/companies/:companyId/contacts', contacts.set);

  router.get('/:userId/tasks', tasks.get);
  router.post('/:userId/tasks/:taskId', tasks.update);
};

function loadUser(req, res, next, id) {

  let done = () => {
    if (!req.requestUser) {
      return res.sendStatus(404);
    }
    next();
  };

  if (id === 'current') {
    req.requestUser = req.user;
    done();
  } else {
    User.findById(id)
        .then(user => {
          req.requestUser = user;
          done();
        }, next);
  }
}

function loadCompany(req, res, next, id) {

  let user = req.requestUser;

  for (let company of user.companies) {
    if (company.id === id) {
      req.company = company;
      break;
    }
  }

  if (!req.company) {
    return res.sendStatus(404);
  }
  next();
}

function loadTask(req, res, next, id) {

  let user = req.requestUser;

  req.task = user.tasks.some(task => {
    if (task.id === id) {
      return task;
    }
  });

  if (!req.task) {
    return res.sendStatus(404);
  }
  next();
}
