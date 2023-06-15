import { useState, useEffect } from 'react';
import '../styles/App.css';
import localeUa from "../data/localeUa.json"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MainPage from './MainPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  


function App() {
  const labels = localeUa
  const categories = Object.entries(labels.menu.catList).map(([k,v])=>[Number(k),v])
  const [initProductsList, setinitProductsList] = useState([])
  const config = {
    labels,
    categories,
    initProductsList
  }

  
  useEffect(()=>{
    //fetch(`/gallery/data/data.php`)
    fetch(`http://localhost:3000/data/products.json`)
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
    <Router>
      <Routes >
        <Route exact path="/" element={<MainPage config={config} />} />
        <Route exact path="/:category" element={<MainPage config={config} />} />
        <Route exact path="/:category/:id/" element={<MainPage config={config} />} />
      </Routes>
    </Router>
  );
}

export default App;
