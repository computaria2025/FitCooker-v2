
import React from 'react';
import { RecipeCategory } from '@/data/mockData';

type CategoryBadgeProps = {
  category: RecipeCategory | string;
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getColor = (cat: RecipeCategory | string) => {
    // Convert category to string for comparison
    const categoryStr = String(cat);
    
    switch (categoryStr) {
      case 'Bulking':
        return 'bg-green-500 text-white';
      case 'Cutting':
        return 'bg-blue-500 text-white';
      case 'LowCarb':
      case 'Low Carb':
        return 'bg-yellow-500 text-black';
      case 'HighProtein':
      case 'Alto Proteína':
        return 'bg-fitcooker-orange text-white';
      case 'Vegetariano':
        return 'bg-emerald-500 text-white';
      case 'Vegano':
        return 'bg-teal-500 text-white';
      case 'SemGlúten':
        return 'bg-amber-400 text-black';
      case 'SemLactose':
        return 'bg-purple-500 text-white';
      case 'Keto':
        return 'bg-red-500 text-white';
      case 'Paleo':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <span className={`category-badge ${getColor(category)} px-2 py-0.5 rounded-full text-xs font-medium`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
