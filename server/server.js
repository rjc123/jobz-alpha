'use strict';

const bodyParser = require('body-parser');
const config = require('config');
const configureDatabase = require('./models');
const configureRoutes = require('./routes');
const configureTasks = require('./tasks');
const session = require('express-session');
const express = require('express');
const passport = require('passport');
const log4js = require('log4js');
const path = require('path');

log4js.configure(config.get('logging'));

const logger = log4js.getLogger('server');
const app = express();

app.disable('x-powered-by');
app.disable('etag');

app.set('trust proxy', true);

app.use(session(config.get('session')));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('client/dist'));
app.use(bodyParser.json({ limit: '512kb' }));
app.use(bodyParser.urlencoded({ limit: '512kb' }));

configureRoutes(app);

app.all('*', (req, res) => res.sendFile(path.resolve('client/dist/index.html')));

app.use((err, req, res, next) => {
  logger.error('Error handling request for', req.method, req.url, req.body, '\n', err.stack);
  res.sendStatus(500);
});

app.isReady = configureDatabase();

if (require.main === module) {
  app.isReady
    .then(() => {
      let server = app.listen(3000, () => {
        let host = server.address().address;
        let port = server.address().port;
        logger.info(`App started, listening at http://${host}:${port}`);

        configureTasks();
      });
    })
    .catch(err => {
      logger.error('Error starting app.', err);
    });
}

module.exports = app;
