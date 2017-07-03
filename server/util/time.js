'use strict';

const logger = require('log4js').getLogger('util/time');

module.exports = function time(label, promise) {

  if (process.env.NODE_ENV === 'production') {
    return promise;
  }

  let start = new Date();
  return promise.then(result => {
    let end = new Date();
    logger.debug(`Time for ${label}: ${end - start}ms`);
    return Promise.resolve(result);
  });
};
