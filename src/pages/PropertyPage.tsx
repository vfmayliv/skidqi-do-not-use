import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { mockListings } from '@/data/mockListings';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyType, PropertyFilters as PropertyFiltersType } from '@/types/listingType';
import PropertyFilters from '@/components/property/PropertyFilters';
import { useState, useEffect } from 'react';
import AdvancedPropertyFilters from '@/components/property/AdvancedPropertyFilters';
import { Grid3X3, List, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyMap from '@/components/property/PropertyMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropertyPage = () => {
  const { language, city } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  
  const [filters, setFilters] = useState<PropertyFiltersType>({
    priceRange: { min: null, max: null },
    rooms: null,
    areaRange: { min: null, max: null },
    floorRange: { min: null, max: null },
    propertyTypes: null,
    districts: null,
    hasPhoto: null,
    onlyNewBuilding: null,
    furnished: null,
    allowPets: null,
    hasParking: null,
    dealType: null,
    buildingTypes: null,
    yearBuiltRange: { min: null, max: null },
    ceilingHeightRange: { min: null, max: null },
    bathroomTypes: null,
    renovationTypes: null,
    hasBalcony: null,
    hasElevator: null,
    rentPeriodMin: null,
    isCorner: null,
    isStudio: null,
    hasSeparateEntrance: null,
    securityGuarded: null,
    hasPlayground: null,
    utilityBillsIncluded: null,
    sortBy: null,
    viewTypes: null,
    nearbyInfrastructure: null
  });
  
  const [filteredListings, setFilteredListings] = useState([]);
  
  const countActiveFilters = () => {
    let count = 0;
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) count++;
    if (filters.rooms !== null) count++;
    if (filters.areaRange.min !== null || filters.areaRange.max !== null) count++;
    if (filters.floorRange.min !== null || filters.floorRange.max !== null) count++;
    if (filters.propertyTypes !== null) count++;
    if (filters.districts !== null) count++;
    if (filters.hasPhoto !== null) count++;
    if (filters.onlyNewBuilding !== null) count++;
    if (filters.furnished !== null) count++;
    if (filters.allowPets !== null) count++;
    if (filters.hasParking !== null) count++;
    if (filters.dealType !== null) count++;
    if (filters.buildingTypes !== null) count++;
    if (filters.yearBuiltRange.min !== null || filters.yearBuiltRange.max !== null) count++;
    if (filters.bathroomTypes !== null) count++;
    if (filters.renovationTypes !== null) count++;
    if (filters.hasBalcony !== null) count++;
    if (filters.hasElevator !== null) count++;
    
    return count;
  };
  
  const activeFiltersCount = countActiveFilters();
  
  useEffect(() => {
    let propertyListings = mockListings.filter(listing => 
      listing.categoryId === 'real-estate'
    );
    
    if (city) {
      propertyListings = propertyListings.filter(listing => 
        listing.city[language] === city[language]
      );
    }
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      propertyListings = propertyListings.filter(listing => 
        listing.propertyType && filters.propertyTypes.includes(listing.propertyType)
      );
    }
    
    if (filters.rooms && filters.rooms.length > 0) {
      propertyListings = propertyListings.filter(listing => 
        listing.rooms && filters.rooms.includes(listing.rooms)
      );
    }
    
    if (filters.priceRange.min !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.discountPrice >= filters.priceRange.min
      );
    }
    
    if (filters.priceRange.max !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.discountPrice <= filters.priceRange.max
      );
    }
    
    if (filters.areaRange.min !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.area && listing.area >= filters.areaRange.min
      );
    }
    
    if (filters.areaRange.max !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.area && listing.area <= filters.areaRange.max
      );
    }
    
    if (filters.floorRange.min !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.floor && listing.floor >= filters.floorRange.min
      );
    }
    
    if (filters.floorRange.max !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.floor && listing.floor <= filters.floorRange.max
      );
    }
    
    if (filters.yearBuiltRange.min !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.yearBuilt && listing.yearBuilt >= filters.yearBuiltRange.min
      );
    }
    
    if (filters.yearBuiltRange.max !== null) {
      propertyListings = propertyListings.filter(listing => 
        listing.yearBuilt && listing.yearBuilt <= filters.yearBuiltRange.max
      );
    }
    
    if (filters.hasPhoto === true) {
      propertyListings = propertyListings.filter(listing => 
        listing.imageUrl && listing.imageUrl.length > 0
      );
    }
    
    if (filters.onlyNewBuilding === true) {
      propertyListings = propertyListings.filter(listing => 
        listing.isNewBuilding === true
      );
    }
    
    if (filters.furnished === true) {
      propertyListings = propertyListings.filter(listing => 
        listing.furnishing === true
      );
    }
    
    if (filters.hasParking === true) {
      propertyListings = propertyListings.filter(listing => 
        listing.parking === true
      );
    }
    
    if (filters.hasBalcony === true) {
      propertyListings = propertyListings.filter(listing => 
        listing.balcony === true
      );
    }
    
    if (filters.hasElevator === true) {
      propertyListings = propertyListings.filter(listing => 
        listing.elevator === true
      );
    }
    
    if (filters.isCorner === true) {
      propertyListings = propertyListings.filter(listing => 
        listing.isCorner === true
      );
    }
    
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          propertyListings.sort((a, b) => a.discountPrice - b.discountPrice);
          break;
        case 'price_desc':
          propertyListings.sort((a, b) => b.discountPrice - a.discountPrice);
          break;
        case 'date_desc':
          propertyListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'area_asc':
          propertyListings.sort((a, b) => (a.area || 0) - (b.area || 0));
          break;
        case 'area_desc':
          propertyListings.sort((a, b) => (b.area || 0) - (a.area || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredListings(propertyListings);
  }, [filters, city, language]);
  
  const handleFilterChange = (newFilters: Partial<PropertyFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  const handleAdvancedFilterChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newFilters.priceRange || { min: null, max: null },
      areaRange: newFilters.areaRange || { min: null, max: null },
      rooms: newFilters.rooms.length > 0 ? newFilters.rooms : null,
      floorRange: {
        min: newFilters.floor?.min || null,
        max: newFilters.floor?.max || null
      },
      propertyTypes: newFilters.propertyTypes.length > 0 ? newFilters.propertyTypes : null,
      buildingTypes: newFilters.buildingTypes.length > 0 ? newFilters.buildingTypes : null,
      yearBuiltRange: newFilters.yearBuilt || { min: null, max: null },
      bathroomTypes: newFilters.bathroomTypes.length > 0 ? newFilters.bathroomTypes : null,
      renovationTypes: newFilters.renovationTypes.length > 0 ? newFilters.renovationTypes : null,
      districts: newFilters.districts.length > 0 ? newFilters.districts : null,
      hasPhoto: newFilters.hasPhoto || null,
      onlyNewBuilding: newFilters.isNewBuilding || null,
      hasParking: newFilters.hasParking || null,
      furnished: newFilters.hasFurniture || null,
      hasBalcony: newFilters.hasBalcony || null,
      hasElevator: newFilters.hasElevator || null,
      isCorner: newFilters.isCorner || null,
      sortBy: newFilters.sortBy || null
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      priceRange: { min: null, max: null },
      rooms: null,
      areaRange: { min: null, max: null },
      floorRange: { min: null, max: null },
      propertyTypes: null,
      districts: null,
      hasPhoto: null,
      onlyNewBuilding: null,
      furnished: null,
      allowPets: null,
      hasParking: null,
      dealType: null,
      buildingTypes: null,
      yearBuiltRange: { min: null, max: null },
      ceilingHeightRange: { min: null, max: null },
      bathroomTypes: null,
      renovationTypes: null,
      hasBalcony: null,
      hasElevator: null,
      rentPeriodMin: null,
      isCorner: null,
      isStudio: null,
      hasSeparateEntrance: null,
      securityGuarded: null,
      hasPlayground: null,
      utilityBillsIncluded: null,
      sortBy: null,
      viewTypes: null,
      nearbyInfrastructure: null
    });
  };
  
  const districts = [
    { id: 'almaty-center', name: { ru: 'Центр', kz: 'Орталық' } },
    { id: 'almaty-north', name: { ru: 'Север', kz: 'Солтүстік' } },
    { id: 'almaty-east', name: { ru: 'Восток', kz: 'Шығыс' } },
    { id: 'almaty-west', name: { ru: 'Запад', kz: 'Батыс' } },
    { id: 'almaty-south', name: { ru: 'Юг', kz: 'Оңтүстік' } },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language === 'ru' ? 'Недвижимость' : 'Жылжымайтын мүлік'}
          {city && (
            <span className="text-muted-foreground font-normal ml-2 text-xl">
              — {city[language]}
            </span>
          )}
        </h1>
        
        <div className="mb-8">
          <div className="mb-4">
            <PropertyFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
              onSearch={() => {/* Уже реализовано через useEffect */}}
              districts={districts}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
          
          <div className="mb-4">
            <AdvancedPropertyFilters
              onApplyFilters={handleAdvancedFilterChange}
              onReset={resetFilters}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            {language === 'ru' 
              ? `Найдено объявлений: ${filteredListings.length}` 
              : `Хабарландырулар табылды: ${filteredListings.length}`}
          </p>
          
          <div className="flex items-center gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as 'grid' | 'list' | 'map')}
              className="w-fit"
            >
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="grid" className="px-3">
                  <Grid3X3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="map" className="px-3">
                  <MapPin className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <Tabs value={viewMode} className="w-full">
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
              {filteredListings.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    {language === 'ru' 
                      ? 'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.' 
                      : 'Сұрауыңыз бойынша ештеңе табылмады. Іздеу параметрлерін өзгертіп көріңіз.'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} variant="horizontal" />
              ))}
              {filteredListings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {language === 'ru' 
                      ? 'По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.' 
                      : 'Сұрауыңыз бойынша ештеңе табылмады. Іздеу параметрлерін өзгертіп көріңіз.'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <div className="relative h-[70vh] w-full rounded-lg overflow-hidden">
              <PropertyMap 
                listings={filteredListings} 
                onListingClick={(listing) => {
                  window.location.href = `/listing/${listing.id}`;
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyPage;
