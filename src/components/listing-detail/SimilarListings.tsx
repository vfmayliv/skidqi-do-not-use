
import { Link } from 'react-router-dom';
import { Listing } from '@/types/listingType';

interface SimilarListingsProps {
  listings: Listing[];
  language: string;
  formatPrice: (price: number) => string;
}

export const SimilarListings = ({ listings, language, formatPrice }: SimilarListingsProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">
        {language === 'ru' ? 'Похожие объявления' : 'Ұқсас хабарландырулар'}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {listings.map((item) => (
          <Link key={item.id} to={`/listing/${item.id}`} className="group">
            <div className="aspect-square rounded-md overflow-hidden mb-2">
              <img 
                src={item.imageUrl} 
                alt={item.title[language]} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="font-medium text-sm line-clamp-2 mb-1">
              {item.title[language]}
            </div>
            <div className="text-primary font-bold">
              {formatPrice(item.discountPrice)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
