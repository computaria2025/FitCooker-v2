
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Star, Users, Search, Filter, MapPin, Calendar, Sparkles, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface Chef {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  preferencias: string[] | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
  nota_media: number | null;
  data_cadastro: string;
}

const Cooks: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('data_cadastro');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      console.log('Fetching chefs...');

      const { data: chefData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;

      const chefsWithStats = await Promise.all(
        (chefData || []).map(async (chef) => {
          const { data: recipes } = await supabase
            .from('receitas')
            .select('nota_media')
            .eq('usuario_id', chef.id)
            .eq('status', 'ativa');

          const recipeCount = recipes?.length || 0;
          let averageRating = null;

          if (recipes && recipes.length > 0) {
            const validRatings = recipes.filter(r => r.nota_media > 0);
            if (validRatings.length > 0) {
              averageRating = validRatings.reduce((sum, recipe) => sum + recipe.nota_media, 0) / validRatings.length;
            }
          }

          return {
            ...chef,
            receitas_count: recipeCount,
            nota_media: averageRating ? Number(averageRating.toFixed(1)) : null
          };
        })
      );

      console.log('Chefs with stats:', chefsWithStats);
      setChefs(chefsWithStats);
    } catch (error) {
      console.error('Error fetching chefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'data_cadastro', label: 'Mais Recentes' },
    { value: 'receitas_count', label: 'Mais Receitas' },
    { value: 'seguidores_count', label: 'Mais Seguidores' },
    { value: 'nota_media', label: 'Melhor Avaliados' },
    { value: 'nome', label: 'Nome A-Z' }
  ];

  const filteredChefs = React.useMemo(() => {
    let filtered = [...chefs];

    if (searchTerm) {
      filtered = filtered.filter(chef =>
        chef.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chef.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chef.preferencias?.some(pref => pref.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'receitas_count':
          return b.receitas_count - a.receitas_count;
        case 'seguidores_count':
          return b.seguidores_count - a.seguidores_count;
        case 'nota_media':
          return (b.nota_media || 0) - (a.nota_media || 0);
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'data_cadastro':
        default:
          return new Date(b.data_cadastro).getTime() - new Date(a.data_cadastro).getTime();
      }
    });

    return filtered;
  }, [chefs, searchTerm, sortBy]);

  const handleChefClick = (chefId: string) => {
    navigate(`/cook/${chefId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="py-2">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600 text-white py-16 mb-8"
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
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className="w-12 h-12 text-yellow-300" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Mestres da Culinária
                </h1>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <Sparkles className="w-12 h-12 text-yellow-300" />
                </motion.div>
              </div>
              <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                Conheça os talentosos cozinheiros que fazem a magia acontecer na nossa comunidade
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar chefs por nome, bio ou preferências..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-fitcooker-orange"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12">
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
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredChefs.length} Chef{filteredChefs.length !== 1 ? 's' : ''} Encontrado{filteredChefs.length !== 1 ? 's' : ''}
            </h2>
          </motion.div>

          {/* Chefs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }, (_, i) => (
                  <Card key={i} className="animate-pulse overflow-hidden">
                    <div className="h-32 bg-gray-200"></div>
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredChefs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredChefs.map((chef, index) => (
                  <motion.div
                    key={chef.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 8) }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => handleChefClick(chef.id)}
                  >
                    <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden group">
                      {/* Header Gradient */}
                      <div className="relative h-24 bg-gradient-to-r from-fitcooker-orange via-orange-500 to-orange-600">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
                        <motion.div
                          className="absolute inset-0 opacity-30"
                          animate={{
                            background: [
                              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                              "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)"
                            ]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                      <CardContent className="relative p-6 -mt-8">
                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                          >
                            <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-4 ring-orange-100">
                              <AvatarImage src={chef.avatar_url || ''} className="object-cover" />
                              <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
                                <ChefHat className="w-8 h-8" />
                              </AvatarFallback>
                            </Avatar>
                            {chef.receitas_count >= 10 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <Crown className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                        
                        {/* Chef Info */}
                        <div className="text-center mb-4">
                          <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-fitcooker-orange transition-colors">
                            {chef.nome}
                          </h3>
                          {chef.bio && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                              {chef.bio}
                            </p>
                          )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-2 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                            <div className="font-bold text-gray-900">{chef.receitas_count}</div>
                            <div className="text-xs text-gray-500">Receitas</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                            <div className="font-bold text-gray-900">{chef.seguidores_count}</div>
                            <div className="text-xs text-gray-500">Seguidores</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg group-hover:bg-orange-50 transition-colors">
                            {chef.nota_media ? (
                              <>
                                <div className="flex items-center justify-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="font-bold text-gray-900">{chef.nota_media}</span>
                                </div>
                                <div className="text-xs text-gray-500">Avaliação</div>
                              </>
                            ) : (
                              <>
                                <div className="font-bold text-gray-400">-</div>
                                <div className="text-xs text-gray-500">Sem nota</div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Preferences */}
                        {chef.preferencias && chef.preferencias.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs font-medium text-gray-500 mb-2">Preferências:</div>
                            <div className="flex flex-wrap gap-1">
                              {chef.preferencias.slice(0, 2).map((pref, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                                  {pref}
                                </Badge>
                              ))}
                              {chef.preferencias.length > 2 && (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                                  +{chef.preferencias.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Join Date */}
                        <div className="flex items-center justify-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Membro desde {new Date(chef.data_cadastro).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                        </div>
                      </CardContent>
                    </Card>
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
                  Nenhum chef encontrado
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  Tente ajustar sua busca ou filtros
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('data_cadastro');
                  }} 
                  className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                >
                  Limpar Filtros
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

export default Cooks;
