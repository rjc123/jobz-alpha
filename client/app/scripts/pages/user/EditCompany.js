// Copyright (c) 2015 Caution Your Blast Ltd.  All rights reserved.

import React, {Component} from 'react';
import { Link } from 'react-router'
import { Form } from 'formsy-react';
import { Input, Textarea } from 'formsy-react-components';

import CompanyActions from '../../actions/CompanyActions';
import userStore from '../../stores/UserStore';
import companyStore from '../../stores/CompanyStore';

import Contacts from '../../components/inputs/Contacts';

export default class extends Component {

  constructor(props) {
    super(props);
    this.history = this.props.history;
  }

  componentDidMount() {
    let {companyId} = this.props.params;
    let company = companyStore.getCompany(companyId);
    this.refs.form.reset(company);
  }

  update(data) {
    CompanyActions.save(data);
    this.history.replaceState(null, `/users/${userStore.user._id}/edit`);
  }

  render() {
    return (
      <div className="edit-company">
        <Form ref="form" onValidSubmit={this.update.bind(this)}>
          <Input name="_id" type="hidden" />
          <fieldset>
            <div className="container">
              <legend>Company</legend>
              <Input name="name" type="text" label="Name" required={true} autoFocus={true} />
            </div>
          </fieldset>
          <fieldset>
            <div className="container">
              <legend>Contacts</legend>
              <Contacts name="contacts" />
            </div>
          </fieldset>
          <fieldset>
            <div className="container">
              <div className="row">
                <div className="form-group">
                  <div className="col-sm-offset-3 col-sm-9">
                    <button className="btn btn-primary" type="submit">Update</button>
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
