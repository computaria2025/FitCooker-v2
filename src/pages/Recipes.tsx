
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChefHat, Clock, Users, Star, X } from 'lucide-react';
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
            <h1 className="text-6xl font-bold bg-gradient-to-r from-fitcooker-orange via-red-500 to-orange-600 bg-clip-text text-transparent mb-4 tracking-tight">
              Receitas
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-fitcooker-orange to-red-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por receitas, ingredientes ou chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-fitcooker-orange transition-colors"
              />
            </div>

            {/* Advanced Filter Button */}
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 px-6 border-2 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-all"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros Avançados
                  {(filters.selectedCategories.length > 0 || filters.category || filters.difficulty) && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {filters.selectedCategories.length + (filters.category ? 1 : 0) + (filters.difficulty ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-fitcooker-orange">Filtros Avançados</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Categories */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Categorias</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories?.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filters.selectedCategories.includes(category.nome)}
                            onCheckedChange={() => toggleCategory(category.nome)}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {category.nome}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Difficulty */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Dificuldade</h3>
                    <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({...prev, difficulty: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a dificuldade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas</SelectItem>
                        <SelectItem value="Fácil">Fácil</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Difícil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Preparation Time */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Tempo de Preparo</h3>
                    <div className="px-2">
                      <Slider
                        value={filters.preparationTime}
                        onValueChange={(value) => setFilters(prev => ({...prev, preparationTime: value}))}
                        max={120}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{filters.preparationTime[0]} min</span>
                        <span>{filters.preparationTime[1]} min</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Servings */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Porções</h3>
                    <div className="px-2">
                      <Slider
                        value={filters.servings}
                        onValueChange={(value) => setFilters(prev => ({...prev, servings: value}))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{filters.servings[0]} porção{filters.servings[0] > 1 ? 'ões' : ''}</span>
                        <span>{filters.servings[1]} porção{filters.servings[1] > 1 ? 'ões' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Rating */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Avaliação</h3>
                    <div className="px-2">
                      <Slider
                        value={filters.rating}
                        onValueChange={(value) => setFilters(prev => ({...prev, rating: value}))}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{filters.rating[0]} ⭐</span>
                        <span>{filters.rating[1]} ⭐</span>
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={clearFilters} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Limpar Filtros
                    </Button>
                    <Button 
                      onClick={() => setFilterOpen(false)} 
                      className="flex-1 bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Active Filters */}
          {(filters.selectedCategories.length > 0 || filters.category || filters.difficulty) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {filters.selectedCategories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className="bg-fitcooker-orange/10 text-fitcooker-orange border border-fitcooker-orange/20 hover:bg-fitcooker-orange hover:text-white cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {filters.difficulty && (
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 cursor-pointer"
                  onClick={() => setFilters(prev => ({...prev, difficulty: ''}))}
                >
                  {filters.difficulty} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Limpar todos
              </Button>
            </motion.div>
          )}

          {/* Results Count */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-gray-600">
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
              <div className="col-span-full text-center py-16">
                <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhuma receita encontrada</h3>
                <p className="text-gray-600 mb-8">Tente ajustar seus filtros ou termos de busca.</p>
                <Button onClick={clearFilters} className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
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
