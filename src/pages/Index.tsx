
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedRecipes from '@/components/home/FeaturedRecipes';

const Index: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Initialize scroll animations
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    animateOnScrollElements.forEach((element) => {
      observer.observe(element);
    });
    
    return () => {
      animateOnScrollElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedRecipes />
        
        {/* Benefits Section */}
        <section className="section-padding bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-4">Por Que Escolher o FitCooker?</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Navegue por centenas de receitas fit, calcule macros com precisão e acompanhe sua jornada nutricional.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm animate-on-scroll">
                <div className="w-12 h-12 bg-fitcooker-orange/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fitcooker-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Cálculo de Macros</h3>
                <p className="text-gray-600">
                  Acompanhe calorias, proteínas, carboidratos e gorduras em cada receita com precisão.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm animate-on-scroll">
                <div className="w-12 h-12 bg-fitcooker-yellow/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fitcooker-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Adicione Suas Receitas</h3>
                <p className="text-gray-600">
                  Compartilhe suas próprias criações com a comunidade e se torne um cozinheiro de destaque.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm animate-on-scroll">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-2">Múltiplas Categorias</h3>
                <p className="text-gray-600">
                  Encontre receitas por objetivo: bulking, cutting, low-carb e muitas outras opções.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-fitcooker-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto para começar sua jornada culinária fit?
              </h2>
              <p className="text-gray-300 mb-8">
                Junte-se a milhares de pessoas que estão transformando sua alimentação com o FitCooker.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/signup" className="btn btn-primary">
                  Criar Conta Grátis
                </a>
                <a href="/recipes" className="btn bg-white text-fitcooker-black hover:bg-gray-100">
                  Explorar Receitas
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
