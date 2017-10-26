import { REQUEST_POSTS } from '../actions/posts'
import { RECEIVE_POSTS } from '../actions/posts'
import { REQUEST_UPDATE_POSTS } from '../actions/posts'
import { ADD_POST } from '../actions/posts'
import { UPDATE_POST } from '../actions/posts'
import { DELETE_POST } from '../actions/posts'
import { INCREMENT_VOTE_SCORE } from '../actions/posts'
import { DECREMENT_VOTE_SCORE } from '../actions/posts'

const initialPostsState = {
  isFetching: false,
  isUpdating: false,
  received: false,
  items: {}
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
        items: action.items.reduce((acc, post) => {
          const { id, ...restPost } = post
          return {
            ...acc,
            [post.category]: {
              ...acc[post.category] || {},
              [id]: restPost
            }
          }
        }, {})
      }
    case REQUEST_UPDATE_POSTS:
      return {
        ...state,
        isUpdating: true
      }
    case ADD_POST:
      const { post } = action
      const { id, ...restPost } = post
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [post.category]: {
            ...state.items[post.category],
            [id]: restPost
          }
        }
      }
    case UPDATE_POST:
      const { values } = action
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [action.categoryName]: {
            ...state.items[action.categoryName],
            [action.postId]: {
              ...state.items[action.categoryName][action.postId],
              ...values
            }
          }
        }
      }
    case DELETE_POST:
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [action.categoryName]: {
            ...state.items[action.categoryName],
            [action.postId]: {
              ...state.items[action.categoryName][action.postId],
              deleted: true
            }
          }
        }
      }
    case INCREMENT_VOTE_SCORE:
    case DECREMENT_VOTE_SCORE:
      const { type, categoryName, postId } = action
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [categoryName]: {
            ...state.items[categoryName],
            [postId]: {
              ...state.items[categoryName][postId],
              voteScore: state.items[categoryName][postId].voteScore +
                (type === INCREMENT_VOTE_SCORE ? 1 : (-1))
            }
          }
        }
      }
    default:
      return state
  }
}

export default posts