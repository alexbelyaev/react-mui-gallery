import { useState, useEffect } from 'react';
import '../styles/App.css';
import localeUa from "../data/localeUa.json"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MainPage from './MainPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import mainTheme from '../styles/theme';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function App() {
  const labels = localeUa
  const categories = Object.entries(labels.menu.catList).map(([k,v])=>[Number(k),v])
  const [initProductsList, setinitProductsList] = useState([])
  const config = {
    labels,
    categories,
    initProductsList
  }
  const theme = createTheme(mainTheme)
  
  useEffect(()=>{
    fetch(`/gallery/data/data.php`)
    .then((r) => r.json())
    .then((data) =>{
      setinitProductsList(data.reverse())
    })
  },[])


  return (
    !initProductsList.length
    ? <div></div>
    :
    //<Router basename='gallery'>
    <ThemeProvider theme={theme}>
      <Router basename='gallery'>
        <Routes >
          <Route exact path="/" element={<MainPage config={config} />} />
          <Route exact path="/:category" element={<MainPage config={config} />} />
          <Route exact path="/:category/:id/" element={<MainPage config={config} />} />
          <Route exact path="/search/:query/" element={<MainPage config={config} />} />
          <Route exact path="/search/:query/:id/" element={<MainPage config={config} />} />
          <Route exact path="/favorites" element={<MainPage config={config} favorites={true} />} />
          <Route exact path="/favorites/:id/" element={<MainPage config={config} favorites={true} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
