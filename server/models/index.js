'use strict';

const config = require('config');
const mongoose = require('mongoose');
const log4js = require('log4js');

const logger = log4js.getLogger('models/index');

module.exports = function setupDatabase() {
  logger.debug('Setting up database.');
  return new Promise((resolve, reject) => {
    mongoose.connect(config.get('database.url'));

    let db = mongoose.connection;
    let resolved = false;

    db.on('error', err => {
      if (!resolved) {
        resolved = true;
        reject(err);
      } else {
        logger.error('Database connection error:', err);
      }
    });
    db.once('open', () => {
      resolved = true;
      resolve();
    });
  });
};
