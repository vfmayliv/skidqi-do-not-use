
import { UniversalFilters } from '@/components/filters/UniversalFilters';
import { CategoryTreeFilter } from '@/components/filters/CategoryTreeFilter';
import { useUniversalFiltersStore } from '@/stores/useUniversalFiltersStore';

interface CategoryFiltersSectionProps {
  categoryId: string;
  shouldShowCategoryTree: boolean;
  shouldShowUniversalFilters: boolean;
  selectedSubcategory?: string;
  onSubcategorySelect: (subcategoryId: string) => void;
  onSearch: () => void;
  FiltersComponent?: React.ComponentType<any>;
}

export function CategoryFiltersSection({
  categoryId,
  shouldShowCategoryTree,
  shouldShowUniversalFilters,
  selectedSubcategory,
  onSubcategorySelect,
  onSearch,
  FiltersComponent
}: CategoryFiltersSectionProps) {
  const { filters, setFilters, resetFilters } = useUniversalFiltersStore();

  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      {/* Category Tree Filter */}
      {shouldShowCategoryTree && (
        <CategoryTreeFilter
          categoryId={categoryId}
          onCategorySelect={onSubcategorySelect}
          selectedCategoryId={selectedSubcategory}
        />
      )}
      
      {/* Universal Filters */}
      {shouldShowUniversalFilters && (
        <UniversalFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          onSearch={onSearch}
        />
      )}
      
      {/* Custom Category Filters */}
      {FiltersComponent && (
        <FiltersComponent
          filters={{}}
          onFilterChange={() => {}}
          onReset={() => {}}
          onSearch={onSearch}
          districts={[]}
          config={{
            cities: [],
            onCityChange: () => {},
            selectedCity: null
          }}
          brands={[]}
          activeFiltersCount={0}
        />
      )}
    </div>
  );
}
