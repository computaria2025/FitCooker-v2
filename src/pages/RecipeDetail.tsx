
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import MacroDisplay from '@/components/ui/MacroDisplay';
import { allRecipes, Recipe, RecipeStep, Ingredient } from '@/data/mockData';
import { Clock, Flame, ChefHat, Users, ChevronLeft, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulate API fetch
    setTimeout(() => {
      const foundRecipe = allRecipes.find(r => r.id === Number(id));
      setRecipe(foundRecipe || null);
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="heading-lg mb-4">Receita não encontrada</h2>
            <p className="text-gray-600 mb-6">
              A receita que você está procurando não existe ou foi removida.
            </p>
            <Link to="/recipes" className="btn btn-primary">
              Ver todas as receitas
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const {
    title,
    description,
    categories,
    preparationTime,
    servings,
    difficulty,
    ingredients,
    steps,
    imageUrl,
    videoUrl,
    macros,
    author,
    rating,
    createdAt
  } = recipe;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-fitcooker-orange transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/recipes" className="hover:text-fitcooker-orange transition-colors">Receitas</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 truncate">{title}</span>
            </div>
          </div>
        </div>
        
        {/* Recipe Image & Main Info */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image */}
              <div className="lg:w-1/2">
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Play Button (if video exists) */}
                  {videoUrl && (
                    <button 
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                      aria-label="Assistir vídeo"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-8 h-8 text-fitcooker-orange ml-1"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                  
                  {/* Categories */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[80%]">
                    {categories.map((category, index) => (
                      <CategoryBadge key={index} category={category} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Info */}
              <div className="lg:w-1/2">
                <Link
                  to="/recipes"
                  className="inline-flex items-center text-fitcooker-orange hover:underline mb-4"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Voltar para receitas
                </Link>
                
                <h1 className="heading-lg mb-3">{title}</h1>
                
                <p className="text-gray-600 mb-6">{description}</p>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-4">
                    <img 
                      src={author.avatarUrl} 
                      alt={author.name} 
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <span className="block text-sm font-medium">por {author.name}</span>
                      <span className="block text-xs text-gray-500">
                        {new Date(createdAt).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-fitcooker-orange/10 text-fitcooker-orange px-3 py-1 rounded-full">
                    <Star size={16} className="mr-1 fill-fitcooker-orange" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Clock size={20} className="mx-auto mb-1 text-gray-500" />
                    <span className="block text-sm font-medium">{preparationTime} min</span>
                    <span className="block text-xs text-gray-500">Tempo</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Users size={20} className="mx-auto mb-1 text-gray-500" />
                    <span className="block text-sm font-medium">{servings}</span>
                    <span className="block text-xs text-gray-500">Porções</span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Flame 
                      size={20} 
                      className={`mx-auto mb-1 ${
                        difficulty === 'Fácil' ? 'text-green-500' : 
                        difficulty === 'Médio' ? 'text-yellow-500' : 'text-red-500'
                      }`} 
                    />
                    <span className="block text-sm font-medium">{difficulty}</span>
                    <span className="block text-xs text-gray-500">Dificuldade</span>
                  </div>
                </div>
                
                {/* Macros */}
                <MacroDisplay 
                  calories={macros.calories}
                  protein={macros.protein}
                  carbs={macros.carbs}
                  fat={macros.fat}
                  className="mb-8"
                />
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <button className="btn btn-primary flex-1">
                    Salvar Receita
                  </button>
                  <button className="btn btn-outline flex-1">
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Tabs */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={cn(
                  'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange',
                  activeTab === 'ingredients' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                )}
              >
                Ingredientes
              </button>
              
              <button
                onClick={() => setActiveTab('steps')}
                className={cn(
                  'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange',
                  activeTab === 'steps' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                )}
              >
                Modo de Preparo
              </button>
            </div>
            
            {/* Tabs Content */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {activeTab === 'ingredients' ? (
                <div>
                  <h2 className="heading-md mb-4">Ingredientes</h2>
                  <ul className="space-y-3">
                    {ingredients.map((ingredient: Ingredient, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-fitcooker-orange mr-3"></div>
                        <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                        <span className="mx-2">de</span>
                        <span>{ingredient.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <h2 className="heading-md mb-4">Modo de Preparo</h2>
                  <ol className="space-y-6">
                    {steps.map((step: RecipeStep) => (
                      <li key={step.order} className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-8 h-8 bg-fitcooker-orange/10 rounded-full flex items-center justify-center text-fitcooker-orange font-bold">
                            {step.order}
                          </div>
                        </div>
                        <div className="pt-1">
                          <p>{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
