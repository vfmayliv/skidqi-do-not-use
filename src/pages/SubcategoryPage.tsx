
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { mockListings } from '@/data/mockListings';
import { Listing } from '@/types/listingType';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { ListingCard } from '@/components/ListingCard';

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const [searchParams] = useSearchParams();
  const { language, t } = useAppWithTranslations();
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  
  useEffect(() => {
    // Filter the listings based on both category and subcategory
    let newListings = mockListings;
    
    if (categoryId) {
      newListings = newListings.filter(listing => listing.categoryId === categoryId);
    }
    
    if (subcategoryId) {
      newListings = newListings.filter(listing => listing.subcategoryId === subcategoryId);
    }
    
    setFilteredListings(newListings);
  }, [categoryId, subcategoryId]);
  
  // Get category config to display proper names
  const config = categoryId ? getCategoryConfig(categoryId) : null;
  const categoryName = config?.name?.[language] || categoryId || '';
  
  // Determine subcategory name (in a real app, you would get this from your subcategories data)
  const subcategoryName = subcategoryId || '';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbNavigation 
        items={[
          { label: language === 'ru' ? 'Категории' : 'Санаттар', link: '/category' },
          { label: categoryName, link: `/category/${categoryId}` }
        ]}
        currentPage={subcategoryName}
      />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">{subcategoryName}</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          
          {filteredListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('noListingsFound', 'Объявлений не найдено')}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
