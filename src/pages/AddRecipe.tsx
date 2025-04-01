
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RecipeCategory } from '@/data/mockData';
import MacroDisplay from '@/components/ui/MacroDisplay';
import { Check, Plus, Search, X, ImagePlus, Video, FileCheck, Clock, Users, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import CategoryBadge from '@/components/ui/CategoryBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface IngredientInput {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

interface RecipeStep {
  id: string;
  order: number;
  description: string;
}

const AddRecipe: React.FC = () => {
  const { toast } = useToast();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate auth state
  
  // Recipe basic information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Médio');
  const [selectedCategories, setSelectedCategories] = useState<RecipeCategory[]>([]);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Images and media
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  
  // Ingredients management
  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { id: '1', name: '', quantity: 0, unit: 'g', protein: 0, carbs: 0, fat: 0, calories: 0 }
  ]);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');
  const [showAddIngredientForm, setShowAddIngredientForm] = useState(false);
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [currentIngredientIndex, setCurrentIngredientIndex] = useState(0);
  
  // Steps management
  const [steps, setSteps] = useState<RecipeStep[]>([
    { id: '1', order: 1, description: '' }
  ]);
  
  // Predefined options
  const difficultyOptions = ['Fácil', 'Médio', 'Difícil'];
  const servingsOptions = ['1', '2', '3', '4', '5', '6', '8', '10', '12'];
  const unitOptions = ['g', 'kg', 'ml', 'l', 'unidade', 'colher de sopa', 'colher de chá', 'xícara'];
  
  // Calculate total macros
  const totalMacros = ingredients.reduce(
    (acc, ingredient) => {
      return {
        calories: acc.calories + (ingredient.calories * ingredient.quantity / 100),
        protein: acc.protein + (ingredient.protein * ingredient.quantity / 100),
        carbs: acc.carbs + (ingredient.carbs * ingredient.quantity / 100),
        fat: acc.fat + (ingredient.fat * ingredient.quantity / 100)
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  
  // Mock ingredients database for search
  const ingredientsDatabase = [
    { name: 'Peito de Frango', protein: 31, carbs: 0, fat: 3.6, calories: 165, unit: 'g' },
    { name: 'Arroz Branco', protein: 2.7, carbs: 28, fat: 0.3, calories: 130, unit: 'g' },
    { name: 'Batata Doce', protein: 1.6, carbs: 20, fat: 0.1, calories: 86, unit: 'g' },
    { name: 'Whey Protein', protein: 24, carbs: 3, fat: 1.5, calories: 120, unit: 'g' },
    { name: 'Ovo', protein: 6, carbs: 0.6, fat: 5, calories: 70, unit: 'unidade' },
    { name: 'Azeite de Oliva', protein: 0, carbs: 0, fat: 14, calories: 126, unit: 'ml' },
    { name: 'Aveia', protein: 16.9, carbs: 66.3, fat: 6.9, calories: 389, unit: 'g' },
    { name: 'Brócolis', protein: 2.8, carbs: 6.6, fat: 0.4, calories: 34, unit: 'g' },
  ];
  
  const filteredIngredients = ingredientsDatabase.filter(
    ing => ing.name.toLowerCase().includes(ingredientSearchTerm.toLowerCase())
  );
  
  // Handler for selecting an ingredient from search
  const handleSelectIngredient = (index: number, ingredient: typeof ingredientsDatabase[0]) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      name: ingredient.name,
      unit: ingredient.unit,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      calories: ingredient.calories
    };
    setIngredients(newIngredients);
    setIngredientSearchTerm('');
    setShowIngredientSelector(false);
  };
  
  // Handler for adding a custom ingredient
  const handleAddCustomIngredient = () => {
    const customIngredient = {
      name: newIngredientName,
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      unit: 'g'
    };
    
    // Add to current recipe
    handleSelectIngredient(currentIngredientIndex, customIngredient);
    
    // Reset form
    setNewIngredientName('');
    setShowAddIngredientForm(false);
    setShowIngredientSelector(false);
    
    toast({
      title: "Ingrediente adicionado",
      description: "Por favor, atualize os valores nutricionais.",
      duration: 3000,
    });
  };
  
  // Open ingredient selector
  const openIngredientSelector = (index: number) => {
    setCurrentIngredientIndex(index);
    setShowIngredientSelector(true);
    setIngredientSearchTerm('');
  };
  
  // Add new ingredient field
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', quantity: 0, unit: 'g', protein: 0, carbs: 0, fat: 0, calories: 0 }
    ]);
  };
  
  // Remove ingredient field
  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ing => ing.id !== id));
    }
  };
  
  // Add new step field
  const addStep = () => {
    const newOrder = steps.length + 1;
    setSteps([
      ...steps,
      { id: Date.now().toString(), order: newOrder, description: '' }
    ]);
  };
  
  // Remove step field
  const removeStep = (id: string) => {
    if (steps.length > 1) {
      const newSteps = steps.filter(step => step.id !== id)
        .map((step, index) => ({ ...step, order: index + 1 }));
      setSteps(newSteps);
    }
  };
  
  // Toggle category selection
  const toggleCategory = (category: RecipeCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Handle adding new category
  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      toast({
        title: "Nova categoria sugerida",
        description: "Sua sugestão será analisada pela nossa equipe.",
        duration: 3000,
      });
      setNewCategoryName('');
      setShowNewCategoryDialog(false);
    }
  };
  
  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Update ingredient quantity
  const updateIngredientQuantity = (id: string, quantity: number) => {
    setIngredients(
      ingredients.map(ing => 
        ing.id === id ? { ...ing, quantity } : ing
      )
    );
  };
  
  // Update step description
  const updateStepDescription = (id: string, description: string) => {
    setSteps(
      steps.map(step => 
        step.id === id ? { ...step, description } : step
      )
    );
  };
  
  // Check if recipe is valid for submission
  const isRecipeValid = () => {
    return (
      title.trim() !== '' &&
      selectedCategories.length > 0 &&
      preparationTime !== '' &&
      ingredients.length > 0 && 
      !ingredients.some(ing => !ing.name || ing.quantity <= 0) &&
      steps.length > 0 && 
      !steps.some(step => !step.description)
    );
  };
  
  // Check if user is logged in before proceeding
  const checkLoginBeforeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isRecipeValid()) {
      toast({
        title: "Formulário incompleto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    handleSubmit();
  };
  
  // Submit form
  const handleSubmit = () => {
    // Form validation complete, proceed with submission
    toast({
      title: "Receita enviada com sucesso!",
      description: "Sua receita será analisada e publicada em breve.",
      duration: 3000,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPreparationTime('');
    setServings('');
    setDifficulty('Médio');
    setSelectedCategories([]);
    setMainImage(null);
    setMainImagePreview(null);
    setVideoUrl('');
    setIngredients([{ id: '1', name: '', quantity: 0, unit: 'g', protein: 0, carbs: 0, fat: 0, calories: 0 }]);
    setSteps([{ id: '1', order: 1, description: '' }]);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-gray-50">
        <section className="container mx-auto px-4 md:px-6">
          <h1 className="heading-lg mb-6 text-center">Adicionar Nova Receita</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-8">
              <form onSubmit={checkLoginBeforeSubmit} className="space-y-8">
                {/* Basic Information */}
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
                
                {/* Media Upload */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Mídia</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="block mb-2">Imagem Principal</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {mainImagePreview ? (
                          <div className="relative">
                            <img 
                              src={mainImagePreview} 
                              alt="Preview" 
                              className="mx-auto h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMainImage(null);
                                setMainImagePreview(null);
                              }}
                              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer block">
                            <div className="flex flex-col items-center justify-center py-6">
                              <ImagePlus className="w-12 h-12 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">Clique para fazer upload</span>
                              <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                            </div>
                            <input 
                              type="file" 
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="videoUrl" className="block mb-2">URL do Vídeo (YouTube, Vimeo)</Label>
                      <div className="flex items-center space-x-2">
                        <Video className="text-gray-400" size={20} />
                        <Input
                          id="videoUrl"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="Ex: https://youtube.com/watch?v=..."
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Opcional: Adicione um vídeo para demonstrar o preparo</p>
                    </div>
                  </div>
                </div>
                
                {/* Ingredients Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Ingredientes *</h2>
                  
                  <div className="space-y-4">
                    {ingredients.map((ingredient, index) => (
                      <div key={ingredient.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Ingrediente {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeIngredient(ingredient.id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={ingredients.length <= 1}
                          >
                            <X size={18} />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`ingredient-name-${ingredient.id}`}>Nome *</Label>
                            <div className="relative">
                              <div 
                                className="flex items-center border border-input rounded-md bg-background cursor-pointer"
                                onClick={() => openIngredientSelector(index)}
                              >
                                <div className="flex-grow p-2 px-3 text-sm">
                                  {ingredient.name || 'Selecione um ingrediente'}
                                </div>
                                <div className="border-l border-input p-2 text-gray-400">
                                  <Search size={16} />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`ingredient-quantity-${ingredient.id}`}>Quantidade *</Label>
                              <Input
                                id={`ingredient-quantity-${ingredient.id}`}
                                type="number"
                                min="0"
                                step="0.1"
                                value={ingredient.quantity || ''}
                                onChange={(e) => updateIngredientQuantity(
                                  ingredient.id, 
                                  parseFloat(e.target.value) || 0
                                )}
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`ingredient-unit-${ingredient.id}`}>Unidade</Label>
                              <Select
                                value={ingredient.unit}
                                onValueChange={(value) => {
                                  const newIngredients = [...ingredients];
                                  newIngredients[index].unit = value;
                                  setIngredients(newIngredients);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {unitOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {ingredient.name && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                              <div className="text-center">
                                <span className="text-xs text-gray-500 block">Proteínas</span>
                                <span className="font-medium">{(ingredient.protein * ingredient.quantity / 100).toFixed(1)}g</span>
                              </div>
                              <div className="text-center">
                                <span className="text-xs text-gray-500 block">Carboidratos</span>
                                <span className="font-medium">{(ingredient.carbs * ingredient.quantity / 100).toFixed(1)}g</span>
                              </div>
                              <div className="text-center">
                                <span className="text-xs text-gray-500 block">Gorduras</span>
                                <span className="font-medium">{(ingredient.fat * ingredient.quantity / 100).toFixed(1)}g</span>
                              </div>
                              <div className="text-center">
                                <span className="text-xs text-gray-500 block">Calorias</span>
                                <span className="font-medium">{(ingredient.calories * ingredient.quantity / 100).toFixed(0)} kcal</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-fitcooker-orange hover:border-fitcooker-orange transition-colors flex items-center justify-center"
                    >
                      <Plus size={18} className="mr-2" />
                      Adicionar Ingrediente
                    </button>
                  </div>
                </div>
                
                {/* Steps Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4">Modo de Preparo *</h2>
                  
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium flex items-center">
                            <div className="w-6 h-6 rounded-full bg-fitcooker-orange text-white flex items-center justify-center mr-2">
                              {step.order}
                            </div>
                            Passo {step.order}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={steps.length <= 1}
                          >
                            <X size={18} />
                          </button>
                        </div>
                        
                        <textarea
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          rows={3}
                          value={step.description}
                          onChange={(e) => updateStepDescription(step.id, e.target.value)}
                          placeholder={`Descreva o passo ${step.order}...`}
                          required
                        />
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addStep}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-fitcooker-orange hover:border-fitcooker-orange transition-colors flex items-center justify-center"
                    >
                      <Plus size={18} className="mr-2" />
                      Adicionar Passo
                    </button>
                  </div>
                </div>
                
                <div className="lg:hidden">
                  <Button type="submit" className="w-full" size="lg">
                    Publicar Receita
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Preview Section (Desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FileCheck className="mr-2 text-green-500" />
                  Pré-visualização da Receita
                </h2>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {mainImagePreview ? (
                    <img src={mainImagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  ) : (
                    <div className="bg-gray-100 h-40 flex items-center justify-center">
                      <p className="text-gray-500 text-center">Imagem da receita</p>
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
                      <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${!ingredients.some(ing => !ing.name || ing.quantity <= 0) && ingredients.length > 0 ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
                      <span className={!ingredients.some(ing => !ing.name || ing.quantity <= 0) && ingredients.length > 0 ? 'text-gray-800' : 'text-gray-500'}>
                        Pelo menos um ingrediente adicionado
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className={`mt-0.5 flex-shrink-0 h-4 w-4 rounded-full ${!steps.some(step => !step.description) && steps.length > 0 ? 'bg-green-500' : 'bg-gray-200'} mr-2`}></div>
                      <span className={!steps.some(step => !step.description) && steps.length > 0 ? 'text-gray-800' : 'text-gray-500'}>
                        Pelo menos um passo de preparo
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
            </div>
          </div>
        </section>
      </main>
      
      {/* Ingredient Selector Dialog */}
      <Dialog open={showIngredientSelector} onOpenChange={setShowIngredientSelector}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Selecionar Ingrediente</DialogTitle>
            <DialogDescription>
              Escolha um ingrediente da nossa base de dados ou adicione um novo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar ingrediente..."
              className="pl-10"
              value={ingredientSearchTerm}
              onChange={(e) => setIngredientSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="max-h-60 overflow-auto">
            {filteredIngredients.length > 0 ? (
              <div className="space-y-1">
                {filteredIngredients.map((ing) => (
                  <button
                    key={ing.name}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex justify-between"
                    onClick={() => handleSelectIngredient(currentIngredientIndex, ing)}
                  >
                    <span>{ing.name}</span>
                    <span className="text-gray-500">{ing.calories} kcal/100{ing.unit}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500">Nenhum ingrediente encontrado</p>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 mt-2">
            {!showAddIngredientForm ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowAddIngredientForm(true);
                  setNewIngredientName(ingredientSearchTerm);
                }}
              >
                <Plus size={16} className="mr-2" />
                Adicionar novo ingrediente
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newIngredientName">Nome do ingrediente</Label>
                  <Input
                    id="newIngredientName"
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    className="mt-1"
                    placeholder="Ex: Quinoa"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={handleAddCustomIngredient}
                    className="flex-1"
                    disabled={!newIngredientName.trim()}
                  >
                    <Check size={16} className="mr-2" />
                    Adicionar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddIngredientForm(false)}
                    className="flex-1"
                  >
                    <X size={16} className="mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Suggest new category dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sugerir Nova Categoria</DialogTitle>
            <DialogDescription>
              Sugira uma nova categoria que você acredita que seria útil para classificar receitas.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newCategory">Nome da Categoria</Label>
            <Input
              id="newCategory"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ex: Low Carb"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>Cancelar</Button>
            <Button onClick={handleAddNewCategory}>Enviar Sugestão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Login prompt dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Necessário</DialogTitle>
            <DialogDescription>
              Para publicar receitas, você precisa estar logado na plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>Cancelar</Button>
            <Button asChild>
              <Link to="/login">Fazer Login</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AddRecipe;
