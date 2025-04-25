
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ListingCard } from '@/components/ListingCard';
import PropertyCard from '@/components/property/PropertyCard';
import { useAppContext } from '@/contexts/AppContext';
import { mockListings } from '@/data/mockListings';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const { language } = useAppContext();
  const [filteredListings, setFilteredListings] = useState(mockListings);

  useEffect(() => {
    let newListings = mockListings.filter(listing => listing.categoryId === categoryId);

    // Apply subcategory filter if present
    const subcategoryId = searchParams.get('subcategory');
    if (subcategoryId) {
      newListings = newListings.filter(listing => listing.subcategoryId === subcategoryId);
    }

    setFilteredListings(newListings);
  }, [categoryId, searchParams]);

  if (!categoryId) {
    return <div>{language === 'ru' ? 'Категория не найдена' : 'Санат табылмады'}</div>;
  }

  const categoryName = categoryId === 'property'
    ? (language === 'ru' ? 'Недвижимость' : 'Жылжымайтын мүлік')
    : (language === 'ru' ? 'Товары' : 'Тауарлар');

  const isPropertyCategory = categoryId === 'property';

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">{categoryName}</h1>
        {isPropertyCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <PropertyCard 
                key={listing.id} 
                listing={listing}
              />
            ))}
          </div>
        )}

        {!isPropertyCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
