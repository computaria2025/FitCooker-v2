
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ChefHat, Calendar, MapPin, Heart, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import RecipeCard from '@/components/ui/RecipeCard';
import FollowButton from '@/components/ui/FollowButton';
import { Recipe } from '@/types/recipe';

interface CookProfile {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  preferencias: string[] | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
  data_cadastro: string;
  is_chef: boolean;
}

const CookProfile: React.FC = () => {
  const { cookId } = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<CookProfile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cookId) {
      fetchCookProfile();
      fetchCookRecipes();
    }
  }, [cookId]);

  const fetchCookProfile = async () => {
    if (!cookId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', cookId)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil do chef:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil do chef.",
        variant: "destructive",
      });
    }
  };

  const fetchCookRecipes = async () => {
    if (!cookId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('usuario_id', cookId)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRecipes: Recipe[] = (data || []).map((recipe: any) => ({
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

      setRecipes(formattedRecipes);
    } catch (error) {
      console.error('Erro ao buscar receitas do chef:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as receitas do chef.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <p>Carregando perfil...</p>
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
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <div className="relative h-48 bg-gradient-to-r from-fitcooker-orange via-orange-500 to-red-500">
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              
              <CardContent className="relative pt-0 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-24">
                  <Avatar className="w-48 h-48 border-6 border-white shadow-2xl ring-4 ring-fitcooker-orange/20">
                    <AvatarImage src={profile.avatar_url || ''} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-200 text-6xl">
                      <User className="w-24 h-24 text-orange-600" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2 md:mb-0">
                        {profile.nome}
                        {profile.is_chef && (
                          <ChefHat className="inline-block w-8 h-8 text-fitcooker-orange ml-3" />
                        )}
                      </h1>
                      <FollowButton targetUserId={profile.id} className="px-8 py-3" />
                    </div>
                    
                    {profile.bio && (
                      <p className="text-gray-600 leading-relaxed mb-6 text-lg max-w-2xl">
                        {profile.bio}
                      </p>
                    )}
                    
                    <div className="flex justify-center md:justify-start gap-8">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 min-w-[120px]"
                      >
                        <div className="text-3xl font-bold text-blue-700">{profile.receitas_count}</div>
                        <div className="text-sm text-blue-600">Receitas</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 min-w-[120px]"
                      >
                        <div className="text-3xl font-bold text-green-700">{profile.seguidores_count}</div>
                        <div className="text-sm text-green-600">Seguidores</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 min-w-[120px]"
                      >
                        <div className="text-3xl font-bold text-purple-700">{profile.seguindo_count}</div>
                        <div className="text-sm text-purple-600">Seguindo</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          {profile.preferencias && profile.preferencias.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-fitcooker-orange" />
                    Especialidades Culinárias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferencias.map((preference, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                        {preference}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recipes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-fitcooker-orange" />
                  Receitas de {profile.nome} ({recipes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-t"></div>
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : recipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <RecipeCard recipe={recipe} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma receita ainda</h3>
                    <p className="text-gray-600">Este chef ainda não publicou nenhuma receita.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookProfile;
