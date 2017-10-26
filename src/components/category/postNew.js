import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import { requestAddPost } from '../../actions/posts'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Close from 'material-ui-icons/Close'
import Check from 'material-ui-icons/Check'

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
  }
})

const requiredFields = [
  'title',
  'body',
  'author',
  'category'
]

class PostNew extends Component {
  state = {
    submitting: false,
    values: {}
  }


  _handleChange = (name, value) =>
    this.setState(prevState => ({
    ...prevState,
    values: {
      ...prevState.values,
      [name]: value
    }
  }))

  _submit = _ => {
    this.setState(prevState => ({
      submitting: true,
      values: {
        ...prevState.values, 
        category: this.props.categoryName || prevState.values.category
      }
    }))
    if (requiredFields.reduce((acc,field) => acc && this.state.values[field], true)) {
      this._createItem()
    }
  }

  _createItem = _ =>
    this.props.requestAddPost(this.state.values).then( _ => this.props.closeDialog())

  render = _ => {
    const { closeDialog, categoryName, categories, isUpdating, classes } = this.props
    const { submitting, values } = this.state

    return (
      <HeaderLayout
        title={`New ${categoryName || ''} Post`}
        loading={isUpdating}
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, right:true, onClick:this._submit}
        ]}
      >
        <form className={classes.container}>
          <TextField
            fullWidth
            required={requiredFields.includes('title')}
            error={submitting && !values.title}
            id="title"
            label="Title"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.title}
            onChange={event => this._handleChange('title', event.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            required={requiredFields.includes('author')}
            error={submitting && !values.author}
            id="author"
            label="Author"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.author}
            onChange={event => this._handleChange('author', event.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            required={requiredFields.includes('category')}
            style={{display: Boolean(categoryName) ? 'none' : 'flex'}}
            error={submitting && !values.category}
            id="category"
            select
            label="Category"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.category}
            onChange={event => this._handleChange('category', event.target.value)}
            SelectProps={{native: true}}
            margin="normal"
          >
            <option value=""></option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            required={requiredFields.includes('body')}
            error={submitting && !values.body}
            id="body"
            label="Body"
            InputLabelProps={{shrink: true}}
            multiline
            rows="14"
            rowsMax="14"
            value={values.body}
            onChange={event => this._handleChange('body', event.target.value)}
            className={classes.textField}
            margin="normal"
          />
        </form>
      </HeaderLayout>
    )
  }
}

PostNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  categoryName: PropTypes.string,
  isUpdating: PropTypes.bool.isRequired
}

const mapStateToProps = ({ posts, categories }, ownProps) => ({ 
  categories: categories.items.map(category => category.name),
  isUpdating: posts.isUpdating
})

const mapDispatchToProps = dispatch => ({
  requestAddPost: post => dispatch(requestAddPost(post))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PostNew))
