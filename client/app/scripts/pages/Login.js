import React, {Component} from 'react';

export default class extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="login-panel col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <h1>Log in to Jobz</h1>
            <ul>
              <li>
                <a className="btn btn-block btn-social btn-linkedin btn-lg" href="/api/auth/linkedin">
                  <span className="fa fa-linkedin"></span> Log in with LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
