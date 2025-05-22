
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger, // Added DialogTrigger import here
} from "@/components/ui/dialog";
import { Star, Search, Award, ChefHat, Book, Users, Heart, MessageSquare, Filter, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryBadge from '@/components/ui/CategoryBadge';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

// Mock data for cooks
const mockCooks = [
  { 
    id: 1, 
    name: 'Tiago Leite', 
    avatarUrl: '/tiago.png',
    bio: "Chef especializado em receitas fitness com foco em sabor e valor nutricional. Formado em Nutrição e apaixonado por gastronomia saudável.",
    rating: 4.8,
    followers: 243,
    recipes: [
      { id: 101, title: 'Frango ao Curry', imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=2484&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'HighProtein' },
      { id: 102, title: 'Salada Fitness', imageUrl: 'https://images.unsplash.com/photo-1636044731923-6a80c14ec1c5?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'LowCarb' }
    ],
    specialties: ['HighProtein', 'Vegan']
  },
  { 
    id: 2, 
    name: 'Carlos Oliveira', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: "Nutricionista esportivo especializado em receitas para ganho de massa muscular. Autor de dois livros sobre nutrição para atletas.",
    rating: 4.6,
    followers: 187,
    recipes: [
      { id: 103, title: 'Prato Proteico', imageUrl: 'https://source.unsplash.com/random/300x200?protein', category: 'HighProtein' },
      { id: 104, title: 'Smoothie Verde', imageUrl: 'https://source.unsplash.com/random/300x200?smoothie', category: 'LowCarb' }
    ],
    specialties: ['HighProtein', 'PostWorkout']
  },
  { 
    id: 3, 
    name: 'Juliana Santos', 
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: "Chef profissional com especialização em comida vegetariana e vegana. Transforma receitas tradicionais em versões plant-based deliciosas.",
    rating: 4.9,
    followers: 312,
    recipes: [
      { id: 105, title: 'Bowl de Açaí', imageUrl: 'https://source.unsplash.com/random/300x200?acai', category: 'Vegan' },
      { id: 106, title: 'Omelete Fit', imageUrl: 'https://source.unsplash.com/random/300x200?omelet', category: 'LowCarb' }
    ],
    specialties: ['Vegan', 'GlutenFree']
  },
  { 
    id: 4, 
    name: 'Ricardo Almeida', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: "Fisiculturista e nutricionista com foco em receitas para definição muscular. Especialista em dietas de cutting e bulking.",
    rating: 4.7,
    followers: 156,
    recipes: [
      { id: 107, title: 'Wrap de Frango', imageUrl: 'https://source.unsplash.com/random/300x200?wrap', category: 'HighProtein' },
      { id: 108, title: 'Batata Doce Assada', imageUrl: 'https://source.unsplash.com/random/300x200?sweetpotato', category: 'PreWorkout' }
    ],
    specialties: ['HighProtein', 'PreWorkout']
  },
  { 
    id: 5, 
    name: 'Fernanda Lima', 
    avatarUrl: 'https://randomuser.me/api/portraits/women/90.jpg',
    bio: "Especialista em nutrição funcional e receitas para intolerantes a lactose e glúten. Foco em alimentação anti-inflamatória.",
    rating: 4.5,
    followers: 134,
    recipes: [
      { id: 109, title: 'Panqueca Proteica', imageUrl: 'https://source.unsplash.com/random/300x200?pancake', category: 'GlutenFree' },
      { id: 110, title: 'Salada de Quinoa', imageUrl: 'https://source.unsplash.com/random/300x200?quinoa', category: 'LowCarb' }
    ],
    specialties: ['GlutenFree', 'DairyFree']
  },
  { 
    id: 6, 
    name: 'Bruno Costa', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
    bio: "Chef especializado em pratos mediterrâneos adaptados para dietas fitness. Combina tradição culinária com ciência da nutrição.",
    rating: 4.8,
    followers: 201,
    recipes: [
      { id: 111, title: 'Salmão Grelhado', imageUrl: 'https://source.unsplash.com/random/300x200?salmon', category: 'Keto' },
      { id: 112, title: 'Sopa de Legumes', imageUrl: 'https://source.unsplash.com/random/300x200?soup', category: 'LowCarb' }
    ],
    specialties: ['Keto', 'Mediterranean']
  },
  { 
    id: 7, 
    name: 'Camila Mendes', 
    avatarUrl: 'https://randomuser.me/api/portraits/women/15.jpg',
    bio: "Nutricionista esportiva com foco em alimentação para corredores e praticantes de endurance. Especialista em receitas ricas em carboidratos complexos.",
    rating: 4.6,
    followers: 178,
    recipes: [
      { id: 113, title: 'Mousse de Abacate', imageUrl: 'https://source.unsplash.com/random/300x200?avocado', category: 'Keto' },
      { id: 114, title: 'Iogurte com Frutas', imageUrl: 'https://source.unsplash.com/random/300x200?yogurt', category: 'PreWorkout' }
    ],
    specialties: ['PreWorkout', 'PostWorkout']
  },
  { 
    id: 8, 
    name: 'André Souza', 
    avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: "Personal trainer e cozinheiro amador especializado em receitas rápidas e práticas para pessoas com rotina intensa. Foco em preparo batch cooking.",
    rating: 4.7,
    followers: 145,
    recipes: [
      { id: 115, title: 'Torta de Frango Fit', imageUrl: 'https://source.unsplash.com/random/300x200?pie', category: 'LowCarb' },
      { id: 116, title: 'Shake Proteico', imageUrl: 'https://source.unsplash.com/random/300x200?shake', category: 'PostWorkout' }
    ],
    specialties: ['QuickMeals', 'MealPrep']
  },
];

// Specialties for filtering
const specialties = [
  'HighProtein',
  'LowCarb',
  'Vegan',
  'GlutenFree',
  'DairyFree',
  'Keto',
  'PreWorkout',
  'PostWorkout',
  'QuickMeals',
  'MealPrep'
];

const Cooks: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'recipes'>('profile');
  const [selectedCook, setSelectedCook] = useState<number | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  
  useEffect(() => {
    // Check URL params for selected cook
    const params = new URLSearchParams(location.search);
    const cookId = params.get('id');
    
    if (cookId) {
      const id = parseInt(cookId, 10);
      setSelectedCook(id);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [location]);
  
  const filteredCooks = mockCooks
    .filter(cook => 
      cook.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeFilters.length === 0 || 
       cook.specialties.some(specialty => activeFilters.includes(specialty)))
    )
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.followers - a.followers;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else { // newest
        return b.id - a.id;
      }
    });
  
  const handleCookClick = (cookId: number) => {
    setSelectedCook(cookId);
    navigate(`/cooks?id=${cookId}`);
  };

  const handleFollowClick = () => {
    // In a real app, check if user is logged in
    // For now, show login prompt dialog
    setShowLoginPrompt(true);
  };
  
  const toggleFilter = (specialty: string) => {
    if (activeFilters.includes(specialty)) {
      setActiveFilters(activeFilters.filter(s => s !== specialty));
    } else {
      setActiveFilters([...activeFilters, specialty]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  const selectedCookData = selectedCook !== null 
    ? mockCooks.find(cook => cook.id === selectedCook) 
    : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {selectedCookData ? (
              // Cook profile view with their recipes
              <div className="animate-fade-in">
                <div className="flex items-center mb-8">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCook(null);
                      navigate('/cooks');
                    }}
                    className="mr-4"
                  >
                    Voltar
                  </Button>
                  <h1 className="text-3xl font-bold">Perfil de {selectedCookData.name}</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                  {/* Cook profile card */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-fitcooker-orange/20">
                          <img 
                            src={selectedCookData.avatarUrl} 
                            alt={selectedCookData.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 bg-fitcooker-orange text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                          <Award className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-2">{selectedCookData.name}</h2>
                      
                      <div className="flex items-center justify-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedCookData.rating) 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : i < selectedCookData.rating 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({selectedCookData.rating})</span>
                      </div>
                      
                      <div className="flex gap-2 mb-4 flex-wrap justify-center">
                        {selectedCookData.specialties.map((specialty, index) => (
                          <span 
                            key={index}
                            className="bg-fitcooker-orange/10 text-fitcooker-orange text-xs px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-around w-full text-sm text-gray-600 mb-4">
                        <div className="flex flex-col items-center">
                          <ChefHat className="w-4 h-4 text-fitcooker-orange mb-1" />
                          <span>{selectedCookData.recipes.length} receitas</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Users className="w-4 h-4 text-fitcooker-orange mb-1" />
                          <span>{selectedCookData.followers} seguidores</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6">
                        {selectedCookData.bio}
                      </p>
                      
                      <Button 
                        className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90 mb-3"
                        onClick={handleFollowClick}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Seguir Cozinheiro
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </Button>
                    </div>
                  </div>
                  
                  {/* Cook recipes */}
                  <div className="md:col-span-3">
                    <Tabs defaultValue="recipes" className="w-full">
                      <TabsList className="mb-6">
                        <TabsTrigger 
                          value="recipes"
                          className="flex items-center gap-2"
                        >
                          <Book className="w-4 h-4" />
                          Receitas
                        </TabsTrigger>
                        <TabsTrigger 
                          value="about"
                          className="flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          Sobre
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="recipes">
                        <h3 className="text-2xl font-bold mb-6 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-fitcooker-orange/50 after:to-fitcooker-yellow/50">
                          Receitas de {selectedCookData.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {selectedCookData.recipes.map(recipe => (
                            <Link 
                              key={recipe.id}
                              to={`/recipe/${recipe.id}`}
                              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2"
                            >
                              <div className="h-48 overflow-hidden">
                                <img 
                                  src={recipe.imageUrl} 
                                  alt={recipe.title}
                                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                                />
                              </div>
                              <div className="p-4">
                                <h4 className="font-bold text-lg mb-2">{recipe.title}</h4>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                  4.5
                                </div>
                                <div className="mt-3 flex justify-center">
                                  <CategoryBadge category={recipe.category} />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="about">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                          <h3 className="text-2xl font-bold mb-4">Sobre {selectedCookData.name}</h3>
                          <p className="text-gray-600 mb-6">
                            {selectedCookData.bio}
                          </p>
                          
                          <h4 className="text-lg font-semibold mb-3">Especialidades</h4>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {selectedCookData.specialties.map((specialty, index) => (
                              <span 
                                key={index}
                                className="bg-fitcooker-orange/10 text-fitcooker-orange px-3 py-1 rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="text-lg font-semibold mb-3">Estatísticas</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-3xl font-bold text-fitcooker-orange mb-1">
                                {selectedCookData.recipes.length}
                              </div>
                              <div className="text-sm text-gray-600">Receitas</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-3xl font-bold text-fitcooker-orange mb-1">
                                {selectedCookData.followers}
                              </div>
                              <div className="text-sm text-gray-600">Seguidores</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-3xl font-bold text-fitcooker-orange mb-1">
                                {selectedCookData.rating}
                              </div>
                              <div className="text-sm text-gray-600">Avaliação</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            ) : (
              // Cooks listing view
              <>
                <header className="text-center mb-12">
                  {/* Added decorative background for the title with animation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative mb-8"
                  >
                    <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-fitcooker-orange/80 to-transparent"></div>
                    <div className="relative z-10 inline-block bg-white px-8 py-2">
                      <h1 className="text-4xl font-bold mb-0 relative 
                                   after:content-[''] after:absolute after:bottom-0 after:left-0 
                                   after:w-full after:h-1 after:bg-fitcooker-yellow/50 
                                   after:scale-x-0 after:origin-left 
                                   after:transition-transform after:duration-700 
                                   after:animate-[scale-in_1s_ease_forwards]">
                        Nossos Chefs Fit
                      </h1>
                    </div>
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-lg text-gray-600 max-w-3xl mx-auto"
                  >
                    Conheça os cozinheiros mais talentosos da nossa comunidade. Eles são especialistas em criar receitas saudáveis e deliciosas.
                  </motion.p>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto mt-8 gap-4"
                  >
                    <div className="relative w-full md:max-w-md">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Buscar cozinheiros..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                      />
                      {searchTerm && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                      >
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Mais populares</SelectItem>
                          <SelectItem value="rating">Melhor avaliados</SelectItem>
                          <SelectItem value="newest">Mais recentes</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filtrar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Filtrar Cozinheiros</DialogTitle>
                            <DialogDescription>
                              Selecione as especialidades que você procura
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-2 gap-2 py-4">
                            {specialties.map(specialty => (
                              <div 
                                key={specialty}
                                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                                  activeFilters.includes(specialty) 
                                  ? 'bg-fitcooker-orange/20 text-fitcooker-orange font-medium' 
                                  : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => toggleFilter(specialty)}
                              >
                                {specialty}
                              </div>
                            ))}
                          </div>
                          
                          {activeFilters.length > 0 && (
                            <div className="flex justify-end">
                              <Button 
                                variant="ghost" 
                                onClick={clearFilters}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Limpar filtros
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </motion.div>
                  
                  {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      <span className="text-sm text-gray-500">Filtros ativos:</span>
                      {activeFilters.map(filter => (
                        <div 
                          key={filter}
                          className="flex items-center bg-fitcooker-orange/10 text-fitcooker-orange text-sm px-3 py-1 rounded-full"
                        >
                          {filter}
                          <button
                            onClick={() => toggleFilter(filter)}
                            className="ml-1 focus:outline-none"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </header>
                
                {filteredCooks.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredCooks.map((cook, index) => (
                      <motion.div 
                        key={cook.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 h-full"
                      >
                        <div className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-fitcooker-orange/20">
                                <img 
                                  src={cook.avatarUrl} 
                                  alt={cook.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {index < 3 && (
                                <div className="absolute -top-2 -right-2">
                                  <div className={`
                                    flex items-center justify-center w-8 h-8 rounded-full shadow-md
                                    ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'}
                                  `}>
                                    <Award className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <h3 className="font-bold text-xl mb-1">{cook.name}</h3>
                            
                            <div className="flex items-center justify-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < Math.floor(cook.rating) 
                                      ? 'text-yellow-500 fill-yellow-500' 
                                      : i < cook.rating 
                                        ? 'text-yellow-500 fill-yellow-500' 
                                        : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                              <span className="ml-1 text-sm text-gray-600">({cook.rating})</span>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-2 mb-3">
                              {cook.specialties.map((specialty, idx) => (
                                <span 
                                  key={idx}
                                  className="text-xs bg-fitcooker-orange/10 text-fitcooker-orange px-2 py-0.5 rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex justify-around w-full text-sm text-gray-600 mb-4">
                              <div className="flex flex-col items-center">
                                <ChefHat className="w-4 h-4 text-fitcooker-orange mb-1" />
                                <span>{cook.recipes.length} receitas</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <Users className="w-4 h-4 text-fitcooker-orange mb-1" />
                                <span>{cook.followers} seguidores</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {cook.bio}
                            </p>
                            
                            <Button 
                              className="w-full bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                              onClick={() => handleCookClick(cook.id)}
                            >
                              Ver Perfil
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <img 
                      src="https://assets.website-files.com/5e51c674258ffe10d286d30a/5e535b5c2b886a1d6b92e1f2_peep-59.svg" 
                      alt="No cooks found" 
                      className="w-48 h-48 mx-auto mb-6"
                    />
                    <h3 className="text-2xl font-bold mb-2">Nenhum cozinheiro encontrado</h3>
                    <p className="text-gray-600 mb-6">
                      Tente ajustar seus filtros ou buscar por outro termo.
                    </p>
                    <Button 
                      onClick={clearFilters}
                      className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                    >
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login Necessário</DialogTitle>
            <DialogDescription>
              Para seguir um cozinheiro, você precisa estar logado na sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
              asChild
            >
              <Link to="/login">
                Fazer Login
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Cooks;
