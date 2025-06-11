
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-fitcooker-orange" />
              <span className="text-2xl font-bold">FitCooker</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Desperte o chef que há em você! Uma plataforma completa para descobrir, criar e compartilhar receitas saudáveis e deliciosas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/recipes" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Receitas
                </Link>
              </li>
              <li>
                <Link to="/cooks" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Chefs
                </Link>
              </li>
              <li>
                <Link to="/add-recipe" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Adicionar Receita
                </Link>
              </li>
              <li>
                <Link to="/ferramentas" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Ferramentas
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/quem-somos" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/alimentacao-saudavel" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Alimentação Saudável
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/termos-de-uso" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-400 hover:text-fitcooker-orange transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 FitCooker. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Desenvolvido por Ígor Tavares Rocha
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
