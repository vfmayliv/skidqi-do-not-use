
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Listing, VehicleType, TransmissionType, EngineType, DriveType } from '@/types/listingType';

type TransportCardProps = {
  listing: Listing;
  variant?: 'default' | 'horizontal';
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
};

const TransportCard = ({ listing, variant = 'default', onFavoriteToggle, isFavorite = false }: TransportCardProps) => {
  const { language } = useAppContext();
  
  // Helper to format discount price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ').format(price);
  };
  
  // Get engine type label
  const getEngineTypeLabel = () => {
    if (!listing.engineType) return '';
    
    const labels = {
      [EngineType.PETROL]: { ru: 'Бензин', kz: 'Бензин' },
      [EngineType.DIESEL]: { ru: 'Дизель', kz: 'Дизель' },
      [EngineType.GAS]: { ru: 'Газ', kz: 'Газ' },
      [EngineType.HYBRID]: { ru: 'Гибрид', kz: 'Гибрид' },
      [EngineType.ELECTRIC]: { ru: 'Электро', kz: 'Электр' },
      [EngineType.PETROL_GAS]: { ru: 'Бензин/Газ', kz: 'Бензин/Газ' },
    };
    
    return labels[listing.engineType][language];
  };
  
  // Get transmission label
  const getTransmissionLabel = () => {
    if (!listing.transmission) return '';
    
    const labels = {
      [TransmissionType.MANUAL]: { ru: 'Механика', kz: 'Механика' },
      [TransmissionType.AUTOMATIC]: { ru: 'Автомат', kz: 'Автомат' },
      [TransmissionType.ROBOT]: { ru: 'Робот', kz: 'Робот' },
      [TransmissionType.VARIATOR]: { ru: 'Вариатор', kz: 'Вариатор' },
    };
    
    return labels[listing.transmission][language];
  };
  
  // Get drive type label
  const getDriveTypeLabel = () => {
    if (!listing.driveType) return '';
    
    const labels = {
      [DriveType.FRONT]: { ru: 'Передний', kz: 'Алдыңғы' },
      [DriveType.REAR]: { ru: 'Задний', kz: 'Артқы' },
      [DriveType.ALL_WHEEL]: { ru: 'Полный', kz: 'Толық' },
      [DriveType.FULL]: { ru: '4WD', kz: '4WD' },
    };
    
    return labels[listing.driveType][language];
  };
  
  // Get vehicle details string
  const getVehicleDetails = () => {
    const details = [];
    
    if (listing.engineVolume) {
      details.push(`${listing.engineVolume.toFixed(1)} ${language === 'ru' ? 'л' : 'л'}`);
    }
    
    if (listing.engineType) {
      details.push(getEngineTypeLabel());
    }
    
    if (listing.transmission) {
      details.push(getTransmissionLabel());
    }
    
    if (listing.driveType) {
      details.push(getDriveTypeLabel());
    }
    
    return details.join(', ');
  };
  
  // Get time since listing posted
  const getTimeSince = () => {
    const createdAt = new Date(listing.createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
      if (diffInHours === 0) {
        return language === 'ru' ? 'Только что' : 'Жаңа ғана';
      }
      return `${diffInHours} ${language === 'ru' ? 'ч назад' : 'сағат бұрын'}`;
    } else if (diffInDays === 1) {
      return language === 'ru' ? 'Вчера' : 'Кеше';
    } else if (diffInDays < 7) {
      return `${diffInDays} ${language === 'ru' ? 'дн назад' : 'күн бұрын'}`;
    } else {
      return createdAt.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ');
    }
  };
  
  if (variant === 'horizontal') {
    return (
      <Card className="overflow-hidden h-[130px]">
        <div className="flex h-full">
          <div className="w-[130px] h-full relative">
            <img
              src={listing.imageUrl || '/placeholder.svg'}
              alt={listing.title[language]}
              className="w-full h-full object-cover"
            />
            {listing.discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                -{listing.discount}%
              </Badge>
            )}
            {listing.isFeatured && (
              <Badge variant="outline" className="absolute bottom-2 left-2 bg-blue-500 text-white border-none">
                {language === 'ru' ? 'Премиум' : 'Премиум'}
              </Badge>
            )}
          </div>
          
          <CardContent className="flex flex-col justify-between p-3 flex-1 overflow-hidden">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {listing.brand} {listing.model} {listing.year}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate mb-1">
                    {getVehicleDetails()}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onFavoriteToggle?.(listing.id);
                  }}
                  className="ml-2 text-muted-foreground hover:text-primary"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
              
              <div className="flex items-center mt-1 mb-1">
                <p className="text-muted-foreground text-xs">
                  {listing.mileage?.toLocaleString()} {language === 'ru' ? 'км' : 'км'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-1">
              <p className="font-bold">
                {formatPrice(listing.discountPrice)} ₸
              </p>
              
              <div className="text-xs text-muted-foreground">
                {listing.city[language]}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }
  
  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-md">
        <div className="h-48 relative">
          <img
            src={listing.imageUrl || '/placeholder.svg'}
            alt={listing.title[language]}
            className="w-full h-full object-cover"
          />
          {listing.discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{listing.discount}%
            </Badge>
          )}
          {listing.isFeatured && (
            <Badge variant="outline" className="absolute top-2 right-2 bg-blue-500 text-white border-none">
              {language === 'ru' ? 'Премиум' : 'Премиум'}
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle?.(listing.id);
            }}
            className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center text-muted-foreground hover:text-primary"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
        
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate">
              {listing.brand} {listing.model} {listing.year}
            </h3>
            <p className="font-bold text-right ml-2">
              {formatPrice(listing.discountPrice)} ₸
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">
            {getVehicleDetails()}
          </p>
          
          <div className="flex items-center mt-2 gap-2">
            <p className="text-xs text-muted-foreground">
              {listing.mileage?.toLocaleString()} {language === 'ru' ? 'км' : 'км'}
            </p>
            <span className="text-xs text-muted-foreground">•</span>
            <p className="text-xs text-muted-foreground">
              {listing.city[language]}
            </p>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            {getTimeSince()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TransportCard;
