import { REQUEST_COMMENTS } from '../actions/comments'
import { RECEIVE_COMMENTS } from '../actions/comments'
import { REQUEST_UPDATE_COMMENTS } from '../actions/comments'
import { ADD_COMMENT } from '../actions/comments'
import { UPDATE_COMMENT } from '../actions/comments'
import { DELETE_COMMENT } from '../actions/comments'
import { INCREMENT_COMMENT_VOTE_SCORE } from '../actions/comments'
import { DECREMENT_COMMENT_VOTE_SCORE } from '../actions/comments'

const initialCommentsState = {
  isFetching: false,
  isUpdating: false,
  received: false,
  items: {}
}

const comments = (state = initialCommentsState, action) => {
  switch (action.type) {
    case REQUEST_COMMENTS:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_COMMENTS:
      return {
        ...state,
        isFetching: false,
        received: true,
        items: action.items.reduce((acc, comment) => {
          const { id, ...restComment } = comment
          return {
            ...acc,
            [comment.parentId]: {
              ...acc[comment.parentId] || {},
              [id]: restComment
            }
          }
        }, state.items)
      }
    case REQUEST_UPDATE_COMMENTS:
      return {
        ...state,
        isUpdating: true
      }
    case ADD_COMMENT:
      const { parentId, comment } = action
      const { id, ...restComment } = comment
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [parentId]: {
            ...state.items[parentId],
            [id]: restComment
          }
        }
      }
    case UPDATE_COMMENT:
      const { values } = action
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [action.postId]: {
            ...state.items[action.postId],
            [action.commentId]: {
              ...state.items[action.postId][action.commentId],
              ...values
            }
          }
        }
      }
    case DELETE_COMMENT:
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [action.postId]: {
            ...state.items[action.postId],
            [action.commentId]: {
              ...state.items[action.postId][action.commentId],
              deleted: true
            }
          }
        }
      }
    case INCREMENT_COMMENT_VOTE_SCORE:
    case DECREMENT_COMMENT_VOTE_SCORE:
      const { type, postId, commentId } = action
      return {
        ...state,
        isUpdating: false,
        items: {
          ...state.items,
          [postId]: {
            ...state.items[postId],
            [commentId]: {
              ...state.items[postId][commentId],
              voteScore: state.items[postId][commentId].voteScore +
                (type === INCREMENT_COMMENT_VOTE_SCORE ? 1 : (-1))
            }
          }
        }
      }
    default:
      return state
  }
}

export default comments