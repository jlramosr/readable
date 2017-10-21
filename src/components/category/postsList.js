import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderLayout from '../headerLayout';
import ArrowBack from 'material-ui-icons/ArrowBack';
import Check from 'material-ui-icons/Check';

class PostsList extends Component {

  _createItem = _ => {
    console.log("CREAR ITEM");
  }

  render = _ => {
    return (
      <HeaderLayout
        title={`Lista`} 
        operations={[
          {id:'arrowBack', icon:ArrowBack, to:'/' },
          {id:'check', icon:Check, right: true, onClick:this._createItem}
        ]}
      >
        holaaa listaaaaaaaaaaaaaa
      </HeaderLayout>
    );
  }
}

PostsList.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  itemLabel: PropTypes.string,
}

export default PostsList;
