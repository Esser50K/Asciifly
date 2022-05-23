import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Watch from "./pages/Watch";
import {createTheme, ThemeProvider} from '@material-ui/core/styles';

const theme = createTheme({});

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
