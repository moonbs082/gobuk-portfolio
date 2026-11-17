import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B1A',
      contrastText: '#0E0E10',
    },
    secondary: {
      main: '#E5252E',
    },
    background: {
      default: '#0E0E10',
      paper: '#1C1C21',
    },
    text: {
      primary: '#F5F3EF',
      secondary: '#8A8A93',
    },
  },
  typography: {
    fontFamily: '"Pretendard", system-ui, sans-serif',
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

export default theme;
