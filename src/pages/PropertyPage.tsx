import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { usePropertyListings } from '@/hooks/usePropertyListings';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GuidedSearch } from '@/components/property/GuidedSearch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { List, Map } from 'lucide-react';
import MapView from '@/components/property/MapView';

export default function PropertyPage() {
  const { dealType, segment, filters, setFilters, setDealType, setSegment } = usePropertyFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, loading, error } = usePropertyListings(filters);
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    // Sync URL params with store on initial load
    const urlDealType = searchParams.get('dealType');
    const urlSegment = searchParams.get('segment');
    if (urlDealType && urlSegment) {
      setDealType(urlDealType);
      setSegment(urlSegment);
      setShowFilters(true);
    }
  }, []);

  const handleGuidedSearchComplete = (deal: string, seg: string) => {
    setDealType(deal);
    setSegment(seg);
    setSearchParams({ dealType: deal, segment: seg });
    setShowFilters(true);
  };

  const processedListings = useMemo(() => {
    return listings.map(l => ({ ...l, price: Number(l.price) }));
  }, [listings]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-8">
          {!showFilters ? (
            <GuidedSearch onComplete={handleGuidedSearchComplete} />
          ) : (
            <>
              <PropertyFilters />
              
              <div className="flex justify-end">
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => {if (value) setViewMode(value)}} className="bg-card p-1 rounded-md">
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="map" aria-label="Map view">
                    <Map className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {loading && <div className="text-center">Загрузка объявлений...</div>}
              {error && <div className="text-center text-red-500">Ошибка: {error.message}</div>}
              
              {!loading && viewMode === 'list' && processedListings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
                  {processedListings.map(listing => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
              
              {!loading && viewMode === 'map' && (
                <MapView listings={processedListings} />
              )}
              
              {!loading && processedListings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Подходящих объявлений не найдено.</p>
                  <p className="text-sm text-gray-400 mt-2">Попробуйте изменить параметры фильтра или сбросить их.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
