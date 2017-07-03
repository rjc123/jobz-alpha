// Copyright (c) 2015 Caution Your Blast Ltd.  All rights reserved.

import React from 'react';
import { Mixin } from 'formsy-react';
import { Row, Icon, ComponentMixin } from 'formsy-react-components';

import { DragDropContext }  from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Company from './Company';

export default DragDropContext(HTML5Backend)(React.createClass({

  mixins: [Mixin, ComponentMixin],

  getDefaultProps: function () {
    return {
      value: []
    };
  },

  handleDelete: function (i) {
    let companies = this.getValue();
    companies.splice(i, 1);
    this.changeValue(companies);
  },

  handleAddition: function () {
    let companies = this.getValue();
    companies.push({ contacts: [] });
    this.changeValue(companies);
  },

  handleDrag: function (company, currPos, newPos) {
    let companies = this.getValue();
    companies.splice(currPos, 1);
    companies.splice(newPos, 0, company);
    this.changeValue(companies);
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
    let companies = this.getValue();
    if (!companies.length) {
      companies.push({ contacts: [] });
    }
    return (
      <div className="Companies">
        <div className="Companies__inputs">
          {companies.map((company, i) => (
            <Company key={i} company={company}
              onDelete={this.handleDelete} onDrag={this.handleDrag} onEdit={this.props.onEdit.bind(null, i)} />
          ))}
        </div>
        <a className="Companies__add" onClick={this.handleAddition}>Add</a>
      </div>
    );
  }
}));
