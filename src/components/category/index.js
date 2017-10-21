import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import PostsList from './postsList'
import PostDetail from './postDetail'

class Category extends Component {
  render = _ => {
    const { name } = this.props

    console.log(name);

    return (
      <div>
        <Route path={`/${name}`} exact component={PostsList}/>

        <Route path={`/${name}/:postId`} render={ props => {
          const postId = props.match.params.postId
          return React.createElement(PostDetail, { postId })
        }}/>
      </div>
    )
  }
}

Category.propTypes = {
  name: PropTypes.string.isRequired
}

export default Category
