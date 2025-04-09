
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, ArrowRight, Tag, User, Clock } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { allRecipes } from '@/data/mockData';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { motion, AnimatePresence } from 'framer-motion';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get unique categories
  useEffect(() => {
    const allCategories = allRecipes.flatMap(recipe => recipe.categories);
    const uniqueCategories = [...new Set(allCategories)].slice(0, 6);
    setCategories(uniqueCategories);
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history).slice(0, 3));
    }
  }, []);

  // Reset search when location changes
  useEffect(() => {
    setSearchTerm('');
    setSearchResults([]);
  }, [location.pathname]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.categories.some(category => 
          category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSelectRecipe = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
    onOpenChange(false);
    saveToSearchHistory(searchTerm);
    setSearchTerm('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
      saveToSearchHistory(searchTerm);
      onOpenChange(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/recipes?category=${encodeURIComponent(category.toLowerCase())}`);
    onOpenChange(false);
  };

  const saveToSearchHistory = (term: string) => {
    if (term.trim()) {
      const history = localStorage.getItem('searchHistory');
      let searches = history ? JSON.parse(history) : [];
      // Add new search to beginning, remove duplicates
      searches = [term, ...searches.filter(s => s !== term)].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(searches));
      setSearchHistory(searches.slice(0, 3));
    }
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[700px] p-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-lg">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dialogVariants}
              className="search-dialog"
            >
              <Command className="rounded-lg">
                <div className="flex items-center border-b p-4">
                  <Search className="mr-3 h-5 w-5 flex-shrink-0 text-fitcooker-orange" />
                  <CommandInput 
                    placeholder="Busque por receitas, ingredientes, categorias..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    className="flex h-14 w-full rounded-md bg-transparent py-3 text-base font-medium outline-none placeholder:text-gray-400 focus:ring-0 focus:border-none"
                    autoFocus
                  />
                  {searchTerm && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSearchTerm('')}
                      className="h-10 w-10 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                
                <CommandList className="max-h-[60vh] py-4 px-2 overflow-y-auto">
                  {!searchTerm && searchHistory.length > 0 && (
                    <CommandGroup heading="Pesquisas recentes" className="px-2 mb-4">
                      <div className="flex flex-wrap gap-2 mt-2">
                        {searchHistory.map((term, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            size="sm"
                            className="rounded-full flex items-center gap-1 bg-gray-50 hover:bg-gray-100 border-gray-200"
                            onClick={() => handleHistoryClick(term)}
                          >
                            <Clock size={14} />
                            {term}
                          </Button>
                        ))}
                      </div>
                    </CommandGroup>
                  )}
                  
                  {!searchTerm && (
                    <CommandGroup heading="Categorias populares" className="px-2">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {categories.map((category, idx) => (
                          <motion.div 
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              variant="outline" 
                              className="w-full justify-start text-left border-gray-200 hover:border-fitcooker-orange hover:text-fitcooker-orange"
                              onClick={() => handleCategoryClick(category)}
                            >
                              <Tag size={16} className="mr-2 flex-shrink-0" />
                              <span className="truncate">{category}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CommandGroup>
                  )}
                  
                  {searchTerm && searchResults.length === 0 && (
                    <CommandEmpty className="py-12">
                      <div className="text-center">
                        <Search className="h-10 w-10 mx-auto text-gray-300 mb-4" />
                        <p className="text-muted-foreground font-medium">
                          Nenhum resultado encontrado para "{searchTerm}"
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tente buscar com outras palavras ou categorias diferentes.
                        </p>
                      </div>
                    </CommandEmpty>
                  )}
                  
                  {searchResults.length > 0 && (
                    <CommandGroup heading="Resultados">
                      <div className="space-y-2">
                        {searchResults.slice(0, 5).map((recipe) => (
                          <CommandItem
                            key={recipe.id}
                            onSelect={() => handleSelectRecipe(recipe.id)}
                            className="cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                <img 
                                  src={recipe.imageUrl} 
                                  alt={recipe.title} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-base truncate">{recipe.title}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="flex items-center text-xs text-gray-500">
                                    <User size={12} className="mr-1" />
                                    {recipe.author.name}
                                  </span>
                                  <span className="flex items-center text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    {recipe.preparationTime} min
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {recipe.categories.slice(0, 2).map((cat, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                      {cat}
                                    </span>
                                  ))}
                                  {recipe.categories.length > 2 && (
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                      +{recipe.categories.length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight size={16} className="text-gray-400" />
                            </div>
                          </CommandItem>
                        ))}
                      </div>
                      
                      {searchResults.length > 5 && (
                        <div className="p-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              className="w-full bg-fitcooker-orange text-white hover:bg-fitcooker-orange/90 transition-colors" 
                              onClick={handleSearchSubmit}
                            >
                              Ver todos os {searchResults.length} resultados
                              <ArrowRight size={16} className="ml-2" />
                            </Button>
                          </motion.div>
                        </div>
                      )}
                    </CommandGroup>
                  )}
                </CommandList>
                
                {searchTerm && searchResults.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full bg-fitcooker-orange text-white hover:bg-fitcooker-orange/90 transition-colors" 
                        onClick={handleSearchSubmit}
                      >
                        Buscar por "{searchTerm}"
                        <Search size={16} className="ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </Command>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SearchDialog;
