import React from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'

let Category = props => (
  <div>{renderRoutes(props.route.routes)}</div>
)

Category.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryName: PropTypes.string.isRequired
    })
  }) 
}

export default Category
