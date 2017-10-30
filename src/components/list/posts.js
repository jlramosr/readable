import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeaderLayout from '../headerLayout'
import { withStyles } from 'material-ui/styles'
import ListSubheader from 'material-ui/List/ListSubheader'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Badge from 'material-ui/Badge'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ThumbUp from 'material-ui-icons/ThumbUp'
import ThumbDown from 'material-ui-icons/ThumbDown'
import Stars from 'material-ui-icons/Stars'
import Comment from 'material-ui-icons/Comment'
import PostNew from '../category/postNew'
import SortByAlpha from 'material-ui-icons/SortByAlpha'
import DateRange from 'material-ui-icons/DateRange'
import Favorite from 'material-ui-icons/Favorite'
import Add from 'material-ui-icons/Add'
import Tooltip from 'material-ui/Tooltip'
import Slide from 'material-ui/transitions/Slide'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import removeDiacritics from 'remove-diacritics'
import { requestIncrementVoteScore, requestDecrementVoteScore } from '../../actions/posts'
import { timestampToHuman, capitalize } from '../../utils/helpers'

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
  },
  iconButton: {
    width: 24,
  },
  badge: {
    width: 18,
    height: 18,
    fontSize: 11,
    right: -2,
    top: 16
  }
})

class CustomPostsList extends Component {
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

  _orderPosts = (posts, orderBy, orderDesc) =>
    posts.sort(sortBy(`${orderDesc ? '' : '-'}${orderBy}`))

  _thumbClicked = (event, which, post) => {
    event.preventDefault()
    which === 'up' ?
      this.props.requestIncrementVoteScore(post.category, post.id) :
      this.props.requestDecrementVoteScore(post.category, post.id)
  }

  updateSearchQuery = (searchQuery, posts = null) => {
    const _posts = posts || this.props.posts
    let activePosts = _posts
    if (searchQuery) {
      const cleanQuery = removeDiacritics(searchQuery.trim())
      const match = new RegExp(escapeRegExp(cleanQuery), 'i')
      activePosts = _posts.filter(post => (
        match.test(removeDiacritics(post.title))
      ))
    }
    this.setState({ activePosts, searchQuery })
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

  componentWillReceiveProps = props =>
    this.updateSearchQuery(this.state.searchQuery, props.posts)

  render = _ => {
    const { activePosts, showNewDialog, orderBy, orderDesc } = this.state
    const {
      title,
      loading,
      aditionalOperations,
      category,
      posts,
      postsReceived,
      isUpdatingPosts,
      classes 
    } = this.props

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
        loading={loading || isUpdatingPosts}
        operations={[
          { 
            id:'sortByAlpha', icon:SortByAlpha, right:true, hidden: !posts.length,
            description:'Order By Title', onClick: _ => this._updateOrder('title'),
            color: this._getIconOrderColor('title', orderBy, orderDesc)
          },
          {
            id:'dateRange', icon:DateRange, right:true, hidden: !posts.length,
            description:'Order By Date', onClick: _ => this._updateOrder('timestamp'),
            color: this._getIconOrderColor('timestamp', orderBy, orderDesc)
          },
          {
            id:'favorite', icon:Favorite, right:true, hidden: !posts.length,
            description:'Order By Votes', onClick: _ => this._updateOrder('voteScore'),
            color: this._getIconOrderColor('voteScore', orderBy, orderDesc)
          },
          { 
            id:'add', icon:Add, right:true, hidden: !posts.length,
            description:`New${category ? ` ${capitalize(category)} `: ' '}Post`, onClick:this._openNewDialog,
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
                <div key={post.id}>
                  <Link key={post.id} to={`/${post.category}/${post.id}`}>
                    <ListItem button> 
                      <Tooltip
                        title="Votes"
                        placement="left"
                        disableTriggerTouch
                        enterDelay={200}
                        leaveDelay={0}
                      >
                        <IconButton tabIndex="-1" aria-label="Votes" disableRipple className={classes.iconButton}>
                          <Badge badgeContent={post.voteScore} classes={{badge:classes.badge}} color="accent">
                            <Stars />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title="Comments"
                        placement="left"
                        disableTriggerTouch
                        enterDelay={200}
                        leaveDelay={0}
                      >
                        <IconButton tabIndex="-1" aria-label="Comments" disableRipple className={classes.iconButton}>
                          <Badge badgeContent={post.commentCount} classes={{badge:classes.badge}} color="accent">
                            <Comment />
                          </Badge>
                        </IconButton>
                      </Tooltip>
                      <ListItemText
                        primary={post.title}
                        secondary={`${timestampToHuman(post.timestamp)}, by ${post.author}`}
                      />

                      <ListItemSecondaryAction>
                        <IconButton tabIndex="-1" aria-label=":)" onClick={event => this._thumbClicked(event,'up',post)}>
                          <ThumbUp />
                        </IconButton>
                        <IconButton tabIndex="-1" aria-label=":(" onClick={event => this._thumbClicked(event,'down',post)}>
                          <ThumbDown />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Link>
                  <Divider tabIndex="-1"/>
                </div>
              ))}
            </List> 
          ) : (
            <div style={{padding: 20}}>
              There is no posts yet. Create the firt one <span className={classes.noPostsText} onClick={this._openNewDialog}>here</span>
            </div>
          )
        )}

        <Dialog
          fullScreen
          open={showNewDialog}
          onRequestClose={this._newDialogClosed}
          transition={<Slide direction="up" />}
        >
          <PostNew closeDialog={this.closeNewDialog} categoryName={category} />
        </Dialog>

      </HeaderLayout>
    )
  }
}

CustomPostsList.propTypes = {
  title: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  postsReceived: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  aditionalOperations: PropTypes.array,
  category: PropTypes.string,
  classes: PropTypes.object.isRequired
}

CustomPostsList.defaultProps = {
  aditionalOperations: [],
  loading: false,
  title: '',
}

const mapStateToProps = ({ posts }) => ({
  isUpdatingPosts: posts.isUpdating
})

const mapDispatchToProps = dispatch => ({
  requestIncrementVoteScore: (categoryName, postId) => 
    dispatch(requestIncrementVoteScore(categoryName, postId)),
  requestDecrementVoteScore: (categoryName, postId) => 
    dispatch(requestDecrementVoteScore(categoryName, postId))   
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomPostsList))