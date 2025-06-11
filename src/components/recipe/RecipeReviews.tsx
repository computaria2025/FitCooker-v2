
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface Review {
  id: number;
  nota: number;
  comentario: string | null;
  created_at: string;
  profiles: {
    nome: string;
    avatar_url: string | null;
  };
}

interface RecipeReviewsProps {
  recipeId: number;
  averageRating: number;
  totalReviews: number;
}

const RecipeReviews: React.FC<RecipeReviewsProps> = ({ 
  recipeId, 
  averageRating, 
  totalReviews 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          id,
          nota,
          comentario,
          created_at,
          profiles!avaliacoes_usuario_id_fkey(nome, avatar_url)
        `)
        .eq('receita_id', recipeId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
          <MessageSquare className="w-5 h-5" />
          Avaliações ({totalReviews})
        </CardTitle>
        
        {/* Rating Summary */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex items-center">
              {renderStars(Math.round(averageRating))}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            Baseado em {totalReviews} avaliação{totalReviews !== 1 ? 'ões' : ''}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.profiles?.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {review.profiles?.nome || 'Usuário'}
                      </span>
                      <div className="flex items-center">
                        {renderStars(review.nota)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    
                    {review.comentario && (
                      <p className="text-gray-700 leading-relaxed">
                        {review.comentario}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Ainda não há avaliações para esta receita</p>
              <p className="text-sm">Seja o primeiro a avaliar!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeReviews;
