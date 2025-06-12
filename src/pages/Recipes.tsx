
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChefHat, Utensils, Sparkles, Clock, Users, Star } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useCategories } from '@/hooks/useCategories';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';

const Recipes: React.FC = () => {
  const { data: recipes, isLoading } = useRecipes();
  const { data: categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState([0, 180]);
  const [servingsRange, setServingsRange] = useState([1, 12]);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const difficulties = ['Fácil', 'Médio', 'Difícil'];
  const sortOptions = [
    { value: 'created_at', label: 'Mais Recentes' },
    { value: 'rating', label: 'Melhor Avaliadas' },
    { value: 'preparationTime', label: 'Menor Tempo' },
    { value: 'title', label: 'Nome A-Z' }
  ];

  const filteredRecipes = React.useMemo(() => {
    let filtered = [...recipes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter (single selection)
    if (selectedCategory) {
      filtered = filtered.filter(recipe =>
        recipe.categories.includes(selectedCategory)
      );
    }

    // Multiple categories filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(recipe =>
        selectedCategories.some(cat => recipe.categories.includes(cat))
      );
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(recipe =>
        recipe.difficulty === selectedDifficulty
      );
    }

    // Time range filter
    filtered = filtered.filter(recipe =>
      recipe.preparationTime >= timeRange[0] && recipe.preparationTime <= timeRange[1]
    );

    // Servings range filter
    filtered = filtered.filter(recipe =>
      recipe.servings >= servingsRange[0] && recipe.servings <= servingsRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(recipe => recipe.rating >= minRating);
    }

    // Sort recipes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'preparationTime':
          return a.preparationTime - b.preparationTime;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created_at':
        default:
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });

    return filtered;
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty, sortBy, timeRange, servingsRange, minRating, selectedCategories]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSortBy('created_at');
    setTimeRange([0, 180]);
    setServingsRange([1, 12]);
    setMinRating(0);
    setSelectedCategories([]);
  };

  const activeFiltersCount = [
    selectedCategory, 
    selectedDifficulty, 
    timeRange[0] > 0 || timeRange[1] < 180 ? 'tempo' : '', 
    servingsRange[0] > 1 || servingsRange[1] < 12 ? 'porcoes' : '',
    minRating > 0 ? 'rating' : '',
    selectedCategories.length > 0 ? 'multiplas_categorias' : ''
  ].filter(Boolean).length;

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-2">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-20 mb-8"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-12 h-12 text-yellow-300" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-orange-100 to-yellow-200 bg-clip-text text-transparent">
                  Universo de Sabores
                </h1>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Utensils className="w-12 h-12 text-yellow-300" />
                </motion.div>
              </div>
              <p className="text-orange-100 text-xl max-w-3xl mx-auto leading-relaxed">
                Descubra receitas incríveis criadas por chefs apaixonados de todo o mundo. Sua próxima criação culinária favorita está aqui!
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Advanced Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar receitas, ingredientes, chefs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 border-gray-200 focus:border-fitcooker-orange text-lg rounded-xl"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-2 border-2 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white h-12 px-6 rounded-xl font-semibold"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      Filtros Avançados
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-fitcooker-orange text-white">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>

                    {/* Quick Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48 h-12 rounded-xl border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" onClick={clearFilters} className="text-gray-600 hover:text-red-600">
                      Limpar Todos os Filtros
                    </Button>
                  )}
                </div>

                {/* Expanded Advanced Filters */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 pt-6 border-t-2 border-gray-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Basic Filters */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Categoria Principal</h4>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todas as categorias</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.nome}>
                                {category.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <h4 className="font-semibold text-gray-800 mt-4">Dificuldade</h4>
                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Selecione a dificuldade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Todas as dificuldades</SelectItem>
                            {difficulties.map((difficulty) => (
                              <SelectItem key={difficulty} value={difficulty}>
                                {difficulty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Range Filters */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-gray-800">Tempo de Preparo</h4>
                          </div>
                          <div className="px-3">
                            <Slider
                              value={timeRange}
                              onValueChange={setTimeRange}
                              max={180}
                              min={0}
                              step={5}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                              <span>{timeRange[0]} min</span>
                              <span>{timeRange[1]} min</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-green-600" />
                            <h4 className="font-semibold text-gray-800">Número de Porções</h4>
                          </div>
                          <div className="px-3">
                            <Slider
                              value={servingsRange}
                              onValueChange={setServingsRange}
                              max={12}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                              <span>{servingsRange[0]} porção{servingsRange[0] > 1 ? 'ões' : ''}</span>
                              <span>{servingsRange[1]} porç{servingsRange[1] > 1 ? 'ões' : 'ão'}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-yellow-600" />
                            <h4 className="font-semibold text-gray-800">Avaliação Mínima</h4>
                          </div>
                          <div className="px-3">
                            <Slider
                              value={[minRating]}
                              onValueChange={(value) => setMinRating(value[0])}
                              max={5}
                              min={0}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="text-sm text-gray-600 mt-2 text-center">
                              {minRating} estrela{minRating !== 1 ? 's' : ''} ou mais
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Multiple Categories */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Categorias Múltiplas</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategories.includes(category.nome)}
                                onCheckedChange={() => handleCategoryToggle(category.nome)}
                              />
                              <label htmlFor={`category-${category.id}`} className="text-sm font-medium">
                                {category.nome}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Active Filters Display */}
                    {activeFiltersCount > 0 && (
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-gray-800 mb-3">Filtros Ativos:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategory && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Categoria: {selectedCategory}
                            </Badge>
                          )}
                          {selectedDifficulty && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              Dificuldade: {selectedDifficulty}
                            </Badge>
                          )}
                          {(timeRange[0] > 0 || timeRange[1] < 180) && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              Tempo: {timeRange[0]}-{timeRange[1]} min
                            </Badge>
                          )}
                          {(servingsRange[0] > 1 || servingsRange[1] < 12) && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Porções: {servingsRange[0]}-{servingsRange[1]}
                            </Badge>
                          )}
                          {minRating > 0 && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Avaliação: {minRating}+ estrelas
                            </Badge>
                          )}
                          {selectedCategories.map(cat => (
                            <Badge key={cat} variant="secondary" className="bg-indigo-100 text-indigo-800">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              {filteredRecipes.length} Receita{filteredRecipes.length !== 1 ? 's' : ''} Encontrada{filteredRecipes.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-gray-600 mt-1">
              Mostrando os melhores resultados para sua busca
            </p>
          </motion.div>

          {/* Recipes Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }, (_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 8) }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <ChefHat className="w-24 h-24 text-gray-300 mx-auto mb-8" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Nenhuma receita encontrada
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Tente ajustar seus filtros ou explore diferentes termos de busca para descobrir receitas incríveis
                </p>
                <Button 
                  onClick={clearFilters} 
                  className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 px-8 py-3 text-lg"
                >
                  Limpar Todos os Filtros
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
