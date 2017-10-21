import { snapshotToArray } from '../utils/helpers'
import { REQUEST_CATEGORIES } from '../actions/categories'
import { RECEIVE_CATEGORIES } from '../actions/categories'

const initialCategoriesState = {
  isFetching: false,
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
        items: snapshotToArray(action.items),
      }
    default:
      return state
  }
}

export default categories