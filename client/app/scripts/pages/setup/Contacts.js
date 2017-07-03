import React, {Component} from 'react';
import { Link } from 'react-router'
import moment from 'moment';
import { Form } from 'formsy-react';
import { Input, Textarea } from 'formsy-react-components';

import ContactActions from '../../actions/ContactActions';
import companyStore from '../../stores/CompanyStore';
import contactStore from '../../stores/ContactStore';

export default class extends Component {

  constructor(props) {
    super(props);
    this.contactUpdated = this.contactUpdated.bind(this);
    this.history = this.props.history;
    this.state = {
      companies: [],
      currentIndex: 0
    };
  }

  componentWillMount() {
    this.setState({
      companies: companyStore.companies
    });
  }

  saveAndContinue(data) {
    let {companies, currentIndex} = this.state;
    let contactNames = data.names.split(/\n/).filter(name => !!name);
    let contacts = contactNames.map(name => {
      let [firstName, lastName, emailAddress] = name.split(/\s/);
      return {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress
      };
    });
    contactStore.addChangeListener(this.contactUpdated);
    ContactActions.set(companies[currentIndex], contacts);
  }

  contactUpdated() {
    let {companies, currentIndex} = this.state;
    contactStore.removeChangeListener(this.contactUpdated);

    if (currentIndex < companies.length - 1) {
      currentIndex++;
      this.setState({
        currentIndex: currentIndex
      });
      this.refs.form.reset(companies[currentIndex]);
    } else {
      this.history.replaceState(null, '/');
    }
  }

  render() {
    let {companies, currentIndex} = this.state;
    let company = companies[currentIndex];
    return (
      <section className="setup contacts">
        <h3>{company.name}</h3>
        <Form ref="form" onValidSubmit={this.saveAndContinue.bind(this)}>
          <div className="container">
            <div className="row">
              Lorem ipsum: info about what to do goes here
            </div>
          </div>
          <fieldset>
            <div className="container">
              <Textarea name="names" type="text" label="Contacts" required={true} autoFocus={true} />
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
