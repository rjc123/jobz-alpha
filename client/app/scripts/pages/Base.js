import React, {Component} from 'react';
import { Link } from 'react-router'
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavBrand from 'react-bootstrap/lib/NavBrand';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';

import userStore from '../stores/UserStore';

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: !!userStore.user
    };
  }

  componentWillMount() {
    userStore.addChangeListener(() => {
      this.state = {
        isAuthenticated: !!userStore.user
      };
    });
  }

  render() {

    let menu = [];

    if (this.state.isAuthenticated) {
      let user = userStore.user;
      menu.push(<Link to="/dashboard">Dashboard</Link>);
      menu.push(<Link to={`/users/${user._id}`}>Setup</Link>);
      menu.push(<Link to="/logout">Log out</Link>);
    } else {
      menu.push(<Link to="/login">Log in / Sign up</Link>);
//      menu.push(<Link to="/login" className="signup-btn">Sign up</Link>);
    }

    return (
      <div>
        <Navbar toggleNavKey={0}>
          <NavBrand>
            <Link to="/" className="navbar-brand">
              <img src="/assets/jobz_logo_250x55.png" style={{ height: '32px' }} />
            </Link>
          </NavBrand>
          <CollapsibleNav eventKey={0}>
            <Nav navbar pullRight>
              {menu.map((item, i) => (<li eventKey={i+1} key={i}>{item}</li>))}
            </Nav>
          </CollapsibleNav>
        </Navbar>
        <div id="main">
          {this.props.children}
        </div>
      </div>
    );
  }
}
