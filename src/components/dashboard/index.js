import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer } from '../../actions/drawer'
import List from '../list'
import MenuIcon from 'material-ui-icons/Menu'

class Dashboard extends Component {
  render = _ => {
    const { posts, isFetchingPosts, postsReceived, drawerOpened, toggleDrawer } = this.props

    return (
      <div>
        <List
          postsReceived={postsReceived}
          posts={posts}
          loading={isFetchingPosts}
          title="Readable"
          aditionalOperations={[
            { id:'menu', icon:MenuIcon, onClick: _ => toggleDrawer(!drawerOpened) }
          ]}
        />
      </div>
    )
  }
}

Dashboard.propTypes = {
  posts: PropTypes.array.isRequired,
  isFetchingPosts: PropTypes.bool.isRequired,
  drawerOpened: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  postsReceived: PropTypes.bool.isRequired
}

const mapStateToProps = ({ categories, posts, drawer }) => ({ 
  posts: Object.keys(posts.items).reduce((acc, categoryId) => (
    [...acc, ...posts.items[categoryId]]), []
  ),
  isFetchingPosts: posts.isFetching,
  postsReceived: posts.received,
  drawerOpened: drawer.opened
})

const mapDispatchToProps = dispatch => ({
  toggleDrawer: opened => dispatch(toggleDrawer(opened))
})

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)