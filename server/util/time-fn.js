'use strict';

const logger = require('log4js').getLogger('util/time');

module.exports = function time(label, fn, args) {

  if (process.env.NODE_ENV === 'production') {
    return fn.apply(null, args);
  }

  let start = new Date();
  let response = fn.apply(null, args);
  let end = new Date();
  logger.debug(`Time for ${label}: ${end - start}ms`);
  return response;
};
