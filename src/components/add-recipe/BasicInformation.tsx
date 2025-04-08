
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { RecipeCategory } from '@/data/mockData';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { cn } from '@/lib/utils';

interface BasicInformationProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  preparationTime: string;
  setPreparationTime: (time: string) => void;
  servings: string;
  setServings: (servings: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  selectedCategories: RecipeCategory[];
  toggleCategory: (category: RecipeCategory) => void;
  showNewCategoryDialog: boolean;
  setShowNewCategoryDialog: (show: boolean) => void;
  servingsOptions: string[];
  difficultyOptions: string[];
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  preparationTime,
  setPreparationTime,
  servings,
  setServings,
  difficulty,
  setDifficulty,
  selectedCategories,
  toggleCategory,
  showNewCategoryDialog,
  setShowNewCategoryDialog,
  servingsOptions,
  difficultyOptions
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Informações Básicas</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título da Receita *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Frango Grelhado com Batata Doce"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <textarea
            id="description"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva brevemente sua receita..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="preparationTime">Tempo de Preparo (min) *</Label>
            <Input
              id="preparationTime"
              type="number"
              min="1"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="servings">Porções *</Label>
            <Select
              value={servings}
              onValueChange={setServings}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {servingsOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="difficulty">Dificuldade</Label>
            <Select
              value={difficulty}
              onValueChange={setDifficulty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Categorias *</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNewCategoryDialog(true)}
              className="text-xs text-fitcooker-orange hover:text-fitcooker-orange/80"
            >
              <Plus size={14} className="mr-1" />
              Sugerir nova categoria
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(RecipeCategory).map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => toggleCategory(category)}
                className={cn(
                  "category-badge transition-all",
                  selectedCategories.includes(category)
                    ? "bg-fitcooker-orange text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
