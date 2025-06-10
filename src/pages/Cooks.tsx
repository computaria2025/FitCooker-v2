
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Users, Star, Award, Search, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Chef {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  receitas_count: number;
  seguidores_count: number;
  is_chef: boolean;
  preferencias: string[] | null;
  nota_media: number | null;
}

const Cooks: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      console.log('Fetching chefs...');
      
      // Get all profiles with chef statistics
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('receitas_count', { ascending: false });

      if (error) {
        console.error('Error fetching chefs:', error);
        return;
      }

      // Calculate average rating for each chef based on their recipes
      const chefsWithRatings = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: recipes } = await supabase
            .from('receitas')
            .select('nota_media')
            .eq('usuario_id', profile.id)
            .not('nota_media', 'is', null);

          let averageRating = null;
          if (recipes && recipes.length > 0) {
            const validRatings = recipes.filter(r => r.nota_media > 0);
            if (validRatings.length > 0) {
              averageRating = validRatings.reduce((sum, recipe) => sum + recipe.nota_media, 0) / validRatings.length;
            }
          }

          return {
            ...profile,
            nota_media: averageRating ? Number(averageRating.toFixed(1)) : null
          };
        })
      );

      console.log('Chefs with ratings:', chefsWithRatings);
      setChefs(chefsWithRatings);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChefs = chefs.filter(chef =>
    chef.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chef.bio && chef.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (chef.preferencias && chef.preferencias.some(pref => 
      pref.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30 flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-fitcooker-orange/20 border-t-fitcooker-orange mx-auto mb-6"></div>
            <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-fitcooker-orange" />
          </div>
          <p className="text-gray-600 font-medium">Carregando nossos chefs talentosos...</p>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-2">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-16 mb-12"
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
                Nossos Chefs Talentosos
              </h1>
              <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                Conheça os chefs que compartilham suas receitas incríveis conosco
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-200 focus:border-fitcooker-orange"
              />
            </div>
          </motion.div>

          {/* Chefs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os Chefs'}
              </h2>
              <span className="text-gray-500">
                {filteredChefs.length} chef{filteredChefs.length !== 1 ? 's' : ''} encontrado{filteredChefs.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredChefs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredChefs.map((chef, index) => (
                  <motion.div
                    key={chef.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                  >
                    <Link to={`/cook/${chef.id}`}>
                      <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-0">
                          {/* Chef Header */}
                          <div className="relative bg-gradient-to-br from-fitcooker-orange/10 to-orange-100/50 p-6 text-center">
                            <div className="relative inline-block mb-4">
                              <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                              <Avatar className="relative w-20 h-20 border-4 border-white shadow-lg mx-auto">
                                <AvatarImage src={chef.avatar_url || ''} className="object-cover" />
                                <AvatarFallback className="text-xl bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white">
                                  <ChefHat className="w-8 h-8" />
                                </AvatarFallback>
                              </Avatar>
                              {chef.is_chef && (
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                                >
                                  <Award className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-fitcooker-orange transition-colors duration-300">
                              {chef.nome}
                            </h3>
                            
                            {chef.is_chef && (
                              <Badge className="bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white border-0 mb-3">
                                <ChefHat className="w-3 h-3 mr-1" />
                                Chef Verificado
                              </Badge>
                            )}
                          </div>

                          {/* Chef Info */}
                          <div className="p-6 space-y-4">
                            {/* Bio */}
                            {chef.bio && (
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                {chef.bio}
                              </p>
                            )}

                            {/* Preferences */}
                            {chef.preferencias && chef.preferencias.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Preferências:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {chef.preferencias.slice(0, 3).map((pref, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs px-2 py-1 border-fitcooker-orange/30 text-fitcooker-orange">
                                      {pref}
                                    </Badge>
                                  ))}
                                  {chef.preferencias.length > 3 && (
                                    <Badge variant="outline" className="text-xs px-2 py-1 border-gray-300 text-gray-500">
                                      +{chef.preferencias.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Statistics */}
                            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                              <div className="text-center">
                                <div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-lg mx-auto mb-1">
                                  <ChefHat className="w-4 h-4 text-fitcooker-orange" />
                                </div>
                                <p className="text-lg font-bold text-gray-900">{chef.receitas_count}</p>
                                <p className="text-xs text-gray-500">Receitas</p>
                              </div>
                              
                              <div className="text-center">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg mx-auto mb-1">
                                  <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-lg font-bold text-gray-900">{chef.seguidores_count}</p>
                                <p className="text-xs text-gray-500">Seguidores</p>
                              </div>
                              
                              <div className="text-center">
                                <div className="flex items-center justify-center w-8 h-8 bg-yellow-50 rounded-lg mx-auto mb-1">
                                  <Star className="w-4 h-4 text-yellow-600" />
                                </div>
                                <p className="text-lg font-bold text-gray-900">
                                  {chef.nota_media ? chef.nota_media.toFixed(1) : '--'}
                                </p>
                                <p className="text-xs text-gray-500">Avaliação</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
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
                  {searchTerm ? 'Nenhum chef encontrado' : 'Nenhum chef disponível'}
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  {searchTerm 
                    ? 'Tente ajustar sua busca ou explorar outros termos'
                    : 'Seja o primeiro chef a se juntar à nossa plataforma!'
                  }
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    Limpar Busca
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
