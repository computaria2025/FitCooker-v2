
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Plus, Settings, Lock, Bell, Shield, Upload, Camera } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import RecipeCard from '@/components/ui/RecipeCard';
import FollowSection from '@/components/profile/FollowSection';
import SavedRecipesSection from '@/components/profile/SavedRecipesSection';
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
  const [uploading, setUploading] = useState(false);
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

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso.",
      });

      fetchProfile();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Profile Header - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              {/* Header Background */}
              <div className="relative h-48 bg-gradient-to-r from-fitcooker-orange via-orange-500 to-red-500">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              <CardContent className="relative pt-0 pb-8">
                <div className="flex flex-col items-center text-center -mt-24">
                  {/* Avatar Section */}
                  <div className="relative group mb-6">
                    <Avatar className="w-48 h-48 border-6 border-white shadow-2xl ring-4 ring-fitcooker-orange/20">
                      <AvatarImage src={profile.avatar_url || ''} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-200 text-6xl">
                        <Camera className="w-24 h-24 text-orange-600" />
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Upload overlay */}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      <div className="text-white text-center">
                        {uploading ? (
                          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto"></div>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 mx-auto mb-2" />
                            <span className="text-sm font-medium">Alterar Foto</span>
                          </>
                        )}
                      </div>
                    </label>
                    
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploading}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Profile Info */}
                  <div className="w-full max-w-2xl">
                    {editing ? (
                      <div className="space-y-6">
                        <Input
                          value={editForm.nome}
                          onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                          placeholder="Seu nome"
                          className="text-3xl font-bold h-16 text-center bg-white/80 backdrop-blur-sm"
                        />
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Conte um pouco sobre você..."
                          className="resize-none bg-white/80 backdrop-blur-sm text-center"
                          rows={4}
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
                          {profile.nome}
                        </h1>
                        {profile.bio && (
                          <p className="text-gray-600 leading-relaxed mb-8 text-lg max-w-2xl mx-auto">
                            {profile.bio}
                          </p>
                        )}
                      </>
                    )}
                    
                    {/* Stats */}
                    <div className="flex justify-center gap-8 mb-8">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 min-w-[120px]"
                      >
                        <div className="text-4xl font-bold text-blue-700">{profile.receitas_count}</div>
                        <div className="text-sm text-blue-600">Receitas</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 min-w-[120px]"
                      >
                        <div className="text-4xl font-bold text-green-700">{profile.seguidores_count}</div>
                        <div className="text-sm text-green-600">Seguidores</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 min-w-[120px]"
                      >
                        <div className="text-4xl font-bold text-purple-700">{profile.seguindo_count}</div>
                        <div className="text-sm text-purple-600">Seguindo</div>
                      </motion.div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                      {editing ? (
                        <>
                          <Button 
                            onClick={handleSaveProfile}
                            className="bg-gradient-to-r from-fitcooker-orange to-orange-500 hover:from-orange-500 hover:to-red-500 text-white shadow-lg px-8"
                          >
                            Salvar Alterações
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditing(false)}
                            className="border-2 border-gray-300 hover:bg-gray-50 px-8"
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => setEditing(true)}
                          variant="outline"
                          className="gap-2 border-2 border-fitcooker-orange text-fitcooker-orange hover:bg-fitcooker-orange hover:text-white transition-all shadow-lg px-8"
                        >
                          <Edit3 className="w-5 h-5" />
                          Editar Perfil
                        </Button>
                      )}
                    </div>
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
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
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
              <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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

          {/* Main Content - 2 Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-8">
              {/* Minhas Receitas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-fitcooker-orange" />
                      Minhas Receitas ({userRecipes.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
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
                    ) : userRecipes.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
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

              {/* Receitas Salvas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SavedRecipesSection />
              </motion.div>

              {/* Configurações de Conta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-fitcooker-orange" />
                      Configurações de Conta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Alterar
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Senha</p>
                        <p className="text-sm text-gray-500">••••••••</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Lock className="w-4 h-4 mr-2" />
                        Alterar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-8">
              {/* Seguidores e Seguindo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FollowSection />
              </motion.div>

              {/* Configurações de Privacidade */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-fitcooker-orange" />
                      Privacidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Perfil Público</p>
                        <p className="text-sm text-gray-500">Permitir que outros vejam seu perfil</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Mostrar Seguidores</p>
                        <p className="text-sm text-gray-500">Exibir lista de seguidores publicamente</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Receitas Públicas</p>
                        <p className="text-sm text-gray-500">Permitir que outros vejam suas receitas</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notificações */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-fitcooker-orange" />
                      Notificações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Novos Seguidores</p>
                        <p className="text-sm text-gray-500">Ser notificado quando alguém me seguir</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Comentários</p>
                        <p className="text-sm text-gray-500">Notificar sobre comentários nas receitas</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Avaliações</p>
                        <p className="text-sm text-gray-500">Notificar quando avaliarem minhas receitas</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
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
