
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
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

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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
    setSearchTerm('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl animate-scale-in">
        <Command className="rounded-lg">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-5 w-5 shrink-0 text-fitcooker-orange" />
            <CommandInput 
              placeholder="Buscar receitas, ingredientes, categorias..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchTerm('')}
                className="h-8 w-8 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty className="py-8 text-center text-gray-500">
              Nenhum resultado encontrado para "{searchTerm}"
            </CommandEmpty>
            {searchResults.length > 0 && (
              <CommandGroup heading="Receitas">
                {searchResults.map((recipe) => (
                  <CommandItem
                    key={recipe.id}
                    onSelect={() => handleSelectRecipe(recipe.id)}
                    className="cursor-pointer py-3 px-4 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="h-14 w-14 rounded-md overflow-hidden mr-4 border border-gray-200">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-base">{recipe.title}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {recipe.categories.slice(0, 2).join(', ')}
                          {recipe.categories.length > 2 && '...'}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
                
                <div className="p-3 border-t">
                  <Button 
                    className="w-full bg-fitcooker-orange text-white hover:bg-fitcooker-orange/90 transition-colors" 
                    onClick={handleSearchSubmit}
                  >
                    Ver todos os resultados para "{searchTerm}"
                  </Button>
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
