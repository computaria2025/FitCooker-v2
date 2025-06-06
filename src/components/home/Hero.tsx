
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-fitcooker-orange/10 to-white overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <ChefHat className="w-16 h-16 text-fitcooker-orange" />
          </div>
          <h1 className="heading-xl mb-6">
            Descubra receitas <span className="text-fitcooker-orange">saudáveis</span> e deliciosas
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Conecte-se com chefs apaixonados, compartilhe suas criações culinárias e transforme sua alimentação em uma jornada de sabor e saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-fitcooker-orange hover:bg-fitcooker-orange/90">
              <Link to="/recipes">
                Explorar Receitas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/add-recipe">
                Criar Receita
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
