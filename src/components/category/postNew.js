import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderLayout from '../headerLayout';
import Close from 'material-ui-icons/Close';
import Check from 'material-ui-icons/Check';

class PostNew extends Component {

  _createItem = _ => {
    console.log("CREAR ITEM");
    this.props.closeDialog();
  }

  render = _ => {
    const { closeDialog, category } = this.props;

    return (
      <HeaderLayout
        title={`New ${category || ''} Post`}
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, right: true, onClick:this._createItem}
        ]}
      >
        new
      </HeaderLayout>
    );
  }
}

PostNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  category: PropTypes.string
}

export default PostNew;
