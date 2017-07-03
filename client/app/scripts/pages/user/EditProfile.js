// Copyright (c) 2015 Caution Your Blast Ltd.  All rights reserved.

import React, {Component} from 'react';
import { Link } from 'react-router'
import { Form } from 'formsy-react';
import { Input, Textarea } from 'formsy-react-components';

import UserActions from '../../actions/UserActions';
import userStore from '../../stores/UserStore';
import companyStore from '../../stores/CompanyStore';

import Companies from '../../components/inputs/Companies';

export default class extends Component {

  constructor(props) {
    super(props);
    this.history = this.props.history;
  }

  componentDidMount() {
    // FIXME: doesn't reset all fields (nesting?)
    this.refs.form.reset(userStore.user);
  }

  update(data) {
    delete data.companies;
    let user = userStore.user;
    // FIXME: allow overwriting profile image at some point
    data.profileImageUrl = user.profileImageUrl;
    UserActions.save(data);
    this.history.replaceState(null, `/users/${user._id}`);
  }

  editCompany(index, company) {
    let user = userStore.user;
    this.history.replaceState(null, `/users/${user._id}/company/${company._id}`);
  }

  render() {
    let user = userStore.user;
    // FIXME: split company management from user
    user.companies = companyStore.companies;
    return (
      <div className="edit-profile">
        <Form ref="form" onValidSubmit={this.update.bind(this)}>
          <fieldset>
            <div className="container">
              <legend>General</legend>
              <Input name="name" type="text" label="Name" required={true} autoFocus={true} />
              <Input name="emailAddress" type="email" label="Email address" required={true} />
            </div>
          </fieldset>
          <fieldset>
            <div className="container">
              <legend>Companies</legend>
              <Companies name="companies" onEdit={this.editCompany.bind(this)} />
            </div>
          </fieldset>
          <fieldset>
            <div className="container">
              <div className="row">
                <div className="form-group">
                  <div className="col-sm-offset-3 col-sm-9">
                    <button className="btn btn-primary" type="submit">Update</button>
                    <a className="btn btn-default" href={'/users/' + user._id}>Cancel</a>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>
    );
  }
}
