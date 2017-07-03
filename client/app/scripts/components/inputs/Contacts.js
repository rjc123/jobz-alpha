// Copyright (c) 2015 Caution Your Blast Ltd.  All rights reserved.

import React from 'react';
import { Mixin } from 'formsy-react';
import { Row, Icon, ComponentMixin } from 'formsy-react-components';

import { DragDropContext }  from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Contact from './Contact';

export default DragDropContext(HTML5Backend)(React.createClass({

  mixins: [Mixin, ComponentMixin],

  getDefaultProps: function () {
    return {
      value: []
    };
  },

  handleDelete: function (i) {
    let contacts = this.getValue();
    contacts.splice(i, 1);
    this.changeValue(contacts);
  },

  handleAddition: function () {
    let contacts = this.getValue();
    contacts.push({});
    this.changeValue(contacts);
  },

  handleDrag: function (contact, currPos, newPos) {
    let contacts = this.getValue();
    contacts.splice(currPos, 1);
    contacts.splice(newPos, 0, contact);
    this.changeValue(contacts);
  },

  handleChange: function () {
    this.changeValue(this.getValue());
  },

  changeValue: function (value) {
    this.setValue(value);
    this.props.onChange(this.props.name, value);
  },

  render: function () {
    let element = this.renderElement();

    if (this.getLayout() === 'elementOnly') {
      return element;
    }

    let warningIcon = '';
    if (this.showErrors()) {
      warningIcon = (
        <Icon symbol="remove" className="form-control-feedback"/>
      );
    }

    return (
      <Row
        label={this.props.label}
        rowClassName={this.props.rowClassName}
        labelClassName={this.props.labelClassName}
        elementWrapperClassName={this.props.elementWrapperClassName}
        required={this.isRequired()}
        hasErrors={this.showErrors()}
        layout={this.getLayout()}
        htmlFor={this.getId()}
        >
        {element}
        {warningIcon}
        {this.renderHelp()}
        {this.renderErrorMessage()}
      </Row>
    );
  },

  renderElement: function () {
    let contacts = this.getValue();
    if (!contacts.length) {
      contacts.push({});
    }
    return (
      <div className="Contacts">
        <div className="Contacts__inputs">
          {contacts.map((contact, i) => (
            <Contact key={i} contact={contact}
              onDelete={this.handleDelete.bind(this, i)} onDrag={this.handleDrag}
              onChange={this.handleChange} />
          ))}
        </div>
        <a className="Contacts__add" onClick={this.handleAddition}>Add</a>
      </div>
    );
  }
}));
