import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategories } from '../../actions/categories'
import { fetchPosts } from '../../actions/posts'
import { renderRoutes } from 'react-router-config'
import Drawer from '../drawer'

class App extends Component {

  componentDidMount = _ => {
    this.props.fetchCategories()
    this.props.fetchPosts()
  }
  
  render = _ => (
    <div>
      <Drawer />
      {renderRoutes(this.props.route.routes)}
    </div>
  )

}

App.propTypes = {
  fetchCategories: PropTypes.func.isRequired,
  fetchPosts: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  fetchCategories: _ => dispatch(fetchCategories()),
  fetchPosts: _ => dispatch(fetchPosts())
})

export default connect(null, mapDispatchToProps)(App)
