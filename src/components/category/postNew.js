import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import HeaderLayout from '../headerLayout'
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

class PostNew extends Component {
  state = {
    values: {},
    editMode: false
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  _createItem = _ => {
    this.props.closeDialog()
  }

  render = _ => {
    const { closeDialog, category, categories, classes } = this.props
    const { ...values } = this.state

    return (
      <HeaderLayout
        title={`New ${category || ''} Post`}
        relative
        operations={[
          {id:'close', icon:Close, onClick:closeDialog},
          {id:'check', icon:Check, right: true, onClick:this._createItem}
        ]}
      >
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            fullWidth
            id="title"
            label="Title"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.title}
            onChange={this._handleChange('title')}
            margin="normal"
          />
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
            margin="normal"
          />
          <TextField
            fullWidth
            id="author"
            label="Author"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.author}
            onChange={this._handleChange('author')}
            margin="normal"
          />
          <TextField
            fullWidth
            id="category"
            select
            label="Category"
            InputLabelProps={{shrink: true}}
            className={classes.textField}
            value={values.category}
            onChange={this._handleChange('category')}
            SelectProps={{native: true}}
            margin="normal"
          >
            <option value="none"></option>
            {categories.map(category => (
              <option key={category} value={category}>
                <span>{category}</span>
              </option>
            ))}
          </TextField>
        </form>
      </HeaderLayout>
    )
  }
}

PostNew.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  category: PropTypes.string
}

const mapStateToProps = ({ posts, categories }, ownProps) => ({ 
  categories: categories.items.map(category => category.name),
})

export default connect(mapStateToProps)(withStyles(styles)(PostNew))
