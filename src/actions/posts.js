import { getAPIPosts, addAPIPost } from '../utils/api'
import uuid from 'uuid'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const REQUEST_ADD_POST = 'REQUEST_ADD_POST'
export const ADD_POST = 'ADD_POST'

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

export const requestAddPost = _ => ({
  type: REQUEST_ADD_POST
})

export const addPost = post => ({
  type: ADD_POST,
  post
})

export const demandAddPost = values => (dispatch, getState) => {
  dispatch(requestAddPost())
  console.log(values)
  return addAPIPost({
    ...values,
    id: uuid(),
    timestamp: Date.now()
  }).then(
    post => dispatch(addPost(post)),
    error => console.log("ERROR", error)
  )
}