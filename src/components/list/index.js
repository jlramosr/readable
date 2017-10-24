import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import { withStyles } from 'material-ui/styles'
import ListSubheader from 'material-ui/List/ListSubheader'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Badge from 'material-ui/Badge'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import Stars from 'material-ui-icons/Stars'
import PostNew from '../category/postNew'
import SortByAlpha from 'material-ui-icons/SortByAlpha'
import DateRange from 'material-ui-icons/DateRange'
import Favorite from 'material-ui-icons/Favorite'
import Add from 'material-ui-icons/Add'
import escapeRegExp from 'escape-string-regexp'
import removeDiacritics from 'remove-diacritics'

const styles = theme => ({
  root: {
    background: theme.palette.background.paper
  },
  subheader: {
    textTransform: 'capitalize',
    color: 'red'
  },
  noPostsText: {
    color:'teal',
    cursor:'pointer',
    textDecoration: 'underline'
  }
})

class CustomList extends Component {
  state = {
    activePosts: null,
    searchQuery: '',
    showNewDialog: false,
    orderBy: 'voteScore',
    orderDesc: false
  }

  _openNewDialog = _ => this.setState({ showNewDialog: true})
  
  _newDialogClosed = _ => this.closeNewDialog()
  
  closeNewDialog = _ => this.setState({ showNewDialog: false})

  _orderPosts = (posts, orderBy, orderDesc) => {
    
    return posts.sort((a,b) => orderDesc ? (b[orderBy] <= a[orderBy]) : (b[orderBy] > a[orderBy]))
  }

  updateSearchQuery = searchQuery => {
    const { posts } = this.props
    let activePosts = posts
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      activePosts = posts.filter(post => (
        match.test(removeDiacritics(post.title))
      ))
    }
    this.setState({ activePosts })
  }

  _updateOrder = orderBy => {
    this.setState(prevState => {
      const orderDesc = (orderBy === prevState.orderBy) ? !prevState.orderDesc : false
      return { ...prevState, orderDesc, orderBy }
    })
  }

  _getIconOrderColor = (currentIcon, orderBy, orderDesc) =>
    currentIcon === orderBy ?
      (orderDesc ? "default" : "accent") :
      "contrast"

  componentWillReceiveProps = props => {
    this.setState({activePosts: props.posts})
  }

  render = _ => {
    const { activePosts, showNewDialog, orderBy, orderDesc } = this.state
    const { title, loading, aditionalOperations, category, posts, postsReceived, classes } = this.props

    let subHeader = 'Posts'
    let _orderDesc = orderDesc
    if (orderBy === 'timestamp') {
      subHeader = orderDesc ? 'Old Posts' : 'Recent Posts'
    } else if (orderBy === 'voteScore') {
      subHeader = orderDesc ? 'Disliked Posts' : 'Favorite Posts'
    } else if (orderBy === 'title') {
      _orderDesc = !_orderDesc
    }

    const showingPosts = this._orderPosts(activePosts ? activePosts : posts, orderBy, _orderDesc)

    return (
      <HeaderLayout
        title={title}
        updateSearchQuery={posts.length ? this.updateSearchQuery : null}
        loading={loading}
        operations={[
          { 
            id:'sortByAlpha', icon:SortByAlpha, right:true, hidden: !posts.length,
            description:'Order By Title', onClick: _ => this._updateOrder('title'),
            color: this._getIconOrderColor('title', orderBy, orderDesc)
          },
          {
            id:'dateRange', icon:DateRange, right:true, hidden: !posts.length,
            description:'More recents', onClick: _ => this._updateOrder('timestamp'),
            color: this._getIconOrderColor('timestamp', orderBy, orderDesc)
          },
          {
            id:'favorite', icon:Favorite, right:true, hidden: !posts.length,
            description:'Favorites', onClick: _ => this._updateOrder('voteScore'),
            color: this._getIconOrderColor('voteScore', orderBy, orderDesc)
          },
          { 
            id:'add', icon:Add, right:true, hidden: !posts.length,
            description:'New Post', onClick:this._openNewDialog,
          },
          ...aditionalOperations
        ]}
      >
        {postsReceived && (
          posts.length ? (
            <List
              classes={{
                root: classes.root,
                subheader: classes.subheader
              }}
              subheader={<ListSubheader>{subHeader}</ListSubheader>}
            >
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
                          <Badge badgeContent={post.voteScore} color="accent">
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
          ) : (
            <div style={{padding: 20}}>
              There is no posts yet. Create the firts one <span className={classes.noPostsText} onClick={this._openNewDialog}>here</span>
            </div>
          )
        )}

        <Dialog open={showNewDialog} onRequestClose={this._newDialogClosed}>
          <PostNew closeDialog={this.closeNewDialog} categoryName={category} />
        </Dialog>

      </HeaderLayout>
    )
  }
}

CustomList.propTypes = {
  title: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  postsReceived: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  aditionalOperations: PropTypes.array,
  category: PropTypes.string,
  classes: PropTypes.object.isRequired
}

CustomList.defaultProps = {
  aditionalOperations: [],
  loading: false,
  title: '',
}

export default withStyles(styles)(CustomList)