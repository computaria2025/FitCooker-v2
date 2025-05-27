import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Apple, Heart } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RecipeCard from '@/components/ui/RecipeCard';
import { featuredRecipes } from '@/data/mockData';

const FeaturedPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
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
        damping: 20,
        mass: 1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-12 text-center"
        >
          <h1 className="heading-lg">
            Descubra Nossas Receitas <span className="text-gradient">Mais Populares</span>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto mt-4">
            Explore uma seleção cuidadosamente escolhida de receitas que estão fazendo sucesso entre nossos usuários.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>

      </div>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-orange-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow rounded-full mb-6">
              <Apple size={32} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Transforme Sua Vida com{" "}
              <span className="text-gradient">Alimentação Consciente</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Descubra como pequenas mudanças na sua alimentação podem revolucionar 
              sua energia, saúde e bem-estar. Sua jornada saudável começa aqui!
            </p>
            <Link
              to="/alimentacao-saudavel"
              className="btn btn-primary px-8 py-4 text-lg inline-flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Heart size={24} />
              <span>Descubra os Benefícios</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturedPage;
