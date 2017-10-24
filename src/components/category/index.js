import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import NotFound from '../notFound'

let Category = props => {
  const { match, categories, categoriesReceived, route } = props
  const categoryName = match.params.categoryName
  const category = categories.find(category => category.name === categoryName)
  return categoriesReceived ?
    (category ?
      <div>{renderRoutes(route.routes, {categoryName})}</div> :
      <NotFound text="Category Not Found" />
    ) :
    <NotFound text="Loading Category ..." />
}

Category.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryName: PropTypes.string.isRequired
    })
  }) 
}

const mapStateToProps = ({ categories }) => ({ 
  categories: categories.items,
  categoriesReceived: categories.received
})


export default connect(mapStateToProps)(Category)
