import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { transportFilterConfig } from '@/categories/transport/filterConfig';
import { useTransportData } from '@/hooks/useTransportData';
import { 
  TransportFilters as TransportFiltersType,
  BodyType,
  TransmissionType,
  EngineType,
  DriveType,
  ConditionType,
  VehicleType 
} from '@/types/listingType';
import { BrandData } from '@/data/transportData';

export interface TransportFiltersProps {
  onFilterChange?: (filters: Partial<TransportFiltersType>) => void;
  onReset?: () => void;
  onSearch?: () => void;
  brands?: BrandData[];
  activeFiltersCount?: number;
  vehicleType?: string;
  availableFilters?: {
    brands?: string[];
    models?: Record<string, string[]>;
    years?: number[];
    bodyTypes?: string[];
  };
}

const TransportFilters: React.FC<TransportFiltersProps> = ({
  onFilterChange,
  onReset,
  onSearch,
  activeFiltersCount = 0,
  vehicleType = 'passenger'
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(vehicleType);
  
  // Используем хук для загрузки данных из Supabase для текущей категории
  const { brands, models, loading, error } = useTransportData(selectedCategory);
  
  const [selectedFilters, setSelectedFilters] = useState({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    bodyType: '',
    transmission: '',
    engine: '',
    drive: '',
    condition: 'all',
    withPhoto: true,
    mileageFrom: '',
    mileageTo: ''
  });

  // Мемоизированные модели для выбранного бренда
  const availableModels = useMemo(() => {
    if (!selectedFilters.brand) return [];
    return models.filter(model => model.brand_id === selectedFilters.brand);
  }, [models, selectedFilters.brand]);

  // Используем конфигурацию фильтров транспорта
  const categories = transportFilterConfig.categories || [];
  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  // Годы для фильтра
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  // Обработчик изменения фильтров
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...selectedFilters, [key]: value };
    
    // Сброс модели при изменении бренда
    if (key === 'brand') {
      newFilters.model = '';
    }
    
    setSelectedFilters(newFilters);
    
    if (onFilterChange) {
      // Преобразуем фильтры в формат TransportFiltersType
      const convertedFilters: Partial<TransportFiltersType> = {
        vehicleType: selectedCategory as VehicleType,
        priceRange: { min: null, max: null },
        yearRange: { min: null, max: null },
        mileageRange: { min: null, max: null },
        brands: []
      };
      
      // Преобразуем выбор бренда в массив брендов
      if (newFilters.brand) {
        convertedFilters.brands = [newFilters.brand];
      }
      
      // Преобразуем ценовой диапазон
      if (newFilters.priceFrom || newFilters.priceTo) {
        convertedFilters.priceRange = {
          min: newFilters.priceFrom ? Number(newFilters.priceFrom) : null,
          max: newFilters.priceTo ? Number(newFilters.priceTo) : null
        };
      }
      
      // Преобразуем диапазон годов
      if (newFilters.yearFrom || newFilters.yearTo) {
        convertedFilters.yearRange = {
          min: newFilters.yearFrom ? Number(newFilters.yearFrom) : null,
          max: newFilters.yearTo ? Number(newFilters.yearTo) : null
        };
      }
      
      // Преобразуем диапазон пробега
      if (newFilters.mileageFrom || newFilters.mileageTo) {
        convertedFilters.mileageRange = {
          min: newFilters.mileageFrom ? Number(newFilters.mileageFrom) : null,
          max: newFilters.mileageTo ? Number(newFilters.mileageTo) : null
        };
      }
      
      // Преобразуем тип кузова
      if (newFilters.bodyType) {
        convertedFilters.bodyTypes = [newFilters.bodyType as BodyType];
      }
      
      // Преобразуем трансмиссию
      if (newFilters.transmission) {
        convertedFilters.transmissionTypes = [newFilters.transmission as TransmissionType];
      }
      
      // Преобразуем тип двигателя
      if (newFilters.engine) {
        convertedFilters.engineTypes = [newFilters.engine as EngineType];
      }
      
      // Преобразуем привод
      if (newFilters.drive) {
        convertedFilters.driveTypes = [newFilters.drive as DriveType];
      }
      
      // Преобразуем состояние
      if (newFilters.condition !== 'all') {
        convertedFilters.conditionTypes = [newFilters.condition as ConditionType];
      }
      
      // Преобразуем наличие фото
      if (newFilters.withPhoto) {
        convertedFilters.hasPhoto = true;
      }
      
      onFilterChange(convertedFilters);
    }
  };

  // Обработчик смены категории
  const handleCategoryChange = (newCategory: string) => {
    console.log('Changing category to:', newCategory);
    setSelectedCategory(newCategory);
    // Сброс фильтров при смене категории
    setSelectedFilters({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      bodyType: '',
      transmission: '',
      engine: '',
      drive: '',
      condition: 'all',
      withPhoto: true,
      mileageFrom: '',
      mileageTo: ''
    });
  };

  // Обработчик сброса всех фильтров
  const handleReset = () => {
    setSelectedFilters({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      bodyType: '',
      transmission: '',
      engine: '',
      drive: '',
      condition: 'all',
      withPhoto: true,
      mileageFrom: '',
      mileageTo: ''
    });
    
    if (onReset) {
      onReset();
    }
  };

  // Функция для подсчета количества активных фильтров
  const countActiveFilters = () => {
    return Object.entries(selectedFilters).filter(([key, value]) => {
      if (key === 'withPhoto' && value === true) return true;
      if (key === 'condition' && value !== 'all') return true;
      return value !== '' && value !== false;
    }).length;
  };

  if (loading) {
    return (
      <div className="transport-filters">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">
            {t('loading.data') || 'Загрузка данных...'}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transport-filters">
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">
            {t('error.loading.data') || 'Ошибка загрузки данных'}: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transport-filters">
      {/* Выбор категории транспорта */}
      <Tabs 
        defaultValue={selectedCategory} 
        onValueChange={handleCategoryChange} 
        className="mb-6"
      >
        <TabsList className="w-full flex overflow-x-auto space-x-1 mb-6">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id}
              value={category.id} 
              className={`flex-1 py-3 px-6 rounded-md ${selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {t(category.label.ru)}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {category.subcategories?.map((subcat) => (
                <Button 
                  key={subcat.id}
                  variant="outline" 
                  className={`justify-start hover:bg-blue-50 ${
                    selectedFilters.bodyType === subcat.id ? 'bg-blue-100 text-blue-600 border-blue-300' : ''
                  }`}
                  onClick={() => handleFilterChange('bodyType', subcat.id)}
                >
                  {t(subcat.label.ru)}
                </Button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Основные фильтры - состояние, марка, модель */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('condition')}</label>
              <div className="flex rounded-md overflow-hidden">
                <Button 
                  variant={selectedFilters.condition === 'all' ? 'default' : 'outline'}
                  className="flex-1 rounded-none border-r-0" 
                  onClick={() => handleFilterChange('condition', 'all')}
                >
                  {t('all')}
                </Button>
                <Button 
                  variant={selectedFilters.condition === 'new' ? 'default' : 'outline'}
                  className="flex-1 rounded-none border-r-0 border-l-0" 
                  onClick={() => handleFilterChange('condition', 'new')}
                >
                  {t('new')}
                </Button>
                <Button 
                  variant={selectedFilters.condition === 'used' ? 'default' : 'outline'}
                  className="flex-1 rounded-none border-l-0" 
                  onClick={() => handleFilterChange('condition', 'used')}
                >
                  {t('used')}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('brand')}</label>
              <Select 
                value={selectedFilters.brand} 
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('all.brands') || 'Все марки'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('all.brands') || 'Все марки'}</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('model')}</label>
              <Select 
                value={selectedFilters.model} 
                onValueChange={(value) => handleFilterChange('model', value)}
                disabled={!selectedFilters.brand}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('all.models') || 'Все модели'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('all.models') || 'Все модели'}</SelectItem>
                  {availableModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Дополнительные фильтры в зависимости от категории */}
          {selectedCategory === 'passenger' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('body.type')}</label>
                <Select 
                  value={selectedFilters.bodyType} 
                  onValueChange={(value) => handleFilterChange('bodyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('all.types')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('all.types')}</SelectItem>
                    {transportFilterConfig.bodyTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{t(type.label.ru)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('transmission')}</label>
                <Select 
                  value={selectedFilters.transmission} 
                  onValueChange={(value) => handleFilterChange('transmission', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('all')}</SelectItem>
                    {transportFilterConfig.transmissions?.map((trans) => (
                      <SelectItem key={trans.id} value={trans.id}>{t(trans.label.ru)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('engine')}</label>
                <Select 
                  value={selectedFilters.engine} 
                  onValueChange={(value) => handleFilterChange('engine', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('all')}</SelectItem>
                    {transportFilterConfig.engineTypes?.map((engine) => (
                      <SelectItem key={engine.id} value={engine.id}>{t(engine.label.ru)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('drive')}</label>
                <Select 
                  value={selectedFilters.drive} 
                  onValueChange={(value) => handleFilterChange('drive', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('all')}</SelectItem>
                    {transportFilterConfig.driveTypes?.map((drive) => (
                      <SelectItem key={drive.id} value={drive.id}>{t(drive.label.ru)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedCategory === 'commercial' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t('weight')}</label>
                <div className="flex space-x-2">
                  {transportFilterConfig.weightCategories?.map((weight) => (
                    <Button 
                      key={weight.id}
                      variant={selectedFilters.bodyType === weight.id ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => handleFilterChange('bodyType', weight.id)}
                    >
                      {t(weight.label.ru)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Общие фильтры для всех категорий */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('price')}</label>
              <div className="flex space-x-2">
                <Input 
                  type="text" 
                  placeholder={t('from')} 
                  value={selectedFilters.priceFrom}
                  onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                />
                <Input 
                  type="text" 
                  placeholder={t('to')} 
                  value={selectedFilters.priceTo}
                  onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t('year')}</label>
              <div className="flex space-x-2">
                <Select 
                  value={selectedFilters.yearFrom} 
                  onValueChange={(value) => handleFilterChange('yearFrom', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('from')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('from')}</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedFilters.yearTo} 
                  onValueChange={(value) => handleFilterChange('yearTo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('to')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('to')}</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {selectedFilters.condition === 'used' && (
            <div className="mb-6">
              <label className="text-sm text-gray-500 mb-1 block">{t('mileage')}</label>
              <div className="flex space-x-2">
                <Input 
                  type="text" 
                  placeholder={t('from')} 
                  value={selectedFilters.mileageFrom}
                  onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
                />
                <Input 
                  type="text" 
                  placeholder={t('to')} 
                  value={selectedFilters.mileageTo}
                  onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Checkbox 
                id="withPhoto" 
                checked={selectedFilters.withPhoto}
                onCheckedChange={(checked) => 
                  handleFilterChange('withPhoto', checked === true)
                }
              />
              <label htmlFor="withPhoto" className="ml-2 text-sm">{t('with.photo')}</label>
            </div>
            
            <div className="flex space-x-2">
              {countActiveFilters() > 0 && (
                <Button variant="outline" onClick={handleReset}>
                  {t('reset.filters')}
                </Button>
              )}
              
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSearch}>
                {t('show.results')} ({brands.length} {t('brands')}, {models.length} {t('models')})
              </Button>
            </div>
          </div>

          {/* Дополнительные фильтры (раскрывающийся аккордеон) */}
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="additional-filters">
              <AccordionTrigger className="text-blue-600 hover:text-blue-800">
                {t('additional.filters')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                  {selectedCategory === 'passenger' && (
                    <>
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">{t('color')}</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder={t('all')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">{t('all')}</SelectItem>
                            <SelectItem value="black">{t('black')}</SelectItem>
                            <SelectItem value="white">{t('white')}</SelectItem>
                            <SelectItem value="silver">{t('silver')}</SelectItem>
                            <SelectItem value="red">{t('red')}</SelectItem>
                            <SelectItem value="blue">{t('blue')}</SelectItem>
                            <SelectItem value="green">{t('green')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">{t('number.of.seats')}</label>
                        <div className="flex space-x-2">
                          <Input type="text" placeholder={t('from')} />
                          <Input type="text" placeholder={t('to')} />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">{t('region')}</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t('all.regions')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('all.regions')}</SelectItem>
                        <SelectItem value="almaty">{t('almaty')}</SelectItem>
                        <SelectItem value="astana">{t('astana')}</SelectItem>
                        <SelectItem value="shymkent">{t('shymkent')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportFilters;
