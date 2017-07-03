import React, {Component} from 'react';
import { Link } from 'react-router'
import moment from 'moment';
import { Form } from 'formsy-react';
import { Input, Textarea } from 'formsy-react-components';

import CompanyActions from '../../actions/CompanyActions';
import companyStore from '../../stores/CompanyStore';

export default class extends Component {

  constructor(props) {
    super(props);
    this.companiesUpdated = this.companiesUpdated.bind(this);
    this.history = this.props.history;
  }

  saveAndContinue(data) {
    let companyNames = data.names.split(/\n/).filter(name => !!name);
    companyStore.addChangeListener(this.companiesUpdated);
    CompanyActions.set(companyNames);
  }

  companiesUpdated() {
    companyStore.removeChangeListener(this.companiesUpdated);
    this.history.replaceState(null, `/setup/contacts`);
  }

  render() {
    return (
      <section className="setup companies">
        <Form ref="form" onValidSubmit={this.saveAndContinue.bind(this)}>
          <div className="container">
            <div className="row">
              Lorem ipsum: info about what to do goes here
            </div>
          </div>
          <fieldset>
            <div className="container">
              <Textarea name="names" type="text" label="Companies" required={true} autoFocus={true} />
            </div>
          </fieldset>
          <fieldset>
            <div className="container">
              <div className="row">
                <div className="form-group">
                  <div className="col-sm-offset-3 col-sm-9">
                    <button className="btn btn-primary" type="submit">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </Form>
      </section>
    );
  }
}
