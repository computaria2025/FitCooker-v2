
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { allRecipes } from '@/data/mockData';
import { ChefHat, Star, TrendingUp, Search } from 'lucide-react';

interface Cook {
  id: number;
  name: string;
  avatarUrl: string;
  bio: string;
  recipesCount: number;
  averageRating: number;
  followers: number;
  specialties: string[];
}

const Cooks: React.FC = () => {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Simulating API fetch
    setTimeout(() => {
      // Extract unique cooks from recipes and calculate their stats
      const uniqueCooksMap = new Map();
      
      allRecipes.forEach(recipe => {
        const { author } = recipe;
        
        if (!uniqueCooksMap.has(author.id)) {
          uniqueCooksMap.set(author.id, {
            id: author.id,
            name: author.name,
            avatarUrl: author.avatarUrl,
            bio: author.bio || "Chef especializado em receitas fitness.",
            recipes: [recipe],
            totalRating: recipe.rating,
            followers: Math.floor(Math.random() * 1000) + 100,
            specialties: recipe.categories.slice(0, 3),
          });
        } else {
          const cookData = uniqueCooksMap.get(author.id);
          cookData.recipes.push(recipe);
          cookData.totalRating += recipe.rating;
          
          // Add unique categories to specialties
          recipe.categories.forEach(category => {
            if (!cookData.specialties.includes(category) && cookData.specialties.length < 5) {
              cookData.specialties.push(category);
            }
          });
        }
      });
      
      // Convert map to array and calculate stats
      const cooksArray = Array.from(uniqueCooksMap.values()).map(cookData => ({
        id: cookData.id,
        name: cookData.name,
        avatarUrl: cookData.avatarUrl,
        bio: cookData.bio,
        recipesCount: cookData.recipes.length,
        averageRating: parseFloat((cookData.totalRating / cookData.recipes.length).toFixed(1)),
        followers: cookData.followers,
        specialties: cookData.specialties.slice(0, 3), // Limit to 3 specialties
      }));
      
      // Sort by average rating (highest first)
      cooksArray.sort((a, b) => b.averageRating - a.averageRating);
      
      setCooks(cooksArray);
      setIsLoading(false);
    }, 800);
  }, []);
  
  const filteredCooks = cooks.filter(cook => 
    cook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cook.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-pulse space-y-8 w-full max-w-4xl">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-gray-200 h-32 rounded-lg w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="heading-lg text-center mb-2">Nossos Cozinheiros</h1>
            <p className="text-gray-600 text-center mb-8">
              Conheça os talentos por trás das receitas mais saudáveis e saborosas
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Busque por nome ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitcooker-orange focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Cozinheiros</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCooks.slice(0, 3).map((cook, index) => (
                  <div key={cook.id} className="relative bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className={`absolute top-0 left-0 w-0 h-0 border-solid ${
                      index === 0 ? 'border-t-[80px] border-l-[80px] border-t-yellow-400 border-l-transparent border-r-transparent' :
                      index === 1 ? 'border-t-[80px] border-l-[80px] border-t-gray-400 border-l-transparent border-r-transparent' :
                      'border-t-[80px] border-l-[80px] border-t-amber-600 border-l-transparent border-r-transparent'
                    }`}></div>
                    <div className="absolute top-2 left-2 z-10 text-black font-bold text-xl">
                      {index + 1}
                    </div>
                    
                    <div className="p-6 flex flex-col items-center">
                      <img 
                        src={cook.avatarUrl} 
                        alt={cook.name} 
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mb-4"
                      />
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{cook.name}</h3>
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{cook.averageRating}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span>{cook.recipesCount} receitas</span>
                      </div>
                      <p className="text-gray-600 text-center mb-4 text-sm">{cook.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {cook.specialties.map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1 text-fitcooker-orange" />
                        <span>{cook.followers} seguidores</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-fitcooker-orange to-fitcooker-yellow p-4 flex justify-center">
                      <button className="bg-white text-fitcooker-orange px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-50">
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Todos os Cozinheiros</h2>
              <div className="space-y-4">
                {filteredCooks.slice(3).map((cook) => (
                  <div key={cook.id} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 transform transition-all duration-300 hover:shadow-md">
                    <img 
                      src={cook.avatarUrl} 
                      alt={cook.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-800">{cook.name}</h3>
                      <div className="flex items-center justify-center sm:justify-start mb-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{cook.averageRating}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span>{cook.recipesCount} receitas</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span>{cook.followers} seguidores</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{cook.bio}</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {cook.specialties.map((specialty, idx) => (
                          <span 
                            key={idx}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 border border-fitcooker-orange text-fitcooker-orange rounded-lg hover:bg-fitcooker-orange/5 transition-colors mt-2 sm:mt-0">
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cooks;
