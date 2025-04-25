import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ListingCard } from '@/components/ListingCard';
import { mockListings } from '@/data/mockListings';
import { categories, PropertyFilterConfig } from '@/data/categories'; // Убедимся, что PropertyFilterConfig импортирован
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Grid3X3, List, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PropertyFilters from '@/components/property/PropertyFilters';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyMap from '@/components/property/PropertyMap';
import type { PropertyFilters as PropertyFiltersType } from '@/types/listingType';

// Добавляем возможность переопределять ID категории через пропс
interface CategoryPageProps {
  overrideId?: string;
}

const CategoryPage = ({ overrideId }: CategoryPageProps) => {
  const params = useParams<{ categoryId: string }>();
  const categoryId = overrideId || params.categoryId;
  const { language, city, t } = useAppContext();
  // State and handlers for 'property' category
  const [propViewMode, setPropViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [propertyFilters, setPropertyFilters] = useState<PropertyFiltersType>({
    priceRange: { min: null, max: null }, rooms: null, areaRange: { min: null, max: null },
    floorRange: { min: null, max: null }, propertyTypes: null, districts: null,
    hasPhoto: null, onlyNewBuilding: null, furnished: null, allowPets: null, hasParking: null,
    dealType: null, buildingTypes: null, yearBuiltRange: { min: null, max: null },
    ceilingHeightRange: { min: null, max: null }, bathroomTypes: null, renovationTypes: null,
    hasBalcony: null, hasElevator: null, rentPeriodMin: null, isCorner: null,
    isStudio: null, hasSeparateEntrance: null, securityGuarded: null, hasPlayground: null,
    utilityBillsIncluded: null, sortBy: null, viewTypes: null, nearbyInfrastructure: null
  });
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const findCategory = (id: string | undefined, cats: typeof categories): (typeof categories[0] | undefined) => {
    if (!id) return undefined;
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.subcategories) {
        const found = findCategory(id, cat.subcategories);
        if (found) return found;
      }
    }
    return undefined;
  };

  const category = findCategory(categoryId, categories);

  const districts = [ // Примерные данные, замените на ваши реальные
    { id: 'almaty-center', name: { ru: 'Центр', kz: 'Орталық' } },
    { id: 'almaty-north', name: { ru: 'Север', kz: 'Солтүстік' } },
    // ... другие районы
  ];

  // Логика фильтрации для категории 'Недвижимость'
  const countActiveFilters = () => {
    const f = propertyFilters;
    let cnt = 0;
    if (f.dealType !== null) cnt++;
    if (f.propertyTypes !== null && f.propertyTypes.length > 0) cnt++;
    if (f.isStudio) cnt++;
    if (f.rooms !== null && f.rooms.length > 0) cnt++;
    if (f.priceRange.min !== null || f.priceRange.max !== null) cnt++;
    if (f.areaRange.min !== null || f.areaRange.max !== null) cnt++;
    if (f.floorRange.min !== null || f.floorRange.max !== null) cnt++;
    if (f.districts !== null && f.districts.length > 0) cnt++;
    if (f.hasPhoto !== null) cnt++;
    if (f.onlyNewBuilding !== null) cnt++;
    if (f.furnished !== null) cnt++;
    if (f.allowPets !== null) cnt++;
    if (f.hasParking !== null) cnt++;
    if (f.buildingTypes !== null && f.buildingTypes.length > 0) cnt++;
    if (f.yearBuiltRange.min !== null || f.yearBuiltRange.max !== null) cnt++;
    if (f.bathroomTypes !== null && f.bathroomTypes.length > 0) cnt++;
    if (f.renovationTypes !== null && f.renovationTypes.length > 0) cnt++;
    if (f.hasBalcony !== null) cnt++;
    if (f.hasElevator !== null) cnt++;
    if (f.isCorner !== null) cnt++;
    if (f.hasSeparateEntrance !== null) cnt++;
    if (f.securityGuarded !== null) cnt++;
    if (f.hasPlayground !== null) cnt++;
    if (f.utilityBillsIncluded !== null) cnt++;
    if (f.sortBy !== null) cnt++;
    if (f.viewTypes !== null && f.viewTypes.length > 0) cnt++;
    if (f.nearbyInfrastructure !== null && f.nearbyInfrastructure.length > 0) cnt++;
    // Add other filters if needed
    return cnt;
  };
  const activeFiltersCount = countActiveFilters();

  useEffect(() => {
    let listings = mockListings.filter(l => l.categoryId === categoryId); // Фильтруем по текущей категории
    if (categoryId === 'property') {
      if (city) listings = listings.filter(l => l.city[language] === city[language]);
      const f = propertyFilters;

      // Apply filters
      if (f.dealType) listings = listings.filter(l => l.dealType === f.dealType);
      if (f.propertyTypes && f.propertyTypes.length) listings = listings.filter(l => l.propertyType && f.propertyTypes.includes(l.propertyType));
      if (f.isStudio) listings = listings.filter(l => l.isStudio === f.isStudio);
      if (f.rooms && f.rooms.length) listings = listings.filter(l => l.rooms && f.rooms.includes(l.rooms));
      if (f.priceRange.min !== null) listings = listings.filter(l => l.discountPrice >= f.priceRange.min!);
      if (f.priceRange.max !== null) listings = listings.filter(l => l.discountPrice <= f.priceRange.max!);
      if (f.areaRange.min !== null) listings = listings.filter(l => l.area && l.area >= f.areaRange.min!);
      if (f.areaRange.max !== null) listings = listings.filter(l => l.area && l.area <= f.areaRange.max!);
      // ... примените остальные фильтры аналогично ...

       // Sorting
       if (f.sortBy === 'price_asc') {
         listings.sort((a, b) => a.discountPrice - b.discountPrice);
       } else if (f.sortBy === 'price_desc') {
         listings.sort((a, b) => b.discountPrice - a.discountPrice);
       } else if (f.sortBy === 'date_desc') {
         listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
       }
    } else {
      // Логика для других категорий
       if (city) listings = listings.filter(l => l.city[language] === city[language]);
    }
    setFilteredListings(listings);
  }, [categoryId, propertyFilters, city, language]);

  const handleFilterChange = (newF: Partial<PropertyFiltersType>) => setPropertyFilters(prev => ({ ...prev, ...newF }));

  const handleSearch = () => {
    // Поиск инициируется изменением propertyFilters через useEffect
    console.log("Search triggered with filters:", propertyFilters);
  }

  const resetFilters = () => setPropertyFilters({
    priceRange: { min: null, max: null }, rooms: null, areaRange: { min: null, max: null },
    floorRange: { min: null, max: null }, propertyTypes: null, districts: null,
    hasPhoto: null, onlyNewBuilding: null, furnished: null, allowPets: null, hasParking: null,
    dealType: null, buildingTypes: null, yearBuiltRange: { min: null, max: null },
    ceilingHeightRange: { min: null, max: null }, bathroomTypes: null, renovationTypes: null,
    hasBalcony: null, hasElevator: null, rentPeriodMin: null, isCorner: null,
    isStudio: null, hasSeparateEntrance: null, securityGuarded: null, hasPlayground: null,
    utilityBillsIncluded: null, sortBy: null, viewTypes: null, nearbyInfrastructure: null
  });

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">
              {language === 'ru' ? 'Категория не найдена' : 'Санат табылмады'}
            </h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Подставляем правильный базовый путь в зависимости от overrideId
  const basePath = overrideId ? `/${categoryId}` : `/category/${categoryId}`;

  // Если отдельная логика для недвижимости – встраиваем UI прямо здесь
  if (categoryId === 'property') {
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
          {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ: Убраны обертки, PropertyFilters рендерится один раз --- */}
          <div className="mb-8">
            {category.propertyFilterConfig && (
              <PropertyFilters
                config={category.propertyFilterConfig}
                filters={propertyFilters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                onSearch={handleSearch} // Передаем handleSearch
                districts={districts}
                activeFiltersCount={activeFiltersCount}
              />
            )}
          </div>
          {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              {language === 'ru'
                ? `Найдено объявлений: ${filteredListings.length}`
                : `Хабарландырулар табылды: ${filteredListings.length}`}
            </p>
            <div className="flex items-center gap-2">
              <Tabs
                value={propViewMode}
                onValueChange={(value) =>
                  setPropViewMode(value as 'grid' | 'list' | 'map')
                }
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
          <Tabs value={propViewMode} className="w-full">
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
                   <PropertyCard key={listing.id} listing={listing} view="list" />
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
             <TabsContent value="map" className="mt-0 h-[600px]">
               {filteredListings.length > 0 ? (
                 <PropertyMap listings={filteredListings} />
               ) : (
                  <div className="col-span-full text-center py-12 h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      {language === 'ru'
                        ? 'Нет объектов для отображения на карте.'
                        : 'Картада көрсетуге нысандар жоқ.'}
                    </p>
                  </div>
               )}
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    );
  }

  // Стандартная логика для других категорий
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{category.name[language]}</h1>
        {/* Breadcrumbs or other category-specific info */}
        <div className="flex justify-between items-center mb-6">
           <p className="text-sm text-muted-foreground">
              {language === 'ru'
                ? `Найдено объявлений: ${filteredListings.length}`
                : `Хабарландырулар табылды: ${filteredListings.length}`}
            </p>
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

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
             {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} view="list" />
            ))}
          </div>
        )}

         {filteredListings.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {language === 'ru'
                  ? 'По вашему запросу ничего не найдено.'
                  : 'Сұрауыңыз бойынша ештеңе табылмады.'}
              </p>
            </div>
          )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
