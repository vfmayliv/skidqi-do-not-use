import { Listing } from '../types/listingType';
import { generateFixedListings } from './fixedListings';
import { getAdditionalFixedListings } from './additionalListings';
import { generateAdditionalListings } from './listingUtils';

// Generate mock listings
export const generateMockListings = (count: number): Listing[] => {
  const fixedListings = generateFixedListings();
  const additionalFixedListings = getAdditionalFixedListings();
  
  const allFixedListings = [...fixedListings, ...additionalFixedListings];
  
  if (count > allFixedListings.length) {
    const additionalCount = count - allFixedListings.length;
    const additionalListings = generateAdditionalListings(allFixedListings.length + 1, additionalCount);
    
    return [...allFixedListings, ...additionalListings];
  }
  
  return allFixedListings.slice(0, count);
};

// Add this at the top of the file, after imports
// This ensures the mock listings have the required properties

// Add to the existing mockListings array to ensure all listing objects 
// include the new administrative division fields
export function addAdministrativeDivisionFields() {
  // This will run once when the file is imported
  mockListings.forEach(listing => {
    // Only add if not already present
    if (listing.regionId === undefined) {
      listing.regionId = '';
    }
    if (listing.cityId === undefined) {
      listing.cityId = '';
    }
    if (listing.microdistrictId === undefined) {
      listing.microdistrictId = '';
    }
  });
}

// Run the function immediately
addAdministrativeDivisionFields();

// Export a set of mock listings and re-export the Listing type
export const mockListings = generateMockListings(30);
export type { Listing } from '../types/listingType';
