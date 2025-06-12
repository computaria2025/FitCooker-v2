
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ChefHat, ArrowLeft, Heart, Bookmark, Timer, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import RateRecipeButton from '@/components/recipe/RateRecipeButton';
import SaveRecipeButton from '@/components/recipe/SaveRecipeButton';
import MediaCarousel from '@/components/recipe/MediaCarousel';
import ShareButton from '@/components/recipe/ShareButton';
import RecipeReviews from '@/components/recipe/RecipeReviews';
import MacroDisplay from '@/components/ui/MacroDisplay';

interface RecipeDetailData {
  id: number;
  titulo: string;
  descricao: string;
  tempo_preparo: number;
  porcoes: number;
  dificuldade: string;
  imagem_url: string;
  nota_media: number;
  avaliacoes_count: number;
  created_at: string;
  usuario_id: string;
  profiles: {
    nome: string;
    avatar_url: string;
    bio: string;
  };
  receita_categorias: Array<{
    categorias: {
      nome: string;
    };
  }>;
  receita_ingredientes: Array<{
    quantidade: number;
    unidade: string;
    ordem: number;
    ingredientes: {
      nome: string;
    };
  }>;
  receita_passos: Array<{
    ordem: number;
    descricao: string;
  }>;
  informacao_nutricional: Array<{
    calorias_totais: number;
    proteinas_totais: number;
    carboidratos_totais: number;
    gorduras_totais: number;
  }>;
  receita_midias: Array<{
    id: number;
    url: string;
    tipo: 'image' | 'video';
    is_principal: boolean;
    ordem: number;
  }>;
}

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<RecipeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipeDetail();
    }
  }, [id]);

  const fetchRecipeDetail = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url, bio),
          receita_categorias(categorias(nome)),
          receita_ingredientes(quantidade, unidade, ordem, ingredientes(nome)),
          receita_passos(ordem, descricao),
          informacao_nutricional(*),
          receita_midias(*)
        `)
        .eq('id', id)
        .eq('status', 'ativa')
        .single();

      if (error) throw error;
      if (!data) throw new Error('Receita não encontrada');

      setRecipe(data);
    } catch (err) {
      console.error('Erro ao buscar receita:', err);
      setError('Receita não encontrada');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingUpdate = () => {
    fetchRecipeDetail();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Receita não encontrada</h1>
            <p className="text-gray-600 mb-8">A receita que você está procurando não existe ou foi removida.</p>
            <Button onClick={() => navigate('/recipes')} className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Receitas
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categories = recipe.receita_categorias?.map(rc => rc.categorias?.nome).filter(Boolean) || [];
  const ingredients = recipe.receita_ingredientes?.sort((a, b) => a.ordem - b.ordem) || [];
  const steps = recipe.receita_passos?.sort((a, b) => a.ordem - b.ordem) || [];
  const nutritionInfo = recipe.informacao_nutricional?.[0];
  const mediaItems = recipe.receita_midias?.sort((a, b) => a.ordem - b.ordem) || [];

  const macros = {
    calories: nutritionInfo?.calorias_totais || 0,
    protein: nutritionInfo?.proteinas_totais || 0,
    carbs: nutritionInfo?.carboidratos_totais || 0,
    fat: nutritionInfo?.gorduras_totais || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-orange-100 text-gray-700 hover:text-fitcooker-orange transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recipe Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-0">
                    {/* Media Carousel */}
                    <div className="relative">
                      <MediaCarousel 
                        mediaItems={mediaItems}
                        className="w-full"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                          <Badge key={index} className="bg-white/90 text-fitcooker-orange border-fitcooker-orange">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
                      >
                        {recipe.titulo}
                      </motion.h1>
                      <p className="text-gray-600 leading-relaxed mb-8 text-lg">{recipe.descricao}</p>
                      
                      {/* Recipe Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
                        >
                          <Timer className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="font-bold text-blue-800 text-lg">{recipe.tempo_preparo}min</div>
                          <div className="text-xs text-blue-600">Preparo</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
                        >
                          <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <div className="font-bold text-green-800 text-lg">{recipe.porcoes}</div>
                          <div className="text-xs text-green-600">Porções</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200"
                        >
                          <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                          <div className="font-bold text-yellow-800 text-lg">{recipe.nota_media?.toFixed(1) || '0.0'}</div>
                          <div className="text-xs text-yellow-600">Avaliação</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200"
                        >
                          <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                          <div className="font-bold text-purple-800 text-lg">{recipe.dificuldade}</div>
                          <div className="text-xs text-purple-600">Dificuldade</div>
                        </motion.div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <RateRecipeButton 
                          recipeId={recipe.id} 
                          currentRating={recipe.nota_media || 0}
                          onRatingUpdate={handleRatingUpdate}
                        />
                        <SaveRecipeButton recipeId={recipe.id} />
                        <ShareButton recipeId={recipe.id} recipeTitle={recipe.titulo} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Ingredients */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-100/50">
                    <CardTitle className="text-xl text-green-800">🥗 Ingredientes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-3">
                      {ingredients.map((ingredient, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200 hover:shadow-md transition-all"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="flex-1 font-medium">
                            <span className="text-green-800 font-bold">{ingredient.quantidade} {ingredient.unidade}</span>
                            <span className="text-gray-700 ml-2">{ingredient.ingredientes.nome}</span>
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-100/50">
                    <CardTitle className="text-xl text-orange-800">👨‍🍳 Modo de Preparo</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {steps.map((step, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100/30 rounded-lg border border-orange-200"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-fitcooker-orange to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {step.ordem}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed text-lg">{step.descricao}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recipe Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RecipeReviews 
                  recipeId={recipe.id}
                  averageRating={recipe.nota_media || 0}
                  totalReviews={recipe.avaliacoes_count || 0}
                />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Author Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-100/50">
                    <CardTitle className="text-purple-800">👨‍🍳 Chef</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-20 h-20 border-4 border-purple-200">
                        <AvatarImage src={recipe.profiles?.avatar_url || ''} />
                        <AvatarFallback className="bg-purple-100">
                          <ChefHat className="w-10 h-10 text-purple-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900">{recipe.profiles?.nome}</h3>
                        {recipe.profiles?.bio && (
                          <p className="text-sm text-gray-600 line-clamp-3 mt-2">{recipe.profiles.bio}</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 font-semibold"
                      onClick={() => navigate(`/cook/${recipe.usuario_id}`)}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Ver Perfil
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Nutritional Information */}
              {nutritionInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-100/50">
                      <CardTitle className="text-blue-800">📊 Informações Nutricionais</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <MacroDisplay 
                        calories={macros.calories}
                        protein={macros.protein}
                        carbs={macros.carbs}
                        fat={macros.fat}
                        compact={false}
                      />
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 text-center font-medium">
                          ⚡ Valores por porção ({recipe.porcoes} porções no total)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
