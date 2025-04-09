
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImagePlus, Video, Check, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  file?: File;
  preview?: string;
  url?: string;
  isMain: boolean;
}

interface MediaUploadProps {
  mediaItems: MediaItem[];
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddVideoUrl: () => void;
  handleRemoveMediaItem: (id: string) => void;
  handleSetMainImage: (id: string) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  mediaItems,
  videoUrl,
  setVideoUrl,
  handleImageChange,
  handleAddVideoUrl,
  handleRemoveMediaItem,
  handleSetMainImage
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Mídia (Opcional)</h2>
      
      <div className="space-y-6">
        {/* Media gallery */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="block">Imagens da Receita</Label>
            <p className="text-xs text-gray-500">* Marque uma das imagens como principal para preview</p>
          </div>
          
          {mediaItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {mediaItems.filter(item => item.type === 'image').map((item) => (
                <div key={item.id} className="relative group">
                  <div className={cn(
                    "h-24 w-full rounded-lg overflow-hidden border-2",
                    item.isMain ? "border-fitcooker-orange" : "border-transparent"
                  )}>
                    <img 
                      src={item.preview} 
                      alt="Imagem da receita" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveMediaItem(item.id)}
                      className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                      title="Remover imagem"
                    >
                      <X size={14} />
                    </button>
                    {!item.isMain && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(item.id)}
                        className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                        title="Definir como principal"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                  {item.isMain && (
                    <div className="absolute bottom-0 left-0 w-full bg-fitcooker-orange text-white text-xs py-1 text-center">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <label className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center py-6">
                <ImagePlus className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Clique para fazer upload</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB por imagem)</span>
              </div>
              <input 
                type="file" 
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
            </label>
          </div>
        </div>
        
        {/* Video section */}
        <div>
          <Label className="block mb-2">Vídeos (opcional)</Label>
          
          {mediaItems.filter(item => item.type === 'video').length > 0 && (
            <div className="space-y-2 mb-4">
              {mediaItems.filter(item => item.type === 'video').map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <Video className="text-gray-400 mr-2" size={20} />
                    <span className="text-sm truncate max-w-xs">{item.url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMediaItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className="flex-grow">
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ex: https://youtube.com/watch?v=..."
              />
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleAddVideoUrl}
              disabled={!videoUrl.trim()}
            >
              <Plus size={16} className="mr-2" />
              Adicionar
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo e outros links de vídeo</p>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
