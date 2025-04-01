import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Search, Award, ChefHat, Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for cooks
const mockCooks = [
  { 
    id: 1, 
    name: 'Ana Silva', 
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    recipes: [
      { id: 101, title: 'Frango ao Curry', imageUrl: 'https://source.unsplash.com/random/300x200?chicken' },
      { id: 102, title: 'Salada Fitness', imageUrl: 'https://source.unsplash.com/random/300x200?salad' }
    ]
  },
  { 
    id: 2, 
    name: 'Carlos Oliveira', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    recipes: [
      { id: 103, title: 'Prato Proteico', imageUrl: 'https://source.unsplash.com/random/300x200?protein' },
      { id: 104, title: 'Smoothie Verde', imageUrl: 'https://source.unsplash.com/random/300x200?smoothie' }
    ]
  },
  { 
    id: 3, 
    name: 'Juliana Santos', 
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    recipes: [
      { id: 105, title: 'Bowl de Açaí', imageUrl: 'https://source.unsplash.com/random/300x200?acai' },
      { id: 106, title: 'Omelete Fit', imageUrl: 'https://source.unsplash.com/random/300x200?omelet' }
    ]
  },
  { 
    id: 4, 
    name: 'Ricardo Almeida', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    recipes: [
      { id: 107, title: 'Wrap de Frango', imageUrl: 'https://source.unsplash.com/random/300x200?wrap' },
      { id: 108, title: 'Batata Doce Assada', imageUrl: 'https://source.unsplash.com/random/300x200?sweetpotato' }
    ]
  },
  { 
    id: 5, 
    name: 'Fernanda Lima', 
    avatarUrl: 'https://randomuser.me/api/portraits/women/90.jpg',
    recipes: [
      { id: 109, title: 'Panqueca Proteica', imageUrl: 'https://source.unsplash.com/random/300x200?pancake' },
      { id: 110, title: 'Salada de Quinoa', imageUrl: 'https://source.unsplash.com/random/300x200?quinoa' }
    ]
  },
  { 
    id: 6, 
    name: 'Bruno Costa', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
    recipes: [
      { id: 111, title: 'Salmão Grelhado', imageUrl: 'https://source.unsplash.com/random/300x200?salmon' },
      { id: 112, title: 'Sopa de Legumes', imageUrl: 'https://source.unsplash.com/random/300x200?soup' }
    ]
  },
  { 
    id: 7, 
    name: 'Camila Mendes', 
    avatarUrl: 'https://randomuser.me/api/portraits/women/15.jpg',
    recipes: [
      { id: 113, title: 'Mousse de Abacate', imageUrl: 'https://source.unsplash.com/random/300x200?avocado' },
      { id: 114, title: 'Iogurte com Frutas', imageUrl: 'https://source.unsplash.com/random/300x200?yogurt' }
    ]
  },
  { 
    id: 8, 
    name: 'André Souza', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    recipes: [
      { id: 115, title: 'Torta de Frango Fit', imageUrl: 'https://source.unsplash.com/random/300x200?pie' },
      { id: 116, title: 'Shake Proteico', imageUrl: 'https://source.unsplash.com/random/300x200?shake' }
    ]
  },
];

const Cooks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'recipes'>('profile');
  const [selectedCook, setSelectedCook] = useState<number | null>(null);
  
  const filteredCooks = mockCooks.filter(cook => 
    cook.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCookClick = (cookId: number) => {
    if (selectedCook === cookId) {
      setSelectedCook(null);
    } else {
      setSelectedCook(cookId);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="heading-lg mb-4">Nossos Chefs Fit</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Conheça os cozinheiros mais talentosos da nossa comunidade. Eles são especialistas em criar receitas saudáveis e deliciosas.
              </p>
              
              <div className="flex items-center max-w-md mx-auto mt-8 relative">
                <Input
                  type="text"
                  placeholder="Buscar cozinheiros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </header>
            
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCooks.map((cook, index) => (
                <div 
                  key={cook.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg h-full"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col md:flex-row">
                      {/* Left side: Cook profile */}
                      <div className="md:w-1/2 p-4 flex flex-col items-center border-r border-gray-100">
                        <div className="relative">
                          <div className="rounded-full border-4 border-fitcooker-orange/20 overflow-hidden mx-auto">
                            <img 
                              src={cook.avatarUrl} 
                              alt={cook.name}
                              className="w-24 h-24 object-cover"
                            />
                          </div>
                          
                          {index < 3 && (
                            <div className="absolute -top-2 -right-2">
                              <div className={`
                                flex items-center justify-center w-8 h-8 rounded-full 
                                ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'}
                              `}>
                                <Award className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 text-center">
                          <h3 className="font-bold text-xl mb-1">{cook.name}</h3>
                          <div className="flex items-center justify-center mb-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <Star className="w-4 h-4 text-gray-300" />
                            <span className="ml-1 text-sm text-gray-600">(4.0)</span>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="bg-fitcooker-orange/10 text-fitcooker-orange text-sm rounded-full px-3 py-1 flex items-center">
                              <ChefHat className="w-3 h-3 mr-1" />
                              {cook.recipes.length} receitas
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side: Cook recipes */}
                      <div className="md:w-1/2 p-4">
                        <h4 className="font-medium text-sm mb-3">Receitas Populares:</h4>
                        <div className="space-y-2">
                          {cook.recipes.slice(0, 2).map(recipe => (
                            <Link 
                              key={recipe.id}
                              to={`/recipe/${recipe.id}`}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <img 
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="w-10 h-10 rounded-md object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm truncate">{recipe.title}</h5>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                                  4.5
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto p-4 pt-0 border-t border-gray-100">
                      <Link to={`/recipes?author=${cook.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Todas as Receitas
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
