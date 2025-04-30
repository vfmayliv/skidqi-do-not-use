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
  
  // Добавляем поля для административного деления
  regionId?: string;
  cityId?: string;
  microdistrictId?: string;
}
