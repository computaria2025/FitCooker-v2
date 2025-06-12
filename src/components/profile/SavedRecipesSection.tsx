
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Heart, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import RecipeCard from '@/components/ui/RecipeCard';
import { Recipe } from '@/types/recipe';

const SavedRecipesSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('receitas_salvas')
        .select(`
          receita_id,
          receitas!inner(
            *,
            profiles(nome, avatar_url),
            receita_categorias(categorias(nome)),
            informacao_nutricional(*)
          )
        `)
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRecipes: Recipe[] = (data || []).map((item: any) => {
        const recipe = item.receitas;
        return {
          id: recipe.id,
          titulo: recipe.titulo,
          descricao: recipe.descricao,
          imagem_url: recipe.imagem_url || '/placeholder.svg',
          tempo_preparo: recipe.tempo_preparo,
          porcoes: recipe.porcoes,
          dificuldade: recipe.dificuldade,
          nota_media: recipe.nota_media || 0,
          avaliacoes_count: recipe.avaliacoes_count || 0,
          created_at: recipe.created_at,
          usuario_id: recipe.usuario_id,
          
          title: recipe.titulo,
          description: recipe.descricao,
          imageUrl: recipe.imagem_url || '/placeholder.svg',
          preparationTime: recipe.tempo_preparo,
          servings: recipe.porcoes,
          difficulty: recipe.dificuldade,
          rating: recipe.nota_media || 0,
          
          author: {
            id: recipe.usuario_id,
            name: recipe.profiles?.nome || 'Chef Anônimo',
            avatarUrl: recipe.profiles?.avatar_url || '/placeholder.svg'
          },
          categories: recipe.receita_categorias?.map((rc: any) => rc.categorias?.nome).filter(Boolean) || [],
          macros: {
            calories: recipe.informacao_nutricional?.[0]?.calorias_totais || 0,
            protein: recipe.informacao_nutricional?.[0]?.proteinas_totais || 0,
            carbs: recipe.informacao_nutricional?.[0]?.carboidratos_totais || 0,
            fat: recipe.informacao_nutricional?.[0]?.gorduras_totais || 0
          }
        };
      });

      setSavedRecipes(formattedRecipes);
    } catch (error) {
      console.error('Erro ao buscar receitas salvas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas receitas salvas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveRecipe = async (recipeId: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('receitas_salvas')
        .delete()
        .eq('usuario_id', user.id)
        .eq('receita_id', recipeId);

      if (error) throw error;

      setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      toast({
        title: "Receita removida!",
        description: "A receita foi removida dos seus salvos.",
      });
    } catch (error) {
      console.error('Erro ao remover receita salva:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a receita.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-fitcooker-orange" />
            Receitas Salvas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-t"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-fitcooker-orange" />
          Receitas Salvas ({savedRecipes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="relative group">
                <RecipeCard recipe={recipe} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover dos salvos</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover "{recipe.title}" dos seus salvos?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleUnsaveRecipe(recipe.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma receita salva</h3>
            <p className="text-gray-600">Comece salvando suas receitas favoritas!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedRecipesSection;
