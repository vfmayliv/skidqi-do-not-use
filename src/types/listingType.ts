
export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  COMMERCIAL = 'commercial',
  PARTS = 'parts'
}

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
  category?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  createdAt: string;
  imageUrl: string;
  images?: string[];
  isFeatured?: boolean;
  views: number;
  seller: {
    name: string;
    phone: string;
    rating: number;
    reviews?: number;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  // Transport specific fields
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  vehicleType?: VehicleType;
}
