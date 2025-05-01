
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppStore } from '@/stores/useAppStore';
import { mockListings } from '@/data/mockListings';
import TransportFilters from '@/components/transport/TransportFilters';
import TransportCard from '@/components/transport/TransportCard';
import { useTransportFiltersStore } from '@/stores/useTransportFiltersStore';
import { Listing } from '@/types/listingType';

export function TransportPage() {
  const { language } = useAppStore();
  const { filters, setFilters, resetFilters, activeFiltersCount } = useTransportFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter transport listings only
  const [transportListings, setTransportListings] = useState<Listing[]>(
    mockListings.filter(listing => listing.vehicleType)
  );
  
  // State for favorites
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Handle favorite toggle
  const handleFavoriteToggle = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };
  
  // Apply filters when they change
  useEffect(() => {
    let filtered = [...mockListings.filter(listing => listing.vehicleType)];
    
    // Apply brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(listing => 
        listing.brand && filters.brands.includes(listing.brand)
      );
    }
    
    // Apply price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(listing => 
        listing.discountPrice >= filters.priceRange.min!
      );
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(listing => 
        listing.discountPrice <= filters.priceRange.max!
      );
    }
    
    // Apply year range filter
    if (filters.yearRange.min) {
      filtered = filtered.filter(listing => 
        listing.year && listing.year >= filters.yearRange.min!
      );
    }
    if (filters.yearRange.max) {
      filtered = filtered.filter(listing => 
        listing.year && listing.year <= filters.yearRange.max!
      );
    }
    
    // Apply mileage range filter
    if (filters.mileageRange.min) {
      filtered = filtered.filter(listing => 
        listing.mileage && listing.mileage >= filters.mileageRange.min!
      );
    }
    if (filters.mileageRange.max) {
      filtered = filtered.filter(listing => 
        listing.mileage && listing.mileage <= filters.mileageRange.max!
      );
    }
    
    // Apply vehicle type filter
    if (filters.vehicleType) {
      filtered = filtered.filter(listing => 
        listing.vehicleType === filters.vehicleType
      );
    }
    
    // Apply engine types filter
    if (filters.engineTypes && filters.engineTypes.length > 0) {
      filtered = filtered.filter(listing => 
        listing.engineType && filters.engineTypes!.includes(listing.engineType)
      );
    }
    
    // Apply transmission types filter
    if (filters.transmissionTypes && filters.transmissionTypes.length > 0) {
      filtered = filtered.filter(listing => 
        listing.transmission && filters.transmissionTypes!.includes(listing.transmission)
      );
    }
    
    // Apply drive types filter
    if (filters.driveTypes && filters.driveTypes.length > 0) {
      filtered = filtered.filter(listing => 
        listing.driveType && filters.driveTypes!.includes(listing.driveType)
      );
    }
    
    // Apply body types filter
    if (filters.bodyTypes && filters.bodyTypes.length > 0) {
      filtered = filtered.filter(listing => 
        listing.bodyType && filters.bodyTypes!.includes(listing.bodyType)
      );
    }
    
    // Apply condition types filter
    if (filters.conditionTypes && filters.conditionTypes.length > 0) {
      filtered = filtered.filter(listing => 
        listing.condition && filters.conditionTypes!.includes(listing.condition)
      );
    }
    
    // Apply sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.discountPrice - b.discountPrice);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.discountPrice - a.discountPrice);
          break;
        case 'year_asc':
          filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
          break;
        case 'year_desc':
          filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
          break;
        case 'mileage_asc':
          filtered.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
          break;
        case 'mileage_desc':
          filtered.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
          break;
        default:
          break;
      }
    }
    
    // Update state with filtered listings
    setTransportListings(filtered);
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">
            {language === 'ru' ? 'Транспорт' : 'Көлік'}
          </h1>
          
          <TransportFilters 
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            activeFiltersCount={activeFiltersCount}
          />
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {transportListings.length} {language === 'ru' ? 'объявлений' : 'хабарландыру'}
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                
                <button 
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {transportListings.map(listing => (
                <TransportCard 
                  key={listing.id}
                  listing={listing}
                  variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={favorites.includes(listing.id)}
                  viewMode={viewMode}
                />
              ))}
              
              {transportListings.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    {language === 'ru' 
                      ? 'Нет объявлений, соответствующих вашему запросу' 
                      : 'Сіздің сұранысыңызға сәйкес хабарландырулар жоқ'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
