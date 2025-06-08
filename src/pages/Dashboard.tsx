
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users, Heart, Clock, ChefHat, Bookmark } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';

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
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 md:px-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta! 👋
            </h1>
            <p className="text-gray-600">
              Descubra novas receitas e acompanhe suas favoritas
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <ChefHat className="w-8 h-8 text-fitcooker-orange mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRecipes}</p>
                  <p className="text-sm text-gray-600">Receitas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-fitcooker-orange mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalChefs}</p>
                  <p className="text-sm text-gray-600">Chefs</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-fitcooker-orange mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                  <p className="text-sm text-gray-600">Categorias</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <Bookmark className="w-8 h-8 text-fitcooker-orange mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.savedRecipes}</p>
                  <p className="text-sm text-gray-600">Salvos</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Recipes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Receitas em Destaque</h2>
              <Link to="/recipes" className="text-fitcooker-orange hover:underline">
                Ver todas →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </motion.section>

          {/* Featured Chefs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chefs em Destaque</h2>
              <Link to="/cooks" className="text-fitcooker-orange hover:underline">
                Ver todos →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredChefs.map((chef) => (
                <Link
                  key={chef.id}
                  to={`/cook/${chef.id}`}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <img
                      src={chef.avatar_url || '/placeholder.svg'}
                      alt={chef.nome}
                      className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{chef.nome}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{chef.bio}</p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <span>{chef.seguidores_count} seguidores</span>
                      <span>{chef.receitas_count} receitas</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Saved Recipes */}
          {savedRecipes.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Minhas Receitas Salvas</h2>
                <Link to="/saved" className="text-fitcooker-orange hover:underline">
                  Ver todas →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
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
