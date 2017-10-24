import App from './components/app'
import Dashboard from './components/dashboard'
import Category from './components/category'
import PostsList from './components/category/postsList'
import PostDetail from './components/category/postDetail'

export default [{
  component: App,
  exact: true,
  routes: [
    { path: '/', exact: true, component: Dashboard },
    { path: '/:categoryName', component: Category, routes: [
      { path: '/:categoryName', exact: true, component: PostsList },
      { path: '/:categoryName/:postId', component: PostDetail }
    ]}
  ]
}]