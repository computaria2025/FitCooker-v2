
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Search, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'py-3 bg-white shadow-md' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-fitcooker-black hover:opacity-80 transition-opacity"
          >
            <ChefHat 
              size={32} 
              className={cn(
                'text-fitcooker-orange transition-all duration-300',
                isScrolled ? 'scale-90' : 'scale-100'
              )} 
            />
            <span 
              className={cn(
                'font-bold tracking-tight text-gradient transition-all duration-300',
                isScrolled ? 'text-2xl' : 'text-3xl'
              )}
            >
              FitCooker
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/recipes" className="nav-link">Receitas</Link>
            <Link to="/cooks" className="nav-link">Cozinheiros</Link>
            <Link to="/about" className="nav-link">Sobre</Link>
          </div>
          
          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Buscar receitas"
            >
              <Search size={20} />
            </button>
            
            <Link 
              to="/login" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User size={20} />
              <span>Entrar</span>
            </Link>
            
            <Link 
              to="/add-recipe" 
              className="btn btn-primary flex items-center"
            >
              <span>Adicionar Receita</span>
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      <div 
        className={cn(
          'fixed inset-0 bg-white z-40 pt-20 px-6 transition-transform duration-300 ease-in-out transform md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex flex-col space-y-6">
          <Link to="/" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Home</span>
          </Link>
          <Link to="/recipes" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Receitas</span>
          </Link>
          <Link to="/cooks" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Cozinheiros</span>
          </Link>
          <Link to="/about" className="flex items-center py-3 border-b border-gray-100">
            <span className="text-xl font-medium">Sobre</span>
          </Link>
          
          <div className="pt-6 flex flex-col space-y-4">
            <Link to="/login" className="btn btn-outline flex items-center justify-center">
              <User size={20} className="mr-2" />
              <span>Entrar</span>
            </Link>
            
            <Link to="/add-recipe" className="btn btn-primary flex items-center justify-center">
              <span>Adicionar Receita</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
