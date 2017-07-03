// Copyright (c) 2015 Caution Your Blast Ltd.  All rights reserved.

import React, {Component} from 'react';

export default class extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.location = '/api/logout';
  }

  render() {
    return (<div></div>);
  }
}
