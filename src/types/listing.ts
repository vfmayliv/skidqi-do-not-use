
export interface Listing {
  id: string;
  title: {
    ru: string;
    kz: string;
  };
  description: {
    ru: string;
    kz: string;
  };
  originalPrice: number;
  discountPrice: number;
  discount: number;
  city: {
    ru: string;
    kz: string;
  };
  categoryId: string;
  subcategoryId?: string;
  createdAt: string;
  imageUrl: string;
  isFeatured?: boolean; // Made optional to match listingType.ts
  views: number;
  
  // Add seller property to match listingType.ts Listing interface
  seller?: {
    name: string;
    phone: string;
    rating: number;
    reviews?: number;
  };
  
  // Transport-specific properties
  vehicleType?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  engineType?: string;
  transmission?: string;
  driveType?: string;
  bodyType?: string;
  condition?: string;
  
  // Administrative division properties
  regionId: string;
  cityId: string;
  microdistrictId: string;
  districtId?: string; // Keeping for backward compatibility
}
