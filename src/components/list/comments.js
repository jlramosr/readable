import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeaderLayout from '../headerLayout'
import { withStyles } from 'material-ui/styles'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Dialog from 'material-ui/Dialog'
import Badge from 'material-ui/Badge'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ThumbUp from 'material-ui-icons/ThumbUp'
import ThumbDown from 'material-ui-icons/ThumbDown'
import Check from 'material-ui-icons/Check'
import Delete from 'material-ui-icons/Delete'
import Stars from 'material-ui-icons/Stars'
import InsertComment from 'material-ui-icons/InsertComment'
import Tooltip from 'material-ui/Tooltip'
import Slide from 'material-ui/transitions/Slide'
import TextField from 'material-ui/TextField'
import keycode from 'keycode'
import sortBy from 'sort-by'
import CommentNew from '../category/commentNew'
import {
  requestUpdateComment,
  requestDeleteComment,
  requestIncrementVoteScore,
  requestDecrementVoteScore 
} from '../../actions/comments'
import { timestampToHuman } from '../../utils/helpers'

const styles = theme => ({
  root: {
    background: theme.palette.background.paper,
    padding: 0
  },
  noComments: {
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

class CustomCommmentsList extends Component {
  state = {
    submitting: false,
    showNewDialog: false,
    editingCommentId: null,
    editingCommentBody: ''
  }

  _clearEditingComment = _ =>
    this.setState({ editingCommentId: null, editingCommentBody: '', submitting: false })

  _handleKeyDown = event => {
    if (this.state.editingCommentId) {
      switch (keycode(event)) {
        case 'esc':
          this._clearEditingComment()
          break
        case 'enter':
          event.preventDefault()
          this._saveComment()
          break
        default:
          break
      }
    }
  }

  _editComment = (editingCommentId, editingCommentBody) => {
    if (!this.state.editingCommentId) {
      this.setState({ editingCommentId, editingCommentBody } )
    }
  }

  _saveComment = origBody => {
    this.setState( {submitting: true} )
    const { editingCommentId, editingCommentBody } = this.state
    if (editingCommentBody) {
      if (editingCommentBody === origBody) {
        this._clearEditingComment()
      } else {
        this.props.requestUpdateComment(editingCommentId, editingCommentBody).then( _ =>
          this._clearEditingComment()
        )
      }
    }
  }

  _deleteComment = _ => {
    const { editingCommentId, editingCommentBody } = this.state
    this.props.requestDeleteComment(editingCommentId, editingCommentBody).then( _ =>
      this._clearEditingComment()
    )
  }

  _handleCommentChange = editingCommentBody => this.setState({ editingCommentBody })

  _openNewDialog = _ => this.setState({ showNewDialog: true})
  
  _newDialogClosed = _ => this.closeNewDialog()
  
  closeNewDialog = _ => this.setState({ showNewDialog: false})

  _thumbClicked = (event, which, comment) => {
    event.preventDefault()
    which === 'up' ?
      this.props.requestIncrementVoteScore(comment.id) :
      this.props.requestDecrementVoteScore(comment.id)
  }

  componentWillMount = _ => document.addEventListener('keydown', this._handleKeyDown)

  componentWillUnmount = _ => document.removeEventListener('keydown', this._handleKeyDown)

  render = _ => {
    const { submitting, showNewDialog, editingCommentId, editingCommentBody } = this.state
    const {
      title,
      postId,
      categoryName,
      loading,
      comments,
      commentsReceived,
      classes 
    } = this.props

    const showingComments = comments.sort(sortBy('-voteScore'))

    return (
      <HeaderLayout
        title={title}
        relative
        miniToolbar
        loading={loading}
        operations={[
          { 
            id:'insertComment', icon:InsertComment, right:true, hidden:!comments.length,
            description:`New Comment`, onClick:this._openNewDialog,
          }
        ]}
      >
        {commentsReceived && (
          comments.length ? (
            <List
              className={classes.root}>
              {showingComments.map(comment => (
                <div key={comment.id}>
                  <ListItem button={editingCommentId!==comment.id} onClick={_ => this._editComment(comment.id, comment.body)}> 
                    <Tooltip
                      title="Votes"
                      placement="left"
                      disableTriggerTouch
                      enterDelay={200}
                      leaveDelay={0}
                    >
                      <IconButton tabIndex="-1" aria-label="Votes" disableRipple className={classes.iconButton}>
                        <Badge badgeContent={comment.voteScore} classes={{badge:classes.badge}} color="accent">
                          <Stars />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    {editingCommentId===comment.id ? (
                      <ListItemText
                        primary={
                          <TextField
                            fullWidth
                            required
                            error={submitting && !editingCommentBody}
                            multiline
                            rows="4"
                            rowsMax="4"
                            value={editingCommentBody}
                            onChange={event => this._handleCommentChange(event.target.value)}
                          />
                        }
                        secondary={`${timestampToHuman(comment.timestamp)}, by ${comment.author}`}
                      />
                    ) : (
                      <ListItemText
                        primary={comment.body}
                        secondary={`${timestampToHuman(comment.timestamp)}, by ${comment.author}`}
                      />
                    )}

                    {editingCommentId===comment.id ? (
                      <ListItemSecondaryAction>
                        <IconButton tabIndex="-1" aria-label="Save" onClick={_ => this._saveComment(comment.body)}>
                          <Check />
                        </IconButton>
                        <IconButton tabIndex="-1" aria-label="Delete" onClick={this._deleteComment}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>      
                    ) : (
                      <ListItemSecondaryAction>
                        <IconButton tabIndex="-1" aria-label=":)" onClick={event => this._thumbClicked(event,'up',comment)}>
                          <ThumbUp />
                        </IconButton>
                        <IconButton tabIndex="-1" aria-label=":(" onClick={event => this._thumbClicked(event,'down',comment)}>
                          <ThumbDown />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                    </ListItem>
                    <Divider tabIndex="-1"/>
                </div>
              ))}
            </List> 
          ) : (
            <div style={{padding: 20}}>
              There is no comments yet. Create the firt one <span className={classes.noComments} onClick={this._openNewDialog}>here</span>
            </div>
          )
        )}

        <Dialog
          open={showNewDialog}
          onRequestClose={this._newDialogClosed}
          transition={<Slide direction="up" />}
        >
          <CommentNew closeDialog={this.closeNewDialog} categoryName={categoryName} postId={postId}/>
        </Dialog>

      </HeaderLayout>
    )
  }
}

CustomCommmentsList.propTypes = {
  title: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  commentsReceived: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  requestUpdateComment: PropTypes.func.isRequired,
  requestDeleteComment: PropTypes.func.isRequired,
  requestIncrementVoteScore: PropTypes.func.isRequired,
  requestDecrementVoteScore: PropTypes.func.isRequired
}

CustomCommmentsList.defaultProps = {
  loading: false,
  title: '',
}

const mapStateToProps = ({ posts }) => ({
  isUpdatingPosts: posts.isUpdating
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestUpdateComment: (commentId, body) => 
    dispatch(requestUpdateComment(ownProps.postId, commentId, body)),
  requestDeleteComment: (commentId) => 
    dispatch(requestDeleteComment(ownProps.categoryName, ownProps.postId, commentId)),
  requestIncrementVoteScore: (commentId) => 
    dispatch(requestIncrementVoteScore(ownProps.postId, commentId)),
  requestDecrementVoteScore: (commentId) => 
    dispatch(requestDecrementVoteScore(ownProps.postId, commentId))   
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomCommmentsList))