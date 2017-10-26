import { createMuiTheme } from 'material-ui/styles'
import indigo from 'material-ui/colors/indigo'
import amber from 'material-ui/colors/amber'
import red from 'material-ui/colors/red'
import grey from 'material-ui/colors/grey'

let theme = createMuiTheme({
    standards: {
      colors: {
        primary: grey,
        secondary: indigo,
        error: red,
        grey: amber
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
      MuiSelect: {
        select: {
          textTransform: 'capitalize'
        },
      },
      MuiList: {
        padding: {
          paddingTop: 0,
          paddingBottom: 0,
          [`${theme.breakpoints.up('sm')}`]: {
            paddingTop: theme.spacing.unit,
            paddingBottom: theme.spacing.unit,
            paddingLeft: theme.spacing.unit*8,
            paddingRight: theme.spacing.unit*8,
          },
          [`${theme.breakpoints.up('md')}`]: {
            paddingLeft: theme.spacing.unit*16,
            paddingRight: theme.spacing.unit*16,
          },
          [`${theme.breakpoints.up('lg')}`]: {
            paddingLeft: theme.spacing.unit*32,
            paddingRight: theme.spacing.unit*32,
          },
        },
      },
      MuiListItem: {
        root: {
          outline: 'none'
        }
      },
      MuiListItemText: {
        root: {
          padding: 0,
          paddingRight: theme.spacing.unit*10,
          paddingLeft: theme.spacing.unit*2
        }
      },
      MuiListItemSecondaryAction: {
        root: {
          right: 10
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