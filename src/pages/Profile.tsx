
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Users, ChefHat, Heart, User, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ProfilePictureUpload from '@/components/ui/ProfilePictureUpload';
import RecipeCard from '@/components/ui/RecipeCard';
import FollowSection from '@/components/profile/FollowSection';
import { Recipe } from '@/types/recipe';

interface Profile {
  id: string;
  nome: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  preferencias: string[] | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: '',
    bio: '',
    preferencias: [] as string[]
  });
  const [newPreference, setNewPreference] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserRecipes();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditForm({
        nome: data.nome || '',
        bio: data.bio || '',
        preferencias: data.preferencias || []
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const fetchUserRecipes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('usuario_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRecipes: Recipe[] = (data || []).map((recipe: any) => ({
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
      }));

      setUserRecipes(formattedRecipes);
    } catch (error) {
      console.error('Erro ao buscar receitas do usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas receitas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: editForm.nome,
          bio: editForm.bio,
          preferencias: editForm.preferencias
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      const { error } = await supabase
        .from('receitas')
        .update({ status: 'inativa' })
        .eq('id', recipeId);

      if (error) throw error;

      toast({
        title: "Receita removida!",
        description: "A receita foi removida com sucesso.",
      });
      
      fetchUserRecipes();
      fetchProfile();
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a receita.",
        variant: "destructive",
      });
    }
  };

  const addPreference = () => {
    if (newPreference.trim() && !editForm.preferencias.includes(newPreference.trim())) {
      setEditForm({
        ...editForm,
        preferencias: [...editForm.preferencias, newPreference.trim()]
      });
      setNewPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setEditForm({
      ...editForm,
      preferencias: editForm.preferencias.filter(p => p !== preference)
    });
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <p>Carregando perfil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-fitcooker-orange to-orange-500 h-32"></div>
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src={profile.avatar_url || ''} className="object-cover" />
                      <AvatarFallback className="bg-gray-200 text-4xl">
                        <User className="w-16 h-16" />
                      </AvatarFallback>
                    </Avatar>
                    {!editing && (
                      <ProfilePictureUpload
                        currentAvatarUrl={profile.avatar_url}
                        onUploadComplete={fetchProfile}
                      />
                    )}
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1 mt-4 md:mt-0">
                    {editing ? (
                      <div className="space-y-4">
                        <Input
                          value={editForm.nome}
                          onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                          placeholder="Seu nome"
                          className="text-2xl font-bold h-12"
                        />
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Conte um pouco sobre você..."
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.nome}</h1>
                        {profile.bio && (
                          <p className="text-gray-600 leading-relaxed mb-4">{profile.bio}</p>
                        )}
                      </>
                    )}
                    
                    {/* Stats */}
                    <div className="flex gap-6 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{profile.receitas_count}</div>
                        <div className="text-sm text-gray-500">Receitas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{profile.seguidores_count}</div>
                        <div className="text-sm text-gray-500">Seguidores</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{profile.seguindo_count}</div>
                        <div className="text-sm text-gray-500">Seguindo</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <Button 
                          onClick={handleSaveProfile}
                          className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                        >
                          Salvar
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditing(false)}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setEditing(true)}
                        variant="outline"
                        className="gap-2 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar Perfil
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences Section */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Preferências Culinárias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newPreference}
                        onChange={(e) => setNewPreference(e.target.value)}
                        placeholder="Ex: Vegano, Sem Glúten, Fitness..."
                        onKeyPress={(e) => e.key === 'Enter' && addPreference()}
                      />
                      <Button 
                        onClick={addPreference}
                        className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {editForm.preferencias.map((preference, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                          onClick={() => removePreference(preference)}
                        >
                          {preference} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Preferences Display */}
          {!editing && profile.preferencias && profile.preferencias.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-fitcooker-orange" />
                    Preferências Culinárias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferencias.map((preference, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                        {preference}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Recipes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-fitcooker-orange" />
                      Minhas Receitas ({userRecipes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array(4).fill(0).map((_, i) => (
                          <Card key={i} className="animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-t"></div>
                            <CardContent className="p-4">
                              <div className="h-4 bg-gray-200 rounded mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : userRecipes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userRecipes.map((recipe) => (
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
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir a receita "{recipe.title}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteRecipe(recipe.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Excluir
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
                        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma receita ainda</h3>
                        <p className="text-gray-600 mb-6">Comece criando sua primeira receita!</p>
                        <Button 
                          asChild 
                          className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                        >
                          <a href="/add-recipe">
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Receita
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Follow Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FollowSection />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
