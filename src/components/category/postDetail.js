import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeaderLayout from '../headerLayout'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: theme.spacing.unit*4,
    paddingRight: theme.spacing.unit*4,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class PostDetail extends Component {
  state = {
    title: '',
    editMode: false
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  _updateItem = _ => {
    console.log("UPDATE ITEM", this.state.item)
    this._changeEditMode(false)
  }

  _deleteItem = _ => {
    console.log("DELETE ITEM", this.state.item)
  }

  _changeEditMode = editMode => {
    console.log("EDIT MODE", editMode)
    this.setState({editMode})
  }

  componentWillReceiveProps = props => {
    const { title } = props.post
    this.setState({title})
  }

  render = _ => {
    const { categoryName, post, isFetchingPosts, classes } = this.props
    const { title, editMode } = this.state

    return (
      <HeaderLayout
        title={post.title}
        loading={isFetchingPosts}
        operations={[
          {id:'arrowBack', icon:ArrowBack, to:`/${categoryName}`},
          {id:'check', icon:Check, right: true, onClick:this._updateItem},
          {id:'edit', icon:Edit, right: true, onClick: _ => this._changeEditMode(true)},
          {id:'delete', icon:Delete, right: true, onClick:this._deleteItem},
        ]}
      >
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            fullWidth
            id="title"
            label="Title"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={title}
            onChange={this._handleChange('title')}
            margin="normal"
          />
        </form>
      </HeaderLayout>
    )
  }
}

PostDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string.isRequired
    })
  }),
  categoryName: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ posts }, ownProps) => ({ 
  post: (posts.items[ownProps.match.params.categoryName] || [])
    .find(post => post.id === ownProps.match.params.postId) || {},
  isFetchingPosts: posts.isFetching
})

//https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md#my-views-arent-updating
export default connect(mapStateToProps, null, null, {pure:false})(withStyles(styles)(PostDetail))