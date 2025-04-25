
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Heart, Clock, MapPin, Eye, Tag, ChevronRight } from 'lucide-react';

interface ListingHeaderProps {
  title: string;
  city: string;
  createdAt: string;
  views: number;
  id: string;
  price: number;
  originalPrice: number;
  discount: number;
  isFeatured: boolean;
  isFavorite: boolean;
  language: string;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  onToggleFavorite: () => void;
  onShare: () => void;
  isMobile?: boolean;
}

export const ListingHeader = ({ 
  title, 
  city, 
  createdAt, 
  views, 
  id, 
  price, 
  originalPrice, 
  discount, 
  isFeatured, 
  isFavorite, 
  language, 
  formatPrice, 
  formatDate,
  onToggleFavorite,
  onShare,
  isMobile = false
}: ListingHeaderProps) => {
  
  // Mobile header is simpler
  if (isMobile) {
    return (
      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-2">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{city}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            <span>ID: {id}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop header is more detailed
  return (
    <div className="hidden lg:block bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onShare}
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggleFavorite}
            className={`h-8 w-8 ${isFavorite ? 'text-red-500' : ''}`}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{city}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(createdAt)}</span>
        </div>
        
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          <span>{views} {language === 'ru' ? 'просмотров' : 'қаралым'}</span>
        </div>
        
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1" />
          <span>ID: {id}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(price)}
        </span>
        
        {discount > 0 && (
          <span className="text-sm line-through text-muted-foreground">
            {formatPrice(originalPrice)}
          </span>
        )}
        
        {discount > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200">
            -{discount}%
          </Badge>
        )}
      </div>
      
      <div className="flex items-center text-sm gap-2">
        <Badge variant={isFeatured ? "default" : "outline"} className={isFeatured ? "bg-primary" : ""}>
          {language === 'ru' ? 'Премиум объявление' : 'Премиум хабарландыру'}
        </Badge>
        
        <span className="text-muted-foreground">
          {language === 'ru' ? 'Размещено' : 'Орналастырылған'}: {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
};
