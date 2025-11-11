import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, lightBlue } from '@mui/material/colors';

let theme = createTheme({
  palette: {
    primary: blue,
    secondary: lightBlue,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: blue[700],
      secondary: blue[500],
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: '"Avenir", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          maxHeight: 45,
          height: 45,
          boxShadow: 'none !important',
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 5,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          maxWidth: 'inherit !important',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          top: 0,
          height: 3,
        },
        root: {
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
