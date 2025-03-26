
import React from 'react';
import { cn } from '@/lib/utils';

interface MacroDisplayProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  className?: string;
  compact?: boolean;
}

const MacroDisplay: React.FC<MacroDisplayProps> = ({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  className,
  compact = false
}) => {
  if (compact) {
    return (
      <div className={cn('flex items-center space-x-3 text-sm font-medium', className)}>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-fitcooker-orange mr-1"></span>
          <span>{calories} kcal</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
          <span>{protein}g P</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
          <span>{carbs}g C</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
          <span>{fat}g G</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('p-4 rounded-xl bg-white shadow-sm', className)}>
      <h3 className="text-lg font-bold mb-3 text-center">Informações Nutricionais</h3>
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
          <span className="text-sm text-gray-500">Calorias</span>
          <span className="text-lg font-bold text-fitcooker-orange">{calories}</span>
          <span className="text-xs text-gray-400">kcal</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
          <span className="text-sm text-gray-500">Proteínas</span>
          <span className="text-lg font-bold text-red-500">{protein}</span>
          <span className="text-xs text-gray-400">g</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
          <span className="text-sm text-gray-500">Carboidratos</span>
          <span className="text-lg font-bold text-yellow-500">{carbs}</span>
          <span className="text-xs text-gray-400">g</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50">
          <span className="text-sm text-gray-500">Gorduras</span>
          <span className="text-lg font-bold text-blue-500">{fat}</span>
          <span className="text-xs text-gray-400">g</span>
        </div>
      </div>
    </div>
  );
};

export default MacroDisplay;
