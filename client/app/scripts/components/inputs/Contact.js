import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';
import { Row, Icon, Input } from 'formsy-react-components';

import userStore from '../../stores/UserStore';

const ItemTypes = { CONTACT: 'contact' };

var contactSource = {
  beginDrag(props) {
    return props.contact;
  }
};

var contactTarget = {
  hover(props, monitor) {
    var draggedId = monitor.getItem().name;
    if (draggedId !== props.contact.name) {
      props.onDrag(props.contact);
    }
  }
};

function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

function dropCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

let Company = React.createClass({

  propTypes: {
    onDelete: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    contact: React.PropTypes.object.isRequired,
    onDrag: React.PropTypes.func.isRequired
  },

  handleChange: function (property, event) {
    let {contact} = this.props;
    contact[property] = event.target.value;
    this.props.onChange();
  },

  render: function(){
    let { connectDragSource, connectDropTarget, contact } = this.props;
    return connectDragSource(connectDropTarget(
      <div className="Contacts__input">
        <input type="hidden" name="_id" value={contact._id} />

        <i className="fa fa-ellipsis-v"></i>
        <div className="container">

          <div className="row form-group">
            <label className="control-label col-sm-3">First name</label>
            <div className="col-sm-8">
              <input className="form-control" name="firstName" type="text" value={contact.firstName}
                     onChange={this.handleChange.bind(null, 'firstName')} />
            </div>
          </div>

          <div className="row form-group">
            <label className="control-label col-sm-3">Last name</label>
            <div className="col-sm-8">
              <input className="form-control" name="lastName" type="text" value={contact.lastName}
                     onChange={this.handleChange.bind(null, 'lastName')} />
            </div>
          </div>

          <div className="row form-group">
            <label className="control-label col-sm-3">Email address</label>
            <div className="col-sm-8">
              <input className="form-control" name="name" type="email" value={contact.emailAddress}
                     onChange={this.handleChange.bind(null, 'emailAddress')} />
            </div>
          </div>

          <div className="row form-group">
            <div className="col-sm-offset-3 col-sm-9">
              <a className="btn btn-danger" onClick={this.props.onDelete}>Delete</a>
            </div>
          </div>
        </div>
      </div>
    ));
  }
});

module.exports = _.flow(
  DragSource(ItemTypes.CONTACT, contactSource, dragCollect),
  DropTarget(ItemTypes.CONTACT, contactTarget, dropCollect)
)(Company);
