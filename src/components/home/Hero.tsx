
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChefHat, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroElement = heroRef.current;
      
      if (heroElement) {
        // Parallax effect for background
        heroElement.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        
        // Opacity effect for content
        const opacity = Math.max(1 - scrollPosition / 700, 0);
        const content = heroElement.querySelector('.hero-content') as HTMLElement;
        if (content) {
          content.style.opacity = opacity.toString();
          content.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 hero-content">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-2">
              <ChefHat size={40} className="text-fitcooker-orange mr-2" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Fit<span className="text-fitcooker-orange">Cooker</span>
              </h1>
            </div>
            <p className="text-white/90 text-xl md:text-3xl mt-4 mb-2 font-bold">
              TRANSFORME SUA DIETA, CONQUISTE SEU CORPO
            </p>
            <p className="text-white/80 text-lg md:text-xl mb-8 italic">
              Receitas de alto desempenho para quem busca resultados extraordinários
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="bg-fitcooker-orange px-3 py-1 rounded-full text-white text-sm font-medium">Alta Proteína</span>
              <span className="bg-fitcooker-yellow px-3 py-1 rounded-full text-black text-sm font-medium">Baixo Carboidrato</span>
              <span className="bg-white px-3 py-1 rounded-full text-fitcooker-black text-sm font-medium">Zero Açúcar</span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative mx-auto max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Busque por receitas, ingredientes ou categoria..."
                className="w-full py-4 pl-12 pr-4 border-none rounded-lg text-gray-900 focus:ring-2 focus:ring-fitcooker-orange transition-all duration-300 shadow-lg"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-fitcooker-orange text-white rounded-md hover:bg-opacity-90 transition-colors">
                Buscar
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Link 
              to="/recipes?category=bulking"
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center transition-all duration-300 hover:bg-white/20 hover:transform hover:scale-105"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-fitcooker-orange" />
              <span className="text-white font-medium">Bulking</span>
            </Link>
            
            <Link 
              to="/recipes?category=cutting"
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center transition-all duration-300 hover:bg-white/20 hover:transform hover:scale-105"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-fitcooker-yellow" />
              <span className="text-white font-medium">Cutting</span>
            </Link>
            
            <Link 
              to="/recipes?category=highprotein"
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center transition-all duration-300 hover:bg-white/20 hover:transform hover:scale-105"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <span className="text-white font-medium">Alto Proteína</span>
            </Link>
            
            <Link 
              to="/recipes?category=lowcarb"
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center transition-all duration-300 hover:bg-white/20 hover:transform hover:scale-105"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <span className="text-white font-medium">Low Carb</span>
            </Link>
          </div>
          
          {/* CTA Button */}
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Link
              to="/recipes"
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <span>Explorar Todas as Receitas</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
