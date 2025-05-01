
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
  isFeatured: boolean;
  views: number;
  
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
