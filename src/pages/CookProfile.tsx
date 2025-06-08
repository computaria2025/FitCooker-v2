
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Award, ChefHat, Heart, ArrowLeft, Calendar, MapPin, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRecipes } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/ui/RecipeCard';
import LoginPrompt from '@/components/add-recipe/LoginPrompt';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface CookProfile {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
  is_chef: boolean;
  data_cadastro: string;
}

const CookProfile: React.FC = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [cookProfile, setCookProfile] = useState<CookProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { recipes, loading: recipesLoading } = useRecipes();
  const { toast } = useToast();
  
  // Mock auth state - in a real app, this would come from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCookProfile();
    }
  }, [id]);

  const fetchCookProfile = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      console.log('Fetching cook profile for ID:', id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching cook profile:', error);
        setError('Chef não encontrado');
        return;
      }

      console.log('Cook profile data:', data);
      setCookProfile(data);
    } catch (error) {
      console.error('Unexpected error fetching cook profile:', error);
      setError('Erro ao carregar perfil do chef');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter recipes by the cook's user ID
  const cookRecipes = recipes.filter(recipe => recipe.usuario_id === id).slice(0, 6);

  const handleFollow = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Deixou de seguir" : "Seguindo chef",
      description: isFollowing 
        ? `Você deixou de seguir ${cookProfile?.nome}` 
        : `Agora você está seguindo ${cookProfile?.nome}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-fitcooker-orange/20 border-t-fitcooker-orange mx-auto mb-6"></div>
            <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-fitcooker-orange" />
          </div>
          <p className="text-gray-600 font-medium">Carregando perfil do chef...</p>
        </motion.div>
        <Footer />
      </div>
    );
  }

  if (error || !cookProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chef não encontrado</h2>
            <p className="text-gray-600 mb-6">
              O perfil que você está procurando não existe ou foi removido.
            </p>
            <Link to="/cooks" className="text-fitcooker-orange hover:underline font-medium">
              ← Voltar para lista de chefs
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/cooks"
            className="inline-flex items-center text-fitcooker-orange hover:text-fitcooker-orange/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para chefs
          </Link>
        </motion.div>

        {/* Enhanced Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8"
        >
          {/* Header Background */}
          <div className="relative h-40 bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative -mt-20 mb-6 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full blur-xl opacity-40"></div>
                <Avatar className="relative w-40 h-40 border-6 border-white shadow-2xl">
                  <AvatarImage src={cookProfile.avatar_url || ''} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white">
                    <ChefHat className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                {cookProfile.is_chef && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Award className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{cookProfile.nome}</h1>
                  {cookProfile.is_chef && (
                    <Badge className="bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white border-0 mb-4 text-sm px-4 py-1">
                      <ChefHat className="w-4 h-4 mr-2" />
                      Chef Verificado
                    </Badge>
                  )}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-6"
                >
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
                    <Users className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-semibold text-gray-900">{cookProfile.seguidores_count.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">seguidores</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
                    <ChefHat className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-semibold text-gray-900">{cookProfile.receitas_count}</span>
                    <span className="text-gray-500 ml-1">receitas</span>
                  </div>
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl">
                    <Heart className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-semibold text-gray-900">{cookProfile.seguindo_count}</span>
                    <span className="text-gray-500 ml-1">seguindo</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm text-gray-600 mb-6"
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Membro desde {new Date(cookProfile.data_cadastro).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </motion.div>

                {cookProfile.bio && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 leading-relaxed text-lg"
                  >
                    {cookProfile.bio}
                  </motion.p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="lg:w-auto flex justify-center"
              >
                <Button
                  onClick={handleFollow}
                  size="lg"
                  className={`px-8 py-3 font-medium transition-all duration-300 ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-r from-fitcooker-orange to-orange-500 hover:from-fitcooker-orange hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                  {isFollowing ? "Seguindo" : "Seguir Chef"}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Recipes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Receitas do Chef</h2>
            <span className="text-gray-500 text-lg">{cookRecipes.length} receita{cookRecipes.length !== 1 ? 's' : ''}</span>
          </div>

          {recipesLoading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-fitcooker-orange mx-auto mb-4" />
              <p className="text-gray-500">Carregando receitas...</p>
            </div>
          ) : cookRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cookRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1) }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100"
            >
              <ChefHat className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">Nenhuma receita encontrada</h3>
              <p className="text-gray-500 text-lg">Este chef ainda não publicou receitas em nossa plataforma.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Login Prompt Dialog */}
      <LoginPrompt 
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
      />

      <Footer />
    </div>
  );
};

export default CookProfile;
