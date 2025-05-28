
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Cooks from './pages/Cooks';
import About from './pages/About';
import Contato from './pages/Contato';
import NotFound from './pages/NotFound';
import CookProfile from './pages/CookProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AddRecipe from './pages/AddRecipe';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/cooks" element={<Cooks />} />
          <Route path="/cook/:id" element={<CookProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contato />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
