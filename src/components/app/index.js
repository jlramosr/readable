import React, { Component } from 'react'
import { Route } from 'react-router'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchCategories } from '../../actions/categories'
import Dashboard from '../dashboard'
import Drawer from '../drawer'
import Category from '../category'
import NotFound from '../notFound'

class App extends Component {

  componentDidMount = _ => this.props.fetchCategories()

  render = _ => {
    return (
      <div>
        <Drawer />

        <Route path="/" exact component={Dashboard} />

        {/*<Route path="/:categoryName" component={props => {
          const categoryName = props.match.params.categoryName
          return category ? 
            React.createElement(Category, { 
              categoryName: categoryName
            }) : 
            React.createElement(NotFound, {title: 'Category Not Found'})
        }}/>*/}
      </div>
    )
  }

}

const mapDispatchToProps = dispatch => ({
  fetchCategories: _ => dispatch(fetchCategories()),
})

export default connect(null, mapDispatchToProps)(App)
