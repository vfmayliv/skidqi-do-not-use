
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

// First, export the mockListings
export const mockListings = generateMockListings(30);
export type { Listing } from '../types/listingType';

// Add administrative division fields to all listings
// Define the function to add admin fields, but don't run it immediately
function addAdministrativeDivisionFields(listings: Listing[]): void {
  listings.forEach(listing => {
    if (!('regionId' in listing)) {
      listing.regionId = '';
    }
    if (!('cityId' in listing)) {
      listing.cityId = '';
    }
    if (!('microdistrictId' in listing)) {
      listing.microdistrictId = '';
    }
  });
}

// Now run the function after mockListings is defined
addAdministrativeDivisionFields(mockListings);
