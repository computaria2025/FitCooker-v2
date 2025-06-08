
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Search, Menu, X, ChefHat, PlusCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SearchDialog from './SearchDialog';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Handle scroll for responsive navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navigation = [
    { name: 'Receitas', href: '/recipes' },
    { name: 'Chefs', href: '/cooks' },
    { name: 'Alimentação', href: '/alimentacao-saudavel' },
    { name: 'Ferramentas', href: '/ferramentas' },
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
  };

  return (
    <>
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-20'
          }`}>
            {/* Logo */}
            <motion.div
              layout
              className="flex items-center space-x-2"
            >
              <Link to="/" className="flex items-center space-x-2 group">
                <motion.div
                  animate={{ 
                    scale: isScrolled ? 0.9 : 1,
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    scale: { duration: 0.3 },
                    rotate: { duration: 2, repeat: Infinity, repeatDelay: 3 }
                  }}
                >
                  <ChefHat className={`text-fitcooker-orange transition-all duration-300 ${
                    isScrolled ? 'h-6 w-6' : 'h-8 w-8'
                  }`} />
                </motion.div>
                <motion.span 
                  className={`font-bold transition-all duration-300 ${
                    isScrolled ? 'text-lg' : 'text-xl'
                  }`}
                  layout
                >
                  Fit<span className="text-fitcooker-orange">Cooker</span>
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="relative text-gray-700 hover:text-fitcooker-orange transition-colors duration-300 group"
                  >
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-fitcooker-orange transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <motion.button
                onClick={() => setShowSearchDialog(true)}
                className="p-2 text-gray-600 hover:text-fitcooker-orange transition-colors"
                aria-label="Buscar receitas"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-5 w-5" />
              </motion.button>

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

                  {/* User Menu with Avatar */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline text-gray-700 hover:text-fitcooker-orange">
                          {user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário'}
                        </span>
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Meu Perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="sm:hidden">
                        <Link to="/add-recipe" className="flex items-center">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Nova Receita
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-gray-200 bg-white/90 backdrop-blur-md"
              >
                <div className="flex flex-col space-y-4">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className="text-gray-700 hover:text-fitcooker-orange transition-colors block"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {!user && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.length * 0.1 }}
                    >
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-fitcooker-orange transition-colors block"
                        onClick={() => setIsOpen(false)}
                      >
                        Entrar
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Search Dialog */}
      <SearchDialog open={showSearchDialog} onOpenChange={setShowSearchDialog} />
    </>
  );
};

export default Navbar;
