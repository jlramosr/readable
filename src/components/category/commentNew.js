import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
import { requestAddComment } from '../../actions/comments'
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
  'body',
  'author',
]

class CommentNew extends Component {
  state = {
    submitting: false,
    values: {
      body: '',
      author: ''
    }
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
    this.setState( {submitting: true} )
    if (requiredFields.reduce((acc,field) => acc && this.state.values[field], true)) {
      this._createItem()
    }
  }

  _createItem = _ =>
    this.props.requestAddComment(this.state.values)
      .then( _ => this.props.closeDialog())

  render = _ => {
    const { closeDialog, isUpdating, classes } = this.props
    const { submitting, values } = this.state

    return (
      <HeaderLayout
        title={`New Comment`}
        loading={isUpdating}
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, right:true, onClick:this._submit}
        ]}
      >
        <form className={classes.container}>
          <TextField
            fullWidth
            required={requiredFields.includes('body')}
            error={submitting && !values.body}
            id="body"
            label="Body"
            InputLabelProps={{shrink: true}}
            multiline
            rows="4"
            rowsMax="10"
            value={values.body}
            onChange={event => this._handleChange('body', event.target.value)}
            className={classes.textField}
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
        </form>
      </HeaderLayout>
    )
  }
}

CommentNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
  isUpdating: PropTypes.bool.isRequired
}

const mapStateToProps = ({ comments }, ownProps) => ({ 
  isUpdating: comments.isUpdating
})

const mapDispatchToProps = (dispatch, ownProps) => { 
  const { categoryName, postId } = ownProps
  return {
    requestAddComment: comment => 
      dispatch(requestAddComment(categoryName, postId, comment))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CommentNew))
