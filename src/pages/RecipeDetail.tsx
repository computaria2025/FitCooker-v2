
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import MacroDisplay from '@/components/ui/MacroDisplay';
import RateRecipeForm from '@/components/recipe/RateRecipeForm';
import { Clock, Flame, ChefHat, Users, ChevronLeft, Star, MessageSquare, Heart, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from 'framer-motion';

// Database types
interface RecipeData {
  id: number;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
  video_url: string | null;
  tempo_preparo: number;
  porcoes: number;
  dificuldade: string;
  nota_media: number;
  avaliacoes_count: number;
  created_at: string;
  usuario_id: string;
  profiles: {
    nome: string;
    avatar_url: string | null;
  };
  receita_categorias: Array<{
    categorias: {
      nome: string;
    };
  }>;
  receita_ingredientes: Array<{
    quantidade: number;
    unidade: string;
    ordem: number;
    ingredientes: {
      nome: string;
    };
  }>;
  receita_passos: Array<{
    ordem: number;
    descricao: string;
  }>;
  informacao_nutricional: Array<{
    calorias_totais: number;
    proteinas_totais: number;
    carboidratos_totais: number;
    gorduras_totais: number;
  }>;
}

// Mock reviews data
interface Review {
  id: number;
  user: {
    name: string;
    avatarUrl: string;
  };
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: {
      name: "Maria Silva",
      avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    rating: 5,
    comment: "Receita maravilhosa! Fácil de fazer e muito saborosa. Toda a família adorou.",
    date: "2024-03-10",
    likes: 8
  },
  {
    id: 2,
    user: {
      name: "João Santos",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    rating: 4,
    comment: "Muito boa receita, apenas ajustei um pouco o tempero para o meu gosto.",
    date: "2024-03-05",
    likes: 3
  }
];

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'nutrition' | 'reviews'>('ingredients');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      console.log('Fetching recipe for ID:', id);

      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          receita_ingredientes(quantidade, unidade, ordem, ingredientes(nome)),
          receita_passos(ordem, descricao),
          informacao_nutricional(calorias_totais, proteinas_totais, carboidratos_totais, gorduras_totais)
        `)
        .eq('id', parseInt(id))
        .eq('status', 'ativa')
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        setError('Receita não encontrada');
        return;
      }

      console.log('Recipe data:', data);
      setRecipe(data);
    } catch (error) {
      console.error('Unexpected error fetching recipe:', error);
      setError('Erro ao carregar receita');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLikeReview = (reviewId: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login necessário",
        description: "Faça login para curtir avaliações",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Avaliação curtida",
      description: "Você curtiu esta avaliação"
    });
  };
  
  const handleSaveRecipe = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar receitas",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Receita salva",
      description: "Receita adicionada aos seus favoritos"
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-fitcooker-orange/20 border-t-fitcooker-orange mx-auto mb-6"></div>
              <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-fitcooker-orange" />
            </div>
            <p className="text-gray-600 font-medium">Carregando receita...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Receita não encontrada</h2>
            <p className="text-gray-600 mb-6">
              A receita que você está procurando não existe ou foi removida.
            </p>
            <Link to="/recipes" className="text-fitcooker-orange hover:underline font-medium">
              ← Ver todas as receitas
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const categories = recipe.receita_categorias?.map(rc => rc.categorias?.nome).filter(Boolean) || [];
  const ingredients = recipe.receita_ingredientes?.sort((a, b) => a.ordem - b.ordem) || [];
  const steps = recipe.receita_passos?.sort((a, b) => a.ordem - b.ordem) || [];
  const nutrition = recipe.informacao_nutricional?.[0];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-4">
        {/* Header */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-fitcooker-orange transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/recipes" className="hover:text-fitcooker-orange transition-colors">Receitas</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700 truncate">{recipe.titulo}</span>
            </div>
          </div>
        </div>
        
        {/* Recipe Image & Main Info */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-1/2"
              >
                <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={recipe.imagem_url || '/placeholder.svg'} 
                    alt={recipe.titulo} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Play Button (if video exists) */}
                  {recipe.video_url && (
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
                      <CategoryBadge key={index} category={category as any} />
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <Link
                  to="/recipes"
                  className="inline-flex items-center text-fitcooker-orange hover:underline mb-4 font-medium"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Voltar para receitas
                </Link>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.titulo}</h1>
                
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{recipe.descricao}</p>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-6">
                    <img 
                      src={recipe.profiles?.avatar_url || '/placeholder.svg'} 
                      alt={recipe.profiles?.nome} 
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <span className="block font-medium text-gray-900">por {recipe.profiles?.nome}</span>
                      <span className="block text-sm text-gray-500">
                        {new Date(recipe.created_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-fitcooker-orange/10 text-fitcooker-orange px-4 py-2 rounded-full">
                    <Star size={16} className="mr-2 fill-fitcooker-orange" />
                    <span className="font-semibold">{recipe.nota_media.toFixed(1)}</span>
                    <span className="text-sm ml-1">({recipe.avaliacoes_count})</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <Clock size={24} className="mx-auto mb-2 text-gray-500" />
                    <span className="block font-semibold text-gray-900">{recipe.tempo_preparo} min</span>
                    <span className="block text-sm text-gray-500">Tempo</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <Users size={24} className="mx-auto mb-2 text-gray-500" />
                    <span className="block font-semibold text-gray-900">{recipe.porcoes}</span>
                    <span className="block text-sm text-gray-500">Porções</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <Flame 
                      size={24} 
                      className={`mx-auto mb-2 ${
                        recipe.dificuldade === 'Fácil' ? 'text-green-500' : 
                        recipe.dificuldade === 'Médio' ? 'text-yellow-500' : 'text-red-500'
                      }`} 
                    />
                    <span className="block font-semibold text-gray-900">{recipe.dificuldade}</span>
                    <span className="block text-sm text-gray-500">Dificuldade</span>
                  </div>
                </div>
                
                {/* Macros */}
                {nutrition && (
                  <MacroDisplay 
                    calories={nutrition.calorias_totais}
                    protein={nutrition.proteinas_totais}
                    carbs={nutrition.carboidratos_totais}
                    fat={nutrition.gorduras_totais}
                    className="mb-8"
                  />
                )}
                
                {/* Actions */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button 
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white flex-1"
                    onClick={handleSaveRecipe}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Salvar Receita
                  </Button>
                  <Button className="border border-gray-300 hover:bg-gray-50 flex-1">
                    Compartilhar
                  </Button>
                </div>
                
                <div className="mt-4">
                  <RateRecipeForm 
                    recipeId={id || ''} 
                    recipeName={recipe.titulo} 
                    isLoggedIn={isLoggedIn}
                    prominentDisplay={true}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Recipe Content Section with Horizontal Tabs Layout */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              {/* Horizontal Tabs */}
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={cn(
                    'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap transition-colors',
                    activeTab === 'ingredients' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                  )}
                >
                  Ingredientes
                </button>
                
                <button
                  onClick={() => setActiveTab('steps')}
                  className={cn(
                    'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap transition-colors',
                    activeTab === 'steps' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                  )}
                >
                  Modo de Preparo
                </button>
                
                {nutrition && (
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className={cn(
                      'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap transition-colors',
                      activeTab === 'nutrition' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                    )}
                  >
                    Informação Nutricional
                  </button>
                )}
                
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={cn(
                    'px-6 py-3 font-medium text-gray-600 hover:text-fitcooker-orange whitespace-nowrap transition-colors',
                    activeTab === 'reviews' && 'text-fitcooker-orange border-b-2 border-fitcooker-orange'
                  )}
                >
                  Avaliações
                </button>
              </div>
              
              {/* Tab Content */}
              <div>
                {activeTab === 'ingredients' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredientes</h2>
                    <ul className="space-y-4">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="w-3 h-3 rounded-full bg-fitcooker-orange mr-4"></div>
                          <span className="font-semibold text-fitcooker-orange">{ingredient.quantidade} {ingredient.unidade}</span>
                          <span className="mx-2 text-gray-500">de</span>
                          <span className="text-gray-900">{ingredient.ingredientes?.nome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'steps' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Modo de Preparo</h2>
                    <ol className="space-y-6">
                      {steps.map((step) => (
                        <li key={step.ordem} className="flex">
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-10 h-10 bg-fitcooker-orange/10 rounded-full flex items-center justify-center text-fitcooker-orange font-bold text-lg">
                              {step.ordem}
                            </div>
                          </div>
                          <div className="pt-2">
                            <p className="text-gray-700 leading-relaxed">{step.descricao}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {activeTab === 'nutrition' && nutrition && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Informação Nutricional</h2>
                    
                    <Table className="border-collapse border border-gray-200 rounded-lg overflow-hidden">
                      <TableHeader className="bg-gradient-to-r from-fitcooker-orange/20 to-fitcooker-orange/10">
                        <TableRow>
                          <TableHead className="w-[180px] font-bold text-gray-700 py-4">Nutriente</TableHead>
                          <TableHead className="font-bold text-gray-700 py-4">Quantidade</TableHead>
                          <TableHead className="font-bold text-gray-700 py-4">% do Valor Diário*</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="hover:bg-orange-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-fitcooker-orange py-4">Valor Energético</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">{nutrition.calorias_totais} kcal</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">
                            <div className="flex items-center">
                              <div className="h-2 bg-fitcooker-orange rounded-full mr-2" style={{ width: `${Math.min(100, Math.round((nutrition.calorias_totais / 2000) * 100))}px` }}></div>
                              {Math.round((nutrition.calorias_totais / 2000) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-red-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-red-500 py-4">Proteínas</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">{nutrition.proteinas_totais}g</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">
                            <div className="flex items-center">
                              <div className="h-2 bg-red-500 rounded-full mr-2" style={{ width: `${Math.min(100, Math.round((nutrition.proteinas_totais / 50) * 100))}px` }}></div>
                              {Math.round((nutrition.proteinas_totais / 50) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-yellow-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-yellow-500 py-4">Carboidratos</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">{nutrition.carboidratos_totais}g</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">
                            <div className="flex items-center">
                              <div className="h-2 bg-yellow-500 rounded-full mr-2" style={{ width: `${Math.min(100, Math.round((nutrition.carboidratos_totais / 300) * 100))}px` }}></div>
                              {Math.round((nutrition.carboidratos_totais / 300) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-blue-50 transition-colors">
                          <TableCell className="font-medium border-t border-gray-200 text-blue-500 py-4">Gorduras Totais</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">{nutrition.gorduras_totais}g</TableCell>
                          <TableCell className="border-t border-gray-200 py-4">
                            <div className="flex items-center">
                              <div className="h-2 bg-blue-500 rounded-full mr-2" style={{ width: `${Math.min(100, Math.round((nutrition.gorduras_totais / 65) * 100))}px` }}></div>
                              {Math.round((nutrition.gorduras_totais / 65) * 100)}%
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <div className="mt-6 bg-yellow-50 p-4 rounded-lg text-sm border border-yellow-200">
                      <p className="text-yellow-700">
                        * Percentual de valores diários fornecidos pela dieta de 2.000 kcal.
                        Os valores podem variar dependendo das suas necessidades energéticas.
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                      <h2 className="text-2xl font-bold text-gray-900">Avaliações e Comentários</h2>
                      
                      <RateRecipeForm 
                        recipeId={id || ''} 
                        recipeName={recipe.titulo} 
                        isLoggedIn={isLoggedIn}
                        prominentDisplay={true}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      {mockReviews.map(review => (
                        <div 
                          key={review.id} 
                          className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start">
                            <img 
                              src={review.user.avatarUrl} 
                              alt={review.user.name} 
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                              
                              <div className="flex items-center mt-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    size={16} 
                                    className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                                  />
                                ))}
                              </div>
                              
                              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                              
                              <div className="flex items-center mt-3">
                                <button 
                                  onClick={() => handleLikeReview(review.id)}
                                  className="text-sm flex items-center text-gray-500 hover:text-fitcooker-orange transition-colors"
                                >
                                  <Heart size={14} className="mr-1" />
                                  <span>Curtir ({review.likes})</span>
                                </button>
                                
                                <button 
                                  className="text-sm flex items-center text-gray-500 hover:text-fitcooker-orange ml-4 transition-colors"
                                  onClick={() => {
                                    if (!isLoggedIn) {
                                      toast({
                                        title: "Login necessário",
                                        description: "Faça login para responder avaliações",
                                        variant: "destructive"
                                      });
                                      return;
                                    }
                                  }}
                                >
                                  <MessageSquare size={14} className="mr-1" />
                                  <span>Responder</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
