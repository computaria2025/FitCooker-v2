
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: number;
  url: string;
  tipo: 'image' | 'video';
  is_principal: boolean;
  ordem: number;
}

interface MediaCarouselProps {
  mediaItems: MediaItem[];
  className?: string;
  showThumbnails?: boolean;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({ 
  mediaItems, 
  className,
  showThumbnails = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className={cn("relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center", className)}>
        <Image className="w-16 h-16 text-gray-400" />
        <span className="ml-2 text-gray-500">Sem mídia disponível</span>
      </div>
    );
  }

  const currentMedia = mediaItems[currentIndex];
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };
  
  return (
    <div className={cn("relative", className)}>
      {/* Main Media Display */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
        {currentMedia.tipo === 'image' ? (
          <img 
            src={currentMedia.url}
            alt="Mídia da receita"
            className="w-full h-full object-cover"
          />
        ) : (
          <video 
            src={currentMedia.url}
            controls
            className="w-full h-full object-cover"
            poster={currentMedia.url}
          >
            Seu navegador não suporta vídeos.
          </video>
        )}
        
        {/* Navigation Arrows */}
        {mediaItems.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              onClick={nextSlide}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {/* Media Type Indicator */}
        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
          {currentMedia.tipo === 'video' ? (
            <Play className="w-4 h-4 text-white" />
          ) : (
            <Image className="w-4 h-4 text-white" />
          )}
        </div>
        
        {/* Slide Counter */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {mediaItems.length}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {showThumbnails && mediaItems.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {mediaItems.map((media, index) => (
            <button
              key={media.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all",
                index === currentIndex 
                  ? "border-fitcooker-orange shadow-lg scale-105" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {media.tipo === 'image' ? (
                <img 
                  src={media.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
