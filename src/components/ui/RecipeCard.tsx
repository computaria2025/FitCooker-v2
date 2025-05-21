
import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '@/data/mockData';
import CategoryBadge from './CategoryBadge';
import MacroDisplay from './MacroDisplay';
import { Clock, Flame, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  featured?: boolean;
  similar?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className, featured = false, similar = false }) => {
  const { id, title, description, imageUrl, preparationTime, difficulty, macros, author, categories } = recipe;
  
  return (
    <div 
      className={cn(
        'recipe-card group overflow-hidden h-full flex flex-col',
        featured ? 'md:flex-row' : '',
        similar ? 'transform transition-all duration-500 hover:scale-105 hover:shadow-2xl' : '',
        className
      )}
    >
      <div className={cn(
        'relative overflow-hidden',
        featured ? 'md:w-1/2' : 'w-full'
      )}>
        <Link to={`/recipe/${id}`}>
          <img 
            src={imageUrl} 
            alt={title}
            className={cn(
              "recipe-image w-full h-full object-cover",
              similar ? "transition-transform duration-700 group-hover:scale-110" : ""
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Ver receita</span>
          </div>
        </Link>
        
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[90%]">
          {categories.slice(0, featured ? 3 : 2).map((category, index) => (
            <CategoryBadge key={index} category={category} />
          ))}
          {categories.length > (featured ? 3 : 2) && (
            <span className="category-badge bg-black/70 text-white">
              +{categories.length - (featured ? 3 : 2)}
            </span>
          )}
        </div>
      </div>
      
      <div className={cn(
        'p-5 flex flex-col flex-grow',
        featured ? 'md:w-1/2' : '',
        similar ? 'transform transition-all duration-500 group-hover:bg-gray-50' : ''
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock size={16} />
            <span>{preparationTime} min</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Flame size={16} className={
              difficulty === 'Fácil' ? 'text-green-500' : 
              difficulty === 'Médio' ? 'text-yellow-500' : 'text-red-500'
            } />
            <span>{difficulty}</span>
          </div>
        </div>
        
        <Link to={`/recipe/${id}`} className="group-hover:text-fitcooker-orange transition-colors">
          <h3 className={cn(
            "heading-sm mb-2 line-clamp-2",
            similar ? "transform transition-all duration-500 group-hover:translate-x-1" : ""
          )}>{title}</h3>
        </Link>
        
        {featured && (
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        )}
        
        <div className="mt-auto pt-4">
          <MacroDisplay 
            calories={macros.calories}
            protein={macros.protein}
            carbs={macros.carbs}
            fat={macros.fat}
            compact={true}
            className="mb-3"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src={author.avatarUrl} 
                alt={author.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium">{author.name}</span>
            </div>
            <div className="flex items-center text-sm">
              <ChefHat size={16} className="mr-1 text-fitcooker-orange" />
              <span>{recipe.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
