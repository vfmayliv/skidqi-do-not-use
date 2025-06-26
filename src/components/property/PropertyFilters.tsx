import React, { useMemo } from 'react';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { SegmentWithPropertyTypes, PropertyTypeWithFilters, FullFilterConfig } from '@/lib/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PropertyFiltersProps {
  config: SegmentWithPropertyTypes[];
  onFilterChange: (filters: any) => void;
}

const dealTypes = [
  { id: 'sale', name_ru: 'Купить', name_kz: 'Сатып алу' },
  { id: 'rent', name_ru: 'Снять', name_kz: 'Жалға алу' },
];

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ config, onFilterChange }) => {
  const { filters, setDealType, setSegment, setFilterValue } = usePropertyFiltersStore();

  const handleDealTypeChange = (value: string) => {
    if (value) {
      setDealType(value);
      // Reset segment and other filters when deal type changes
      setSegment(''); 
    }
  };

  const handleSegmentChange = (value: string) => {
    if (value) {
      setSegment(value);
    }
  };

  const handleValueChange = (filterId: string, value: any) => {
    setFilterValue(filterId, value);
    onFilterChange(usePropertyFiltersStore.getState().filters);
  };

  const activeSegments = useMemo(() => {
    return config.map(s => ({ id: s.id, name_ru: s.name_ru, name_kz: s.name_kz }));
  }, [config]);

  const activePropertyTypes = useMemo(() => {
    if (!filters.segment) return [];
    const selectedSegment = config.find(s => s.id === filters.segment);
    return selectedSegment ? selectedSegment.property_types : [];
  }, [config, filters.segment]);

  const renderFilter = (filter: FullFilterConfig) => {
    switch (filter.type) {
      case 'range':
        return (
          <div key={filter.id} className="grid grid-cols-2 gap-2 items-center">
            <Label htmlFor={`${filter.id}-from`}>{filter.name_ru} от</Label>
            <Input
              id={`${filter.id}-from`}
              type="number"
              placeholder={filter.meta?.min || '0'}
              value={filters.values[filter.id]?.from || ''}
              onChange={(e) => handleValueChange(filter.id, { ...filters.values[filter.id], from: e.target.value })}
            />
            <Label htmlFor={`${filter.id}-to`}>{filter.name_ru} до</Label>
            <Input
              id={`${filter.id}-to`}
              type="number"
              placeholder={filter.meta?.max || '1000'}
              value={filters.values[filter.id]?.to || ''}
              onChange={(e) => handleValueChange(filter.id, { ...filters.values[filter.id], to: e.target.value })}
            />
          </div>
        );
      case 'select':
        return (
          <div key={filter.id}>
            <Label>{filter.name_ru}</Label>
            <Select onValueChange={(value) => handleValueChange(filter.id, value)} value={filters.values[filter.id] || ''}>
              <SelectTrigger><SelectValue placeholder={`Выберите ${filter.name_ru.toLowerCase()}`} /></SelectTrigger>
              <SelectContent>
                {filter.options?.map(option => (
                  <SelectItem key={option.id} value={option.value}>{option.name_ru}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'boolean':
        return (
          <div key={filter.id} className="flex items-center space-x-2">
            <Checkbox 
              id={filter.id} 
              checked={!!filters.values[filter.id]}
              onCheckedChange={(checked) => handleValueChange(filter.id, checked)}
            />
            <Label htmlFor={filter.id}>{filter.name_ru}</Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
      {/* Deal Type and Segment Toggles */}
      <div className="flex flex-wrap gap-4">
        <ToggleGroup type="single" value={filters.dealType} onValueChange={handleDealTypeChange}>
          {dealTypes.map(dt => (
            <ToggleGroupItem key={dt.id} value={dt.id}>{dt.name_ru}</ToggleGroupItem>
          ))}
        </ToggleGroup>
        {filters.dealType && activeSegments.length > 0 && (
          <ToggleGroup type="single" value={filters.segment} onValueChange={handleSegmentChange}>
            {activeSegments.map(s => (
              <ToggleGroupItem key={s.id} value={s.id}>{s.name_ru}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </div>

      {/* Dynamic Filters */}
      {filters.segment && activePropertyTypes.map(pt => (
        <div key={pt.id} className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold">{pt.name_ru}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pt.filters.map(renderFilter)}
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-4">
        <Button onClick={() => onFilterChange(filters)}>Поиск</Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
