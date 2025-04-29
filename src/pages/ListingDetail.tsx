
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { ListingGallery } from '@/components/listing-detail/ListingGallery';
import { ListingHeader } from '@/components/listing-detail/ListingHeader';
import { ListingPrice } from '@/components/listing-detail/ListingPrice';
import { ListingDescription } from '@/components/listing-detail/ListingDescription';
import { ListingStats } from '@/components/listing-detail/ListingStats';
import { SellerInfo } from '@/components/listing-detail/SellerInfo';
import { SafetyTips } from '@/components/listing-detail/SafetyTips';
import { SimilarListings } from '@/components/listing-detail/SimilarListings';
import { mockListings } from '@/data/mockListings';
import { Listing } from '@/types/listingType';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { getCategoryConfig } from '@/categories/categoryRegistry';

export default function ListingDetail() {
  const { listingId } = useParams<{ listingId: string }>();
  const { language } = useAppWithTranslations();
  const location = useLocation();
  const [listing, setListing] = useState<Listing | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState<{label: string, link?: string}[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the listing data from an API
    const foundListing = mockListings.find(item => item.id === listingId);
    if (foundListing) {
      setListing(foundListing);
      
      // Build breadcrumbs from the path or listing data
      // The path structure would be /category/subcategory/subcategory.../listing
      const pathSegments = location.pathname.split('/').filter(Boolean);
      
      // Remove the last segment (listing ID)
      const categoryPath = pathSegments.slice(0, -1);
      
      // Build breadcrumb items
      const items = categoryPath.map((segment, index) => {
        // Get the real name for the category if possible
        let label = segment;
        
        // If this is a category ID, try to get its proper name
        if (index === 0 && segment === 'category') {
          label = language === 'ru' ? 'Категории' : 'Санаттар';
        } else if (index === 1) {
          // This would be the specific category
          const config = getCategoryConfig(segment);
          if (config) {
            label = config.name[language] || segment;
          }
        }
        
        // Make a readable label by capitalizing and replacing hyphens
        if (label === segment) {
          label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        }
        
        return {
          label,
          link: `/${categoryPath.slice(0, index + 1).join('/')}`
        };
      });
      
      setBreadcrumbItems(items);
    }
  }, [listingId, language, location.pathname]);

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            {language === 'ru' ? 'Объявление не найдено' : 'Хабарландыру табылмады'}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbNavigation 
        items={breadcrumbItems} 
        currentPage={listing.title[language]} 
      />
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ListingGallery images={listing.images || [listing.imageUrl]} />
              <ListingHeader listing={listing} />
              <ListingPrice listing={listing} />
              <ListingDescription listing={listing} />
              <ListingStats listing={listing} />
            </div>
            <div>
              <SellerInfo seller={listing.seller} />
              <SafetyTips />
            </div>
          </div>
          
          <SimilarListings categoryId={listing.categoryId} currentListingId={listing.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
