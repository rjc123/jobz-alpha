import React, {Component} from 'react';
import {Link} from 'react-router';

import userStore from '../../stores/UserStore';
import companyStore from '../../stores/CompanyStore';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {

    let {id} = this.props.params;

    $.get(`/api/users/${id}`)
      .then(user => {
        this.setState({
          user: user
        })
      });
  }

  render() {
    let user = userStore.user;
    let companies = companyStore.companies;

    if (!user) {
      return (<div></div>);
    }

    let profileImageUrl = (user.profileImageUrl || '').replace(/type=square$/, 'width=130&height=130');
    let editButton = (
      <Link to={`/users/${user._id}/edit`} className="edit">
        <i className="fa fa-edit"></i> Edit
      </Link>
    );

    return (
      <div className="profile">
        <section className="header">
          {editButton}
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <img src={profileImageUrl} className="img-circle" />
                <div className="details">
                  <h1>
                    {user.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container companies">
            <h3>Companies</h3>
            <div className="row">
              {companies.map((item, i) => (
                <div key={i} className="col-xs-12">
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }
}
