import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, History, IndexRoute } from 'react-router'
import { createHistory, useBasename } from 'history'

import auth from './services/auth';

import Base from './pages/Base';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/user/Profile';
import EditProfile from './pages/user/EditProfile';
import EditCompany from './pages/user/EditCompany';

import SetupCompanies from './pages/setup/Companies';
import SetupContacts from './pages/setup/Contacts';

$.ajaxSetup({
  dataType: 'json',
  contentType: 'application/json; charset=utf-8'
});

const history = useBasename(createHistory)({
  basename: '/'
});

const mountNode = document.getElementById('app');

function requireAuth(nextState, replaceState) {
  if (!auth.isAuthenticated()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/login');
  }
}

let start = new Date();

auth.init(() => {
  ReactDOM.render((
    <Router history={history}>
      <Route path="/" component={Base}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route path="logout" component={Logout} />
        <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
        <Route path="users" onEnter={requireAuth}>
          <Route path=":id" component={Profile} />
          <Route path=":id/edit" component={EditProfile} />
          <Route path=":id/company/:companyId" component={EditCompany} />
        </Route>
        <Route path="setup" onEnter={requireAuth}>
          <Route path="companies" component={SetupCompanies} />
          <Route path="contacts" component={SetupContacts} />
        </Route>
      </Route>
    </Router>
  ), mountNode);
  $('#loading').remove();
});

