
import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId, className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingFollow, setCheckingFollow] = useState(true);

  useEffect(() => {
    if (user && targetUserId) {
      checkFollowStatus();
    }
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    if (!user) return;
    
    try {
      setCheckingFollow(true);
      const { data, error } = await supabase
        .from('seguidores')
        .select('id')
        .eq('seguidor_id', user.id)
        .eq('seguido_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsFollowing(!!data);
    } catch (error) {
      console.error('Erro ao verificar status de seguimento:', error);
    } finally {
      setCheckingFollow(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para seguir usuários.",
        variant: "destructive",
      });
      return;
    }

    if (user.id === targetUserId) {
      toast({
        title: "Ação inválida",
        description: "Você não pode seguir a si mesmo.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('seguidores')
          .delete()
          .eq('seguidor_id', user.id)
          .eq('seguido_id', targetUserId);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Sucesso!",
          description: "Você parou de seguir este usuário.",
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('seguidores')
          .insert({
            seguidor_id: user.id,
            seguido_id: targetUserId
          });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "Sucesso!",
          description: "Agora você está seguindo este usuário.",
        });
      }
    } catch (error) {
      console.error('Erro ao seguir/desseguir usuário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar esta ação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === targetUserId) {
    return null;
  }

  if (checkingFollow) {
    return (
      <Button variant="outline" disabled className={className}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      className={`${className} ${
        isFollowing
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "bg-fitcooker-orange hover:bg-fitcooker-orange/90 text-white"
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : isFollowing ? (
        <UserMinus className="w-4 h-4 mr-2" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      {isFollowing ? "Deixar de seguir" : "Seguir"}
    </Button>
  );
};

export default FollowButton;
