import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowDownUp, Car, Check, Search } from 'lucide-react';
import { 
  TransportFilters as TransportFiltersType,
  VehicleType,
  EngineType,
  TransmissionType,
  DriveType,
  BodyType,
  ConditionType,
  SteeringWheelType,
  VehicleFeature,
  SortOption 
} from '@/types/listingType';
import { BrandData, CommercialType } from '@/data/transportData';

type TransportFiltersProps = {
  filters: TransportFiltersType;
  onFilterChange: (newFilters: Partial<TransportFiltersType>) => void;
  onReset: () => void;
  onSearch: () => void;
  brands: BrandData[];
  activeFiltersCount: number;
  commercialTypes?: CommercialType[];
};

const TransportFilters = ({
  filters,
  onFilterChange,
  onReset,
  onSearch,
  brands,
  activeFiltersCount,
  commercialTypes = []
}: TransportFiltersProps) => {
  const { language } = useAppContext();
  const [expandedFilters, setExpandedFilters] = useState<boolean>(false);
  
  // Price slider values
  const [priceValues, setPriceValues] = useState<number[]>([
    filters.priceRange.min || 0,
    filters.priceRange.max || 50000000
  ]);
  
  // Year slider values
  const [yearValues, setYearValues] = useState<number[]>([
    filters.yearRange.min || 1980,
    filters.yearRange.max || new Date().getFullYear()
  ]);
  
  // Mileage slider values
  const [mileageValues, setMileageValues] = useState<number[]>([
    filters.mileageRange.min || 0,
    filters.mileageRange.max || 300000
  ]);
  
  // Engine volume slider values
  const [engineVolumeValues, setEngineVolumeValues] = useState<number[]>([
    filters.engineVolumeRange.min || 0.8,
    filters.engineVolumeRange.max || 6.0
  ]);
  
  // Apply price filter
  const handlePriceChange = (values: number[]) => {
    setPriceValues(values);
    onFilterChange({
      priceRange: {
        min: values[0] > 0 ? values[0] : null,
        max: values[1] < 50000000 ? values[1] : null
      }
    });
  };
  
  // Apply year filter
  const handleYearChange = (values: number[]) => {
    setYearValues(values);
    onFilterChange({
      yearRange: {
        min: values[0] > 1980 ? values[0] : null,
        max: values[1] < new Date().getFullYear() ? values[1] : null
      }
    });
  };
  
  // Apply mileage filter
  const handleMileageChange = (values: number[]) => {
    setMileageValues(values);
    onFilterChange({
      mileageRange: {
        min: values[0] > 0 ? values[0] : null,
        max: values[1] < 300000 ? values[1] : null
      }
    });
  };
  
  // Apply engine volume filter
  const handleEngineVolumeChange = (values: number[]) => {
    setEngineVolumeValues(values);
    onFilterChange({
      engineVolumeRange: {
        min: values[0] > 0.8 ? values[0] : null,
        max: values[1] < 6.0 ? values[1] : null
      }
    });
  };
  
  // Toggle brand selection
  const handleBrandToggle = (brandId: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter(id => id !== brandId)
      : [...currentBrands, brandId];
    
    onFilterChange({ brands: newBrands.length > 0 ? newBrands : null });
  };
  
  // Handle commercial type selection
  const handleCommercialTypeChange = (typeId: string) => {
    onFilterChange({ commercialType: typeId === 'all' ? null : typeId });
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ').format(price);
  };
  
  // Get the appropriate filter sections based on vehicle type
  const renderVehicleTypeSpecificFilters = () => {
    if (filters.vehicleType === VehicleType.COMMERCIAL && commercialTypes.length > 0) {
      return (
        <AccordionItem value="commercial-type">
          <AccordionTrigger className="py-2">
            {language === 'ru' ? 'Тип коммерческого транспорта' : 'Коммерциялық көлік түрі'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <RadioGroup 
                value={filters.commercialType || 'all'} 
                onValueChange={handleCommercialTypeChange}
              >
                <div className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value="all" id="commercial-all" />
                  <Label htmlFor="commercial-all">
                    {language === 'ru' ? 'Все типы' : 'Барлық түрлері'}
                  </Label>
                </div>
                
                {commercialTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2 py-1">
                    <RadioGroupItem value={type.id} id={`commercial-${type.id}`} />
                    <Label htmlFor={`commercial-${type.id}`}>
                      {type.name[language]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }
    
    return null;
  };
  
  // Add missing handler functions
  const handleEngineTypeToggle = (engineType: EngineType) => {
    const currentTypes = filters.engineTypes || [];
    const newTypes = currentTypes.includes(engineType)
      ? currentTypes.filter(type => type !== engineType)
      : [...currentTypes, engineType];
    
    onFilterChange({ engineTypes: newTypes.length > 0 ? newTypes : null });
  };

  const handleTransmissionToggle = (transmission: TransmissionType) => {
    const currentTransmissions = filters.transmissionTypes || [];
    const newTransmissions = currentTransmissions.includes(transmission)
      ? currentTransmissions.filter(t => t !== transmission)
      : [...currentTransmissions, transmission];
    
    onFilterChange({ transmissionTypes: newTransmissions.length > 0 ? newTransmissions : null });
  };

  const handleDriveTypeToggle = (driveType: DriveType) => {
    const currentDriveTypes = filters.driveTypes || [];
    const newDriveTypes = currentDriveTypes.includes(driveType)
      ? currentDriveTypes.filter(t => t !== driveType)
      : [...currentDriveTypes, driveType];
    
    onFilterChange({ driveTypes: newDriveTypes.length > 0 ? newDriveTypes : null });
  };

  const handleBodyTypeToggle = (bodyType: BodyType) => {
    const currentBodyTypes = filters.bodyTypes || [];
    const newBodyTypes = currentBodyTypes.includes(bodyType)
      ? currentBodyTypes.filter(t => t !== bodyType)
      : [...currentBodyTypes, bodyType];
    
    onFilterChange({ bodyTypes: newBodyTypes.length > 0 ? newBodyTypes : null });
  };

  const handleFeatureToggle = (feature: VehicleFeature) => {
    const currentFeatures = filters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    onFilterChange({ features: newFeatures.length > 0 ? newFeatures : null });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </h3>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onReset}>
                {language === 'ru' ? 'Сбросить' : 'Тазалау'}
              </Button>
              <Button size="sm" onClick={onSearch}>
                <Search className="h-4 w-4 mr-1" />
                {language === 'ru' ? 'Показать' : 'Көрсету'}
              </Button>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={['price', 'brand', 'year']} className="w-full">
            {/* Commercial Type filter (only shown for VehicleType.COMMERCIAL) */}
            {renderVehicleTypeSpecificFilters()}
            
            {/* Price Range */}
            <AccordionItem value="price">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Цена' : 'Баға'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <Slider
                    value={priceValues}
                    min={0}
                    max={50000000}
                    step={100000}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {language === 'ru' ? 'От' : 'Бастап'}: {formatPrice(priceValues[0])} ₸
                    </span>
                    <span className="text-sm">
                      {language === 'ru' ? 'До' : 'Дейін'}: {formatPrice(priceValues[1])} ₸
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Brand */}
            <AccordionItem value="brand">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Марка' : 'Маркасы'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="max-h-80 overflow-y-auto pr-2">
                    <div className="grid grid-cols-2">
                      {brands.map(brand => (
                        <div key={brand.id} className="flex items-center space-x-2 py-1">
                          <Checkbox 
                            id={`brand-${brand.id}`} 
                            checked={(filters.brands || []).includes(brand.id)}
                            onCheckedChange={() => handleBrandToggle(brand.id)}
                          />
                          <Label htmlFor={`brand-${brand.id}`} className="text-sm">
                            {brand.name[language]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Year Range */}
            <AccordionItem value="year">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Год выпуска' : 'Шығарылған жылы'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <Slider
                    value={yearValues}
                    min={1980}
                    max={new Date().getFullYear()}
                    step={1}
                    onValueChange={handleYearChange}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {language === 'ru' ? 'От' : 'Бастап'}: {yearValues[0]}
                    </span>
                    <span className="text-sm">
                      {language === 'ru' ? 'До' : 'Дейін'}: {yearValues[1]}
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Mileage */}
            <AccordionItem value="mileage">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Пробег' : 'Жүріп өткен жолы'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <Slider
                    value={mileageValues}
                    min={0}
                    max={300000}
                    step={5000}
                    onValueChange={handleMileageChange}
                  />
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {language === 'ru' ? 'От' : 'Бастап'}: {mileageValues[0].toLocaleString()} км
                    </span>
                    <span className="text-sm">
                      {language === 'ru' ? 'До' : 'Дейін'}: {mileageValues[1].toLocaleString()} км
                    </span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Engine Type */}
            <AccordionItem value="engine">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Двигатель' : 'Қозғалтқыш'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2">
                    {Object.values(EngineType).map(engineType => (
                      <div key={engineType} className="flex items-center space-x-2 py-1">
                        <Checkbox 
                          id={`engine-${engineType}`} 
                          checked={(filters.engineTypes || []).includes(engineType)}
                          onCheckedChange={() => handleEngineTypeToggle(engineType)}
                        />
                        <Label htmlFor={`engine-${engineType}`} className="text-sm">
                          {engineType === EngineType.PETROL && (language === 'ru' ? 'Бензин' : 'Бензин')}
                          {engineType === EngineType.DIESEL && (language === 'ru' ? 'Дизель' : 'Дизель')}
                          {engineType === EngineType.GAS && (language === 'ru' ? 'Газ' : 'Газ')}
                          {engineType === EngineType.HYBRID && (language === 'ru' ? 'Гибрид' : 'Гибрид')}
                          {engineType === EngineType.ELECTRIC && (language === 'ru' ? 'Электро' : 'Электр')}
                          {engineType === EngineType.PETROL_GAS && (language === 'ru' ? 'Бензин/Газ' : 'Бензин/Газ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      {language === 'ru' ? 'Объем двигателя (л)' : 'Қозғалтқыш көлемі (л)'}
                    </h4>
                    <Slider
                      value={engineVolumeValues}
                      min={0.8}
                      max={6.0}
                      step={0.1}
                      onValueChange={handleEngineVolumeChange}
                    />
                    <div className="flex justify-between">
                      <span className="text-sm">
                        {language === 'ru' ? 'От' : 'Бастап'}: {engineVolumeValues[0].toFixed(1)} л
                      </span>
                      <span className="text-sm">
                        {language === 'ru' ? 'До' : 'Дейін'}: {engineVolumeValues[1].toFixed(1)} ��
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Transmission */}
            <AccordionItem value="transmission">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Коробка передач' : 'Беріліс қорабы'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {Object.values(TransmissionType).map(transmission => (
                    <div key={transmission} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`transmission-${transmission}`} 
                        checked={(filters.transmissionTypes || []).includes(transmission)}
                        onCheckedChange={() => handleTransmissionToggle(transmission)}
                      />
                      <Label htmlFor={`transmission-${transmission}`} className="text-sm">
                        {transmission === TransmissionType.MANUAL && (language === 'ru' ? 'Механика' : 'Механика')}
                        {transmission === TransmissionType.AUTOMATIC && (language === 'ru' ? 'Автомат' : 'Автомат')}
                        {transmission === TransmissionType.ROBOT && (language === 'ru' ? 'Робот' : 'Робот')}
                        {transmission === TransmissionType.VARIATOR && (language === 'ru' ? 'Вариатор' : 'Вариатор')}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Drive Type */}
            <AccordionItem value="drive">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Привод' : 'Жетек'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {Object.values(DriveType).map(driveType => (
                    <div key={driveType} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`drive-${driveType}`} 
                        checked={(filters.driveTypes || []).includes(driveType)}
                        onCheckedChange={() => handleDriveTypeToggle(driveType)}
                      />
                      <Label htmlFor={`drive-${driveType}`} className="text-sm">
                        {driveType === DriveType.FRONT && (language === 'ru' ? 'Передний' : 'Алдыңғы')}
                        {driveType === DriveType.REAR && (language === 'ru' ? 'Задний' : 'Артқы')}
                        {driveType === DriveType.ALL_WHEEL && (language === 'ru' ? 'Полный' : 'Толық')}
                        {driveType === DriveType.FULL && (language === 'ru' ? '4WD' : '4WD')}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Body Type */}
            <AccordionItem value="body">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Тип кузова' : 'Шанақ түрі'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2 grid grid-cols-2">
                  {Object.values(BodyType).map(bodyType => (
                    <div key={bodyType} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`body-${bodyType}`} 
                        checked={(filters.bodyTypes || []).includes(bodyType)}
                        onCheckedChange={() => handleBodyTypeToggle(bodyType)}
                      />
                      <Label htmlFor={`body-${bodyType}`} className="text-sm">
                        {bodyType === BodyType.SEDAN && (language === 'ru' ? 'Седан' : 'Седан')}
                        {bodyType === BodyType.HATCHBACK && (language === 'ru' ? 'Хэтчбек' : 'Хэтчбек')}
                        {bodyType === BodyType.SUV && (language === 'ru' ? 'Внедорожник' : 'Жол талғамайтын')}
                        {bodyType === BodyType.PICKUP && (language === 'ru' ? 'Пикап' : 'Пикап')}
                        {bodyType === BodyType.MINIVAN && (language === 'ru' ? 'Минивэн' : 'Минивэн')}
                        {bodyType === BodyType.VAN && (language === 'ru' ? 'Фургон' : 'Фургон')}
                        {bodyType === BodyType.COUPE && (language === 'ru' ? 'Купе' : 'Купе')}
                        {bodyType === BodyType.CABRIOLET && (language === 'ru' ? 'Кабриолет' : 'Кабриолет')}
                        {bodyType === BodyType.WAGON && (language === 'ru' ? 'Универсал' : 'Универсал')}
                        {bodyType === BodyType.LIMOUSINE && (language === 'ru' ? 'Лимузин' : 'Лимузин')}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Steering Wheel */}
            <AccordionItem value="steering">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Руль' : 'Руль'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <RadioGroup 
                    value={filters.steeringWheel || 'any'} 
                    onValueChange={(value) => onFilterChange({ steeringWheel: value === 'any' ? null : value as SteeringWheelType })}
                  >
                    <div className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value={SteeringWheelType.LEFT} id="steering-left" />
                      <Label htmlFor="steering-left">
                        {language === 'ru' ? 'Левый руль' : 'Сол жақ руль'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value={SteeringWheelType.RIGHT} id="steering-right" />
                      <Label htmlFor="steering-right">
                        {language === 'ru' ? 'Правый руль' : 'Оң жақ руль'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value="any" id="steering-any" />
                      <Label htmlFor="steering-any">
                        {language === 'ru' ? 'Любой' : 'Кез келген'}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Additional Options */}
            <AccordionItem value="additional">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Дополнительно' : 'Қосымша'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="customs-cleared">
                      {language === 'ru' ? 'Растаможен' : 'Кедендік тазартылған'}
                    </Label>
                    <Switch 
                      id="customs-cleared" 
                      checked={filters.customsCleared === true}
                      onCheckedChange={(checked) => onFilterChange({ customsCleared: checked ? true : null })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="in-stock">
                      {language === 'ru' ? 'В наличии' : 'Қолда бар'}
                    </Label>
                    <Switch 
                      id="in-stock" 
                      checked={filters.inStock === true}
                      onCheckedChange={(checked) => onFilterChange({ inStock: checked ? true : null })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exchange-possible">
                      {language === 'ru' ? 'Возможен обмен' : 'Айырбас мүмкін'}
                    </Label>
                    <Switch 
                      id="exchange-possible" 
                      checked={filters.exchangePossible === true}
                      onCheckedChange={(checked) => onFilterChange({ exchangePossible: checked ? true : null })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="without-accidents">
                      {language === 'ru' ? 'Без ДТП' : 'Апатсыз'}
                    </Label>
                    <Switch 
                      id="without-accidents" 
                      checked={filters.withoutAccidents === true}
                      onCheckedChange={(checked) => onFilterChange({ withoutAccidents: checked ? true : null })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="with-service-history">
                      {language === 'ru' ? 'С сервисной историей' : 'Қызмет тарихымен'}
                    </Label>
                    <Switch 
                      id="with-service-history" 
                      checked={filters.withServiceHistory === true}
                      onCheckedChange={(checked) => onFilterChange({ withServiceHistory: checked ? true : null })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="has-photo">
                      {language === 'ru' ? 'С фото' : 'Фотосымен'}
                    </Label>
                    <Switch 
                      id="has-photo" 
                      checked={filters.hasPhoto === true}
                      onCheckedChange={(checked) => onFilterChange({ hasPhoto: checked ? true : null })}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Features */}
            <AccordionItem value="features">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Комплектация' : 'Жинақтама'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2 grid grid-cols-2">
                  {Object.values(VehicleFeature).map(feature => (
                    <div key={feature} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`feature-${feature}`} 
                        checked={(filters.features || []).includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={`feature-${feature}`} className="text-sm">
                        {feature === VehicleFeature.ABS && 'ABS'}
                        {feature === VehicleFeature.ESP && 'ESP'}
                        {feature === VehicleFeature.AIRBAGS && (language === 'ru' ? 'Подушки безопасности' : 'Қауіпсіздік жастықтары')}
                        {feature === VehicleFeature.CLIMATE_CONTROL && (language === 'ru' ? 'Климат-контроль' : 'Климат-бақылау')}
                        {feature === VehicleFeature.HEATED_SEATS && (language === 'ru' ? 'Подогрев сидений' : 'Орындықтар жылыту')}
                        {feature === VehicleFeature.CRUISE_CONTROL && (language === 'ru' ? 'Круиз-контроль' : 'Круиз-бақылау')}
                        {feature === VehicleFeature.PARKING_SENSORS && (language === 'ru' ? 'Парктроники' : 'Парктрониктер')}
                        {feature === VehicleFeature.REAR_VIEW_CAMERA && (language === 'ru' ? 'Камера заднего вида' : 'Артқы көрініс камерасы')}
                        {feature === VehicleFeature.NAVIGATION && (language === 'ru' ? 'Навигация' : 'Навигация')}
                        {feature === VehicleFeature.LEATHER_INTERIOR && (language === 'ru' ? 'Кожаный салон' : 'Былғары салон')}
                        {feature === VehicleFeature.SUNROOF && (language === 'ru' ? 'Люк' : 'Төбедегі люк')}
                        {feature === VehicleFeature.ALLOY_WHEELS && (language === 'ru' ? 'Легкосплавные диски' : 'Жеңіл қорытпалы дискілер')}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Sort By */}
            <AccordionItem value="sort">
              <AccordionTrigger className="py-2">
                {language === 'ru' ? 'Сортировка' : 'Сұрыптау'}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <Select
                    value={filters.sortBy || ''}
                    onValueChange={(value) => onFilterChange({ sortBy: value ? value as SortOption : null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ru' ? 'Выберите сортировку' : 'Сұрыптауды таңдаңыз'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">
                        {language === 'ru' ? 'По умолчанию' : 'Әдепкі бойы��ша'}
                      </SelectItem>
                      <SelectItem value={SortOption.PRICE_ASC}>
                        {language === 'ru' ? 'Сначала дешевле' : 'Алдымен арзан'}
                      </SelectItem>
                      <SelectItem value={SortOption.PRICE_DESC}>
                        {language === 'ru' ? 'Сначала дороже' : 'Алдымен қымбат'}
                      </SelectItem>
                      <SelectItem value={SortOption.DATE_DESC}>
                        {language === 'ru' ? 'Сначала новые' : 'Алдымен жаңа'}
                      </SelectItem>
                      <SelectItem value={SortOption.YEAR_DESC}>
                        {language === 'ru' ? 'Сначала новые авто' : 'Алдымен жаңа көліктер'}
                      </SelectItem>
                      <SelectItem value={SortOption.YEAR_ASC}>
                        {language === 'ru' ? 'Сначала старые авто' : 'Алдымен ескі көліктер'}
                      </SelectItem>
                      <SelectItem value={SortOption.MILEAGE_ASC}>
                        {language === 'ru' ? 'По возрастанию пробега' : 'Жүрілген жол бойынша өсу'}
                      </SelectItem>
                      <SelectItem value={SortOption.MILEAGE_DESC}>
                        {language === 'ru' ? 'По убыванию пробега' : 'Жүрілген жол бойынша кему'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default TransportFilters;
