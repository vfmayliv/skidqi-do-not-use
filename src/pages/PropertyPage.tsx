

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { usePropertyListings } from '@/hooks/usePropertyListings';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { List, Map } from 'lucide-react';
import MapView from '@/components/property/MapView';

export default function PropertyPage() {
  const { filters, setFilters, setDealType, setSegment } = usePropertyFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, loading, error } = usePropertyListings(filters);
  
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    const urlDealType = searchParams.get('dealType');
    const urlSegment = searchParams.get('segment');
    if (urlDealType) {
      setDealType(urlDealType);
    }
    if (urlSegment) {
      setSegment(urlSegment);
    }
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.dealType) params.set('dealType', newFilters.dealType);
    if (newFilters.segment) params.set('segment', newFilters.segment);
    setSearchParams(params);
  };
  
  const processedListings = useMemo(() => {
    // Add null/undefined check to prevent map error
    if (!listings || !Array.isArray(listings)) return [];
    return listings;
  }, [listings]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
            <>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Недвижимость</h1>
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} defaultValue="list">
                  <ToggleGroupItem value="list" aria-label="Toggle list">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="map" aria-label="Toggle map">
                    <Map className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <PropertyFilters />
              
              {loading && <div className="text-center py-8">Загрузка...</div>}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
