import { REQUEST_CATEGORIES } from '../actions/categories'
import { RECEIVE_CATEGORIES } from '../actions/categories'

const initialCategoriesState = {
  isFetching: false,
  received: false,
  items: []
}

const categories = (state = initialCategoriesState, action) => {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        received: true,
        items: [...action.items],
      }
    default:
      return state
  }
}

export default categories