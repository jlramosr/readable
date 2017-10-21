import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from '../../utils/api';
import HeaderLayout from '../headerLayout';
import ArrowBack from 'material-ui-icons/ArrowBack';
import Close from 'material-ui-icons/Close';
import Check from 'material-ui-icons/Check';
import Edit from 'material-ui-icons/Edit';
import Delete from 'material-ui-icons/Delete';

class CategoryItemOverview extends Component {
  state = {
    item: {},
    editMode: false,
    loading: true,
  }

  _updateItem = _ => {
    console.log("UPDATE ITEM", this.state.item);
    this._changeEditMode(false);
  }

  _deleteItem = _ => {
    console.log("DELETE ITEM", this.state.item);
    /*TODO:
      return to list
    */
  }

  _changeEditMode = editMode => {
    console.log("EDIT MODE", editMode);
    this.setState({editMode});
  }

  _getData = _ => {
    const { id, categoryId } = this.props;
    API('local').getDocument('categories_items', categoryId, id).then(item => {
      this.setState({item, loading: false});
    })
    .catch(error => {
      console.log("ERROR PIDIENDO ITEM OVERVIEW", error);
    })
  }

  componentDidMount = _ => {
    //this._getData();
  }

  render = _ => {
    const { categoryId, settings, fields, dialog, closeDialog } = this.props;
    const { item, editMode, loading } = this.state;
    return (
      <HeaderLayout
        title={item}
        loading={loading}
        operations={[
          {id:'arrowBack', icon:ArrowBack, hidden:dialog, to:`/${categoryId}`},
          {id:'close', icon:Close, hidden:!dialog, onClick:closeDialog},
          {id:'check', icon:Check, right: true, hidden:!editMode, onClick:this._updateItem},
          {id:'edit', icon:Edit, right: true, hidden:editMode, onClick: _ => this._changeEditMode(true)},
          {id:'delete', icon:Delete, right: true, hidden:editMode, onClick:this._deleteItem},
        ]}
      >
        hola
      </HeaderLayout>
    );
  }
}

CategoryItemOverview.propTypes = {

}

CategoryItemOverview.defaultProps = {
  dialog: false,
}

export default CategoryItemOverview;
