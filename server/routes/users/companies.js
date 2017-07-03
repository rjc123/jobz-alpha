'use strict';

const log4js = require('log4js');
const moment = require('moment');

const logger = log4js.getLogger('routes/users/companies');

function getCompany(req, res) {
  res.json(req.requestUser.renderCompanies());
}

function setCompanies(req, res, next) {
  let user = req.requestUser;
  let setCompaniesTask = user.getTask('set-companies');

  if (!setCompaniesTask || !!setCompaniesTask.completed) {
    next(new Error('Attempt to overwrite existing companies'));
  } else {
    setCompaniesTask.completed = moment();
    user.companies = req.body.companies;
    user.tasks.push({
      type: 'add-contacts',
      scheduled: moment().hours(0).minutes(0).seconds(0)
    });
    user.save().then(() => {
      res.sendStatus(204);
    });
  }
}

function updateCompany(req, res, next) {
  //let user = req.requestUser;
  let company = req.company;

  company.update(req.body)
    .then((r) => {
      console.log(r);
      res.sendStatus(204);
    }, next);
}

module.exports = {
  get: getCompany,
  set: setCompanies,
  update: updateCompany
};
