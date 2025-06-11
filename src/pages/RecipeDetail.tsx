
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, ChefHat, ArrowLeft, Heart, Bookmark } from 'lucide-react';
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
import NutritionalInfo from '@/components/recipe/NutritionalInfo';
import ShareButton from '@/components/recipe/ShareButton';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
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
              className="gap-2 hover:bg-gray-100"
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
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Media Carousel */}
                    <MediaCarousel 
                      mediaItems={mediaItems}
                      className="w-full"
                    />
                    
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.titulo}</h1>
                      <p className="text-gray-600 leading-relaxed mb-6">{recipe.descricao}</p>
                      
                      {/* Recipe Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Clock className="w-5 h-5 text-fitcooker-orange mx-auto mb-1" />
                          <div className="font-bold text-gray-900">{recipe.tempo_preparo}min</div>
                          <div className="text-xs text-gray-500">Preparo</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Users className="w-5 h-5 text-fitcooker-orange mx-auto mb-1" />
                          <div className="font-bold text-gray-900">{recipe.porcoes}</div>
                          <div className="text-xs text-gray-500">Porções</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <Star className="w-5 h-5 text-fitcooker-orange mx-auto mb-1" />
                          <div className="font-bold text-gray-900">{recipe.nota_media?.toFixed(1) || '0.0'}</div>
                          <div className="text-xs text-gray-500">Avaliação</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <ChefHat className="w-5 h-5 text-fitcooker-orange mx-auto mb-1" />
                          <div className="font-bold text-gray-900">{recipe.dificuldade}</div>
                          <div className="text-xs text-gray-500">Dificuldade</div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <RateRecipeButton recipeId={recipe.id} />
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
                <Card>
                  <CardHeader>
                    <CardTitle>Ingredientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-fitcooker-orange rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="flex-1">
                            <span className="font-medium">{ingredient.quantidade} {ingredient.unidade}</span> de{' '}
                            <span className="text-gray-900">{ingredient.ingredientes.nome}</span>
                          </span>
                        </div>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Modo de Preparo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-fitcooker-orange rounded-full flex items-center justify-center text-white font-bold">
                            {step.ordem}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed">{step.descricao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Chef</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={recipe.profiles?.avatar_url || ''} />
                        <AvatarFallback>
                          <ChefHat className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{recipe.profiles?.nome}</h3>
                        {recipe.profiles?.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2">{recipe.profiles.bio}</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
                      onClick={() => navigate(`/cook/${recipe.usuario_id}`)}
                    >
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
                  <NutritionalInfo 
                    macros={macros}
                    servings={recipe.porcoes}
                  />
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
