
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { allRecipes, RecipeCategory } from '@/data/mockData';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

const Recipes: React.FC = () => {
  const location = useLocation();
  const [activeFilters, setActiveFilters] = useState<RecipeCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse URL params for category filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      // Convert URL param to RecipeCategory enum value
      const categoryKey = Object.keys(RecipeCategory).find(
        (key) => key.toLowerCase() === categoryParam.toLowerCase()
      );
      
      if (categoryKey) {
        const category = RecipeCategory[categoryKey as keyof typeof RecipeCategory];
        setActiveFilters([category]);
      }
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [location]);
  
  const toggleFilter = (category: RecipeCategory) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(c => c !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };
  
  // Filter recipes based on active filters and search term
  const filteredRecipes = allRecipes.filter(recipe => {
    // Filter by category if there are active filters
    const matchesCategory = activeFilters.length === 0 || 
      recipe.categories.some(category => activeFilters.includes(category));
    
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="heading-lg text-center mb-2">Todas as Receitas</h1>
            <p className="text-gray-600 text-center mb-8">
              Encontre receitas fit para todos os objetivos e preferências dietéticas
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Busque por receitas, ingredientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            {/* Filters Toggle Button (Mobile) */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <Filter size={18} className="mr-2" />
                  <span>Filtrar receitas</span>
                </div>
                <ChevronDown size={18} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Category Filters */}
            <div className={`${showFilters || 'hidden md:block'} bg-white p-4 rounded-lg shadow-sm mb-6`}>
              <div className="flex flex-wrap gap-2">
                {Object.values(RecipeCategory).map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleFilter(category)}
                    className={`category-badge transition-all ${
                      activeFilters.includes(category)
                        ? 'bg-fitcooker-orange text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                
                {(activeFilters.length > 0 || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="category-badge bg-red-100 text-red-700 hover:bg-red-200 flex items-center"
                  >
                    <X size={14} className="mr-1" />
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
            
            {/* Active Filters Summary */}
            {activeFilters.length > 0 && (
              <div className="flex items-center justify-center mb-4 flex-wrap gap-2">
                <span className="text-sm text-gray-500">Filtros ativos:</span>
                {activeFilters.map((filter) => (
                  <div key={filter} className="flex items-center bg-fitcooker-orange/10 text-fitcooker-orange text-sm px-3 py-1 rounded-full">
                    {filter}
                    <button
                      onClick={() => toggleFilter(filter)}
                      className="ml-1 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Recipe Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            {filteredRecipes.length > 0 ? (
              <>
                <p className="text-gray-500 mb-8">{filteredRecipes.length} receitas encontradas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <img 
                  src="https://assets.website-files.com/5e51c674258ffe10d286d30a/5e535a0c9e6c1d737f20e2ac_peep-59.svg" 
                  alt="No recipes found" 
                  className="w-48 h-48 mx-auto mb-6"
                />
                <h3 className="heading-md mb-2">Nenhuma receita encontrada</h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar seus filtros ou buscar por outro termo.
                </p>
                <button 
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
