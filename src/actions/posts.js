import { getAllPosts } from '../utils/api'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const ADD_CATEGORY = 'ADD_CATEGORY'

export const requestPosts = _ => ({
  type: REQUEST_POSTS
})

export const receivePosts = posts => ({
  type: RECEIVE_POSTS,
  items: posts
})

export const fetchPosts = _ => (dispatch, getState) => {
  dispatch(requestPosts())
  return getAllPosts().then(
    posts => dispatch(receivePosts(posts)),
    error => console.log("ERROR", error)
  )
}

export const addCategory = ({ name, icon, label }) => ({
  type: ADD_CATEGORY,
  name,
  icon,
  label
})