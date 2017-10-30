import {
  getAPIPosts,
  addAPIPost,
  updateAPIPost,
  deleteAPIPost,
  voteAPIPost 
} from '../utils/api'
import uuid from 'uuid'
import { deleteCascadeComments } from './comments'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const REQUEST_UPDATE_POSTS = 'REQUEST_UPDATE_POSTS'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const DELETE_POST = 'DELETE_POST'
export const INCREMENT_POST_VOTE_SCORE = 'INCREMENT_POST_VOTE_SCORE'
export const DECREMENT_POST_VOTE_SCORE = 'DECREMENT_POST_VOTE_SCORE'
export const INCREMENT_COMMENTS_POST = 'INCREMENT_COMMENTS_POST'
export const DECREMENT_COMMENTS_POST = 'DECREMENT_COMMENTS_POST'

export const requestPosts = _ => ({
  type: REQUEST_POSTS
})

export const receivePosts = posts => ({
  type: RECEIVE_POSTS,
  items: posts
})

export const fetchPosts = _ => (dispatch, getState) => {
  dispatch(requestPosts())
  return getAPIPosts().then(
    posts => dispatch(receivePosts(posts)),
    error => console.log("ERROR", error)
  )
}

export const requestUpdatePosts = _ => ({
  type: REQUEST_UPDATE_POSTS
})

export const addPost = post => ({
  type: ADD_POST,
  post
})

export const requestAddPost = values => (dispatch, getState) => {
  dispatch(requestUpdatePosts())
  return addAPIPost({
    ...values,
    id: uuid(),
    timestamp: Date.now()
  }).then(
    post => dispatch(addPost(post)),
    error => console.log("ERROR", error)
  )
}

export const updatePost = (categoryName, postId, values) => ({
  type: UPDATE_POST,
  categoryName,
  postId,
  values
})

export const requestUpdatePost = (categoryName, postId, values) => (dispatch, getState) => {
  dispatch(requestUpdatePosts())
  return updateAPIPost(postId, values).then(
    _ => dispatch(updatePost(categoryName, postId, values)),
    error => console.log("ERROR", error)
  )
}

export const deletePost = (categoryName, postId) => ({
  type: DELETE_POST,
  categoryName,
  postId
})

export const requestDeletePost = (categoryName, postId) => (dispatch, getState) => {
  dispatch(requestUpdatePosts())
  return deleteAPIPost(postId).then(
    _ => { 
      dispatch(deletePost(categoryName, postId))
      dispatch(deleteCascadeComments(postId))
    },
    error => console.log("ERROR", error)
  )
}

export const incrementVoteScore = (categoryName, postId) => ({
  type: INCREMENT_POST_VOTE_SCORE,
  categoryName,
  postId
}) 

export const requestIncrementVoteScore = (categoryName, postId) => (dispatch, getState) => {
  dispatch(requestUpdatePosts())
  return voteAPIPost(postId, 'upVote').then(
    _ => dispatch(incrementVoteScore(categoryName, postId)),
    error => console.log("ERROR", error)
  )
}

export const decrementVoteScore = (categoryName, postId) => ({
  type: DECREMENT_POST_VOTE_SCORE,
  categoryName,
  postId
}) 

export const requestDecrementVoteScore = (categoryName, postId) => (dispatch, getState) => {
  dispatch(requestUpdatePosts())
  return voteAPIPost(postId, 'downVote').then(
    _ => dispatch(decrementVoteScore(categoryName, postId)),
    error => console.log("ERROR", error)
  )
}

export const incrementCommentsPost = (categoryName, postId) => ({
  type: INCREMENT_COMMENTS_POST,
  categoryName,
  postId
})

export const decrementCommentsPost = (categoryName, postId) => ({
  type: DECREMENT_COMMENTS_POST,
  categoryName,
  postId
})

