
import React from 'react';
import { FileCheck, Clock, Users, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MacroDisplay from '@/components/ui/MacroDisplay';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { RecipeCategory } from '@/data/mockData';

interface RecipePreviewProps {
  title: string;
  description: string;
  selectedCategories: RecipeCategory[];
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
  checkLoginBeforeSubmit
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FileCheck className="mr-2 text-green-500" />
        Pré-visualização da Receita
      </h2>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {getMainImagePreview() ? (
          <img 
            src={getMainImagePreview() || ''} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-100 h-40 flex items-center justify-center">
            <p className="text-gray-500 text-center">Adicione uma imagem principal</p>
          </div>
        )}
        
        <div className="p-4">
          <h3 className="font-bold text-lg">{title || "Título da Receita"}</h3>
          
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {description || "Descrição da receita aparecerá aqui..."}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {selectedCategories.map(category => (
              <CategoryBadge key={category} category={category} />
            ))}
            {selectedCategories.length === 0 && (
              <span className="text-sm text-gray-400">Selecione categorias</span>
            )}
          </div>
          
          <div className="flex flex-wrap mt-4 text-sm text-gray-500 gap-4">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {preparationTime ? `${preparationTime} min` : "Tempo"}
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              {servings ? `${servings} porções` : "Porções"}
            </div>
            <div className="flex items-center">
              <ChefHat size={16} className="mr-1" />
              {difficulty}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold text-sm">Informações Nutricionais</h4>
            <MacroDisplay
              calories={Math.round(totalMacros.calories)}
              protein={Math.round(totalMacros.protein)}
              carbs={Math.round(totalMacros.carbs)}
              fat={Math.round(totalMacros.fat)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Checklist de Publicação</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${title ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
            <span className={title ? 'text-gray-800' : 'text-gray-500'}>Título da receita</span>
          </li>
          <li className="flex items-start">
            <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${description ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
            <span className={description ? 'text-gray-800' : 'text-gray-500'}>Descrição da receita</span>
          </li>
          <li className="flex items-start">
            <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${selectedCategories.length > 0 ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
            <span className={selectedCategories.length > 0 ? 'text-gray-800' : 'text-gray-500'}>Pelo menos uma categoria selecionada</span>
          </li>
          <li className="flex items-start">
            <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${preparationTime ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
            <span className={preparationTime ? 'text-gray-800' : 'text-gray-500'}>Tempo de preparo</span>
          </li>
          <li className="flex items-start">
            <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${getMainImagePreview() ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
            <span className={getMainImagePreview() ? 'text-gray-800' : 'text-gray-500'}>
              Pelo menos uma imagem adicionada (opcional)
            </span>
          </li>
          <li className="flex items-start">
            <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${isRecipeValid ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
            <span className={isRecipeValid ? 'text-gray-800' : 'text-gray-500'}>
              Todos os campos obrigatórios preenchidos
            </span>
          </li>
        </ul>
        
        <p className="text-xs text-gray-600 mt-4">
          Verifique se você preencheu todos os campos obrigatórios e se as informações estão corretas. 
          Após a publicação, sua receita passará por uma revisão rápida antes de ser disponibilizada para todos.
        </p>
      </div>
      
      <Button type="submit" className="w-full mt-6" size="lg" onClick={checkLoginBeforeSubmit}>
        Publicar Receita
      </Button>
    </div>
  );
};

export default RecipePreview;
