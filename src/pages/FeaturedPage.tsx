import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Award, ChefHat, TrendingUp, Utensils, Clock, ChevronRight, Users } from 'lucide-react';
import RecipeCard from '@/components/ui/RecipeCard';
import { allRecipes } from '@/data/mockData';

// Select featured recipes
const featuredRecipes = allRecipes.slice(0, 6);

// Mock featured cooks
const featuredCooks = [
  {
    id: 1,
    name: 'Tiago Leite',
    avatarUrl: 'tiago.png',
    rating: 4.9,
    recipes: 12,
    followers: 234,
    specialties: ['Low Carb', 'Proteico']
  },
  {
    id: 2,
    name: 'Carlos Oliveira',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.7,
    recipes: 8,
    followers: 156,
    specialties: ['Vegetariano', 'Sem Glúten']
  },
  {
    id: 3,
    name: 'Juliana Santos',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.8,
    recipes: 15,
    followers: 289,
    specialties: ['Proteico', 'Sem Lactose']
  }
];

const FeaturedPage: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-fitcooker-orange/10 to-white overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-fitcooker-yellow/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fitcooker-orange/10 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="md:w-1/2"
              >
                <div className="inline-flex items-center bg-fitcooker-orange/10 text-fitcooker-orange px-4 py-2 rounded-full mb-4">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Destaques Semanais</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Descubra o Melhor do <span className="text-fitcooker-orange">FitCooker</span>
                </h1>
                
                <p className="text-lg text-gray-700 mb-6">
                  Uma seleção especial das receitas mais populares, cozinheiros em destaque e novidades da nossa comunidade.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                  >
                    Ver Todas as Receitas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange/10"
                  >
                    Conheça os Cozinheiros
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="md:w-1/2"
              >
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-24 h-24 bg-fitcooker-yellow/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-fitcooker-orange/30 rounded-full blur-xl"></div>
                  
                  <div className="bg-white p-3 rounded-2xl shadow-xl overflow-hidden relative z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                      alt="Receitas em destaque" 
                      className="w-full h-auto rounded-lg object-cover"
                    />
                    
                    <div className="absolute bottom-8 left-8 right-8 bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white">
                      <div className="flex items-center mb-2">
                        <Award className="w-5 h-5 text-fitcooker-yellow mr-2" />
                        <span className="text-sm font-medium">Receita Mais Popular da Semana</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">Bowl de Proteína com Legumes</h3>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-fitcooker-yellow fill-fitcooker-yellow mr-1" />
                        <span>4.9</span>
                        <span className="mx-2">•</span>
                        <span>420 avaliações</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Featured Recipes Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Receitas em Destaque</h2>
                <p className="text-gray-600">As receitas mais amadas pela nossa comunidade</p>
              </div>
              <Link 
                to="/recipes" 
                className="text-fitcooker-orange hover:text-fitcooker-orange/80 font-medium flex items-center"
              >
                Ver todas
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredRecipes.map((recipe) => (
                <motion.div 
                  key={recipe.id}
                  variants={itemVariants}
                >
                  <RecipeCard recipe={recipe} className="h-full transform transition-transform hover:-translate-y-2" />
                </motion.div>
              ))}
            </motion.div>
            
            <div className="mt-10 text-center">
              <Button 
                size="lg" 
                className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                asChild
              >
                <Link to="/recipes">
                  Explorar Mais Receitas
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Cooks Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Cozinheiros em Destaque</h2>
                <p className="text-gray-600">Conheça os criadores de receitas mais populares</p>
              </div>
              <Link 
                to="/cooks" 
                className="text-fitcooker-orange hover:text-fitcooker-orange/80 font-medium flex items-center"
              >
                Ver todos
                <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCooks.map((cook, index) => (
                <motion.div 
                  key={cook.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  <div className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-fitcooker-orange/20">
                        <img 
                          src={cook.avatarUrl} 
                          alt={cook.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-fitcooker-orange text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{cook.name}</h3>
                    
                    <div className="flex items-center justify-center mb-3">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{cook.rating}</span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {cook.specialties.map((specialty, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-fitcooker-orange/10 text-fitcooker-orange px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-around text-sm text-gray-600 mb-4">
                      <div className="flex flex-col items-center">
                        <ChefHat className="w-4 h-4 text-fitcooker-orange mb-1" />
                        <span>{cook.recipes} receitas</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Users className="w-4 h-4 text-fitcooker-orange mb-1" />
                        <span>{cook.followers} seguidores</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                      asChild
                    >
                      <Link to={`/cooks?id=${cook.id}`}>
                        Ver Perfil
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Community Trends Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold mb-8">Tendências da Comunidade</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-fitcooker-orange/10 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <Utensils className="w-6 h-6 text-fitcooker-orange mr-3" />
                  <h3 className="text-xl font-bold">Categorias em Alta</h3>
                </div>
                
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="font-medium">Low Carb</span>
                    <span className="text-sm bg-fitcooker-orange/20 text-fitcooker-orange px-2 py-1 rounded-full">
                      +24% essa semana
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-medium">Proteico</span>
                    <span className="text-sm bg-fitcooker-orange/20 text-fitcooker-orange px-2 py-1 rounded-full">
                      +18% essa semana
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-medium">Vegetariano</span>
                    <span className="text-sm bg-fitcooker-orange/20 text-fitcooker-orange px-2 py-1 rounded-full">
                      +15% essa semana
                    </span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-fitcooker-yellow/10 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-fitcooker-yellow mr-3" />
                  <h3 className="text-xl font-bold">Receitas Recentes</h3>
                </div>
                
                <ul className="space-y-3">
                  {allRecipes.slice(0, 3).map((recipe) => (
                    <li key={recipe.id} className="flex items-center gap-3">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{recipe.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                          4.8
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-green-100 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">Estatísticas</h3>
                </div>
                
                <ul className="space-y-4">
                  <li>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Receitas Publicadas</span>
                      <span className="text-green-600 font-medium">234</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Novos Cozinheiros</span>
                      <span className="text-green-600 font-medium">42</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Avaliações</span>
                      <span className="text-green-600 font-medium">897</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-fitcooker-orange/30 to-fitcooker-yellow/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Quer ver sua receita em destaque?
              </h2>
              <p className="text-lg mb-8">
                Compartilhe suas melhores receitas fit e participe da nossa comunidade de entusiastas por alimentação saudável.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 min-w-40"
                  asChild
                >
                  <Link to="/add-recipe">
                    Adicionar Receita
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange/10 min-w-40"
                  asChild
                >
                  <Link to="/signup">
                    Criar Conta
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturedPage;
