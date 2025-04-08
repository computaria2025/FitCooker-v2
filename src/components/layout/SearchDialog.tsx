
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { allRecipes, RecipeCategory } from '@/data/mockData';
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
      <DialogContent className="sm:max-w-[600px] p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Buscar receitas, ingredientes, categorias..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchTerm && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearchTerm('')}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            {searchResults.length > 0 && (
              <CommandGroup heading="Receitas">
                {searchResults.map((recipe) => (
                  <CommandItem
                    key={recipe.id}
                    onSelect={() => handleSelectRecipe(recipe.id)}
                    className="cursor-pointer py-2"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{recipe.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {recipe.categories.slice(0, 2).join(', ')}
                          {recipe.categories.length > 2 && '...'}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
                
                <div className="p-2 border-t">
                  <Button 
                    className="w-full" 
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
