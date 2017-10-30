import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeaderLayout from '../headerLayout'
import CommentsList from '../list/comments'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Badge from 'material-ui/Badge'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import Stars from 'material-ui-icons/Stars'
import Close from 'material-ui-icons/Close'
import ArrowBack from 'material-ui-icons/ArrowBack'
import ThumbUp from 'material-ui-icons/ThumbUp'
import ThumbDown from 'material-ui-icons/ThumbDown'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'
import {
  requestUpdatePost,
  requestDeletePost,
  requestIncrementVoteScore,
  requestDecrementVoteScore
} from '../../actions/posts'
import { fetchComments } from '../../actions/comments'
import Button from 'material-ui/Button'
import Dialog, { DialogActions, DialogContent, DialogContentText } from 'material-ui/Dialog'
import Slide from 'material-ui/transitions/Slide'
import { timestampToHuman, capitalize } from '../../utils/helpers'

const styles = theme => ({
  formContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: theme.spacing.unit*4,
    paddingRight: theme.spacing.unit*4,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  viewContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing.unit*4,
    paddingRight: theme.spacing.unit*4,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  viewHeader: {
    marginBottom: theme.spacing.unit*2,
    padding: theme.spacing.unit,
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10
  },
  viewBody: {
    order: 2,
    padding: theme.spacing.unit,
    display: 'flex',
    flex: '1 1 auto'
  },
  viewComments: {
    order: 3,
    marginTop: theme.spacing.unit*3
  },
  viewInfo: {
    color: theme.palette.secondary[700],
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    marginRight: theme.spacing.unit
  },
  iconButton: {
    cursor: 'initial',
    width: theme.spacing.unit,
    alignSelf: 'center',
    marginRight: theme.spacing.unit*3,
    top: theme.spacing.unit/2
  },
  viewAuthor: {
    alignSelf: 'center',
    flex: '1 1 auto'
  },
  viewDate: {
    color: theme.palette.secondary[700],
    flex: '0 1 auto',
    alignSelf: 'center'
  }
})

const requiredFields = [
  'title',
  'body'
]

class PostDetail extends Component {
  state = {
    editMode: false,
    submitting: false,
    showDeleteDialog: false,
    values: {}
  }

  _handleChange = (name, value) =>
    this.setState(prevState => ({
    ...prevState,
    values: {
      ...prevState.values,
      [name]: value
    }
  }))

  _submit = _ => {
    this.setState({submitting: true})
    if (requiredFields.reduce((acc,field) => acc && this.state.values[field], true)) {
      this._updatePost()
    }
  }

  _updatePost = _ => {
    const { title, body } = this.state.values
    this.props.requestUpdatePost({title, body}).then( _ =>
      this.setState({submitting: false, editMode: false, values: {...this.props.post}})
    )
  }

  _openDeleteDialog = () => {
    this.setState({showDeleteDialog: true})
  }

  _closeDeleteDialog = () => {
    this.setState({showDeleteDialog: false})
  }

  _deletePost = _ =>
    this.props.requestDeletePost().then( _ =>
      this.props.history.push(`/${this.props.categoryName}`)
    )

  _changeEditMode = editMode => {
    this.setState({editMode})
  }

  componentWillReceiveProps = props => {
    this.setState({values: {...props.post}})
  }

  componentDidMount = _ => this.props.fetchComments()

