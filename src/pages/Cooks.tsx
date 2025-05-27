
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users, Award, ChefHat } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const cooks = [
  {
    id: 1,
    name: "Chef Ana Silva",
    specialty: "Receitas Low Carb",
    rating: 4.9,
    followers: 15000,
    recipes: 89,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Especialista em alimentação low carb com mais de 10 anos de experiência.",
    achievements: ["Top Chef 2023", "Mais de 1M de seguidores", "Certificação Nutricional"]
  },
  {
    id: 2,
    name: "Chef Carlos Mendes",
    specialty: "Bulking Saudável",
    rating: 4.8,
    followers: 12500,
    recipes: 76,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Expert em receitas para ganho de massa muscular de forma saudável.",
    achievements: ["Nutricionista Esportivo", "Top Recipes 2023", "Certificação Internacional"]
  },
  // ... outros cooks
];

const Cooks: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
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

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Enhanced Header */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-2xl mb-6 shadow-xl">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fitcooker-orange via-fitcooker-yellow to-fitcooker-orange bg-clip-text text-transparent">
            Mestres da Culinária <span className="text-gray-900">Fit</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conheça os chefs mais talentosos da nossa comunidade. Profissionais dedicados que 
            transformam ingredientes simples em receitas extraordinárias para seus objetivos fitness.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">150+</div>
            <div className="text-sm text-gray-600">Chefs Ativos</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">50+</div>
            <div className="text-sm text-gray-600">Certificados</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">4.8</div>
            <div className="text-sm text-gray-600">Avaliação Média</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2K+</div>
            <div className="text-sm text-gray-600">Receitas Criadas</div>
          </div>
        </motion.div>

        {/* Cooks Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cooks.map((cook) => (
            <motion.div
              key={cook.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={cook.avatar}
                      alt={cook.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {cook.verified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitcooker-orange transition-colors">
                      {cook.name}
                    </h3>
                    <p className="text-fitcooker-orange font-medium">{cook.specialty}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-2">{cook.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{cook.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">Avaliação</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {cook.followers.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-1">{cook.recipes}</div>
                    <p className="text-xs text-gray-500">Receitas</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {cook.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Award className="w-3 h-3 text-fitcooker-orange mr-2" />
                      {achievement}
                    </div>
                  ))}
                </div>

                <Link
                  to={`/cook/${cook.id}`}
                  className="block w-full text-center bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Ver Perfil
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional cooks data would be loaded here */}
        <div className="text-center mt-12">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-white border-2 border-fitcooker-orange text-fitcooker-orange px-8 py-3 rounded-xl font-medium hover:bg-fitcooker-orange hover:text-white transition-all duration-300"
          >
            Carregar Mais Chefs
          </motion.button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cooks;
