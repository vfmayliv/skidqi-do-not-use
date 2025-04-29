
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye } from 'lucide-react';
import { Listing } from '@/types/listingType';
import { useAppWithTranslations } from '@/stores/useAppStore';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { language, t } = useAppWithTranslations();
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ' + t('tenge');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/listing/${listing.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.imageUrl}
            alt={listing.title[language]}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          
          {listing.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-discount">
              -{listing.discount}%
            </Badge>
          )}
          
          {listing.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-primary">
              {t('featured')}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-2 h-12">{listing.title[language]}</h3>
          
          <div className="mt-2 space-y-1">
            <div className="flex flex-col">
              {listing.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(listing.originalPrice)}
                </span>
              )}
              <span className="text-lg font-bold text-discount">
                {formatPrice(listing.discountPrice)}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{listing.city[language]}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
          <span>{formatDate(listing.createdAt)}</span>
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{listing.views}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
