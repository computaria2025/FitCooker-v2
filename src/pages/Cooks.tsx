
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Search, Award, ChefHat } from 'lucide-react';

// Mock data for cooks
const mockCooks = [
  { id: 1, name: 'Ana Silva', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Carlos Oliveira', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Juliana Santos', avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 4, name: 'Ricardo Almeida', avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 5, name: 'Fernanda Lima', avatarUrl: 'https://randomuser.me/api/portraits/women/90.jpg' },
  { id: 6, name: 'Bruno Costa', avatarUrl: 'https://randomuser.me/api/portraits/men/40.jpg' },
  { id: 7, name: 'Camila Mendes', avatarUrl: 'https://randomuser.me/api/portraits/women/15.jpg' },
  { id: 8, name: 'André Souza', avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg' },
];

const Cooks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCooks = mockCooks.filter(cook => 
    cook.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCooks.map((cook, index) => (
                <div 
                  key={cook.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-fitcooker-orange to-yellow-500"></div>
                    <div className="absolute bottom-0 transform translate-y-1/2 left-1/2 -translate-x-1/2">
                      <div className="rounded-full border-4 border-white overflow-hidden">
                        <img 
                          src={cook.avatarUrl} 
                          alt={cook.name}
                          className="w-24 h-24 object-cover"
                        />
                      </div>
                    </div>
                    
                    {index < 3 && (
                      <div className="absolute top-3 right-3">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full 
                          ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'}
                        `}>
                          <Award className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-16 pb-6 px-6 text-center">
                    <h3 className="font-bold text-xl mb-1">{cook.name}</h3>
                    <div className="flex items-center justify-center mb-4">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="ml-1 text-sm text-gray-600">(4.0)</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="bg-fitcooker-orange/10 text-fitcooker-orange text-sm rounded-full px-3 py-1 flex items-center">
                        <ChefHat className="w-3 h-3 mr-1" />
                        12 receitas
                      </div>
                      <div className="bg-green-100 text-green-700 text-sm rounded-full px-3 py-1">
                        4.8K seguidores
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Perfil
                    </Button>
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
