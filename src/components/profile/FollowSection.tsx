
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  nome: string;
  avatar_url: string | null;
  bio: string | null;
}

const FollowSection: React.FC = () => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollowData();
    }
  }, [user]);

  const fetchFollowData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Buscar seguidores
      const { data: followersData } = await supabase
        .from('seguidores')
        .select(`
          seguidor_id,
          profiles!seguidores_seguidor_id_fkey(id, nome, avatar_url, bio)
        `)
        .eq('seguido_id', user.id);

      // Buscar seguindo
      const { data: followingData } = await supabase
        .from('seguidores')
        .select(`
          seguido_id,
          profiles!seguidores_seguido_id_fkey(id, nome, avatar_url, bio)
        `)
        .eq('seguidor_id', user.id);

      if (followersData) {
        setFollowers(followersData.map(f => f.profiles).filter(Boolean) as User[]);
      }
      
      if (followingData) {
        setFollowing(followingData.map(f => f.profiles).filter(Boolean) as User[]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de seguidores:', error);
    } finally {
      setLoading(false);
    }
  };

  const UserList: React.FC<{ users: User[]; title: string }> = ({ users, title }) => {
    const filteredUsers = users.filter(user =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title} ({users.length})</h3>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((userItem) => (
              <div key={userItem.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userItem.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userItem.nome}</p>
                    {userItem.bio && (
                      <p className="text-sm text-gray-500 line-clamp-1">{userItem.bio}</p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `/cook/${userItem.id}`}
                >
                  Ver Perfil
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Seguidores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Seguidores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prévia de Seguidores */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Seguidores ({followers.length})</h3>
              {followers.length > 3 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-fitcooker-orange border-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
                    >
                      Ver todos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Seus Seguidores</DialogTitle>
                    </DialogHeader>
                    <UserList users={followers} title="Seguidores" />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="space-y-3">
              {followers.slice(0, 3).map((follower) => (
                <div key={follower.id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={follower.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{follower.nome}</p>
                    {follower.bio && (
                      <p className="text-xs text-gray-500 truncate">{follower.bio}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {followers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Você ainda não tem seguidores
                </p>
              )}
            </div>
          </div>

          {/* Prévia de Seguindo */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Seguindo ({following.length})</h3>
              {following.length > 3 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-fitcooker-orange border-fitcooker-orange hover:bg-fitcooker-orange hover:text-white"
                    >
                      Ver todos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Pessoas que Você Segue</DialogTitle>
                    </DialogHeader>
                    <UserList users={following} title="Seguindo" />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="space-y-3">
              {following.slice(0, 3).map((followingUser) => (
                <div key={followingUser.id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={followingUser.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{followingUser.nome}</p>
                    {followingUser.bio && (
                      <p className="text-xs text-gray-500 truncate">{followingUser.bio}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {following.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Você ainda não segue ninguém
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowSection;
