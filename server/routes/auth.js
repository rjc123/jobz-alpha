'use strict';

const config = require('config');
const log4js = require('log4js');
const moment = require('moment');
const passport = require('passport');

const FacebookStrategy = require('passport-facebook');
const GithubStrategy = require('passport-github');
const LinkedInStrategy = require('passport-linkedin');

const User = require('../models/user');

const logger = log4js.getLogger('routes/auth');

passport.serializeUser(function (user, done) {
  logger.debug(`Serialising user ${user.id}`);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  logger.debug('De-serialising user from', id);
  User.findById(id)
    .then(user => done(null, user),
          err => {
            console.log('auth error', err);
            done(err);
          });
});

passport.use(new LinkedInStrategy(config.get('auth.linkedin'), login));

function login(accessToken, refreshToken, profile, done) {
  let where = {
    'authentication.id': profile.id,
    'authentication.provider': profile.provider
  };

  let profileImageUrl = profile.photos && profile.photos[0].value.replace(/large$/, 'square');
  if (!profileImageUrl && profile['_json']) {
    profileImageUrl = profile['_json']['avatar_url'] || profile['_json']['pictureUrl'];
  }

  let data = {
    authentication: {
      id: profile.id,
      provider: profile.provider,
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    },
    name: profile.displayName,
    emailAddress: profile.emails && profile.emails[0].value,
    profileImageUrl: profileImageUrl,
    tasks: [{
      type: 'set-companies',
      scheduled: moment().hours(0).minutes(0).seconds(0)
    }]
  };

  User.findOrCreate(where, data, (err, user) => {
    if (err) {
      // TODO: handle duplicate email address error
      logger.error('Error finding or creating user', err);
    }
    done(err, user);
  });
}

function authenticate(req, res, next) {
  let provider = req.params.provider;
  passport.authenticate(provider, { failureRedirect: '/login?error=1' })(req, res, next);
}

module.exports = function configureRoutes(router) {

  router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy(() => {
      res.clearCookie('sid', { path: '/' });
      res.sendStatus(204);
    });
  });

  router.get('/auth/:provider', (req, res, next) => {
    let provider = req.params.provider;
    let options = null;

    if (provider === 'facebook') {
      options = {scope: ['email'], display: 'touch'};
    }
    passport.authenticate(provider, options)(req, res, next);
  });

  router.get('/auth/:provider/callback', authenticate, (req, res) => {
    res.redirect('/');
  });
};
