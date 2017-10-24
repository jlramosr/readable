import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import HeaderLayout from '../headerLayout';
import ArrowBack from 'material-ui-icons/ArrowBack';
import Check from 'material-ui-icons/Check';

class PostsList extends Component {

  _createItem = _ => {
    console.log("CREAR ITEM");
  }

  render = _ => {
    const { match, postReceived, posts } = this.props;

    return (
      <HeaderLayout
        title={match.params.categoryName} 
        loading={postReceived}
        operations={[
          {id:'arrowBack', icon:ArrowBack, to:'/' },
          {id:'check', icon:Check, right: true, onClick:this._createItem}
        ]}
      >
        LISTA
      </HeaderLayout>
    );
  }
}

PostsList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryName: PropTypes.string.isRequired
    })
  }),
  posts: PropTypes.object.isRequired,
  postsReceived: PropTypes.bool.isRequired
}

const mapStateToProps = ({ posts }, ownProps) => {
  //console.log(posts, ownProps)
  return {
    posts: posts.items[ownProps.match.params.categoryName],
    postsReceived: posts.received
  }
}

export default connect(mapStateToProps)(PostsList)
