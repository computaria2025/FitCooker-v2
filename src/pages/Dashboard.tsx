import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users, Heart, Clock, ChefHat, Bookmark, Award, Trophy, Zap, Target } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardStats {
  totalRecipes: number;
  totalChefs: number;
  totalCategories: number;
  savedRecipes: number;
}

interface FeaturedChef {
  id: string;
  nome: string;
  avatar_url: string;
  seguidores_count: number;
  receitas_count: number;
  bio: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [featuredChefs, setFeaturedChefs] = useState<FeaturedChef[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRecipes: 0,
    totalChefs: 0,
    totalCategories: 0,
    savedRecipes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch featured recipes (top rated)
      const { data: recipes } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('status', 'ativa')
        .order('nota_media', { ascending: false })
        .limit(6);

      // Fetch featured chefs (most followers)
      const { data: chefs } = await supabase
        .from('profiles')
        .select('*')
        .order('seguidores_count', { ascending: false })
        .limit(4);

      // Fetch user's saved recipes
      const { data: saved } = await supabase
        .from('receitas_salvas')
        .select(`
          receitas(
            *,
            profiles(nome, avatar_url),
            receita_categorias(categorias(nome)),
            informacao_nutricional(*)
          )
        `)
        .eq('usuario_id', user?.id)
        .limit(4);

      // Fetch user's own recipes
      const { data: userRecipesData } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('usuario_id', user?.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(4);

      // Fetch statistics
      const [recipesCount, chefsCount, categoriesCount, savedCount] = await Promise.all([
        supabase.from('receitas').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('categorias').select('*', { count: 'exact', head: true }),
        supabase.from('receitas_salvas').select('*', { count: 'exact', head: true }).eq('usuario_id', user?.id)
      ]);

      // Format recipes data
      const formattedRecipes = (recipes || []).map((recipe: any) => ({
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
      }));

      const formattedSaved = (saved || []).map((item: any) => {
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

      setUserRecipes(formattedUserRecipes);
      setFeaturedRecipes(formattedRecipes);
      setFeaturedChefs(chefs || []);
      setSavedRecipes(formattedSaved);
      setStats({
        totalRecipes: recipesCount.count || 0,
        totalChefs: chefsCount.count || 0,
        totalCategories: categoriesCount.count || 0,
        savedRecipes: savedCount.count || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <p className="text-gray-600 font-medium">Carregando seu dashboard personalizado...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white"
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
          
          <div className="relative container mx-auto px-4 md:px-6 py-16">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-4 mb-6"
              >
                <Avatar className="w-16 h-16 border-4 border-white/20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-white/20">
                    {user?.user_metadata?.nome?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Olá, {user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Chef'}! 👋
                  </h1>
                  <p className="text-xl text-orange-100">
                    Pronto para criar algo delicioso hoje?
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/add-recipe">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    <span className="font-medium">Criar Nova Receita</span>
                  </motion.div>
                </Link>
                <Link to="/recipes">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    <span className="font-medium">Explorar Receitas</span>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 py-12">
          {/* Enhanced Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-blue-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-2xl mx-auto mb-4">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-1">{userRecipes.length}</p>
                  <p className="text-sm text-gray-600">Minhas Receitas</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-green-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-2xl mx-auto mb-4">
                    <Bookmark className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-1">{stats.savedRecipes}</p>
                  <p className="text-sm text-gray-600">Receitas Salvas</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-orange-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-2xl mx-auto mb-4">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-orange-600 mb-1">{stats.totalRecipes}</p>
                  <p className="text-sm text-gray-600">Total Receitas</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="border-0 bg-gradient-to-br from-white to-purple-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-2xl mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600 mb-1">{stats.totalChefs}</p>
                  <p className="text-sm text-gray-600">Chefs Ativos</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* User's Recipes */}
          {userRecipes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Minhas Receitas</h2>
                  <p className="text-gray-600">Suas criações culinárias mais recentes</p>
                </div>
                <Link to="/profile" className="text-fitcooker-orange hover:underline font-medium">
                  Gerenciar todas →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Featured Recipes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Receitas Recomendadas</h2>
                <p className="text-gray-600">Descobertas especiais baseadas no seu gosto</p>
              </div>
              <Link to="/recipes" className="text-fitcooker-orange hover:underline font-medium">
                Ver todas →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe, index) => (
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
          </motion.section>

          {/* Featured Chefs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Chefs em Destaque</h2>
                <p className="text-gray-600">Conheça os talentos da nossa comunidade</p>
              </div>
              <Link to="/cooks" className="text-fitcooker-orange hover:underline font-medium">
                Ver todos →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredChefs.map((chef, index) => (
                <motion.div
                  key={chef.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/cook/${chef.id}`}>
                    <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-4 border-4 border-fitcooker-orange/20">
                          <AvatarImage src={chef.avatar_url || ''} />
                          <AvatarFallback className="bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white">
                            <ChefHat className="w-8 h-8" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <h3 className="font-bold text-gray-900 mb-2">{chef.nome}</h3>
                        {chef.bio && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{chef.bio}</p>
                        )}
                        
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{chef.seguidores_count}</span>
                          </div>
                          <div className="flex items-center">
                            <ChefHat className="w-4 h-4 mr-1" />
                            <span>{chef.receitas_count}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Saved Recipes */}
          {savedRecipes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Receitas Salvas</h2>
                  <p className="text-gray-600">Suas receitas favoritas para cozinhar depois</p>
                </div>
                <Link to="/saved" className="text-fitcooker-orange hover:underline font-medium">
                  Ver todas →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
