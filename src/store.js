import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import categoriesReducer from './reducers/categories'
import postsReducer from './reducers/posts'
import drawerReducer from './reducers/drawer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
  combineReducers({
    router: routerReducer,
    categories: categoriesReducer,
    posts: postsReducer,
    drawer: drawerReducer,
  }),
  composeEnhancers(
    applyMiddleware(thunk, logger, routerMiddleware(history))
  )
)