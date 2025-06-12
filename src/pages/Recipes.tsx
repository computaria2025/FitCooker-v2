
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChefHat, Clock, Users, Star, X, Sliders } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Recipes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    preparationTime: [0, 120],
    servings: [1, 10],
    rating: [0, 5],
    selectedCategories: [] as string[]
  });
  
  const { data: recipes, isLoading, error } = useRecipes();
  const { data: categories } = useCategories();

  const filteredRecipes = recipes?.filter(recipe => {
    // Search term filter
    if (searchTerm && !recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !recipe.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category && !recipe.categories.includes(filters.category)) {
      return false;
    }

    // Multiple categories filter
    if (filters.selectedCategories.length > 0) {
      const hasMatchingCategory = filters.selectedCategories.some(cat => 
        recipe.categories.includes(cat)
      );
      if (!hasMatchingCategory) return false;
    }

    // Difficulty filter
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }

    // Preparation time filter
    if (recipe.preparationTime < filters.preparationTime[0] || 
        recipe.preparationTime > filters.preparationTime[1]) {
      return false;
    }

    // Servings filter
    if (recipe.servings < filters.servings[0] || 
        recipe.servings > filters.servings[1]) {
      return false;
    }

    // Rating filter
    if (recipe.rating < filters.rating[0] || 
        recipe.rating > filters.rating[1]) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      preparationTime: [0, 120],
      servings: [1, 10],
      rating: [0, 5],
      selectedCategories: []
    });
  };

  const toggleCategory = (categoryName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryName)
        ? prev.selectedCategories.filter(cat => cat !== categoryName)
        : [...prev.selectedCategories, categoryName]
    }));
  };

  const hasActiveFilters = filters.selectedCategories.length > 0 || 
    filters.category || 
    filters.difficulty ||
    filters.preparationTime[0] > 0 || 
    filters.preparationTime[1] < 120 ||
    filters.servings[0] > 1 || 
    filters.servings[1] < 10 ||
    filters.rating[0] > 0 || 
    filters.rating[1] < 5;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Erro ao carregar receitas</h1>
            <p className="text-gray-600">Tente novamente mais tarde.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-fitcooker-orange via-red-500 to-orange-600 bg-clip-text text-transparent">
                Receitas
              </span>
            </h1>
            <div className="w-32 h-2 bg-gradient-to-r from-fitcooker-orange to-red-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubra sabores incríveis e transforme sua cozinha em um laboratório de criatividade culinária
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por receitas, ingredientes ou chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-fitcooker-orange transition-colors rounded-xl"
              />
            </div>

            {/* Advanced Filter Button */}
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-14 px-8 border-2 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-all rounded-xl font-semibold relative"
                >
                  <Sliders className="w-5 h-5 mr-2" />
                  Filtros Avançados
                  {hasActiveFilters && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                      {(filters.selectedCategories.length + 
                        (filters.category ? 1 : 0) + 
                        (filters.difficulty ? 1 : 0) +
                        (filters.preparationTime[0] > 0 || filters.preparationTime[1] < 120 ? 1 : 0) +
                        (filters.servings[0] > 1 || filters.servings[1] < 10 ? 1 : 0) +
                        (filters.rating[0] > 0 || filters.rating[1] < 5 ? 1 : 0))}
                    </div>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold text-fitcooker-orange flex items-center gap-3">
                    <Sliders className="w-8 h-8" />
                    Filtros Avançados
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-fitcooker-orange" />
                      Categorias
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                      {categories?.map((category) => (
                        <div key={category.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.selectedCategories.includes(category.nome)}
                            onCheckedChange={() => toggleCategory(category.nome)}
                            className="data-[state=checked]:bg-fitcooker-orange data-[state=checked]:border-fitcooker-orange"
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium cursor-pointer hover:text-fitcooker-orange transition-colors"
                          >
                            {category.nome}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Difficulty */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Dificuldade</h3>
                      <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({...prev, difficulty: value}))}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Selecione a dificuldade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas</SelectItem>
                          <SelectItem value="Fácil">🟢 Fácil</SelectItem>
                          <SelectItem value="Médio">🟡 Médio</SelectItem>
                          <SelectItem value="Difícil">🔴 Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preparation Time */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Tempo de Preparo</h3>
                      <div className="px-3 py-4 bg-gray-50 rounded-lg">
                        <Slider
                          value={filters.preparationTime}
                          onValueChange={(value) => setFilters(prev => ({...prev, preparationTime: value}))}
                          max={120}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
                          <span>{filters.preparationTime[0]} min</span>
                          <span>{filters.preparationTime[1]} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Servings */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Porções</h3>
                      <div className="px-3 py-4 bg-gray-50 rounded-lg">
                        <Slider
                          value={filters.servings}
                          onValueChange={(value) => setFilters(prev => ({...prev, servings: value}))}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
                          <span>{filters.servings[0]} porção{filters.servings[0] > 1 ? 'ões' : ''}</span>
                          <span>{filters.servings[1]} porção{filters.servings[1] > 1 ? 'ões' : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Avaliação</h3>
                      <div className="px-3 py-4 bg-gray-50 rounded-lg">
                        <Slider
                          value={filters.rating}
                          onValueChange={(value) => setFilters(prev => ({...prev, rating: value}))}
                          max={5}
                          min={0}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-3 font-medium">
                          <span>{filters.rating[0]} ⭐</span>
                          <span>{filters.rating[1]} ⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button 
                    onClick={clearFilters} 
                    variant="outline" 
                    className="flex-1 h-12 text-lg"
                  >
                    Limpar Filtros
                  </Button>
                  <Button 
                    onClick={() => setFilterOpen(false)} 
                    className="flex-1 h-12 bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-lg"
                  >
                    Aplicar Filtros
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {filters.selectedCategories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className="bg-fitcooker-orange/10 text-fitcooker-orange border border-fitcooker-orange/20 hover:bg-fitcooker-orange hover:text-white cursor-pointer transition-all px-3 py-1"
                  onClick={() => toggleCategory(category)}
                >
                  {category} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {filters.difficulty && (
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 cursor-pointer transition-all px-3 py-1"
                  onClick={() => setFilters(prev => ({...prev, difficulty: ''}))}
                >
                  {filters.difficulty} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Limpar todos os filtros
              </Button>
            </motion.div>
          )}

          {/* Results Count */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-gray-600 text-lg font-medium">
                {filteredRecipes?.length === 0 
                  ? 'Nenhuma receita encontrada' 
                  : `${filteredRecipes?.length} receita${filteredRecipes?.length !== 1 ? 's' : ''} encontrada${filteredRecipes?.length !== 1 ? 's' : ''}`
                }
              </p>
            </motion.div>
          )}

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading ? (
              Array(8).fill(0).map((_, index) => (
                <RecipeCardSkeleton key={index} />
              ))
            ) : filteredRecipes?.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
                  <ChefHat className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Nenhuma receita encontrada</h3>
                <p className="text-gray-600 mb-8 text-lg">Tente ajustar seus filtros ou termos de busca.</p>
                <Button 
                  onClick={clearFilters} 
                  className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 px-8 py-3 text-lg"
                >
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              filteredRecipes?.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
