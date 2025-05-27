import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Cooks from './pages/Cooks';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import CookProfile from './pages/CookProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/cooks" element={<Cooks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/cook/:id" element={<CookProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
