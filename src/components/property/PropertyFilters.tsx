
import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpDown, 
  Bed,
  Building,
  Calendar,
  Check, 
  ChevronDown, 
  CreditCard,
  Home, 
  Hotel,
  Key,
  Maximize,
  RefreshCw, 
  Ruler,
  Search, 
  SlidersHorizontal,
  X 
} from 'lucide-react';
import { 
  PropertyFilters as PropertyFiltersType, 
  PropertyType,
  DealType,
  BuildingType,
  BathroomType,
  RenovationType,
  ViewType,
  InfrastructureType,
  SortOption
} from '@/types/listingType';
import type { PropertyFilterConfig } from '@/data/categories';

interface PropertyFiltersProps {
  config: PropertyFilterConfig;
  filters: PropertyFiltersType;
  onFilterChange: (filters: Partial<PropertyFiltersType>) => void;
  onReset: () => void;
  onSearch: () => void;
  districts: { id: string; name: { ru: string; kz: string } }[];
  activeFiltersCount: number;
}

const steps = [
  { ru: 'Тип сделки', kz: 'Мәміле түрі' },
  { ru: 'Местоположение', kz: 'Орналасқан жері' },
  { ru: 'Основные параметры', kz: 'Негізгі параметрлер' },
  { ru: 'Дополнительно', kz: 'Қосымша' }
];

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  config,
  filters,
  onFilterChange,
  onReset,
  onSearch,
  districts,
  activeFiltersCount,
}) => {
  const { language } = useAppContext();
  const [activeStep, setActiveStep] = useState(0);
  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceRange.min || 0,
    filters.priceRange.max || 100000000
  ]);
  const [areaRange, setAreaRange] = useState<[number, number]>([
    filters.areaRange.min || 0,
    filters.areaRange.max || 500
  ]);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const roomOptions = [
    { value: 1, label: { ru: '1', kz: '1' } },
    { value: 2, label: { ru: '2', kz: '2' } },
    { value: 3, label: { ru: '3', kz: '3' } },
    { value: 4, label: { ru: '4', kz: '4' } },
    { value: 5, label: { ru: '5+', kz: '5+' } },
  ];

  const propertyTypeOptions = [
    { value: PropertyType.APARTMENT, label: { ru: 'Квартира', kz: 'Пәтер' } },
    { value: PropertyType.HOUSE, label: { ru: 'Дом', kz: 'Үй' } },
    { value: PropertyType.TOWNHOUSE, label: { ru: 'Таунхаус', kz: 'Таунхаус' } },
    { value: PropertyType.COMMERCIAL, label: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
    { value: PropertyType.LAND, label: { ru: 'Участок', kz: 'Жер телімі' } },
    { value: PropertyType.GARAGE, label: { ru: 'Гараж', kz: 'Гараж' } },
    { value: PropertyType.DACHA, label: { ru: 'Дача', kz: 'Саяжай' } },
    { value: PropertyType.BUILDING, label: { ru: 'Здание', kz: 'Ғимарат' } },
  ];

  const buildingTypeOptions = [
    { value: BuildingType.PANEL, label: { ru: 'Панельный', kz: 'Панельді' } },
    { value: BuildingType.BRICK, label: { ru: 'Кирпичный', kz: 'Кірпіш' } },
    { value: BuildingType.MONOLITHIC, label: { ru: 'Монолитный', kz: 'Монолитті' } },
    { value: BuildingType.BLOCK, label: { ru: 'Блочный', kz: 'Блокты' } },
    { value: BuildingType.WOODEN, label: { ru: 'Деревянный', kz: 'Ағаш' } },
    { value: BuildingType.MIXED, label: { ru: 'Смешанный', kz: 'Аралас' } },
  ];

  const bathroomTypeOptions = [
    { value: BathroomType.COMBINED, label: { ru: 'Совмещенный', kz: 'Біріктірілген' } },
    { value: BathroomType.SEPARATE, label: { ru: 'Раздельный', kz: 'Бөлек' } },
    { value: BathroomType.TWO_OR_MORE, label: { ru: '2 и более', kz: '2 және одан көп' } },
    { value: BathroomType.NO_BATHROOM, label: { ru: 'Без санузла', kz: 'Дәретханасыз' } },
  ];

  const renovationTypeOptions = [
    { value: RenovationType.COSMETIC, label: { ru: 'Косметический', kz: 'Косметикалық' } },
    { value: RenovationType.EURO, label: { ru: 'Евроремонт', kz: 'Еуроремонт' } },
    { value: RenovationType.DESIGNER, label: { ru: 'Дизайнерский', kz: 'Дизайнерлік' } },
    { value: RenovationType.WITHOUT_RENOVATION, label: { ru: 'Без ремонта', kz: 'Ремонтсыз' } },
  ];

  const viewTypeOptions = [
    { value: ViewType.CITY, label: { ru: 'На город', kz: 'Қалаға' } },
    { value: ViewType.PARK, label: { ru: 'На парк', kz: 'Саябаққа' } },
    { value: ViewType.LAKE, label: { ru: 'На озеро', kz: 'Көлге' } },
    { value: ViewType.MOUNTAINS, label: { ru: 'На горы', kz: 'Тауларға' } }, // Fixed from MOUNTAIN to MOUNTAINS
    { value: ViewType.COURTYARD, label: { ru: 'Во двор', kz: 'Ауладға' } },
    { value: ViewType.STREET, label: { ru: 'На улицу', kz: 'Көшеге' } },
  ];

  const infrastructureOptions = [
    { value: InfrastructureType.SCHOOL, label: { ru: 'Школа', kz: 'Мектеп' } },
    { value: InfrastructureType.KINDERGARTEN, label: { ru: 'Детский сад', kz: 'Балабақша' } },
    { value: InfrastructureType.HOSPITAL, label: { ru: 'Больница', kz: 'Аурухана' } },
    { value: InfrastructureType.SHOPPING_CENTER, label: { ru: 'Торговый центр', kz: 'Сауда орталығы' } },
    { value: InfrastructureType.PHARMACY, label: { ru: 'Аптека', kz: 'Дәріхана' } },
    { value: InfrastructureType.PARK, label: { ru: 'Парк', kz: 'Саябақ' } },
    { value: InfrastructureType.PUBLIC_TRANSPORT, label: { ru: 'Общественный транспорт', kz: 'Қоғамдық көлік' } },
    { value: InfrastructureType.SPORT_COMPLEX, label: { ru: 'Спорткомплекс', kz: 'Спорт кешені' } },
    { value: InfrastructureType.CAFE, label: { ru: 'Кафе/Рестораны', kz: 'Кафе/Мейрамханалар' } },
    { value: InfrastructureType.BANK, label: { ru: 'Банки', kz: 'Банктер' } },
  ];

  const sortOptions = [
    { value: SortOption.PRICE_ASC, label: { ru: 'Цена: сначала дешевле', kz: 'Баға: алдымен арзан' } },
    { value: SortOption.PRICE_DESC, label: { ru: 'Цена: сначала дороже', kz: 'Баға: алдымен қымбат' } },
    { value: SortOption.DATE_DESC, label: { ru: 'Дата: сначала новые', kz: 'Күні: алдымен жаңа' } },
    { value: SortOption.AREA_ASC, label: { ru: 'Площадь: сначала меньше', kz: 'Аумағы: алдымен кіші' } },
    { value: SortOption.AREA_DESC, label: { ru: 'Площадь: сначала больше', kz: 'Аумағы: алдымен үлкен' } },
  ];

  const handleRoomToggle = (roomValue: number) => {
    const currentRooms = filters.rooms || [];
    const newRooms = currentRooms.includes(roomValue)
      ? currentRooms.filter(r => r !== roomValue)
      : [...currentRooms, roomValue];
    onFilterChange({ rooms: newRooms.length > 0 ? newRooms : null });
  };

  const handlePropertyTypeToggle = (type: PropertyType) => {
    const currentTypes = filters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ propertyTypes: newTypes.length > 0 ? newTypes : null });
  };

  const handleBuildingTypeToggle = (type: BuildingType) => {
    const currentTypes = filters.buildingTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ buildingTypes: newTypes.length > 0 ? newTypes : null });
  };

  const handleBathroomTypeToggle = (type: BathroomType) => {
    const currentTypes = filters.bathroomTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ bathroomTypes: newTypes.length > 0 ? newTypes : null });
  };

  const handleRenovationTypeToggle = (type: RenovationType) => {
    const currentTypes = filters.renovationTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ renovationTypes: newTypes.length > 0 ? newTypes : null });
  };

  const handleViewTypeToggle = (type: ViewType) => {
    const currentTypes = filters.viewTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ viewTypes: newTypes.length > 0 ? newTypes : null });
  };

  const handleInfrastructureToggle = (type: InfrastructureType) => {
    const current = filters.nearbyInfrastructure || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    onFilterChange({ nearbyInfrastructure: updated.length > 0 ? updated : null });
  };

  const handleDistrictToggle = (districtId: string) => {
    const currentDistricts = filters.districts || [];
    const newDistricts = currentDistricts.includes(districtId)
      ? currentDistricts.filter(d => d !== districtId)
      : [...currentDistricts, districtId];
    onFilterChange({ districts: newDistricts.length > 0 ? newDistricts : null });
  };

  const isRoomActive = (roomValue: number) => {
    return filters.rooms?.includes(roomValue) || false;
  };

  const isPropertyTypeActive = (type: PropertyType) => {
    return filters.propertyTypes?.includes(type) || false;
  };

  const isBuildingTypeActive = (type: BuildingType) => {
    return filters.buildingTypes?.includes(type) || false;
  };

  const isBathroomTypeActive = (type: BathroomType) => {
    return filters.bathroomTypes?.includes(type) || false;
  };

  const isRenovationTypeActive = (type: RenovationType) => {
    return filters.renovationTypes?.includes(type) || false;
  };

  const isViewTypeActive = (type: ViewType) => {
    return filters.viewTypes?.includes(type) || false;
  };

  const isInfrastructureActive = (type: InfrastructureType) => {
    return filters.nearbyInfrastructure?.includes(type) || false;
  };

  const isDistrictActive = (districtId: string) => {
    return filters.districts?.includes(districtId) || false;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} млн ₸`;
    }
    return `${price.toLocaleString()} ₸`;
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold">{language === 'ru' ? 'Тип сделки' : 'Мәміле түрі'}</h2>
            <Select
              value={filters.dealType || DealType.BUY}
              onValueChange={(value) => onFilterChange({ dealType: value as DealType })}
            >
              <SelectTrigger className="h-8 w-full text-xs mt-2">
                <SelectValue placeholder={language === 'ru' ? 'Выберите тип сделки' : 'Мәміле түрін таңдаңыз'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DealType.BUY} className="text-xs">{language === 'ru' ? 'Купить' : 'Сатып алу'}</SelectItem>
                <SelectItem value={DealType.RENT_LONG} className="text-xs">{language === 'ru' ? 'Снять долгосрочно' : 'Ұзақ мерзімге жалға алу'}</SelectItem>
                <SelectItem value={DealType.RENT_DAILY} className="text-xs">{language === 'ru' ? 'Посуточно' : 'Тәуліктік'}</SelectItem>
              </SelectContent>
            </Select>

            <h2 className="text-lg font-semibold mt-4">{language === 'ru' ? 'Тип недвижимости' : 'Жылжымайтын мүлік түрі'}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {propertyTypeOptions.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={isPropertyTypeActive(option.value) ? "default" : "outline"}
                  onClick={() => handlePropertyTypeToggle(option.value)}
                  className="text-xs h-8"
                >
                  {option.label[language]}
                </Button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold">{language === 'ru' ? 'Район' : 'Аудан'}</h2>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto mt-2">
              {districts.map(district => (
                <Button
                  key={district.id}
                  type="button"
                  size="sm"
                  variant={isDistrictActive(district.id) ? "default" : "outline"}
                  onClick={() => handleDistrictToggle(district.id)}
                  className="text-xs h-8"
                >
                  {district.name[language]}
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold">{language === 'ru' ? 'Основные параметры' : 'Негізгі параметрлер'}</h2>
            
            <div className="mt-2">
              <Label className="text-xs mb-1 block flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" />
                {language === 'ru' ? 'Цена, ₸' : 'Баға, ₸'}
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder={language === 'ru' ? 'От' : 'Бастап'}
                  value={priceRange[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setPriceRange([value, priceRange[1]]);
                    onFilterChange({
                      priceRange: {
                        min: value > 0 ? value : null,
                        max: filters.priceRange.max
                      }
                    });
                  }}
                  className="h-8"
                />
                <span>—</span>
                <Input
                  type="number"
                  placeholder={language === 'ru' ? 'До' : 'Дейін'}
                  value={priceRange[1] || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setPriceRange([priceRange[0], value]);
                    onFilterChange({
                      priceRange: {
                        min: filters.priceRange.min,
                        max: value > 0 ? value : null
                      }
                    });
                  }}
                  className="h-8"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-xs mb-1 block flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" />
                {language === 'ru' ? 'Площадь, м²' : 'Аумағы, м²'}
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder={language === 'ru' ? 'От' : 'Бастап'}
                  value={areaRange[0] || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setAreaRange([value, areaRange[1]]);
                    onFilterChange({
                      areaRange: {
                        min: value > 0 ? value : null,
                        max: filters.areaRange.max
                      }
                    });
                  }}
                  className="h-8"
                />
                <span>—</span>
                <Input
                  type="number"
                  placeholder={language === 'ru' ? 'До' : 'Дейін'}
                  value={areaRange[1] || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    setAreaRange([areaRange[0], value]);
                    onFilterChange({
                      areaRange: {
                        min: filters.areaRange.min,
                        max: value > 0 ? value : null
                      }
                    });
                  }}
                  className="h-8"
                />
              </div>
            </div>

            {filters.propertyTypes?.includes(PropertyType.APARTMENT) && (
              <div className="mt-4">
                <Label className="text-xs mb-1 block flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" />
                  {language === 'ru' ? 'Комнаты' : 'Бөлмелер'}
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={filters.isStudio ? "default" : "outline"}
                    onClick={() => onFilterChange({ isStudio: !filters.isStudio })}
                    className="text-xs h-8 px-3"
                  >
                    {language === 'ru' ? 'Студия' : 'Студия'}
                  </Button>
                  {roomOptions.map(option => (
                    <Button
                      key={option.value}
                      type="button"
                      size="sm"
                      variant={isRoomActive(option.value) ? "default" : "outline"}
                      onClick={() => handleRoomToggle(option.value)}
                      className="text-xs h-8 px-3"
                    >
                      {option.label[language]}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <Label className="text-xs mb-1 block flex items-center gap-1">
                <Building className="h-3.5 w-3.5" />
                {language === 'ru' ? 'Тип здания' : 'Ғимарат түрі'}
              </Label>
              <div className="flex flex-wrap gap-2">
                {buildingTypeOptions.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={isBuildingTypeActive(option.value) ? "default" : "outline"}
                    onClick={() => handleBuildingTypeToggle(option.value)}
                    className="text-xs h-8"
                  >
                    {option.label[language]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-xs mb-1 block flex items-center gap-1">
                <Hotel className="h-3.5 w-3.5" />
                {language === 'ru' ? 'Этаж' : 'Қабат'}
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder={language === 'ru' ? 'От' : 'Бастап'}
                  value={filters.floorRange.min || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : null;
                    onFilterChange({
                      floorRange: {
                        min: value,
                        max: filters.floorRange.max
                      }
                    });
                  }}
                  className="h-8"
                />
                <span>—</span>
                <Input
                  type="number"
                  placeholder={language === 'ru' ? 'До' : 'Дейін'}
                  value={filters.floorRange.max || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : null;
                    onFilterChange({
                      floorRange: {
                        min: filters.floorRange.min,
                        max: value
                      }
                    });
                  }}
                  className="h-8"
                />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="not-first-floor"
                  checked={filters.floorRange.min !== null && filters.floorRange.min > 1}
                  onCheckedChange={(checked) => {
                    onFilterChange({ 
                      floorRange: {
                        min: checked ? 2 : null,
                        max: filters.floorRange.max
                      }
                    });
                  }}
                />
                <label htmlFor="not-first-floor" className="text-xs font-medium leading-none">
                  {language === 'ru' ? 'Не первый этаж' : 'Бірінші қабат емес'}
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="not-last-floor"
                  checked={filters.floorRange.max !== null}
                  onCheckedChange={(checked) => {
                    onFilterChange({ 
                      floorRange: {
                        min: filters.floorRange.min,
                        max: checked ? 20 : null
                      }
                    });
                  }}
                />
                <label htmlFor="not-last-floor" className="text-xs font-medium leading-none">
                  {language === 'ru' ? 'Не последний этаж' : 'Соңғы қабат емес'}
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold">{language === 'ru' ? 'Дополнительные параметры' : 'Қосымша параметрлер'}</h2>
            <Collapsible open={isAdditionalFiltersOpen} onOpenChange={setIsAdditionalFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="w-full flex justify-between items-center mb-4">
                  <span>
                    {language === 'ru' ? 'Все фильтры' : 'Барлық сүзгілер'}
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAdditionalFiltersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4">
                <div>
                  <Label className="text-xs mb-1 block">
                    {language === 'ru' ? 'Санузел' : 'Дәретхана'}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {bathroomTypeOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        size="sm"
                        variant={isBathroomTypeActive(option.value) ? "default" : "outline"}
                        onClick={() => handleBathroomTypeToggle(option.value)}
                        className="text-xs h-8"
                      >
                        {option.label[language]}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">
                    {language === 'ru' ? 'Ремонт' : 'Жөндеу'}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {renovationTypeOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        size="sm"
                        variant={isRenovationTypeActive(option.value) ? "default" : "outline"}
                        onClick={() => handleRenovationTypeToggle(option.value)}
                        className="text-xs h-8"
                      >
                        {option.label[language]}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">
                    {language === 'ru' ? 'Вид из окон' : 'Терезеден көрініс'}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {viewTypeOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        size="sm"
                        variant={isViewTypeActive(option.value) ? "default" : "outline"}
                        onClick={() => handleViewTypeToggle(option.value)}
                        className="text-xs h-8"
                      >
                        {option.label[language]}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">
                    {language === 'ru' ? 'Инфраструктура рядом' : 'Жақын инфрақұрылым'}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {infrastructureOptions.map(option => (
                      <Button
                        key={option.value}
                        type="button"
                        size="sm"
                        variant={isInfrastructureActive(option.value) ? "default" : "outline"}
                        onClick={() => handleInfrastructureToggle(option.value)}
                        className="text-xs h-8"
                      >
                        {option.label[language]}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-1 block flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" />
                    {language === 'ru' ? 'Высота потолков, м' : 'Төбе биіктігі, м'}
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder={language === 'ru' ? 'От' : 'Бастап'}
                      value={filters.ceilingHeightRange?.min || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : null;
                        onFilterChange({
                          ceilingHeightRange: {
                            min: value,
                            max: filters.ceilingHeightRange?.max || null
                          }
                        });
                      }}
                      className="h-8"
                      step="0.1"
                    />
                    <span>—</span>
                    <Input
                      type="number"
                      placeholder={language === 'ru' ? 'До' : 'Дейін'}
                      value={filters.ceilingHeightRange?.max || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : null;
                        onFilterChange({
                          ceilingHeightRange: {
                            min: filters.ceilingHeightRange?.min || null,
                            max: value
                          }
                        });
                      }}
                      className="h-8"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-1 block flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {language === 'ru' ? 'Год постройки' : 'Құрылыс жылы'}
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder={language === 'ru' ? 'От' : 'Бастап'}
                      value={filters.yearBuiltRange?.min || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : null;
                        onFilterChange({
                          yearBuiltRange: {
                            min: value,
                            max: filters.yearBuiltRange?.max || null
                          }
                        });
                      }}
                      className="h-8"
                    />
                    <span>—</span>
                    <Input
                      type="number"
                      placeholder={language === 'ru' ? 'До' : 'Дейін'}
                      value={filters.yearBuiltRange?.max || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : null;
                        onFilterChange({
                          yearBuiltRange: {
                            min: filters.yearBuiltRange?.min || null,
                            max: value
                          }
                        });
                      }}
                      className="h-8"
                    />
                  </div>
                </div>

                {filters.dealType === DealType.RENT_LONG && (
                  <div>
                    <Label className="text-xs mb-1 block">
                      {language === 'ru' ? 'Минимальный срок аренды, мес.' : 'Жалдаудың ең аз мерзімі, ай'}
                    </Label>
                    <Input
                      type="number"
                      value={filters.rentPeriodMin || ''}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : null;
                        onFilterChange({ rentPeriodMin: value });
                      }}
                      className="h-8 w-full"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="has-photo"
                      checked={filters.hasPhoto === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ hasPhoto: checked ? true : null });
                      }}
                    />
                    <label htmlFor="has-photo" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'Только с фото' : 'Тек фотосы бар'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="only-new"
                      checked={filters.onlyNewBuilding === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ onlyNewBuilding: checked ? true : null });
                      }}
                    />
                    <label htmlFor="only-new" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'Новостройки' : 'Жаңа құрылыс'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="furnished"
                      checked={filters.furnished === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ furnished: checked ? true : null });
                      }}
                    />
                    <label htmlFor="furnished" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'С мебелью' : 'Жиһазымен'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allow-pets"
                      checked={filters.allowPets === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ allowPets: checked ? true : null });
                      }}
                    />
                    <label htmlFor="allow-pets" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'Можно с животными' : 'Жануарлармен рұқсат'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="has-parking"
                      checked={filters.hasParking === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ hasParking: checked ? true : null });
                      }}
                    />
                    <label htmlFor="has-parking" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'С парковкой' : 'Тұрақ орнымен'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="has-balcony"
                      checked={filters.hasBalcony === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ hasBalcony: checked ? true : null });
                      }}
                    />
                    <label htmlFor="has-balcony" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'С балконом/лоджией' : 'Балконымен/лоджиямен'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="has-elevator"
                      checked={filters.hasElevator === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ hasElevator: checked ? true : null });
                      }}
                    />
                    <label htmlFor="has-elevator" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'С лифтом' : 'Лифтпен'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="corner"
                      checked={filters.isCorner === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ isCorner: checked ? true : null });
                      }}
                    />
                    <label htmlFor="corner" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'Угловая' : 'Бұрыштық'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="separate-entrance"
                      checked={filters.hasSeparateEntrance === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ hasSeparateEntrance: checked ? true : null });
                      }}
                    />
                    <label htmlFor="separate-entrance" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'Отдельный вход' : 'Жеке кіреберіс'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="security"
                      checked={filters.securityGuarded === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ securityGuarded: checked ? true : null });
                      }}
                    />
                    <label htmlFor="security" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'Охрана' : 'Күзет'}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="playground"
                      checked={filters.hasPlayground === true}
                      onCheckedChange={(checked) => {
                        onFilterChange({ hasPlayground: checked ? true : null });
                      }}
                    />
                    <label htmlFor="playground" className="text-sm font-medium leading-none">
                      {language === 'ru' ? 'Детская площадка' : 'Балалар алаңы'}
                    </label>
                  </div>

                  {(filters.dealType === DealType.RENT_LONG || filters.dealType === DealType.RENT_DAILY) && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="utility-bills"
                        checked={filters.utilityBillsIncluded === true}
                        onCheckedChange={(checked) => {
                          onFilterChange({ utilityBillsIncluded: checked ? true : null });
                        }}
                      />
                      <label htmlFor="utility-bills" className="text-sm font-medium leading-none">
                        {language === 'ru' ? 'Коммунальные включены' : 'Коммуналдық қосылған'}
                      </label>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="mt-4">
              <Label className="text-xs mb-1 block">{language === 'ru' ? 'Сортировка' : 'Сұрыптау'}</Label>
              <Select
                value={filters.sortBy || ""}
                onValueChange={(value) => onFilterChange({ sortBy: value as SortOption || null })}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder={language === 'ru' ? 'Сортировка' : 'Сұрыптау'} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm max-w-3xl mx-auto">
      <div className="p-4">
        {/* Custom Stepper */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  activeStep >= index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1">{step[language]}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'ru' ? 'Сбросить' : 'Тазалау'}
          </Button>
          <div className="flex gap-2">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className="text-sm"
            >
              {language === 'ru' ? 'Назад' : 'Артқа'}
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="text-sm"
              >
                {language === 'ru' ? 'Далее' : 'Келесі'}
              </Button>
            ) : (
              <Button
                onClick={onSearch}
                className="text-sm"
              >
                <Search className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Показать объекты' : 'Объектілерді көрсету'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
