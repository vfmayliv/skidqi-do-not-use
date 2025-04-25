
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ListingCard } from '@/components/ListingCard';
import { mockListings } from '@/data/mockListings';
import { categories } from '@/data/categories';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Filter, Grid3X3, List, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const SubcategoryPage = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string, subcategoryId: string }>();
  const { language, city, t } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Find the category and subcategory
  const category = categories.find(c => c.id === categoryId);
  const subcategory = category?.subcategories?.find(s => s.id === subcategoryId);
  
  // Get listings for this subcategory
  const subcategoryListings = mockListings.filter(listing => {
    // If city is selected, filter by city as well
    if (city) {
      return listing.subcategoryId === subcategoryId && listing.city[language] === city[language];
    }
    return listing.subcategoryId === subcategoryId;
  });

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">
              {language === 'ru' ? 'Подкатегория не найдена' : 'Санатша табылмады'}
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link to={`/category/${categoryId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {category.name[language]}
              </Button>
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">{subcategory.name[language]}</h1>
          </div>
          
          {/* Filters and view options */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
              </Button>
              
              {city && (
                <div className="text-sm text-muted-foreground">
                  {language === 'ru' ? 'Город' : 'Қала'}: <span className="font-medium">{city[language]}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Listings */}
        {subcategoryListings.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
              : "space-y-4"
          }>
            {subcategoryListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'ru' 
                ? 'В этой подкатегории пока нет объявлений'
                : 'Бұл санатшада әзірге хабарландырулар жоқ'}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SubcategoryPage;
