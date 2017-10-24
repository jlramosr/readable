import { REQUEST_POSTS } from '../actions/posts'
import { RECEIVE_POSTS } from '../actions/posts'

const initialPostsState = {
  isFetching: false,
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
    default:
      return state
  }
}

export default posts