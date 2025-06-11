
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareButtonProps {
  recipeId: number;
  recipeTitle: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ recipeId, recipeTitle }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = `${window.location.origin}/recipe/${recipeId}`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "O link da receita foi copiado para a área de transferência.",
        duration: 2000,
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Receita</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Compartilhe esta receita deliciosa com seus amigos:
            </p>
            <p className="font-medium text-gray-900">{recipeTitle}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button 
              type="button" 
              size="sm" 
              onClick={handleCopy}
              className={`px-3 transition-all duration-200 ${
                copied 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-fitcooker-orange hover:bg-fitcooker-orange/90'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            Copie este link e compartilhe onde quiser!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
