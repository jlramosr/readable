import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import HeaderLayout from '../headerLayout';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { LinearProgress } from 'material-ui/Progress';
import Avatar from 'material-ui/Avatar';
import Add from 'material-ui-icons/Add';
import ViewList from 'material-ui-icons/ViewList';
import ViewAgenda from 'material-ui-icons/ViewAgenda';
import ArrowBack from 'material-ui-icons/ArrowBack';
import MoreVert from 'material-ui-icons/MoreVert';
import Dialog from 'material-ui/Dialog';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import escapeRegExp from 'escape-string-regexp';
import removeDiacritics from 'remove-diacritics';
import PostDetail from './postDetail';
import PostNew from './postNew';
import { withStyles } from 'material-ui/styles';

const containerStyles = theme => ({
})

class CategoryListContainer extends Component {
  state = {
    showingItems: [],
    showMenuItem: false,
    itemMenuClicked: null,
    anchorEl: null,
    currentPage: 0,
    pageSize: 10,
    allowedPageSizes: [10,20,50,200,500,0],
    columnOrder: null,
    columnWidths: null,
  }

  _updateSearchQuery = searchQuery => {
    const { settings, items } = this.props;
    let showingItems = items;
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim());
      const match = new RegExp(escapeRegExp(cleanQuery), 'i');
      showingItems = items.filter(item => (
        match.test(removeDiacritics(item))
      ))
    }
    this.setState({ showingItems })
  };

  _changeCurrentPage = currentPage => this.setState({ currentPage });
  
  _changePageSize = pageSize => this.setState({ pageSize });

  _changeColumnOrder = columnOrder => this.setState({ columnOrder });

  _changeColumnWidths = columnWidths => this.setState({ columnWidths });

  _itemClick(event, relationMode, id) {
    if (relationMode) {
      event.preventDefault();
      this.props.openOverviewDialog(id);
    }
  }

  _tableRowClick = (event, id) => {
    /*const { category, history } = this.props;
    history.push(`${categoryId}/${id}`)*/
  }

  _tableRowKeyDown = (event, id) => {
    /*if (keycode(event) === 'space') {
      console.log("HOLA");
      this._tableRowClick(event, id);
    }*/
  }

  _handleMenuItemClick = (event, itemId) => {
    event.preventDefault();
    this.setState({ showMenuItem: true, anchorEl: event.currentTarget, itemMenuClicked: itemId });
  };

  _handleMenuItemClose = () => {
    this.setState({ showMenuItem: false, itemMenuClicked: null });
  };

  componentWillReceiveProps = props => {
    if (this.props.searchQuery !== props.searchQuery) {
      this._updateSearchQuery(props.searchQuery);
    } else {
      this.setState({showingItems: props.items});
    }
  }

  render = _ => {
    const { classes, categoryId, tableMode, settings, fields, showAvatar, dense, relationMode } = this.props;
    const { showingItems, currentPage, pageSize, allowedPageSizes, columnOrder, columnWidths } = this.state;
    
    const defaultOrder = fields.map(field => field.id);
    const defaultColumnWidths = fields.reduce(
      (accumulator, currentField) => (
        {...accumulator, [currentField.id]: 100 * (currentField.views.list.ys || 1)}),
      {}
    );

    return (
      <div>
        <List dense={dense}>
        {showingItems.map(item =>
          <div key={item.id}>
            <Link
              key={item.id}
              tabIndex={-1}
              to={`/${categoryId}/${item.id}`}
              onClick={ event => this._itemClick(event, relationMode, item.id)}
            >
              <ListItem button>
                {showAvatar &&
                  <Avatar>
                    <Icon>{settings.icon && React.createElement(settings.icon)}</Icon>
                  </Avatar>
                }
                <ListItemText
                  primary={item}
                  secondary={item}
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Item Menu">
                    <MoreVert
                      onClick={ event => this._handleMenuItemClick(event, item.id)}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem> 
            </Link>
            <Divider/>
          </div>
        )}
        </List>
        <Menu
          elevation={4}
          transformOrigin={{ vertical: 'top', horizontal: 'left',}}
          anchorEl={this.state.anchorEl}
          open={this.state.showMenuItem}
          onRequestClose={this._handleMenuItemClose}
          className={classes.menu}
        >
          <MenuItem onClick={this._handleMenuItemClose}>
            View
          </MenuItem>
          <MenuItem onClick={this._handleMenuItemClose}>
            Edit
          </MenuItem>
          <MenuItem onClick={this._handleMenuItemClose}>
            Delete
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

CategoryListContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  dense: PropTypes.bool,
  items: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  showAvatar: PropTypes.bool,
  relationMode: PropTypes.bool,
  openOverviewDialog: PropTypes.func,
}

CategoryListContainer.defaultProps = {
  showAvatar: true,
  dense: false,
  relationMode: false,
}

CategoryListContainer = withStyles(containerStyles)(CategoryListContainer);

class CategoryList extends Component {
  state = {
    searchQuery: '',
    showNewDialog: false,
    showOverviewDialog: false,
    dialogItemId: '',
    tableMode: true,
  }

  _updateSearchQuery = searchQuery => this.setState({searchQuery});

  _changeView = view => this.setState({tableMode: view === 'list'});

  _openNewDialog = _ => this.setState({ showNewDialog: true});

  _newDialogClosed = _ => this.closeNewDialog();

  closeNewDialog = _ => this.setState({ showNewDialog: false});

  openOverviewDialog = itemId => this.setState({ showOverviewDialog: true, dialogItemId: itemId});
  
  overviewDialogClosed = _ => this.closeOverviewDialog();
  
  closeOverviewDialog = _ => this.setState({ showOverviewDialog: false});

  render = _ => {
    const { categoryId, categoryLabel, settings, items, fields, operations, relationMode, showAvatar, loading } = this.props;
    const { searchQuery, showNewDialog, showOverviewDialog, dialogItemId, tableMode } = this.state;

    return (
      <HeaderLayout
        miniToolbar={relationMode}
        relative={relationMode}
        relativeHeight={relationMode ? 200 : null}
        title={categoryLabel}
        updateSearchQuery={!tableMode && this._updateSearchQuery}
        loading={loading}
        operations={operations || [
          { 
            id:'arrowBack',
            icon:ArrowBack,
            hidden:relationMode,
            to:'/',
          },
          {
            id:'viewAgenda',
            icon:ViewAgenda,
            description:'Vista agenda',
            hidden:!tableMode,
            right: true,
            onClick: _ => this._changeView('agenda'),
          },
          {
            id:'viewList',
            icon:ViewList,
            description:'Vista tabla',
            hidden:tableMode,
            right: true,
            onClick: _ => this._changeView('list'),
          },
          {
            id:'addItem',
            icon:Add,
            description:`Nuevo ${settings.itemLabel || 'Item'}`,
            right: true, onClick: this._openNewDialog
          },
        ]}
      >
        {React.createElement(CategoryListContainer, {
          dense: relationMode,
          openOverviewDialog: relationMode ? this.openOverviewDialog : null,
          relationMode, categoryId, settings, items, fields, tableMode, showAvatar, searchQuery
        })}

        <Dialog fullScreen open={showNewDialog} onRequestClose={this._newDialogClosed}>
          <PostNew closeDialog={this.closeNewDialog} itemLabel={settings.itemLabel} />
        </Dialog>

        <Dialog fullWidth maxWidth="md" open={showOverviewDialog} onRequestClose={this.overviewDialogClosed}>
          <PostDetail
            dialog
            closeDialog={this.closeOverviewDialog}
            id={dialogItemId}
            categoryId={categoryId}
            settings={settings}
            fields={fields}
          />
        </Dialog>
      </HeaderLayout>
    )
  }
}

CategoryList.propTypes = {
  categoryId: PropTypes.string.isRequired,
  categoryLabel: PropTypes.string.isRequired,
  settings: PropTypes.object,
  fields: PropTypes.array,
  items: PropTypes.array,
  operations: PropTypes.array,
  relationMode: PropTypes.bool.isRequired,
  showAvatar: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired
}

CategoryList.defaultProps = {
  relationMode: false,
  showAvatar: true,
  loading: true
}

export default CategoryList
