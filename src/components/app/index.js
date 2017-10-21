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
    const { categories } = this.props;

    return (
      <div>
        <Drawer />

        <Route path="/" exact component={Dashboard} />

        <Route path="/:categoryName" component={props => {
          const categoryName = props.match.params.categoryName
          const category = categories.find(category => category.name === categoryName)
          return category ?
            React.createElement(Category, { name: categoryName }) : 
            React.createElement(NotFound, {text: 'Category Not Found'})
        }}/>
      </div>
    )
  }

}

Dashboard.propTypes = {
  categories: PropTypes.array.isRequired,
  fetchCategories: PropTypes.func.isRequired
}

const mapStateToProps = ({categories}) => ({
  categories: categories.items
})

const mapDispatchToProps = dispatch => ({
  fetchCategories: _ => dispatch(fetchCategories()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
