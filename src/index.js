import React from 'react';
import ReactDOM from 'react-dom/client';
import {ThemeProvider, createTheme} from '@mui/material/styles';

import './index.css';
import App from './App';

const theme = createTheme({
    palette: {
      primary: {
        main: '#eeeeee'
      },
      secondary: {
        main: '#87CEEB'
      },
    },
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);