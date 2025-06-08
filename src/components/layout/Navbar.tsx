
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Search, Menu, X, ChefHat, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import SearchDialog from './SearchDialog';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('#user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Receitas', href: '/recipes' },
    { name: 'Chefs', href: '/cooks' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' }
  ];

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você saiu da sua conta com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-fitcooker-orange" />
              <span className="text-xl font-bold">
                Fit<span className="text-fitcooker-orange">Cooker</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-fitcooker-orange transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setShowSearchDialog(true)}
                className="p-2 text-gray-600 hover:text-fitcooker-orange transition-colors"
                aria-label="Buscar receitas"
              >
                <Search className="h-5 w-5" />
              </button>

              {user ? (
                <>
                  {/* Add Recipe Button - Only for authenticated users */}
                  <Link
                    to="/add-recipe"
                    className="hidden sm:flex items-center space-x-2 bg-fitcooker-orange text-white px-4 py-2 rounded-lg hover:bg-fitcooker-orange/90 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Nova Receita</span>
                  </Link>

                  {/* User Menu */}
                  <div className="relative" id="user-menu">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-fitcooker-orange transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">Meu Perfil</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-fitcooker-orange"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="inline h-4 w-4 mr-2" />
                          Meu Perfil
                        </Link>
                        <Link
                          to="/add-recipe"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-fitcooker-orange sm:hidden"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <PlusCircle className="inline h-4 w-4 mr-2" />
                          Nova Receita
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600"
                        >
                          <LogOut className="inline h-4 w-4 mr-2" />
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Login/Signup for non-authenticated users */}
                  <Link
                    to="/login"
                    className="hidden sm:block text-gray-700 hover:text-fitcooker-orange transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-fitcooker-orange text-white px-4 py-2 rounded-lg hover:bg-fitcooker-orange/90 transition-colors"
                  >
                    Cadastrar
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-fitcooker-orange"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-fitcooker-orange transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {!user && (
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-fitcooker-orange transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Dialog */}
      <SearchDialog isOpen={showSearchDialog} onClose={() => setShowSearchDialog(false)} />
    </>
  );
};

export default Navbar;
