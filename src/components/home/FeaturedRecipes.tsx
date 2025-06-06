
import React from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/ui/RecipeCard';
import RecipeCardSkeleton from '@/components/ui/RecipeCardSkeleton';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedRecipes: React.FC = () => {
  const { recipes, loading } = useRecipes();
  
  const featuredRecipes = recipes.slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Receitas em Destaque</h2>
          <p className="text-gray-600">Descubra as receitas mais populares da nossa comunidade</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            <div className="text-center">
              <Link 
                to="/recipes"
                className="inline-flex items-center text-fitcooker-orange hover:text-fitcooker-orange/80 font-medium"
              >
                Ver todas as receitas
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma receita encontrada</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRecipes;
