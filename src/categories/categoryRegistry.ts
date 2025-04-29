
import { CategoryConfig } from './shared/types';
import { categories } from '@/data/categories';
// Re-export components from each category
// import { PropertyFilters } from './real-estate/components';
// import { TransportFilters } from './transport/components';

// This registry will be populated with all category configurations
// For now, we're creating a skeleton with basic information from the existing categories data
export const categoryRegistry: Record<string, CategoryConfig> = {};

// Initialize the registry with basic data from the existing categories
export const initializeCategoryRegistry = () => {
  // Loop through all categories from the data
  categories.forEach(category => {
    categoryRegistry[category.id] = {
      id: category.id,
      name: category.name,
      // These will be populated later with actual components
      filtersComponent: () => null,
      cardComponent: () => null,
      styles: `/src/categories/${category.id}/styles/style.css`,
      filterConfig: {},
    };
  });
};

// Call this function to initialize the registry
initializeCategoryRegistry();

// Getter function to access category configurations
export const getCategoryConfig = (categoryId: string): CategoryConfig | undefined => {
  return categoryRegistry[categoryId];
};

// Function to register a new category configuration or update an existing one
export const registerCategoryConfig = (config: CategoryConfig) => {
  categoryRegistry[config.id] = config;
};
