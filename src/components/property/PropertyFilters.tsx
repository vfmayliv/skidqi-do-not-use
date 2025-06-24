import React, { useMemo } from 'react';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { filtersConfig } from '@/config/filtersConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PropertyType } from '@/types/listingType';
import { useAppStore } from '@/stores/useAppStore';
import { Search, X } from 'lucide-react';

const PropertyFilters: React.FC = () => {
  const { language } = useAppStore();
  const { dealType, segment, filters, setDealType, setSegment, setFilters, resetFilters } = usePropertyFiltersStore();

  const handleDealTypeChange = (value: string) => {
    if (value) {
      setDealType(value);
      setSegment(''); // Reset segment
      setFilters({ propertyTypes: [] }); // Reset property type
    }
  };

  const handleSegmentChange = (value: string) => {
    if (value) {
      setSegment(value);
      setFilters({ propertyTypes: [] }); // Reset property type
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters({ [key]: value });
  };

  // Correctly derive the configuration based on the new structure
  const configForCurrentDeal = useMemo(() => {
    if (!dealType) return null;
    return filtersConfig.dealDetails[dealType];
  }, [dealType]);

  const configForCurrentSegment = useMemo(() => {
    if (!configForCurrentDeal || !segment) return null;
    return configForCurrentDeal.segmentDetails[segment];
  }, [configForCurrentDeal, segment]);

  const availableSegments = configForCurrentDeal?.segments || [];
  const availablePropertyTypes = configForCurrentSegment?.propertyTypes || [];
  const selectedPropertyType = filters.propertyTypes?.[0];

  const renderFilterInputs = () => {
    if (!selectedPropertyType || !configForCurrentSegment) return null;

    const visibleFilterIds = configForCurrentSegment.visibility[selectedPropertyType] || [];
    const allFilters = configForCurrentSegment.filters;

    return visibleFilterIds.map(filterId => {
      const filter = allFilters.find(f => f.id === filterId);
      if (!filter) return null;

      switch (filter.type) {
        case 'range':
          return (
            <div key={filter.id} className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">{filter.label[language]}</label>
              <Input
                type="number"
                placeholder="от"
                className="w-24"
                value={filters[filter.id]?.min || ''}
                onChange={e => handleFilterChange(filter.id, { ...filters[filter.id], min: e.target.value ? Number(e.target.value) : undefined })}
              />
              <Input
                type="number"
                placeholder="до"
                className="w-24"
                value={filters[filter.id]?.max || ''}
                onChange={e => handleFilterChange(filter.id, { ...filters[filter.id], max: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          );
        case 'select':
          return (
            <Select
              key={filter.id}
              value={filters[filter.id] || ''}
              onValueChange={value => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.label[language]} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map(option => (
                  <SelectItem key={option.id} value={option.id}>{option.label[language]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg mb-8">
      <div className="flex flex-wrap gap-x-4 gap-y-3 items-center">
        {/* Deal Type Selector */}
        <ToggleGroup type="single" value={dealType} onValueChange={handleDealTypeChange} className="bg-muted p-1 rounded-md">
          {filtersConfig.dealTypes.map(dt => (
            <ToggleGroupItem key={dt.id} value={dt.id} className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3">
              {dt.label[language]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {/* Segment Selector */}
        {dealType && availableSegments.length > 0 && (
          <ToggleGroup type="single" value={segment} onValueChange={handleSegmentChange} className="bg-muted p-1 rounded-md">
            {availableSegments.map(s => (
              <ToggleGroupItem key={s.id} value={s.id} className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3">
                {s.label[language]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        {/* Property Type Selector */}
        {segment && availablePropertyTypes.length > 0 && (
          <Select
            value={selectedPropertyType || ''}
            onValueChange={(value) => handleFilterChange('propertyTypes', value ? [value as PropertyType] : [])}
          >
            <SelectTrigger className="w-auto min-w-[180px] flex-shrink-0">
              <SelectValue placeholder="Тип недвижимости" />
            </SelectTrigger>
            <SelectContent>
              {availablePropertyTypes.map(pt => (
                <SelectItem key={pt.id} value={pt.id}>{pt.label[language]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Dynamic Filters */}
        {renderFilterInputs()}

        {/* Action Buttons */}
        <div className="flex gap-2 ml-auto">
            <Button>
                <Search className="mr-2 h-4 w-4" /> Поиск
            </Button>
            <Button variant="ghost" onClick={resetFilters}>
                <X className="mr-2 h-4 w-4"/> Сбросить
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
