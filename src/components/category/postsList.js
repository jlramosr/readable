import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import List from '../list/posts'
import ArrowBack from 'material-ui-icons/ArrowBack'

class PostsList extends Component {
  render = _ => {
    const { categoryName, posts, isFetchingPosts, postsReceived } = this.props

    return (
      <List
        posts={posts}
        postsReceived={postsReceived}
        loading={isFetchingPosts}
        title={`${categoryName}`}
        aditionalOperations={[
          { id:'arrowBack', icon:ArrowBack, to: '/' }
        ]}
        category={categoryName}
      />
    )
  }
}

PostsList.propTypes = {
  categoryName: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetchingPosts: PropTypes.bool.isRequired,
  postsReceived: PropTypes.bool.isRequired
}

const _getCategoryPosts = posts =>
  Object.keys(posts).reduce( (accPosts, postId) => [...accPosts, {id:postId, ...posts[postId]}], [])

const mapStateToProps = ({ posts }, ownProps) => {
  return {
    posts: _getCategoryPosts(posts.items[ownProps.categoryName] || []).filter(post => !post.deleted),
    isFetchingPosts: posts.isFetching,
    postsReceived: posts.received
  }
}

export default connect(mapStateToProps)(PostsList)
