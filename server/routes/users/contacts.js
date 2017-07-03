'use strict';

const log4js = require('log4js');
const moment = require('moment');

const logger = log4js.getLogger('routes/users/contacts');

function getContacts(req, res) {
  res.json(req.requestUser.renderContacts(req.company));
}

function setContacts(req, res, next) {
  let user = req.requestUser;
  let company = req.company;
  let addContactsTask = user.getTask('add-contacts');

  if (!addContactsTask || !!addContactsTask.completed) {
    next(new Error('Attempt to overwrite existing contacts'));
  } else {
    company.contacts = req.body.contacts;

    let remainingCompanies = user.companies.filter(company => !company.contacts || company.contacts.length === 0);
    if (remainingCompanies.length === 0) {
      addContactsTask.completed = moment();
      user.tasks.push({
        type: 'make-contact',
        scheduled: moment().hours(0).minutes(0).seconds(0),
        company: user.companies[0]._id,
        contact: user.companies[0].contacts[0]._id
      });
      if (user.companies[0].contacts.length > 1) {
        user.tasks.push({
          type: 'make-contact',
          scheduled: moment().hours(0).minutes(0).seconds(0).add(3, 'days'),
          company: user.companies[0]._id,
          contact: user.companies[0].contacts[1]._id
        });
      }
    }
    user.save().then(() => {
      res.sendStatus(204);
    });
  }
}

module.exports = {
  get: getContacts,
  set: setContacts
};
