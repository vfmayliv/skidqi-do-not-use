
// This file contains service functions for location data

/**
 * Fetch special city regions
 */
export async function getSpecialCityRegions() {
  try {
    // Use explicit type annotation instead of automatic inference
    const response: Response = await fetch('/api/regions?isCityLevel=true');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching special city regions:", error);
    return [];
  }
}

/**
 * Fetch all regions
 */
export async function getRegions() {
  try {
    const response = await fetch('/api/regions');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
}

/**
 * Fetch cities by region ID
 */
export async function getCitiesByRegion(regionId: string) {
  try {
    const response = await fetch(`/api/cities?regionId=${regionId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching cities for region ${regionId}:`, error);
    return [];
  }
}

/**
 * Fetch microdistricts by city ID
 */
export async function getMicrodistrictsByCity(cityId: string) {
  try {
    const response = await fetch(`/api/microdistricts?cityId=${cityId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching microdistricts for city ${cityId}:`, error);
    return [];
  }
}
