import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { transportConfig } from '@/categories/transport/config';

export interface TransportFiltersProps {
  vehicleType?: string;
  onFilterChange?: (filters: any) => void;
  availableFilters?: {
    brands?: string[];
    models?: Record<string, string[]>;
    years?: number[];
    bodyTypes?: string[];
  };
}

const TransportFilters: React.FC<TransportFiltersProps> = ({
  vehicleType = 'passenger',
  onFilterChange,
  availableFilters
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(vehicleType);
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

  // Получаем конфигурацию фильтров из общего конфига
  const filterConfig = transportConfig.filterConfig || {};
  
  // Находим выбранную категорию
  const categories = filterConfig.categories || [];
  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];
  
  // Получаем подкатегории для текущей категории
  const subcategories = currentCategory?.subcategories || [];

  // Годы для фильтра
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  // Обработчик изменения фильтров
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
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
    
    if (onFilterChange) {
      onFilterChange({});
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

  return (
    <div className="transport-filters">
      {/* Выбор категории транспорта */}
      <Tabs 
        defaultValue={selectedCategory} 
        onValueChange={setSelectedCategory} 
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
                  <SelectValue placeholder={t('all.brands')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('all.brands')}</SelectItem>
                  {availableFilters?.brands?.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
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
                  <SelectValue placeholder={t('all.models')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('all.models')}</SelectItem>
                  {selectedFilters.brand && availableFilters?.models?.[selectedFilters.brand]?.map((model) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
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
                    {filterConfig.bodyTypes?.map((type) => (
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
                    {filterConfig.transmissions?.map((trans) => (
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
                    {filterConfig.engineTypes?.map((engine) => (
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
                    {filterConfig.driveTypes?.map((drive) => (
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
                  {filterConfig.weightCategories?.map((weight) => (
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
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                {t('show.results')}
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