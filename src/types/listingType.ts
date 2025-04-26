
export interface LocalizedText {
  ru: string;
  kz: string;
}

export interface Seller {
  name: string;
  phone: string;
  rating: number;
  reviews?: number;
}

export interface Listing {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: string;
  subcategory?: string;
  city: LocalizedText;
  imageUrl: string;
  images?: string[];
  originalPrice: number;
  discountPrice: number;
  discount: number;
  isFeatured?: boolean;
  seller: Seller;
  createdAt: string;
  views: number;
}

export interface PropertyFilterConfig {
  priceRangeMin: number;
  priceRangeMax: number;
  roomsMin: number;
  roomsMax: number;
  areaMin: number;
  areaMax: number;
  propertyType: string | null;
}

export type BrandData = {
  id: string;
  name: string;
  models: string[];
};
