
import React from 'react';
import { Link } from 'react-router-dom';
import { featuredRecipes } from '@/data/mockData';
import RecipeCard from '@/components/ui/RecipeCard';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedRecipes: React.FC = () => {
  // Animation variants
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

  const hoverVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center mb-2">
              <ChefHat size={24} className="text-fitcooker-orange mr-2" />
              <h2 className="heading-lg">Receitas em Destaque</h2>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Explore nossas receitas mais populares, cuidadosamente selecionadas para garantir sabor e nutrição.
            </p>
          </div>
          <motion.div 
            whileHover="hover"
            variants={hoverVariants}
          >
            <Link
              to="/recipes"
              className="mt-4 md:mt-0 btn btn-outline self-start md:self-auto"
            >
              Ver Todas
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {featuredRecipes.slice(0, 2).map((recipe) => (
            <motion.div 
              key={recipe.id} 
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
            >
              <RecipeCard recipe={recipe} featured={true} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {featuredRecipes.slice(2).map((recipe) => (
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
    </section>
  );
};

export default FeaturedRecipes;
