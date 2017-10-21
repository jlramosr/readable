import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from 'material-ui/styles'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import App from './components/app'
import categoriesReducer from './reducers/categories'
import postsReducer from './reducers/posts'
import drawerReducer from './reducers/drawer'
import registerServiceWorker from './registerServiceWorker'
import theme from './theme'
import './index.css'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const history = createHistory()

const store = createStore(
  combineReducers({
    router: routerReducer,
    categories: categoriesReducer,
    posts: postsReducer,
    drawer: drawerReducer,
  }),
  composeEnhancers(
    applyMiddleware(thunk),
    applyMiddleware(routerMiddleware(history))
  )
)

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker()
