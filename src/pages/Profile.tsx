
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import RecipeCard from '@/components/ui/RecipeCard';
import { User, Mail, Camera, Save, Award, ChefHat, Heart, Edit, Trash2, Settings } from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface UserProfile {
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
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    bio: '',
    preferencias: [] as string[]
  });
  const [newPreference, setNewPreference] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchProfile();
      fetchUserRecipes();
      fetchSavedRecipes();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setProfile(data);
      setFormData({
        nome: data.nome || '',
        bio: data.bio || '',
        preferencias: data.preferencias || []
      });
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('receitas')
        .select(`
          *,
          profiles(nome, avatar_url),
          receita_categorias(categorias(nome)),
          informacao_nutricional(*)
        `)
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRecipes = (data || []).map((recipe: any) => ({
        id: recipe.id,
        titulo: recipe.titulo,
        title: recipe.titulo,
        descricao: recipe.descricao,
        description: recipe.descricao,
        imagem_url: recipe.imagem_url || '/placeholder.svg',
        imageUrl: recipe.imagem_url || '/placeholder.svg',
        tempo_preparo: recipe.tempo_preparo,
        preparationTime: recipe.tempo_preparo,
        porcoes: recipe.porcoes,
        servings: recipe.porcoes,
        dificuldade: recipe.dificuldade,
        difficulty: recipe.dificuldade,
        nota_media: recipe.nota_media || 0,
        rating: recipe.nota_media || 0,
        avaliacoes_count: recipe.avaliacoes_count || 0,
        created_at: recipe.created_at,
        usuario_id: recipe.usuario_id,
        status: recipe.status,
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
      console.error('Error fetching user recipes:', error);
    }
  };

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('receitas_salvas')
        .select(`
          receita_id,
          receitas(
            *,
            profiles(nome, avatar_url),
            receita_categorias(categorias(nome)),
            informacao_nutricional(*)
          )
        `)
        .eq('usuario_id', user.id);

      if (error) throw error;

      const formattedRecipes = (data || []).map((item: any) => {
        const recipe = item.receitas;
        return {
          id: recipe.id,
          titulo: recipe.titulo,
          title: recipe.titulo,
          descricao: recipe.descricao,
          description: recipe.descricao,
          imagem_url: recipe.imagem_url || '/placeholder.svg',
          imageUrl: recipe.imagem_url || '/placeholder.svg',
          tempo_preparo: recipe.tempo_preparo,
          preparationTime: recipe.tempo_preparo,
          porcoes: recipe.porcoes,
          servings: recipe.porcoes,
          dificuldade: recipe.dificuldade,
          difficulty: recipe.dificuldade,
          nota_media: recipe.nota_media || 0,
          rating: recipe.nota_media || 0,
          avaliacoes_count: recipe.avaliacoes_count || 0,
          created_at: recipe.created_at,
          usuario_id: recipe.usuario_id,
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
      console.error('Error fetching saved recipes:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      
      toast({
        title: "Imagem enviada!",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addPreference = () => {
    if (newPreference.trim() && !formData.preferencias.includes(newPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        preferencias: [...prev.preferencias, newPreference.trim()]
      }));
      setNewPreference('');
    }
  };

  const removePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferencias: prev.preferencias.filter(p => p !== preference)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          bio: formData.bio,
          preferencias: formData.preferencias
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });

      await fetchProfile();
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRecipe = async (recipeId: number) => {
    try {
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', recipeId)
        .eq('usuario_id', user?.id);

      if (error) throw error;

      toast({
        title: "Receita deletada",
        description: "A receita foi removida com sucesso.",
      });

      fetchUserRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar a receita.",
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fitcooker-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-fitcooker-orange to-orange-600 rounded-xl p-8 mb-8 text-white overflow-hidden"
          >
            <div className="absolute inset-0 bg-black opacity-20 rounded-xl"></div>
            <div className="absolute inset-0 opacity-20 rounded-xl bg-pattern"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Meu Perfil</h1>
              <p className="text-orange-100">
                Gerencie suas informações pessoais e configurações da conta
              </p>
            </div>
          </motion.div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="recipes">Minhas Receitas</TabsTrigger>
              <TabsTrigger value="saved">Receitas Salvas</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <CardTitle>Foto de Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="relative inline-block">
                        <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-lg">
                          <AvatarImage src={profile?.avatar_url || ''} />
                          <AvatarFallback className="text-2xl">
                            <User className="w-12 h-12" />
                          </AvatarFallback>
                        </Avatar>
                        <motion.div 
                          className="absolute bottom-0 right-0 bg-fitcooker-orange rounded-full p-2 shadow-lg cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          <Camera className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                      
                      <div>
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                        <Button
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          variant="outline"
                          disabled={isUploading}
                          className="w-full hover:bg-fitcooker-orange hover:text-white transition-colors"
                        >
                          {isUploading ? 'Enviando...' : 'Alterar Foto'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2 text-fitcooker-orange" />
                        Estatísticas do Chef
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <motion.div 
                          className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center">
                            <ChefHat className="w-5 h-5 text-fitcooker-orange mr-3" />
                            <span className="text-gray-700 font-medium">Receitas</span>
                          </div>
                          <span className="font-bold text-fitcooker-orange text-lg">
                            {profile?.receitas_count || 0}
                          </span>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center">
                            <Heart className="w-5 h-5 text-blue-600 mr-3" />
                            <span className="text-gray-700 font-medium">Seguidores</span>
                          </div>
                          <span className="font-bold text-blue-600 text-lg">
                            {profile?.seguidores_count || 0}
                          </span>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center">
                            <User className="w-5 h-5 text-green-600 mr-3" />
                            <span className="text-gray-700 font-medium">Seguindo</span>
                          </div>
                          <span className="font-bold text-green-600 text-lg">
                            {profile?.seguindo_count || 0}
                          </span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2 space-y-6"
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>
                        Atualize suas informações básicas de perfil
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                              Nome
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-gray-400" />
                              </div>
                              <Input
                                id="nome"
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                placeholder="Seu nome"
                                required
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400" />
                              </div>
                              <Input
                                id="email"
                                type="email"
                                value={profile?.email || ''}
                                readOnly
                                className="pl-10 bg-gray-50"
                              />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              O email não pode ser alterado
                            </p>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Conte um pouco sobre você, sua paixão pela culinária..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                          >
                            {isSaving ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Salvando...</span>
                              </div>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                <span>Salvar Alterações</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="recipes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Receitas ({userRecipes.length})</CardTitle>
                  <CardDescription>
                    Gerencie todas as receitas que você criou
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRecipes.map((recipe) => (
                        <div key={recipe.id} className="relative">
                          <RecipeCard recipe={recipe} />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/90 hover:bg-white"
                              onClick={() => navigate(`/receita/${recipe.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white/90 hover:bg-red-50 text-red-600"
                              onClick={() => deleteRecipe(recipe.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="mt-2">
                            <Badge variant={recipe.status === 'ativa' ? 'default' : 'secondary'}>
                              {recipe.status === 'ativa' ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Você ainda não criou nenhuma receita</p>
                      <Button onClick={() => navigate('/add-recipe')}>
                        Criar Primeira Receita
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas Salvas ({savedRecipes.length})</CardTitle>
                  <CardDescription>
                    Suas receitas favoritas salvas para consulta rápida
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Você ainda não salvou nenhuma receita</p>
                      <Button onClick={() => navigate('/recipes')}>
                        Explorar Receitas
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Suas Preferências</CardTitle>
                  <CardDescription>
                    Defina suas preferências culinárias que aparecerão no seu perfil público
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ex: Italiana, Vegana, Doces..."
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addPreference()}
                    />
                    <Button onClick={addPreference} disabled={!newPreference.trim()}>
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Suas preferências atuais:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.preferencias.map((preference, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                          onClick={() => removePreference(preference)}
                        >
                          {preference} ×
                        </Badge>
                      ))}
                      {formData.preferencias.length === 0 && (
                        <p className="text-gray-500">Nenhuma preferência definida ainda</p>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-fitcooker-orange hover:bg-fitcooker-orange/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Preferências
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
