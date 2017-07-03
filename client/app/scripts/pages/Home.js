import React, {Component} from 'react';
import { Link } from 'react-router'

import auth from '../services/auth';

export default class extends Component {

  componentDidMount() {
  //  this.props.history.replaceState(null, '/dashboard');
  }

  render() {
    return (
      <section className="home">

        <div class="row">
          <h1>
          Stay positive on the hunt.
          </h1>

          <p>
          JayOhBeeZed is everything you need to effectively, quickly, organise your job search in one place. From organising your networking to managing your applications, it saves time on admin and follow-up, and helps you stay positive during the sometimes mentally exhausting job hunt.
          </p>

//          <a class="btn--primary" href="/signup">FREE 15 DAY TRIAL</a>

//          <div>
//          <a href="/pricing">Pricing plans</a>from just <span>£10/mo</span>
//          </div>

        </div>

      </section>
    );
  }
}
