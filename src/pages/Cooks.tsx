
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, ChefHat, Users, Award, Star, MapPin, Calendar, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Chef {
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

const Cooks: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      console.log('Fetching chefs from Supabase...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('receitas_count', { ascending: false });

      if (error) {
        console.error('Erro ao buscar chefs:', error);
        return;
      }

      console.log('Chefs data:', data);
      setChefs(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar chefs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
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
            <p className="text-gray-600 font-medium">Carregando nossos talentosos chefs...</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="relative inline-block mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 text-4xl"
              >
                👨‍🍳
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-fitcooker-orange to-orange-600 bg-clip-text text-transparent mb-4">
                Nossos Chefs
              </h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Conheça os talentosos cozinheiros da nossa comunidade FitCooker. 
              Cada chef traz sua paixão única pela culinária saudável e saborosa.
            </motion.p>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50/50 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-2xl mx-auto mb-4 shadow-lg"
                  >
                    <ChefHat className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-fitcooker-orange to-orange-600 bg-clip-text text-transparent mb-2">
                    {chefs.length}
                  </div>
                  <div className="text-gray-600 font-medium">Chefs Talentosos</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 shadow-lg"
                  >
                    <Award className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-2">
                    {chefs.reduce((total, chef) => total + chef.receitas_count, 0)}
                  </div>
                  <div className="text-gray-600 font-medium">Receitas Criadas</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="text-center hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm">
                <CardContent className="pt-8 pb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto mb-4 shadow-lg"
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">
                    {chefs.reduce((total, chef) => total + chef.seguidores_count, 0)}
                  </div>
                  <div className="text-gray-600 font-medium">Seguidores Totais</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Chefs Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {chefs.map((chef, index) => (
              <motion.div
                key={chef.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  rotateY: 5
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300,
                  damping: 20
                }}
                className="group"
              >
                <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:shadow-fitcooker-orange/10">
                  {/* Card Header with Gradient Background */}
                  <div className="relative h-32 bg-gradient-to-br from-fitcooker-orange via-orange-500 to-orange-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
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
                    
                    {/* Chef Badge */}
                    {chef.is_chef && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="absolute top-4 right-4"
                      >
                        <Badge className="bg-white/90 text-fitcooker-orange border-0 font-semibold shadow-lg">
                          <Award className="w-3 h-3 mr-1" />
                          Chef Verificado
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  <CardContent className="relative -mt-12 pt-0 pb-6">
                    {/* Enhanced Avatar */}
                    <div className="flex flex-col items-center mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                        <Avatar className="relative w-24 h-24 border-4 border-white shadow-2xl">
                          <AvatarImage src={chef.avatar_url || ''} className="object-cover" />
                          <AvatarFallback className="text-2xl bg-gradient-to-r from-fitcooker-orange to-orange-500 text-white">
                            <User className="w-10 h-10" />
                          </AvatarFallback>
                        </Avatar>
                        
                        {chef.is_chef && (
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-1 -right-1 bg-gradient-to-r from-fitcooker-orange to-orange-500 rounded-full p-2 shadow-lg"
                          >
                            <ChefHat className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2 text-center group-hover:text-fitcooker-orange transition-colors duration-300">
                        {chef.nome}
                      </h3>
                      
                      {chef.bio && (
                        <p className="text-gray-600 text-sm text-center line-clamp-2 leading-relaxed">
                          {chef.bio}
                        </p>
                      )}
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl"
                      >
                        <div className="flex items-center justify-center mb-1">
                          <ChefHat className="w-4 h-4 text-fitcooker-orange mr-1" />
                          <span className="font-bold text-fitcooker-orange text-lg">{chef.receitas_count}</span>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">Receitas</span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl"
                      >
                        <div className="flex items-center justify-center mb-1">
                          <Heart className="w-4 h-4 text-blue-600 mr-1" />
                          <span className="font-bold text-blue-600 text-lg">{chef.seguidores_count}</span>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">Seguidores</span>
                      </motion.div>
                    </div>

                    {/* Enhanced Action Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link to={`/cook/${chef.id}`}>
                        <Button className="w-full bg-gradient-to-r from-fitcooker-orange to-orange-500 hover:from-fitcooker-orange hover:to-orange-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          Ver Perfil Completo
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="ml-2"
                          >
                            →
                          </motion.span>
                        </Button>
                      </Link>
                    </motion.div>

                    {/* Membership Info */}
                    <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Membro desde {new Date(chef.data_cadastro).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {chefs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <ChefHat className="w-24 h-24 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Nenhum chef encontrado
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Seja o primeiro a se cadastrar como chef e inspire outros com suas receitas!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-fitcooker-orange to-orange-500 hover:from-fitcooker-orange hover:to-orange-600 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Cadastrar-se Agora
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
