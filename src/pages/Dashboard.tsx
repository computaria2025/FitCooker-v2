
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Plus, TrendingUp, Heart, Star, Users, Trophy, Sparkles, BookOpen, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/ui/RecipeCard';
import { Recipe } from '@/types/recipe';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { recipes, loading } = useRecipes();
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalViews: 0,
    avgRating: 0,
    savedRecipes: 0
  });
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get user's recipes count and stats
      const { data: userRecipes } = await supabase
        .from('receitas')
        .select('visualizacoes, nota_media')
        .eq('usuario_id', user.id)
        .eq('status', 'ativa');

      // Get saved recipes count
      const { data: savedRecipes } = await supabase
        .from('receitas_salvas')
        .select('id')
        .eq('usuario_id', user.id);

      const totalRecipes = userRecipes?.length || 0;
      const totalViews = userRecipes?.reduce((sum, recipe) => sum + (recipe.visualizacoes || 0), 0) || 0;
      const validRatings = userRecipes?.filter(r => r.nota_media > 0) || [];
      const avgRating = validRatings.length > 0 
        ? validRatings.reduce((sum, recipe) => sum + recipe.nota_media, 0) / validRatings.length 
        : 0;

      setStats({
        totalRecipes,
        totalViews,
        avgRating,
        savedRecipes: savedRecipes?.length || 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      setLoadingSaved(true);
      
      const { data, error } = await supabase
        .from('receitas_salvas')
        .select(`
          receitas(
            *,
            profiles(nome, avatar_url),
            receita_categorias(categorias(nome)),
            informacao_nutricional(*)
          )
        `)
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;

      const formattedRecipes: Recipe[] = (data || [])
        .filter(item => item.receitas)
        .map((item: any) => {
          const recipe = item.receitas;
          return {
            id: recipe.id,
            titulo: recipe.titulo,
            descricao: recipe.descricao,
            imagem_url: recipe.imagem_url || '/placeholder.svg',
            tempo_preparo: recipe.tempo_preparo,
            porcoes: recipe.porcoes,
            dificuldade: recipe.dificuldade,
            nota_media: recipe.nota_media || 0,
            avaliacoes_count: recipe.avaliacoes_count || 0,
            created_at: recipe.created_at,
            usuario_id: recipe.usuario_id,
            
            title: recipe.titulo,
            description: recipe.descricao,
            imageUrl: recipe.imagem_url || '/placeholder.svg',
            preparationTime: recipe.tempo_preparo,
            servings: recipe.porcoes,
            difficulty: recipe.dificuldade,
            rating: recipe.nota_media || 0,
            
            author: {
              id: recipe.usuario_id,
              name: recipe.profiles?.nome || 'Chef Anônimo',
              avatarUrl: recipe.profiles?.avatar_url || '/placeholder.svg'
            },
            categories: recipe.receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
            macros: {
              calories: recipe.informacao_nutricional?.[0]?.calorias_totais || 0,
              protein: recipe.informacao_nutricional?.[0]?.proteinas_totais || 0,
              carbs: recipe.informacao_nutricional?.[0]?.carboidratos_totais || 0,
              fat: recipe.informacao_nutricional?.[0]?.gorduras_totais || 0
            }
          };
        });

      setSavedRecipes(formattedRecipes);
    } catch (error) {
      console.error('Erro ao buscar receitas salvas:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  const recentRecipes = recipes
    .filter(recipe => recipe.author.id === user?.id)
    .slice(0, 6);

  const featuredRecipes = recipes
    .filter(recipe => recipe.rating >= 4.0)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="pt-20 pb-16">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-20 mb-12"
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
          
          <div className="relative container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className="w-12 h-12 text-yellow-300" />
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  Bem-vindo, Chef!
                </h1>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <ChefHat className="w-12 h-12 text-yellow-300" />
                </motion.div>
              </div>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed mb-8">
                🎉 Agora você é um chef no <span className="font-bold">FitCooker</span>! Comece a criar receitas incríveis ou explore o universo culinário de outros chefs apaixonados.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-fitcooker-orange hover:bg-orange-50 font-semibold text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/add-recipe" className="gap-3">
                    <Plus className="w-5 h-5" />
                    Criar Minha Primeira Receita
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 md:px-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <Card className="text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalRecipes}</div>
                <div className="text-sm text-gray-600">Receitas Criadas</div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalViews}</div>
                <div className="text-sm text-gray-600">Visualizações</div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.avgRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avaliação Média</div>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.savedRecipes}</div>
                <div className="text-sm text-gray-600">Receitas Salvas</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Recipes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Suas Receitas Recentes</h2>
              <Button 
                asChild 
                variant="outline" 
                className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
              >
                <Link to="/profile">Ver Todas</Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recentRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
                <CardContent>
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Comece sua jornada culinária!</h3>
                  <p className="text-gray-600 mb-6">Você ainda não criou nenhuma receita. Que tal compartilhar sua primeira criação?</p>
                  <Button 
                    asChild 
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                  >
                    <Link to="/add-recipe">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Receita
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.section>

          {/* Saved Recipes Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                Receitas Salvas
              </h2>
              <Button 
                asChild 
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Link to="/profile?tab=saved">Ver Todas</Link>
              </Button>
            </div>

            {loadingSaved ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : savedRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 bg-purple-50/50">
                <CardContent>
                  <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma receita salva ainda</h3>
                  <p className="text-gray-600 mb-6">Explore receitas incríveis e salve suas favoritas!</p>
                  <Button 
                    asChild 
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Link to="/recipes">
                      <Heart className="w-4 h-4 mr-2" />
                      Explorar Receitas
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.section>

          {/* Featured Recipes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-fitcooker-orange" />
                Receitas em Destaque
              </h2>
              <Button 
                asChild 
                variant="outline"
                className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
              >
                <Link to="/recipes">Explorar Mais</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
