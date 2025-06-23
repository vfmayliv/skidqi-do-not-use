import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Filter, 
  X, 
  Check,
  Search,
  MapPin,
  Home,
  Building,
  Ruler,
  CreditCard,
  CalendarClock,
  Bed,
  Bath,
  ParkingSquare,
  Baby,
  School,
  DollarSign,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { 
  PropertyType, 
  BuildingType, 
  RenovationType, 
  BathroomType,
  SortOptions
} from '@/types/listingType';

interface AdvancedPropertyFiltersProps {
  onApplyFilters: (filters: any) => void;
  onReset: () => void;
}

const AdvancedPropertyFilters: React.FC<AdvancedPropertyFiltersProps> = ({
  onApplyFilters,
  onReset
}) => {
  const { language } = useAppContext();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filters, setFilters] = useState({
    priceRange: { min: null, max: null },
    areaRange: { min: null, max: null },
    rooms: [],
    yearBuilt: { min: null, max: null },
    floor: { min: null, max: null },
    totalFloors: { min: null, max: null },
    propertyTypes: [],
    buildingTypes: [],
    renovationTypes: [],
    bathroomTypes: [],
    districts: [],
    hasPhoto: false,
    isNewBuilding: false,
    hasParking: false,
    hasFurniture: false,
    hasBalcony: false,
    hasElevator: false,
    isCorner: false,
    onlyTrustedSellers: false,
    mortgageAvailable: false,
    hasVirtualTour: false,
    sortBy: SortOptions.DATE_DESC
  });

  // Вспомогательные функции для работы с фильтрами
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleArrayFilter = (key: string, value: any) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      const newValues = currentValues.includes(value) 
        ? currentValues.filter((v: any) => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [key]: newValues
      };
    });
  };
  
  const isValueInArray = (key: string, value: any) => {
    return (filters[key] || []).includes(value);
  };
  
  // Данные для фильтров
  const propertyTypes = [
    { id: PropertyType.APARTMENT, name: { ru: 'Квартира', kz: 'Пәтер' } },
    { id: PropertyType.HOUSE, name: { ru: 'Дом', kz: 'Үй' } },
    { id: PropertyType.COMMERCIAL, name: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
    { id: PropertyType.LAND, name: { ru: 'Участок', kz: 'Жер телімі' } },
    { id: PropertyType.TOWNHOUSE, name: { ru: 'Таунхаус', kz: 'Таунхаус' } },
    { id: PropertyType.DACHA, name: { ru: 'Дача', kz: 'Саяжай' } },
    { id: PropertyType.GARAGE, name: { ru: 'Гараж', kz: 'Гараж' } },
    { id: PropertyType.BUILDING, name: { ru: 'Здание', kz: 'Ғимарат' } },
  ];
  
  const buildingTypes = [
    { id: BuildingType.PANEL, name: { ru: 'Панельный', kz: 'Панельді' } },
    { id: BuildingType.BRICK, name: { ru: 'Кирпичный', kz: 'Кірпіш' } },
    { id: BuildingType.MONOLITHIC, name: { ru: 'Монолитный', kz: 'Монолитті' } },
    { id: BuildingType.BLOCK, name: { ru: 'Блочный', kz: 'Блокты' } },
    { id: BuildingType.WOOD, name: { ru: 'Деревянный', kz: 'Ағаш' } },
  ];
  
  const renovationTypes = [
    { id: RenovationType.COSMETIC, name: { ru: 'Косметический', kz: 'Косметикалық' } },
    { id: RenovationType.EURO, name: { ru: 'Евроремонт', kz: 'Еуроремонт' } },
    { id: RenovationType.DESIGNER, name: { ru: 'Дизайнерский', kz: 'Дизайнерлік' } },
    { id: RenovationType.WITHOUT_RENOVATION, name: { ru: 'Без ремонта', kz: 'Ремонтсыз' } },
  ];
  
  const bathroomTypes = [
    { id: BathroomType.COMBINED, name: { ru: 'Совмещенный', kz: 'Біріктірілген' } },
    { id: BathroomType.SEPARATE, name: { ru: 'Раздельный', kz: 'Бөлек' } },
    { id: BathroomType.TWO_OR_MORE, name: { ru: 'Два и более', kz: 'Екі және одан көп' } },
  ];
  
  const roomOptions = [
    { id: 1, name: { ru: '1', kz: '1' } },
    { id: 2, name: { ru: '2', kz: '2' } },
    { id: 3, name: { ru: '3', kz: '3' } },
    { id: 4, name: { ru: '4', kz: '4' } },
    { id: 5, name: { ru: '5+', kz: '5+' } },
  ];
  
  const districtOptions = [
    { id: 'almaty-center', name: { ru: 'Центр', kz: 'Орталық' } },
    { id: 'almaty-north', name: { ru: 'Север', kz: 'Солтүстік' } },
    { id: 'almaty-east', name: { ru: 'Восток', kz: 'Шығыс' } },
    { id: 'almaty-west', name: { ru: 'Запад', kz: 'Батыс' } },
    { id: 'almaty-south', name: { ru: 'Юг', kz: 'Оңтүстік' } },
  ];
  
  const sortOptions = [
    { id: SortOptions.DATE_DESC, name: { ru: 'По дате (новые)', kz: 'Күні бойынша (жаңа)' } },
    { id: SortOptions.PRICE_ASC, name: { ru: 'Дешевле', kz: 'Арзан' } },
    { id: SortOptions.PRICE_DESC, name: { ru: 'Дороже', kz: 'Қымбат' } },
    { id: SortOptions.AREA_ASC, name: { ru: 'По площади (меньше)', kz: 'Ауданы бойынша (кіші)' } },
    { id: SortOptions.AREA_DESC, name: { ru: 'По площади (больше)', kz: 'Ауданы бойынша (үлкен)' } },
  ];
  
  // Обработчик применения фильтров
  const handleApplyFilters = () => {
    // Подсчет активных фильтров
    let count = 0;
    
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) count++;
    if (filters.areaRange.min !== null || filters.areaRange.max !== null) count++;
    if (filters.rooms.length > 0) count++;
    if (filters.yearBuilt.min !== null || filters.yearBuilt.max !== null) count++;
    if (filters.floor.min !== null || filters.floor.max !== null) count++;
    if (filters.totalFloors.min !== null || filters.totalFloors.max !== null) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.buildingTypes.length > 0) count++;
    if (filters.renovationTypes.length > 0) count++;
    if (filters.bathroomTypes.length > 0) count++;
    if (filters.districts.length > 0) count++;
    if (filters.hasPhoto) count++;
    if (filters.isNewBuilding) count++;
    if (filters.hasParking) count++;
    if (filters.hasFurniture) count++;
    if (filters.hasBalcony) count++;
    if (filters.hasElevator) count++;
    if (filters.isCorner) count++;
    if (filters.onlyTrustedSellers) count++;
    if (filters.mortgageAvailable) count++;
    if (filters.hasVirtualTour) count++;
    
    setActiveFiltersCount(count);
    onApplyFilters(filters);
    setIsFiltersOpen(false);
  };
  
  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setFilters({
      priceRange: { min: null, max: null },
      areaRange: { min: null, max: null },
      rooms: [],
      yearBuilt: { min: null, max: null },
      floor: { min: null, max: null },
      totalFloors: { min: null, max: null },
      propertyTypes: [],
      buildingTypes: [],
      renovationTypes: [],
      bathroomTypes: [],
      districts: [],
      hasPhoto: false,
      isNewBuilding: false,
      hasParking: false,
      hasFurniture: false,
      hasBalcony: false,
      hasElevator: false,
      isCorner: false,
      onlyTrustedSellers: false,
      mortgageAvailable: false,
      hasVirtualTour: false,
      sortBy: SortOptions.DATE_DESC
    });
    
    setActiveFiltersCount(0);
    onReset();
  };
  
  return (
    <div className="w-full">
      {/* Главный фильтр и индикатор количества активных фильтров */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] sm:w-[500px] p-0" align="start">
              <div className="p-4 border-b flex items-center justify-between">
                <h4 className="font-medium">
                  {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
                </h4>
                <Button variant="ghost" size="sm" onClick={() => setIsFiltersOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <Accordion type="multiple" className="w-full">
                  {/* Тип недвижимости */}
                  <AccordionItem value="property-type">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span>{language === 'ru' ? 'Тип недвижимости' : 'Жылжымайтын мүлік түрі'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {propertyTypes.map(type => (
                          <Button
                            key={type.id}
                            variant={isValueInArray('propertyTypes', type.id) ? "default" : "outline"}
                            size="sm"
                            className="justify-start"
                            onClick={() => toggleArrayFilter('propertyTypes', type.id)}
                          >
                            {isValueInArray('propertyTypes', type.id) && (
                              <Check className="h-3 w-3 mr-2" />
                            )}
                            {type.name[language]}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Цена */}
                  <AccordionItem value="price">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>{language === 'ru' ? 'Цена' : 'Баға'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === 'ru' ? 'От' : 'Бастап'}
                            </p>
                            <Input
                              type="number"
                              value={filters.priceRange.min || ''}
                              onChange={e => updateFilter('priceRange', {
                                ...filters.priceRange,
                                min: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === 'ru' ? 'До' : 'Дейін'}
                            </p>
                            <Input
                              type="number"
                              value={filters.priceRange.max || ''}
                              onChange={e => updateFilter('priceRange', {
                                ...filters.priceRange,
                                max: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder="999 999 999"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="mortgage"
                            checked={filters.mortgageAvailable}
                            onCheckedChange={checked => 
                              updateFilter('mortgageAvailable', checked === true)
                            }
                          />
                          <label
                            htmlFor="mortgage"
                            className="text-sm cursor-pointer"
                          >
                            {language === 'ru' ? 'Возможна ипотека' : 'Ипотека мүмкіндігі бар'}
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Количество комнат */}
                  <AccordionItem value="rooms">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>{language === 'ru' ? 'Комнаты' : 'Бөлмелер саны'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={filters.rooms.includes('studio') ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleArrayFilter('rooms', 'studio')}
                        >
                          {language === 'ru' ? 'Студия' : 'Студия'}
                        </Button>
                        
                        {roomOptions.map(room => (
                          <Button
                            key={room.id}
                            variant={filters.rooms.includes(room.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleArrayFilter('rooms', room.id)}
                          >
                            {room.name[language]}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Площадь */}
                  <AccordionItem value="area">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                        <span>{language === 'ru' ? 'Площадь, м²' : 'Аумағы, м²'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {language === 'ru' ? 'От' : 'Бастап'}
                          </p>
                          <Input
                            type="number"
                            value={filters.areaRange.min || ''}
                            onChange={e => updateFilter('areaRange', {
                              ...filters.areaRange,
                              min: e.target.value ? Number(e.target.value) : null
                            })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {language === 'ru' ? 'До' : 'Дейін'}
                          </p>
                          <Input
                            type="number"
                            value={filters.areaRange.max || ''}
                            onChange={e => updateFilter('areaRange', {
                              ...filters.areaRange,
                              max: e.target.value ? Number(e.target.value) : null
                            })}
                            placeholder="1000"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Этаж */}
                  <AccordionItem value="floor">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{language === 'ru' ? 'Этаж' : 'Қабат'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === 'ru' ? 'От' : 'Бастап'}
                            </p>
                            <Input
                              type="number"
                              value={filters.floor.min || ''}
                              onChange={e => updateFilter('floor', {
                                ...filters.floor,
                                min: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder="1"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {language === 'ru' ? 'До' : 'Дейін'}
                            </p>
                            <Input
                              type="number"
                              value={filters.floor.max || ''}
                              onChange={e => updateFilter('floor', {
                                ...filters.floor,
                                max: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder="100"
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="not-first"
                              checked={filters.floor.min !== null && filters.floor.min > 1}
                              onCheckedChange={checked => 
                                updateFilter('floor', {
                                  ...filters.floor,
                                  min: checked ? 2 : null
                                })
                              }
                            />
                            <label
                              htmlFor="not-first"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'Не первый' : 'Бірінші емес'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="not-last"
                              checked={filters.isCorner}
                              onCheckedChange={checked => 
                                updateFilter('isCorner', checked === true)
                              }
                            />
                            <label
                              htmlFor="not-last"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'Не последний' : 'Соңғы емес'}
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {language === 'ru' ? 'Всего этажей в доме' : 'Үйдегі қабаттар саны'}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={filters.totalFloors.min || ''}
                              onChange={e => updateFilter('totalFloors', {
                                ...filters.totalFloors,
                                min: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder={language === 'ru' ? 'От' : 'Бастап'}
                            />
                            <Input
                              type="number"
                              value={filters.totalFloors.max || ''}
                              onChange={e => updateFilter('totalFloors', {
                                ...filters.totalFloors,
                                max: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder={language === 'ru' ? 'До' : 'Дейін'}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Дополнительные параметры */}
                  <AccordionItem value="additional">
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                        <span>{language === 'ru' ? 'Дополнительно' : 'Қосымша'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {/* Санузел */}
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {language === 'ru' ? 'Санузел' : 'Дәретхана'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {bathroomTypes.map(type => (
                              <Button
                                key={type.id}
                                variant={isValueInArray('bathroomTypes', type.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleArrayFilter('bathroomTypes', type.id)}
                              >
                                {type.name[language]}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Тип дома */}
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {language === 'ru' ? 'Тип дома' : 'Үй түрі'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {buildingTypes.map(type => (
                              <Button
                                key={type.id}
                                variant={isValueInArray('buildingTypes', type.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleArrayFilter('buildingTypes', type.id)}
                              >
                                {type.name[language]}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Ремонт */}
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {language === 'ru' ? 'Ремонт' : 'Жөндеу'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {renovationTypes.map(type => (
                              <Button
                                key={type.id}
                                variant={isValueInArray('renovationTypes', type.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleArrayFilter('renovationTypes', type.id)}
                              >
                                {type.name[language]}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Район */}
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {language === 'ru' ? 'Район' : 'Аудан'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {districtOptions.map(district => (
                              <Button
                                key={district.id}
                                variant={isValueInArray('districts', district.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleArrayFilter('districts', district.id)}
                              >
                                {district.name[language]}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Год постройки */}
                        <div>
                          <p className="text-sm font-medium mb-2">
                            {language === 'ru' ? 'Год постройки' : 'Құрылыс жылы'}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={filters.yearBuilt.min || ''}
                              onChange={e => updateFilter('yearBuilt', {
                                ...filters.yearBuilt,
                                min: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder={language === 'ru' ? 'От' : 'Бастап'}
                            />
                            <Input
                              type="number"
                              value={filters.yearBuilt.max || ''}
                              onChange={e => updateFilter('yearBuilt', {
                                ...filters.yearBuilt,
                                max: e.target.value ? Number(e.target.value) : null
                              })}
                              placeholder={language === 'ru' ? 'До' : 'Дейін'}
                            />
                          </div>
                        </div>
                        
                        {/* Чекбоксы с опциями */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="has-photo"
                              checked={filters.hasPhoto}
                              onCheckedChange={checked => 
                                updateFilter('hasPhoto', checked === true)
                              }
                            />
                            <label
                              htmlFor="has-photo"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'Только с фото' : 'Тек фотосы бар'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="virtual-tour"
                              checked={filters.hasVirtualTour}
                              onCheckedChange={checked => 
                                updateFilter('hasVirtualTour', checked === true)
                              }
                            />
                            <label
                              htmlFor="virtual-tour"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'С 3D-туром' : '3D турымен'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="new-building"
                              checked={filters.isNewBuilding}
                              onCheckedChange={checked => 
                                updateFilter('isNewBuilding', checked === true)
                              }
                            />
                            <label
                              htmlFor="new-building"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'Новостройка' : 'Жаңа құрылыс'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="parking"
                              checked={filters.hasParking}
                              onCheckedChange={checked => 
                                updateFilter('hasParking', checked === true)
                              }
                            />
                            <label
                              htmlFor="parking"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'С парковкой' : 'Тұрақпен'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="furniture"
                              checked={filters.hasFurniture}
                              onCheckedChange={checked => 
                                updateFilter('hasFurniture', checked === true)
                              }
                            />
                            <label
                              htmlFor="furniture"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'С мебелью' : 'Жиһазбен'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="balcony"
                              checked={filters.hasBalcony}
                              onCheckedChange={checked => 
                                updateFilter('hasBalcony', checked === true)
                              }
                            />
                            <label
                              htmlFor="balcony"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'С балконом' : 'Балконмен'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="elevator"
                              checked={filters.hasElevator}
                              onCheckedChange={checked => 
                                updateFilter('hasElevator', checked === true)
                              }
                            />
                            <label
                              htmlFor="elevator"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'С лифтом' : 'Лифтпен'}
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="trusted"
                              checked={filters.onlyTrustedSellers}
                              onCheckedChange={checked => 
                                updateFilter('onlyTrustedSellers', checked === true)
                              }
                            />
                            <label
                              htmlFor="trusted"
                              className="text-sm cursor-pointer"
                            >
                              {language === 'ru' ? 'Только проверенные продавцы' : 'Тек тексерілген сатушылар'}
                            </label>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="p-4 border-t flex justify-between">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  {language === 'ru' ? 'Очистить' : 'Тазарту'}
                </Button>
                <Button onClick={handleApplyFilters}>
                  {language === 'ru' ? 'Показать результаты' : 'Нәтижелерді көрсету'}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Сортировка */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => {
            updateFilter('sortBy', value);
            onApplyFilters({...filters, sortBy: value});
          }}
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder={language === 'ru' ? 'Сортировка' : 'Сұрыптау'} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.id} value={option.id}>
                {option.name[language]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Активные фильтры */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.propertyTypes.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>
                {language === 'ru' ? 'Тип: ' : 'Түрі: '}
                {filters.propertyTypes.length} 
                {language === 'ru' ? ' выбрано' : ' таңдалды'}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => {
                  updateFilter('propertyTypes', []);
                  handleApplyFilters();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(filters.priceRange.min !== null || filters.priceRange.max !== null) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>
                {language === 'ru' ? 'Цена' : 'Баға'}
                {filters.priceRange.min !== null && filters.priceRange.max !== null
                  ? `: ${filters.priceRange.min}-${filters.priceRange.max}`
                  : filters.priceRange.min !== null
                    ? `: от ${filters.priceRange.min}`
                    : `: до ${filters.priceRange.max}`}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => {
                  updateFilter('priceRange', { min: null, max: null });
                  handleApplyFilters();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.rooms.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>
                {language === 'ru' ? 'Комнат: ' : 'Бөлмелер: '}
                {filters.rooms.join(', ')}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1" 
                onClick={() => {
                  updateFilter('rooms', []);
                  handleApplyFilters();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {/* Другие активные фильтры по аналогии */}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs" 
            onClick={handleResetFilters}
          >
            {language === 'ru' ? 'Сбросить все' : 'Барлығын тазарту'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedPropertyFilters;
