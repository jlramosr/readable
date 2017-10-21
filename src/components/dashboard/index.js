import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchPosts } from '../../actions/posts'
import { toggleDrawer } from '../../actions/drawer'
import HeaderLayout from '../headerLayout'
import PostNew from '../category/postNew'
import ListSubheader from 'material-ui/List/ListSubheader'
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Badge from 'material-ui/Badge'
import Dialog from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Add from 'material-ui-icons/Add'
import SortByAlpha from 'material-ui-icons/SortByAlpha'
import DateRange from 'material-ui-icons/DateRange'
import Favorite from 'material-ui-icons/Favorite'
import Stars from 'material-ui-icons/Stars'
import escapeRegExp from 'escape-string-regexp'
import removeDiacritics from 'remove-diacritics'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  list: {
    background: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
})

class Dashboard extends Component {
  state = {
    showingPosts: [],
    searchQuery: '',
    showNewDialog: false,
    orderBy: 'voteScore',
    orderDesc: false
  }

  _orderPosts = (posts, orderBy, orderDesc) =>
    posts.sort((a,b) => orderDesc ? (b[orderBy] <= a[orderBy]) : (b[orderBy] > a[orderBy]))

  updateSearchQuery = searchQuery => {
    const { orderBy, orderDesc } = this.state
    const { posts } = this.props
    let showingPosts = posts
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      showingPosts = posts.filter(post => (
        match.test(removeDiacritics(post.title))
      ))
    }
    this.setState({ showingPosts: this._orderPosts(showingPosts, orderBy, orderDesc) })
  }

  _updateOrder = orderBy => {
    this.setState(prevState => {
      const orderDesc = (orderBy === prevState.orderBy) ? !prevState.orderDesc : false
      return {
        ...prevState,
        orderDesc,
        orderBy,
        showingPosts: this._orderPosts(prevState.showingPosts, orderBy, orderDesc)
      }
    })
  }

  _openNewDialog = _ => this.setState({ showNewDialog: true})

  _newDialogClosed = _ => this.closeNewDialog()

  closeNewDialog = _ => this.setState({ showNewDialog: false})

  _getIconOrderColor = (currentIcon, orderBy, orderDesc) =>
    currentIcon === orderBy ?
      (orderDesc ? "default" : "accent") :
      "contrast"

  componentWillReceiveProps = props => {
    const { orderBy, orderDesc } = this.state
    this.setState({showingPosts: this._orderPosts(props.posts, orderBy, orderDesc)})
  }

  componentDidMount = _ => this.props.fetchPosts()

  render = _ => {
    const { showingPosts, showNewDialog, orderBy, orderDesc } = this.state
    const { isFetchingCategories, isFetchingPosts, drawerOpened, toggleDrawer, classes } = this.props

    let subHeader = 'Posts'
    if (orderBy === 'timestamp') {
      subHeader = orderDesc ? 'Old Posts' : 'Recent Posts'
    } else if (orderBy === 'voteScore') {
      subHeader = orderDesc ? 'Disliked Posts' : 'Favorite Posts'
    }

    return (
      <HeaderLayout
        title="Readable"
        updateSearchQuery={this.updateSearchQuery}
        loading={isFetchingCategories || isFetchingPosts}
        operations={[
          {
            id:'menu', icon:MenuIcon, onClick: _ => toggleDrawer(!drawerOpened)
          },
          { 
            id:'sortByAlpha', icon:SortByAlpha, right:true,
            description:'Order By Title', onClick: _ => this._updateOrder('title'),
            color: this._getIconOrderColor('title', orderBy, orderDesc)
          },
          {
            id:'dateRange', icon:DateRange, right:true, 
            description:'More recents', onClick: _ => this._updateOrder('timestamp'),
            color: this._getIconOrderColor('timestamp', orderBy, orderDesc)
          },
          {
            id:'favorite', icon:Favorite, right:true,
            description:'Favorites', onClick: _ => this._updateOrder('voteScore'),
            color: this._getIconOrderColor('voteScore', orderBy, orderDesc)
          },
          { 
            id:'add', icon:Add, right:true, description:'New Post', onClick:this._openNewDialog,
          }
        ]}
      >

        <List className={classes.list} subheader={<ListSubheader>{subHeader}</ListSubheader>}>
          {showingPosts.map(post => (
            <div key={post.title}>
              <Link key={post.id} to={`/${post.category}/${post.id}`}>
                <ListItem button> 
                  <ListItemText
                    primary={post.title}
                    secondary={`${new Date(post.timestamp).toLocaleString('en-US')}, by ${post.author}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Votes">
                      <Badge
                        className={classes.badge}
                        badgeContent={post.voteScore}
                        color={orderDesc && orderBy === 'voteScore' ? "primary" : "accent"}
                      >
                        <Stars />
                      </Badge>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Link>
              <Divider />
            </div>
          ))}
        </List>

        <Dialog fullScreen open={showNewDialog} onRequestClose={this._newDialogClosed}>
          <PostNew closeDialog={this.closeNewDialog} />
        </Dialog>

      </HeaderLayout>
    )
  }
}

Dashboard.propTypes = {
  posts: PropTypes.array.isRequired,
  isFetchingPosts: PropTypes.bool.isRequired,
  isFetchingCategories: PropTypes.bool.isRequired,
  drawerOpened: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  const { categories, posts, drawer } = state
  return {
    posts: Object.keys(posts.items).reduce((acc, categoryId) => (
      [...acc, ...posts.items[categoryId]]), []
    ),
    isFetchingPosts: posts.isFetching,
    isFetchingCategories: categories.isFetching,
    drawerOpened: drawer.opened
  }
}

const mapDispatchToProps = dispatch => ({
  toggleDrawer: opened => dispatch(toggleDrawer(opened)),
  fetchPosts: _ => dispatch(fetchPosts()),
})

export default connect(mapStateToProps,mapDispatchToProps)(
  withStyles(styles)(Dashboard)
)