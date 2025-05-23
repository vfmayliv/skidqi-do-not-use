import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';
import { Listing } from '@/types/listing';

export interface TransportListing {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  location: string;
  year: number;
  mileage?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  model: string;
  bodyType?: string;
  engine?: {
    type: string;
    power?: number;
    volume?: number;
  };
  transmission?: string;
  driveType?: string;
  condition: 'new' | 'used';
  createdAt: Date;
  seller: {
    name: string;
    rating?: number;
    verified?: boolean;
    type: 'dealer' | 'private';
  };
  features?: string[];
}

export interface TransportCardProps {
  listing: TransportListing | Listing;
  favorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onClick?: (listing: TransportListing | Listing) => void;
  showContactButton?: boolean;
  variant?: 'default' | 'horizontal';
  isFavorite?: boolean;
  viewMode?: 'grid' | 'list';
}

const TransportCard: React.FC<TransportCardProps> = ({
  listing,
  favorited = false,
  onFavoriteToggle,
  onClick,
  showContactButton = true,
  variant = 'default',
  isFavorite = false,
  viewMode = 'grid'
}) => {
  const { t } = useTranslation();
  
  // Helper function to adapt Listing to TransportListing format
  const adaptListing = (listing: any): TransportListing => {
    // If it's a standard listing from our app, convert it to TransportListing format
    if ('discountPrice' in listing) {
      return {
        id: listing.id,
        title: listing.title?.[typeof listing.title === 'object' ? 'ru' : ''] || `${listing.brand || ''} ${listing.model || ''}`,
        description: typeof listing.description === 'object' ? listing.description.ru : listing.description,
        price: listing.discountPrice || 0,
        currency: 'KZT',
        location: typeof listing.city === 'object' ? listing.city.ru : (listing.city || ''),
        year: listing.year || new Date().getFullYear(),
        mileage: listing.mileage,
        images: listing.images || [listing.imageUrl],
        category: listing.categoryId || '',
        subcategory: listing.subcategoryId,
        brand: listing.brand || '',
        model: listing.model || '',
        bodyType: listing.bodyType,
        engine: {
          type: listing.engineType || '',
          volume: listing.engineVolume
        },
        transmission: listing.transmission,
        driveType: listing.driveType,
        condition: listing.condition || 'used',
        createdAt: new Date(listing.createdAt),
        seller: {
          name: listing.seller?.name || '',
          rating: listing.seller?.rating,
          verified: false,
          type: 'private'
        }
      };
    }
    
    // If it already has the right format, just return it
    return listing as TransportListing;
  };
  
  const adaptedListing = adaptListing(listing);
  
  const {
    id,
    title,
    price,
    currency,
    location,
    year,
    mileage,
    brand,
    model,
    images,
    bodyType,
    engine,
    transmission,
    condition,
    seller
  } = adaptedListing;

  // Форматируем цену для отображения
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(price);
  
  // Форматируем пробег для отображения
  const formattedMileage = mileage ? new Intl.NumberFormat('ru-RU').format(mileage) : null;

  // Обработчики событий
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(listing);
    }
  };

  return (
    <Link to={`/transport/${listing.category}/${id}`}>
      <Card 
        className="transport-card overflow-hidden hover:shadow-md transition-shadow duration-300 mb-4"
        onClick={handleCardClick}
      >
        <div className="flex flex-col md:flex-row">
          {/* Изображение транспортного средства */}
          <div className="relative md:w-1/3 h-60 md:h-auto">
            <img 
              src={images[0] || '/images/no-image.png'} 
              alt={`${brand} ${model}`} 
              className="w-full h-full object-cover"
            />
            
            {/* Индикатор числа фотографий */}
            {images.length > 1 && (
              <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {images.length} {t('photos')}
              </span>
            )}
            
            {/* Кнопка добавления в избранное */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 right-2 rounded-full ${favorited ? 'text-red-500' : 'text-white'} bg-black bg-opacity-40 hover:bg-opacity-60`}
              onClick={handleFavoriteClick}
            >
              <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
            </Button>
            
            {/* Если объявление от проверенного продавца или дилера */}
            {seller.verified && (
              <Badge className="absolute top-2 left-2 bg-blue-600">
                {t('verified.seller')}
              </Badge>
            )}
            
            {seller.type === 'dealer' && (
              <Badge className="absolute top-2 left-2 bg-green-600">
                {t('dealer')}
              </Badge>
            )}
          </div>
          
          {/* Информация о транспортном средстве */}
          <CardContent className="md:w-2/3 p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-1 line-clamp-2">
                  {title || `${brand} ${model}`}
                </h2>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  {formattedPrice} {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₸'}
                </p>
              </div>
              
              {condition === 'new' && (
                <Badge className="bg-green-600 text-white">
                  {t('new')}
                </Badge>
              )}
            </div>
            
            {/* Основные характеристики */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-2 w-4">📅</span> {year}
              </div>
              
              {mileage !== undefined && (
                <div className="flex items-center">
                  <span className="mr-2 w-4">🛣️</span>
                  {formattedMileage} {t('km')}
                </div>
              )}
              
              {bodyType && (
                <div className="flex items-center">
                  <span className="mr-2 w-4">🚘</span>
                  {bodyType}
                </div>
              )}
              
              {engine?.type && (
                <div className="flex items-center">
                  <span className="mr-2 w-4">⚙️</span>
                  {engine.type} {engine.volume && `${engine.volume} ${t('l')}`} 
                  {engine.power && `(${engine.power} ${t('hp')})`}
                </div>
              )}
              
              {transmission && (
                <div className="flex items-center">
                  <span className="mr-2 w-4">🔄</span>
                  {transmission}
                </div>
              )}
            </div>
            
            {/* Местоположение и время публикации */}
            <div className="mt-auto">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {location}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {new Date(listing.createdAt).toLocaleString()}
                </span>
                
                {showContactButton && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    {t('contact.seller')}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default TransportCard;