  render = _ => {
    const {
      categoryName,
      post,
      comments,
      commentsReceived,
      isFetchingPosts,
      isFetchingComments,
      isUpdatingPosts,
      requestIncrementVoteScore,
      requestDecrementVoteScore,
      match,
      classes
    } = this.props
    const { editMode, submitting, values } = this.state

    return (
      <HeaderLayout
        title={post.title}
        loading={isFetchingPosts || isUpdatingPosts}
        operations={[
          {
            id:'arrowBack', icon:ArrowBack, hidden:editMode, to:`/${categoryName}`
          },
          {
            id:'close', icon:Close, hidden:!editMode, onClick: _ => this._changeEditMode(false)
          },
          {
            id:'check', icon:Check, description: 'Save', hidden:!editMode, 
            right:true, onClick:this._submit
          },
          {
            id:'thumbUp', icon:ThumbUp, description:'I like this post!', hidden:editMode, 
            right:true, onClick:requestIncrementVoteScore
          },
          {
            id:'thumbDown', icon:ThumbDown, description:'I don\'t like this post', 
            hidden:editMode, right:true, onClick:requestDecrementVoteScore
          },
          {
            id:'edit', icon:Edit, description:'Edit Post', hidden:editMode,
            right:true, onClick: _ => this._changeEditMode(true)
          },
          {
            id:'delete', icon:Delete, description:'Delete Post',hidden:editMode,
            right:true, onClick:this._openDeleteDialog
          },
        ]}
      >
      {editMode ? (
        <form className={classes.formContainer}>
          <TextField
            fullWidth
            required={requiredFields.includes('title')}
            error={submitting && !values.title}
            id="title"
            label="Title"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.title}
            onChange={event => this._handleChange('title', event.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            required={requiredFields.includes('body')}
            error={submitting && !values.body}
            id="body"
            label="Body"
            InputLabelProps={{shrink: true}}
            multiline
            rows="14"
            rowsMax="14"
            value={values.body}
            onChange={event => this._handleChange('body', event.target.value)}
            className={classes.textField}
            margin="dense"
          />
        </form>
      ) : (
        <div className={classes.viewContainer}>

          <div className={classes.viewHeader}>
            <div className={classes.viewInfo}>
              <IconButton tabIndex="-1" aria-label="Comments" disableRipple className={classes.iconButton}>
                <Badge badgeContent={post.voteScore || 0} color="accent">
                  <Stars />
                </Badge>
              </IconButton>
              <div className={classes.viewAuthor}>{`by ${post.author}, in ${capitalize(post.category)} Category`}</div>
            </div>
            <div className={classes.viewDate}>{timestampToHuman(post.timestamp)}</div>
          </div>

          <div className={classes.viewBody}>
            {post.body}
          </div>

          <Paper className={classes.viewComments}>
            <CommentsList
              comments={comments}
              commentsReceived={commentsReceived}
              loading={isFetchingComments}
              title="Comments"
              postId={match.params.postId}
              categoryName={categoryName}
            />
          </Paper>
        </div>
      )}

      <Dialog
        open={this.state.showDeleteDialog}
        transition={<Slide direction="up" />}
        onRequestClose={this._closeDeleteDialog}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this._closeDeleteDialog} color="primary">
            No
          </Button>
          <Button onClick={ _ => {
              this._closeDeleteDialog()
              this._deletePost()
            }}
            color="accent"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>


      </HeaderLayout>
    )
  }
}

PostDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string.isRequired
    })
  }),
  post: PropTypes.object.isRequired,
  categoryName: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  comments: PropTypes.array.isRequired,
  commentsReceived: PropTypes.bool.isRequired,
  isFetchingPosts: PropTypes.bool.isRequired,
  isFetchingComments: PropTypes.bool.isRequired,
  isUpdatingPosts: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired
}

const _getComments = comments =>
  Object.keys(comments || {}).reduce( (accComments, commentId) => 
    [...accComments, {id:commentId, ...comments[commentId]}], [])

const mapStateToProps = ({ posts, categories, comments }, ownProps) => {
  const { categoryName, match } = ownProps
  const postId = match.params.postId
  const categoryPosts = posts.items[categoryName] || {}
  return {
    post: categoryPosts[postId] || {},
    categories: categories.items.map(category => category.name),
    comments: _getComments(comments.items[postId]).filter(comment => !comment.deleted),
    commentsReceived: comments.received,
    isFetchingPosts: posts.isFetching,
    isFetchingComments: comments.isFetching,
    isUpdatingPosts: posts.isUpdating
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { categoryName, match } = ownProps
  const postId = match.params.postId
  return {
    fetchComments: _ =>
      dispatch(fetchComments(postId)),
    requestDeletePost: _ =>
      dispatch(requestDeletePost(categoryName, postId)),
    requestUpdatePost: values =>
      dispatch(requestUpdatePost(categoryName, postId, values)),
    requestIncrementVoteScore: _ => 
      dispatch(requestIncrementVoteScore(categoryName, postId)),
    requestDecrementVoteScore: _ => 
      dispatch(requestDecrementVoteScore(categoryName, postId))   
  }
}

//https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md#my-views-arent-updating
export default connect(mapStateToProps, mapDispatchToProps, null, {pure:false})(withStyles(styles)(PostDetail))