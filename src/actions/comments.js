import {
  getAPIComments,
  addAPIComment,
  updateAPIComment,
  deleteAPIComment,
  voteAPIComment 
} from '../utils/api'
import uuid from 'uuid'
import { incrementCommentsPost, decrementCommentsPost } from './posts'

export const REQUEST_COMMENTS = 'REQUEST_COMMENTS'
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS'
export const REQUEST_UPDATE_COMMENTS = 'REQUEST_UPDATE_COMMENTS'
export const ADD_COMMENT = 'ADD_COMMENT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const INCREMENT_COMMENT_VOTE_SCORE = 'INCREMENT_COMMENT_VOTE_SCORE'
export const DECREMENT_COMMENT_VOTE_SCORE = 'DECREMENT_COMMENT_VOTE_SCORE'

export const requestComments = _ => ({
  type: REQUEST_COMMENTS
})

export const receiveComments = comments => ({
  type: RECEIVE_COMMENTS,
  items: comments
})

export const fetchComments = postId => (dispatch, getState) => {
  dispatch(requestComments())
  return getAPIComments(postId).then(
    comments => dispatch(receiveComments(comments)),
    error => console.log("ERROR", error)
  )
}

export const requestUpdateComments = _ => ({
  type: REQUEST_UPDATE_COMMENTS
})

export const addComment = (parentId, comment) => ({
  type: ADD_COMMENT,
  parentId,
  comment
})

export const requestAddComment = (categoryName, postId, values) => (dispatch, getState) => {
  dispatch(requestUpdateComments())
  return addAPIComment({
    ...values,
    id: uuid(),
    timestamp: Date.now(),
    parentId: postId
  }).then(
    comment => {
      dispatch(addComment(postId, comment))
      dispatch(incrementCommentsPost(categoryName, postId))
    },
    error => console.log("ERROR", error)
  )
}

export const updateComment = (postId, commentId, values) => ({
  type: UPDATE_COMMENT,
  postId,
  commentId,
  values
})

export const requestUpdateComment = (postId, commentId, body) => (dispatch, getState) => {
  dispatch(requestUpdateComments())
  const values = {timestamp:Date.now(), body}
  return updateAPIComment(commentId, values).then(
    _ => dispatch(updateComment(postId, commentId, values)),
    error => console.log("ERROR", error)
  )
}

export const deleteComment = (postId, commentId) => ({
  type: DELETE_COMMENT,
  postId,
  commentId
})

export const requestDeleteComment = (categoryName, postId, commentId) => (dispatch, getState) => {
  dispatch(requestUpdateComments())
  return deleteAPIComment(commentId).then(
    _ => {
      dispatch(deleteComment(postId, commentId))
      dispatch(decrementCommentsPost(categoryName, postId))
    },
    error => console.log("ERROR", error)
  )
}

export const incrementVoteScore = (postId, commentId) => ({
  type: INCREMENT_COMMENT_VOTE_SCORE,
  postId,
  commentId
}) 

export const requestIncrementVoteScore = (postId, commentId) => (dispatch, getState) => {
  dispatch(requestUpdateComments())
  return voteAPIComment(commentId, 'upVote').then(
    _ => dispatch(incrementVoteScore(postId, commentId)),
    error => console.log("ERROR", error)
  )
}

export const decrementVoteScore = (postId, commentId) => ({
  type: DECREMENT_COMMENT_VOTE_SCORE,
  postId,
  commentId
}) 

export const requestDecrementVoteScore = (postId, commentId) => (dispatch, getState) => {
  dispatch(requestUpdateComments())
  return voteAPIComment(commentId, 'downVote').then(
    _ => dispatch(decrementVoteScore(postId, commentId)),
    error => console.log("ERROR", error)
  )
}

