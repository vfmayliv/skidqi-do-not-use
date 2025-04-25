
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

// Export a set of mock listings and re-export the Listing type
export const mockListings = generateMockListings(30);
export type { Listing } from '../types/listingType';
