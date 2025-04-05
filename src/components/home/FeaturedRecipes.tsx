
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { featuredRecipes } from '@/data/mockData';
import RecipeCard from '@/components/ui/RecipeCard';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedRecipes: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation classes when section comes into view
            const cards = entry.target.querySelectorAll('.animate-on-scroll');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('active');
              }, index * 150); // Staggered animation
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50
      }
    }
  };
  
  return (
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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
          <Link
            to="/recipes"
            className="mt-4 md:mt-0 btn btn-outline self-start md:self-auto"
          >
            Ver Todas
          </Link>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {featuredRecipes.slice(0, 2).map((recipe) => (
            <motion.div key={recipe.id} variants={itemVariants}>
              <RecipeCard recipe={recipe} featured={true} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {featuredRecipes.slice(2).map((recipe) => (
            <motion.div key={recipe.id} variants={itemVariants}>
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;
