
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
import { User, Mail, Camera, Save, Award, ChefHat, Heart } from 'lucide-react';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  receitas_count: number;
  seguidores_count: number;
  seguindo_count: number;
}

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
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

      console.log('Profile data:', data);
      setProfile(data);
      setFormData({
        nome: data.nome || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || ''
      });
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível carregar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      
      toast({
        title: "Imagem enviada!",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      console.log('Updating profile with data:', formData);
      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          bio: formData.bio,
          avatar_url: formData.avatar_url
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erro ao salvar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Profile updated successfully');
      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });

      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
          {/* Header com Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-fitcooker-orange to-orange-600 rounded-xl p-8 mb-8 text-white"
          >
            <div className="absolute inset-0 bg-black opacity-20 rounded-xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Meu Perfil</h1>
              <p className="text-orange-100">
                Gerencie suas informações pessoais e configurações da conta
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Coluna 1: Avatar e Estatísticas */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Avatar Card */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Foto de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mx-auto border-4 border-white shadow-lg">
                      {formData.avatar_url ? (
                        <img
                          src={formData.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-fitcooker-orange rounded-full p-2 shadow-lg">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
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
                      className="w-full"
                    >
                      {isUploading ? 'Enviando...' : 'Alterar Foto'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-fitcooker-orange" />
                    Estatísticas do Chef
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <ChefHat className="w-5 h-5 text-fitcooker-orange mr-2" />
                        <span className="text-gray-700">Receitas</span>
                      </div>
                      <span className="font-bold text-fitcooker-orange">
                        {profile?.receitas_count || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-gray-700">Seguidores</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {profile?.seguidores_count || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-gray-700">Seguindo</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {profile?.seguindo_count || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Coluna 2: Formulários */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Informações Pessoais */}
              <Card>
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

              {/* Configurações da Conta */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Conta</CardTitle>
                  <CardDescription>
                    Gerencie suas preferências e segurança da conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Alterar Senha
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Preferências de Notificação
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      Excluir Conta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
