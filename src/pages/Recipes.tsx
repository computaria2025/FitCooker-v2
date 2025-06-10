
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChefHat, Clock, Users, Star, TrendingUp, Award } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import { useRecipes } from '@/hooks/useRecipes';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Recipes: React.FC = () => {
  const { recipes, loading } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    averageRating: 0,
    totalChefs: 0,
    activeRecipes: 0
  });

  // Fetch real statistics from database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total recipes count
        const { count: totalRecipes } = await supabase
          .from('receitas')
          .select('*', { count: 'exact', head: true });

        // Get active recipes count
        const { count: activeRecipes } = await supabase
          .from('receitas')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'ativa');

        // Get average rating
        const { data: avgData } = await supabase
          .from('receitas')
          .select('nota_media')
          .eq('status', 'ativa')
          .not('nota_media', 'is', null);

        const averageRating = avgData && avgData.length > 0 
          ? avgData.reduce((sum, recipe) => sum + (recipe.nota_media || 0), 0) / avgData.length
          : 0;

        // Get total chefs count
        const { count: totalChefs } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalRecipes: totalRecipes || 0,
          averageRating: Number(averageRating.toFixed(1)),
          totalChefs: totalChefs || 0,
          activeRecipes: activeRecipes || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categorias')
          .select('nome')
          .eq('ativa', true);

        if (error) throw error;

        setCategories(data?.map(cat => cat.nome) || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = !selectedCategory || recipe.categories.includes(selectedCategory);
    
    const matchesDifficulty = !selectedDifficulty || recipe.dificuldade === selectedDifficulty;
    
    const matchesTime = !selectedTime || (() => {
      const time = recipe.tempo_preparo;
      switch (selectedTime) {
        case 'quick': return time <= 30;
        case 'medium': return time > 30 && time <= 60;
        case 'long': return time > 60;
        default: return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSelectedTime('');
  };

  const activeFiltersCount = [selectedCategory, selectedDifficulty, selectedTime].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-fitcooker-orange/20 border-t-fitcooker-orange mx-auto mb-6"></div>
              <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-fitcooker-orange" />
            </div>
            <p className="text-gray-600 font-medium">Carregando receitas deliciosas...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="flex-grow py-2">
        {/* Enhanced Header Section with Animated Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-12 mb-8"
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Descubra Receitas Incríveis
              </h1>
              <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                Explore nossa coleção de receitas saudáveis e saborosas criadas por chefs talentosos
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Stats Section with Real Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-orange-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-2xl mx-auto mb-4">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mb-1">{stats.totalRecipes}</p>
                  <p className="text-sm text-gray-600">Total de Receitas</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-yellow-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-2xl mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600 mb-1">{stats.averageRating}</p>
                  <p className="text-sm text-gray-600">Avaliação Média</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-green-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-2xl mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-1">{stats.activeRecipes}</p>
                  <p className="text-sm text-gray-600">Receitas Ativas</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-blue-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-2xl mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">{stats.totalChefs}</p>
                  <p className="text-sm text-gray-600">Chefs Ativos</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6 shadow-lg">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar receitas, ingredientes ou categorias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-fitcooker-orange"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tempo de preparo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Até 30 min</SelectItem>
                      <SelectItem value="medium">30-60 min</SelectItem>
                      <SelectItem value="long">Mais de 60 min</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex items-center justify-center"
                    disabled={activeFiltersCount === 0}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Limpar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </Button>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('')}>
                        {selectedCategory} ×
                      </Badge>
                    )}
                    {selectedDifficulty && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedDifficulty('')}>
                        {selectedDifficulty} ×
                      </Badge>
                    )}
                    {selectedTime && (
                      <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedTime('')}>
                        {selectedTime === 'quick' ? 'Até 30 min' : 
                         selectedTime === 'medium' ? '30-60 min' : 'Mais de 60 min'} ×
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recipes Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm || activeFiltersCount > 0 ? 'Resultados da busca' : 'Todas as Receitas'}
              </h2>
              <span className="text-gray-500">
                {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
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
                <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchTerm || activeFiltersCount > 0 ? 'Nenhuma receita encontrada' : 'Nenhuma receita disponível'}
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  {searchTerm || activeFiltersCount > 0
                    ? 'Tente ajustar sua busca ou filtros'
                    : 'Seja o primeiro a compartilhar uma receita deliciosa!'
                  }
                </p>
                {(searchTerm || activeFiltersCount > 0) && (
                  <Button 
                    onClick={clearFilters}
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                  >
                    Limpar Filtros
                  </Button>
                )}
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
