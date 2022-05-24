import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Watch from "./pages/Watch";
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import PixelatedTimesNewRomanTTF from './fonts/pixelated-times-new-roman.ttf'

const ptnr = {
  fontFamily: 'Pixelated Times New Roman',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    local('Raleway'),
    local('Raleway-Regular'),
    url(${PixelatedTimesNewRomanTTF}) format('woff2')
  `,
  unicodeRange:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}
const theme = createTheme({
  palette: {
    primary: {
      main: '#f00',
    },
    secondary: {
      main: '#ff0',
    },
    info: {
      main: '#00f',
      dark: '#00f',
    }
  },
  typography: {
    fontFamily: "'Pixelated Times New Roman', 'Times New Roman'",
    fontSize: 24,
    allVariants: {
      lineHeight: 0.74,
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [ptnr],
        html: {
          WebkitFontSmoothing: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="*" element={<NoPage />} />
            </Route>
            <Route path="/watch" element={<Layout drawerCollapsed />}>
              <Route index element={<Watch />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
