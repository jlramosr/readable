import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { toggleDrawer } from '../../actions/drawer'
import Drawer from 'material-ui/Drawer'
import { MenuItem } from 'material-ui/Menu'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'

const styles = {
  menuItem: {
    textTransform: 'capitalize'
  }
}

class CustomDrawer extends Component {
  render = _ => {
    const { categories, opened, close } = this.props

    return (
      <Drawer type="persistent" open={opened}>
        <div>
          <IconButton onClick={close}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {categories.map(category => (
          <Link key={category.path} to={`/${category.path}`}>
            <MenuItem style={styles.menuItem} onClick={close}>
              {category.name}
            </MenuItem>
          </Link>
        ))}
      </Drawer>
    )
  }
}

CustomDrawer.propTypes = {
  categories: PropTypes.array.isRequired,
  opened: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
}

const mapStateToProps = ({ categories, drawer }) => ({
  categories: categories.items,
  opened: drawer.opened
})

const mapDispatchToProps = dispatch => ({
  close: _ => dispatch(toggleDrawer(false)),
})

export default connect(mapStateToProps,mapDispatchToProps)(CustomDrawer)
