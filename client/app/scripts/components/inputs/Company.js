import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';
import { Row, Icon, ComponentMixin } from 'formsy-react-components';

const ItemTypes = { CONTACT: 'company' };

var companySource = {
  beginDrag(props) {
    return props.company;
  }
};

var companyTarget = {
  hover(props, monitor) {
    var draggedId = monitor.getItem().name;
    if (draggedId !== props.company.name) {
      props.onDrag(props.company);
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
    onEdit: React.PropTypes.func.isRequired,
    company: React.PropTypes.object.isRequired,
    onDrag: React.PropTypes.func.isRequired
  },

  handleChange: function (property, event) {
    let {company} = this.props;
    company[property] = event.target.value;
  },

  render: function(){
    let { connectDragSource, isDragging, connectDropTarget, company } = this.props;
    return connectDragSource(connectDropTarget(
      <div className="Companies__input">
        <i className="fa fa-ellipsis-v"></i>
        <input onChange={this.handleChange.bind(null, 'name')} type="text"
               placeholder="Name" className="form-control"
               value={company.name} />
        <a className="Companies__delete" onClick={this.props.onDelete}>
          <Icon symbol="remove" />
        </a>
        <a className="Companies__edit" onClick={this.props.onEdit.bind(null, this.props.company)}>
          <i className="fa fa-arrow-right"></i>
        </a>
      </div>
    ));
  }
});

module.exports = _.flow(
  DragSource(ItemTypes.CONTACT, companySource, dragCollect),
  DropTarget(ItemTypes.CONTACT, companyTarget, dropCollect)
)(Company);
