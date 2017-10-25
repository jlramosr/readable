import { REQUEST_POSTS } from '../actions/posts'
import { RECEIVE_POSTS } from '../actions/posts'
import { REQUEST_ADD_POST } from '../actions/posts'
import { ADD_POST } from '../actions/posts'

const initialPostsState = {
  isFetching: false,
  isAdding: false,
  received: false,
  items: []
}

const posts = (state = initialPostsState, action) => {
  switch (action.type) {
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        received: true,
        items: action.items.reduce((acc, post) => (
          {...acc, [post.category]: [...acc[post.category] || [], post]}
        ),{})
      }
    case REQUEST_ADD_POST:
      return {
        ...state,
        isAdding: true
      }
    case ADD_POST:
      const { post } = action
      return {
        ...state,
        isAdding: false,
        items: {
          ...state.items,
          [post.category]: [
            ...state.items[post.category] || {},
            post
          ]
        }
      }
    default:
      return state
  }
}

export default posts