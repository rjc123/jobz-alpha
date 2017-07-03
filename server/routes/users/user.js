'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger('routes/users/user');

function getUser(req, res) {
  res.json(req.requestUser.render());
}

function updateUser(req, res, next) {
  let user = req.requestUser;
  user.update(req.body)
    .then(() => {
      res.sendStatus(204);
    }, next);
}

module.exports = {
  get: getUser,
  update: updateUser
};
