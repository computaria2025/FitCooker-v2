
import React from 'react';
import { RecipeCategory } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: RecipeCategory;
  className?: string;
}

const getCategoryColor = (category: RecipeCategory): string => {
  switch (category) {
    case RecipeCategory.BULKING:
      return 'bg-blue-500 text-white';
    case RecipeCategory.CUTTING:
      return 'bg-green-500 text-white';
    case RecipeCategory.CHEATMEAL:
      return 'bg-red-500 text-white';
    case RecipeCategory.HIGHPROTEIN:
      return 'bg-purple-500 text-white';
    case RecipeCategory.LOWCARB:
      return 'bg-teal-500 text-white';
    case RecipeCategory.VEGETARIAN:
      return 'bg-emerald-500 text-white';
    case RecipeCategory.VEGAN:
      return 'bg-lime-500 text-white';
    case RecipeCategory.BREAKFAST:
      return 'bg-yellow-500 text-black';
    case RecipeCategory.LUNCH:
      return 'bg-amber-500 text-black';
    case RecipeCategory.DINNER:
      return 'bg-indigo-500 text-white';
    case RecipeCategory.SNACK:
      return 'bg-pink-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const categoryColor = getCategoryColor(category);
  
  return (
    <span 
      className={cn(
        'category-badge transition-transform hover:scale-105', 
        categoryColor,
        className
      )}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
