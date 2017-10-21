import { createMuiTheme } from 'material-ui/styles'
import indigo from 'material-ui/colors/indigo'
import amber from 'material-ui/colors/amber'
import red from 'material-ui/colors/red'
import grey from 'material-ui/colors/grey'

let theme = createMuiTheme({
    standards: {
      colors: {
        primary: indigo,
        secondary: amber,
        error: red,
        grey: grey
      },
      toolbarHeights: {
        mobilePortrait: 56,
        mobileLandscape: 48,
        tabletDesktop: 64,
      },
      drawerWidth: 240,
      fontFamily:
        '-apple-system,system-ui,BlinkMacSystemFont,' +
        '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    },
  })
  
  theme = {
    ...theme,
    overrides: {
      ...theme.overrides,
  
      MuiAppBar: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
      MuiDrawer: {
        paper: {
          width: theme.standards.drawerWidth,
        },
      },

      MuiList: {
        padding: {
          paddingTop: 0,
          paddingBottom: 0,
          [`${theme.breakpoints.up('sm')}`]: {
            paddingTop: theme.spacing.unit,
            paddingBottom: theme.spacing.unit,
            paddingLeft: theme.spacing.unit*12,
            paddingRight: theme.spacing.unit*12,
          },
          [`${theme.breakpoints.up('md')}`]: {
            paddingLeft: theme.spacing.unit*24,
            paddingRight: theme.spacing.unit*24,
          },
          [`${theme.breakpoints.up('lg')}`]: {
            paddingLeft: theme.spacing.unit*48,
            paddingRight: theme.spacing.unit*48,
          },
        },
      },
      MuiListItem: {
        root: {
          outline: 'none',
        },
      },
      MuiListItemSecondaryAction: {
        root: {
          right: 20
        }
      }
    },
    palette: {
      ...theme.palette,
      ...theme.standards.colors,
    },
    typography: {
      ...theme.typography,
      fontFamily: theme.standards.fontFamily,
    },
    mixins: {
      ...theme.mixins,
      toolbar: {
        minHeight: theme.standards.toolbarHeights.mobilePortrait,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
          minHeight: theme.standards.toolbarHeights.mobileLandscape,
        },
        [theme.breakpoints.up('sm')]: {
          minHeight: theme.standards.toolbarHeights.tabletDesktop,
        },
      },
    }
  }

  export default theme