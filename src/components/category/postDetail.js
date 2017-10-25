import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeaderLayout from '../headerLayout'
import { withStyles } from 'material-ui/styles'
import{ MenuItem } from 'material-ui/Menu'
import TextField from 'material-ui/TextField'
import ArrowBack from 'material-ui-icons/ArrowBack'
import Check from 'material-ui-icons/Check'
import Edit from 'material-ui-icons/Edit'
import Delete from 'material-ui-icons/Delete'
import { timestampToHuman } from '../../utils/helpers'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: theme.spacing.unit*4,
    paddingRight: theme.spacing.unit*4,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  viewContainer: {
    padding: theme.spacing.unit*4,
    display: 'flex',
    flexDirection: 'column'
  },
  viewHeader: {
    marginBottom: theme.spacing.unit*2,
    padding: theme.spacing.unit,
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
  },
  viewBody: {
    order: 2,
    padding: theme.spacing.unit,
    display: 'flex',
    flex: '1 1 auto'
  },
  viewAuthor: {
    color: theme.palette.secondary[700],
    textTransform: 'capitalize',
    flex: '1 1 auto',
    alignSelf: 'flex-start',
    marginRight: theme.spacing.unit,
  },
  viewDate: {
    color: theme.palette.secondary[700],
    flex: '0 1 auto',
    alignSelf: 'flex-end'
  }
})

class PostDetail extends Component {
  state = {
    editMode: false,
    submitting: false,
    values: {

    }
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
    this.setState({editMode})
  }

  componentWillReceiveProps = props => {
    this.setState({values: {...props.post}})
  }

  render = _ => {
    const { categoryName, categories, post, isFetchingPosts, classes } = this.props
    const { editMode, submitting, values } = this.state

    return (
      <HeaderLayout
        title={post.title}
        loading={isFetchingPosts}
        operations={[
          {id:'arrowBack', icon:ArrowBack, to:`/${categoryName}`},
          {id:'check', icon:Check, hidden:!editMode, right: true, onClick:this._updateItem},
          {id:'edit', icon:Edit, hidden:editMode, right: true, onClick: _ => this._changeEditMode(true)},
          {id:'delete', icon:Delete, hidden:editMode, right: true, onClick:this._deleteItem},
        ]}
      >
      {editMode ? (
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            fullWidth
            id="title"
            label="Title"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.title}
            onChange={this._handleChange('title')}
            margin="dense"
          />
          <TextField
            fullWidth
            id="author"
            label="Author"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.author}
            onChange={this._handleChange('author')}
            margin="dense"
          />
          <TextField
            fullWidth
            id="category"
            select
            label="Category"
            className={classes.textField}
            value={values.category}
            onChange={this._handleChange('category')}
            SelectProps={{native: true}}
            margin="dense"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            id="body"
            label="Body"
            InputLabelProps={{shrink: true}}
            multiline
            rows="14"
            rowsMax="14"
            value={values.body}
            onChange={this._handleChange('body')}
            className={classes.textField}
            margin="dense"
          />
        </form>
      ) : (
        <div className={classes.viewContainer}>
          <div className={classes.viewHeader}>
            <div className={classes.viewAuthor}>{`by ${post.author}, in ${post.category} category`}</div>
            <div className={classes.viewDate}>{timestampToHuman(post.timestamp)}</div>
          </div>
          <div className={classes.viewBody}>
            {values.body}
          </div>
        </div>
      )}
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
  post: PropTypes.object.isRequired,
  categoryName: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ posts, categories }, ownProps) => ({ 
  post: (posts.items[ownProps.categoryName] || []).find(post => 
    post.id === ownProps.match.params.postId
  ) || {},
  categories: categories.items.map(category => category.name),
  isFetchingPosts: posts.isFetching
})

//https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md#my-views-arent-updating
export default connect(mapStateToProps, null, null, {pure:false})(withStyles(styles)(PostDetail))