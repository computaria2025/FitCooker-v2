
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import RatingStars from '@/components/ui/RatingStars';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';

interface RateRecipeFormProps {
  recipeId: string;
  recipeName: string;
}

const RateRecipeForm: React.FC<RateRecipeFormProps> = ({ recipeId, recipeName }) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, dê uma nota para a receita.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log({
      recipeId,
      rating,
      comment,
      timestamp: new Date(),
    });
    
    toast({
      title: "Avaliação enviada!",
      description: `Você deu ${rating} estrelas para ${recipeName}. Obrigado pelo feedback!`,
    });
    
    // Reset form and close dialog
    setRating(0);
    setComment('');
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Avaliar Receita
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avaliar Receita</DialogTitle>
          <DialogDescription>
            Sua avaliação ajuda outros usuários a encontrar receitas de qualidade.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col items-center">
            <p className="text-center mb-2">O que você achou de <span className="font-medium">{recipeName}</span>?</p>
            <RatingStars 
              initialRating={rating} 
              onRatingChange={handleRatingChange} 
              size="lg"
            />
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comentário (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="Compartilhe sua experiência com essa receita..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full sm:w-auto">
              Enviar Avaliação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RateRecipeForm;
