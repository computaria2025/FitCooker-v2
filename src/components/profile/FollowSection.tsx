
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserMinus, Heart, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: string;
  nome: string;
  avatar_url: string | null;
  bio: string | null;
}

const FollowSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
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
      const { data: followersData, error: followersError } = await supabase
        .from('seguidores')
        .select(`
          seguidor_id,
          profiles!seguidores_seguidor_id_fkey(id, nome, avatar_url, bio)
        `)
        .eq('seguido_id', user.id);

      if (followersError) throw followersError;

      // Buscar seguindo
      const { data: followingData, error: followingError } = await supabase
        .from('seguidores')
        .select(`
          seguido_id,
          profiles!seguidores_seguido_id_fkey(id, nome, avatar_url, bio)
        `)
        .eq('seguidor_id', user.id);

      if (followingError) throw followingError;

      // Processar dados dos seguidores
      const processedFollowers: User[] = (followersData || [])
        .filter(item => item.profiles && !Array.isArray(item.profiles))
        .map(item => ({
          id: (item.profiles as any).id,
          nome: (item.profiles as any).nome || '',
          avatar_url: (item.profiles as any).avatar_url || null,
          bio: (item.profiles as any).bio || null
        }));

      // Processar dados dos seguindo
      const processedFollowing: User[] = (followingData || [])
        .filter(item => item.profiles && !Array.isArray(item.profiles))
        .map(item => ({
          id: (item.profiles as any).id,
          nome: (item.profiles as any).nome || '',
          avatar_url: (item.profiles as any).avatar_url || null,
          bio: (item.profiles as any).bio || null
        }));

      setFollowers(processedFollowers);
      setFollowing(processedFollowing);
    } catch (error) {
      console.error('Erro ao buscar dados de seguidores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('seguidores')
        .delete()
        .eq('seguidor_id', user.id)
        .eq('seguido_id', targetUserId);

      if (error) throw error;

      setFollowing(prev => prev.filter(u => u.id !== targetUserId));
      
      toast({
        title: "Sucesso!",
        description: "Você parou de seguir este usuário.",
      });
    } catch (error) {
      console.error('Erro ao deixar de seguir:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deixar de seguir este usuário.",
        variant: "destructive",
      });
    }
  };

  const UserList: React.FC<{ users: User[]; title: string; showUnfollowButton?: boolean }> = ({ 
    users, 
    title, 
    showUnfollowButton = false 
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Ver {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <div className="space-y-4">
            {users.length > 0 ? (
              users.map((targetUser) => (
                <motion.div
                  key={targetUser.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={targetUser.avatar_url || ''} />
                      <AvatarFallback>
                        <Users className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{targetUser.nome}</p>
                      {targetUser.bio && (
                        <p className="text-sm text-gray-500 line-clamp-1">{targetUser.bio}</p>
                      )}
                    </div>
                  </div>
                  
                  {showUnfollowButton && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfollow(targetUser.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-fitcooker-orange" />
            Conexões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-fitcooker-orange" />
          Conexões
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{followers.length}</div>
            <div className="text-sm text-blue-600">Seguidores</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{following.length}</div>
            <div className="text-sm text-green-600">Seguindo</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <UserList users={followers} title="Seguidores" />
          <UserList users={following} title="Seguindo" showUnfollowButton={true} />
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowSection;
