
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ListingCard } from '@/components/ListingCard';
import PropertyCard from '@/components/property/PropertyCard';
import { useAppContext } from '@/contexts/AppContext';
import { mockListings } from '@/data/mockListings';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div>{language === 'ru' ? 'Категория не найдена' : 'Санат табылмады'}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = categoryId === 'property'
    ? (language === 'ru' ? 'Недвижимость' : 'Жылжымайтын мүлік')
    : (language === 'ru' ? 'Товары' : 'Тауарлар');

  const isPropertyCategory = categoryId === 'property';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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
      </main>
      <Footer />
    </div>
  );
}
