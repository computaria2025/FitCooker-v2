
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, ChefHat, Users, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Chef {
  id: string;
  nome: string;
  bio: string | null;
  avatar_url: string | null;
  receitas_count: number;
  seguidores_count: number;
  is_chef: boolean;
}

const Cooks: React.FC = () => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('receitas_count', { ascending: false });

      if (error) {
        console.error('Erro ao buscar chefs:', error);
        return;
      }

      setChefs(data || []);
    } catch (error) {
      console.error('Erro inesperado ao buscar chefs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando chefs...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Chefs
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conheça os talentosos cozinheiros da nossa comunidade FitCooker
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-fitcooker-orange/10 rounded-lg mx-auto mb-4">
                  <ChefHat className="w-6 h-6 text-fitcooker-orange" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{chefs.length}</div>
                <div className="text-gray-600">Chefs Cadastrados</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {chefs.reduce((total, chef) => total + chef.receitas_count, 0)}
                </div>
                <div className="text-gray-600">Receitas Criadas</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {chefs.reduce((total, chef) => total + chef.seguidores_count, 0)}
                </div>
                <div className="text-gray-600">Seguidores Totais</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chefs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chefs.map((chef, index) => (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="relative mx-auto mb-4">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-lg">
                        <AvatarImage src={chef.avatar_url || ''} />
                        <AvatarFallback className="text-lg">
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      {chef.is_chef && (
                        <div className="absolute -bottom-1 -right-1 bg-fitcooker-orange rounded-full p-1">
                          <ChefHat className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg">{chef.nome}</CardTitle>
                    
                    {chef.bio && (
                      <CardDescription className="text-sm line-clamp-2">
                        {chef.bio}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-center">
                        <div className="font-bold text-fitcooker-orange">{chef.receitas_count}</div>
                        <div className="text-xs text-gray-600">Receitas</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{chef.seguidores_count}</div>
                        <div className="text-xs text-gray-600">Seguidores</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {chef.is_chef && (
                        <Badge variant="secondary" className="bg-fitcooker-orange/10 text-fitcooker-orange">
                          <ChefHat className="w-3 h-3 mr-1" />
                          Chef Verificado
                        </Badge>
                      )}
                      
                      <Link
                        to={`/cook/${chef.id}`}
                        className="text-fitcooker-orange hover:text-fitcooker-orange/80 text-sm font-medium ml-auto"
                      >
                        Ver Perfil →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {chefs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum chef encontrado
              </h3>
              <p className="text-gray-600">
                Seja o primeiro a se cadastrar como chef!
              </p>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
