
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, Check, AlertCircle } from 'lucide-react';

interface RecipePreviewProps {
  title: string;
  description: string;
  selectedCategories: string[];
  preparationTime: string;
  servings: string;
  difficulty: string;
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  getMainImagePreview: () => string | null;
  isRecipeValid: boolean;
  checkLoginBeforeSubmit: (e: React.FormEvent) => void;
  ingredientsCount: number;
  stepsCount: number;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({
  title,
  description,
  selectedCategories,
  preparationTime,
  servings,
  difficulty,
  totalMacros,
  getMainImagePreview,
  isRecipeValid,
  checkLoginBeforeSubmit,
  ingredientsCount,
  stepsCount
}) => {
  const previewTitle = title || 'Nome da sua receita';
  const previewDesc = description || 'Descrição da sua receita, conte uma pequena história ou dê dicas sobre o prato.';

  return (
    <div className="bg-white rounded-xl shadow-lg sticky top-24 overflow-hidden">
      <div className="aspect-video bg-gray-200 w-full overflow-hidden relative">
        {getMainImagePreview() ? (
          <img 
            src={getMainImagePreview() || ''} 
            alt="Prévia da receita" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="text-sm">Prévia da imagem aparecerá aqui</span>
            <span className="text-xs mt-1">Adicione uma imagem para visualizar</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{previewTitle}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{previewDesc}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {selectedCategories.length > 0 ? (
            selectedCategories.map((category) => (
              <Badge key={category} variant="category">{category}</Badge>
            ))
          ) : (
            <Badge variant="outline">Selecione categorias</Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <Clock className="w-5 h-5 mx-auto text-fitcooker-orange" />
            <p className="text-xs mt-1">Tempo</p>
            <p className="font-medium text-sm">{preparationTime ? `${preparationTime} min` : '--'}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <svg className="w-5 h-5 mx-auto text-fitcooker-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 18V6M6 18V6M6 12H18M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-xs mt-1">Porções</p>
            <p className="font-medium text-sm">{servings || '--'}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-md">
            <Flame className="w-5 h-5 mx-auto text-fitcooker-orange" />
            <p className="text-xs mt-1">Dificuldade</p>
            <p className="font-medium text-sm">{difficulty || '--'}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md space-y-3">
          <h4 className="font-medium">Informação nutricional (por porção)</h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white p-2 rounded">
              <p className="font-medium text-sm">{Math.round(totalMacros.calories || 0)}</p>
              <p className="text-xs text-gray-500">kcal</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-medium text-sm">{Math.round(totalMacros.protein || 0)}g</p>
              <p className="text-xs text-gray-500">Proteínas</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-medium text-sm">{Math.round(totalMacros.carbs || 0)}g</p>
              <p className="text-xs text-gray-500">Carbos</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-medium text-sm">{Math.round(totalMacros.fat || 0)}g</p>
              <p className="text-xs text-gray-500">Gorduras</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm font-medium">Ingredientes</p>
            <span className="text-sm font-medium">{ingredientsCount}</span>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-medium">Passos</p>
            <span className="text-sm font-medium">{stepsCount}</span>
          </div>
        </div>

        {isRecipeValid ? (
          <Button 
            type="button" 
            className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90 px-6 py-4 h-auto"
            onClick={checkLoginBeforeSubmit}
          >
            <Check className="mr-2 h-5 w-5" />
            Publicar Receita
          </Button>
        ) : (
          <Button 
            type="button" 
            className="w-full bg-gray-300 hover:bg-gray-400 cursor-not-allowed px-6 py-4 h-auto"
            disabled
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            Complete Todos os Campos
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecipePreview;
