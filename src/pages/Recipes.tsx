
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { allRecipes, RecipeCategory } from '@/data/mockData';
import { Search, Filter, ChevronDown, X, Utensils, PlusCircle, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Recipes: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [activeFilters, setActiveFilters] = useState<RecipeCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  
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
  
  const handleSuggestCategory = () => {
    if (newCategoryName.trim()) {
      toast({
        title: "Categoria sugerida com sucesso!",
        description: "Nossa equipe irá analisar sua sugestão em breve.",
        duration: 3000,
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
    } else {
      toast({
        title: "Nome da categoria é obrigatório",
        description: "Por favor, informe um nome para a categoria.",
        variant: "destructive",
        duration: 3000,
      });
    }
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
        {/* Header with Beautiful Food Background */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-b from-fitcooker-orange/10 to-white">
          {/* Stylish background patterns */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-yellow-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-40 -right-20 w-60 h-60 bg-fitcooker-orange rounded-full opacity-10 blur-3xl"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-fitcooker-yellow/80 rounded-full animate-pulse-light"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-fitcooker-orange/80 rounded-full animate-pulse-light" style={{ animationDelay: "0.5s" }}></div>
                <div className="inline-block p-2 bg-white/60 backdrop-blur-sm rounded-full shadow-md mb-4">
                  <Utensils className="h-8 w-8 text-fitcooker-orange" />
                </div>
              </div>
              
              <h1 className="heading-lg text-center mb-2">Nossas Receitas</h1>
              <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
                Descubra receitas fit para todos os objetivos - do bulking ao cutting, 
                com ingredientes nutritivos e deliciosos para seu dia a dia
              </p>
              
              {/* Search Bar with Decorative Elements */}
              <div className="max-w-2xl mx-auto relative mb-10">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-fitcooker-yellow rounded-lg opacity-50 transform rotate-12"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-fitcooker-orange rounded-lg opacity-50 transform -rotate-12"></div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Busque por receitas, ingredientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent transition-all shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Filters Toggle Button (Mobile) */}
        <div className="md:hidden px-4 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              <span>Filtrar receitas</span>
            </div>
            <ChevronDown size={18} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Recipe Grid with Sidebar Layout */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Filters - Left Column */}
              <div className={`md:w-1/4 lg:w-1/5 ${showFilters || 'hidden md:block'}`}>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg flex items-center">
                      <SlidersHorizontal size={18} className="mr-2 text-fitcooker-orange" />
                      Filtros
                    </h2>
                    {(activeFilters.length > 0 || searchTerm) && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center"
                      >
                        <X size={14} className="mr-1" />
                        Limpar
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold mb-2">Categorias</h3>
                    <div className="flex flex-col gap-2">
                      {Object.values(RecipeCategory).map((category) => (
                        <button
                          key={category}
                          onClick={() => toggleFilter(category)}
                          className={`text-left px-3 py-2 rounded-md transition-all ${
                            activeFilters.includes(category)
                              ? 'bg-gradient-to-r from-fitcooker-orange/20 to-fitcooker-orange/5 text-fitcooker-orange font-medium'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              activeFilters.includes(category) ? 'bg-fitcooker-orange' : 'bg-gray-300'
                            }`}></div>
                            {category}
                            {activeFilters.includes(category) && (
                              <Sparkles size={12} className="ml-2 text-fitcooker-orange animate-pulse-light" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Suggest New Category */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="mt-6 text-sm text-fitcooker-orange hover:text-fitcooker-orange/80 flex items-center w-full justify-center">
                        <PlusCircle size={14} className="mr-1" />
                        Sugerir nova categoria
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Sugerir Nova Categoria</DialogTitle>
                        <DialogDescription>
                          Não encontrou a categoria que procurava? Sugira uma nova categoria para nossas receitas.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="categoryName" className="text-right">
                            Nome
                          </Label>
                          <Input
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="col-span-3"
                            placeholder="Ex: Low Carb, Sem Glúten, etc."
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="categoryDescription" className="text-right">
                            Descrição
                          </Label>
                          <Input
                            id="categoryDescription"
                            value={newCategoryDescription}
                            onChange={(e) => setNewCategoryDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Descreva brevemente essa categoria"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleSuggestCategory}>Enviar sugestão</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Active Filters Summary (Mobile) */}
                  {activeFilters.length > 0 && (
                    <div className="mt-6 md:hidden">
                      <h3 className="text-sm font-semibold mb-2">Filtros ativos</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeFilters.map((filter) => (
                          <div key={filter} className="flex items-center bg-fitcooker-orange/10 text-fitcooker-orange text-xs px-2 py-1 rounded-full">
                            {filter}
                            <button
                              onClick={() => toggleFilter(filter)}
                              className="ml-1 focus:outline-none"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recipe Content - Right Column */}
              <div className="md:w-3/4 lg:w-4/5">
                {filteredRecipes.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-gray-600">{filteredRecipes.length} receitas encontradas</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Ordenar por:</span>
                        <select className="bg-white border border-gray-200 rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-fitcooker-orange">
                          <option>Mais relevantes</option>
                          <option>Melhor avaliadas</option>
                          <option>Mais recentes</option>
                          <option>Menos calorias</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Active Filters Summary (Desktop) */}
                    {activeFilters.length > 0 && (
                      <div className="hidden md:flex items-center mb-4 flex-wrap gap-2">
                        <span className="text-sm text-gray-500">Filtros ativos:</span>
                        {activeFilters.map((filter) => (
                          <div key={filter} className="flex items-center bg-gradient-to-r from-fitcooker-orange/20 to-fitcooker-orange/5 text-fitcooker-orange text-sm px-3 py-1 rounded-full">
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
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all" />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
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
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
