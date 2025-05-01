
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
import LocationMap from '@/components/listing-detail/LocationMap';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  
  // Find similar listings for the recommendation section
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);

  useEffect(() => {
    // In a real app, you would fetch the listing data from an API
    const foundListing = mockListings.find(item => item.id === listingId);
    if (foundListing) {
      setListing(foundListing);
      
      // Find similar listings (same category, different ID)
      const similar = mockListings
        .filter(item => item.categoryId === foundListing.categoryId && item.id !== foundListing.id)
        .slice(0, 4);
      setSimilarListings(similar);
      
      // Build improved breadcrumbs with category hierarchy
      const categoryItems = [];
      
      // Add Home
      categoryItems.push({
        label: language === 'ru' ? 'Главная' : 'Басты бет',
        link: '/'
      });
      
      // Add main category
      if (foundListing.categoryId) {
        const categoryConfig = getCategoryConfig(foundListing.categoryId);
        if (categoryConfig) {
          categoryItems.push({
            label: categoryConfig.name[language] || foundListing.categoryId,
            link: `/category/${foundListing.categoryId}`
          });
        }
      }
      
      // Add subcategory if exists
      if (foundListing.subcategoryId) {
        // Format subcategory ID for display
        const subcategoryLabel = foundListing.subcategoryId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        categoryItems.push({
          label: subcategoryLabel,
          link: `/category/${foundListing.categoryId}?subcategory=${foundListing.subcategoryId}`
        });
      }
      
      // Add sub-subcategory if exists (in real data structure)
      if (foundListing.subSubcategoryId) {
        const subSubcategoryLabel = foundListing.subSubcategoryId
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        categoryItems.push({
          label: subSubcategoryLabel,
          link: `/category/${foundListing.categoryId}?subcategory=${foundListing.subcategoryId}&subSubcategory=${foundListing.subSubcategoryId}`
        });
      }
      
      setBreadcrumbItems(categoryItems);
    }
  }, [listingId, language, location.pathname]);

  // Utility functions for formatting
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₸';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Event handlers
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleShare = () => {
    // Share functionality would go here
    if (navigator.share) {
      navigator.share({
        title: listing?.title[language] || '',
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    }
  };
  
  const handleShowPhone = () => {
    setIsPhoneVisible(true);
  };

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

  // Extract and ensure title and description are strings
  const title = typeof listing.title === 'string' 
    ? listing.title 
    : (listing.title && typeof listing.title === 'object' && listing.title[language]) 
      ? listing.title[language] 
      : '';
      
  const city = typeof listing.city === 'string' 
    ? listing.city 
    : (listing.city && typeof listing.city === 'object' && listing.city[language]) 
      ? listing.city[language] 
      : '';
      
  const descriptionText = listing.description ? 
    (typeof listing.description === 'string' ? listing.description : 
     (typeof listing.description === 'object' ? listing.description[language] || '' : '')) 
    : '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbNavigation 
        items={breadcrumbItems} 
        currentPage={title} 
      />
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ListingGallery 
                images={listing.images || [listing.imageUrl]} 
                title={title}
                language={language}
              />
              <ListingHeader 
                title={title}
                city={city}
                createdAt={listing.createdAt}
                views={listing.views}
                id={listing.id}
                price={listing.discountPrice}
                originalPrice={listing.originalPrice}
                discount={listing.discount}
                isFeatured={listing.isFeatured || false}
                isFavorite={isFavorite}
                language={language}
                formatPrice={formatPrice}
                formatDate={formatDate}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
              />
              <ListingPrice 
                price={listing.discountPrice}
                originalPrice={listing.originalPrice}
                discount={listing.discount}
                formatPrice={formatPrice}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
              />
              <ListingDescription 
                description={descriptionText} 
                language={language}
              />
              <ListingStats 
                createdAt={listing.createdAt}
                id={listing.id}
                views={listing.views}
                isFavorite={isFavorite}
                language={language}
                formatDate={formatDate}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
              />
            </div>
            <div>
              <SellerInfo 
                name={listing.seller.name}
                phone={listing.seller.phone}
                rating={listing.seller.rating}
                deals={listing.seller.reviews || 0}
                memberSince="2022"
                response={language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді'}
                lastOnline={language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'}
                isPhoneVisible={isPhoneVisible}
                language={language}
                onShowPhone={handleShowPhone}
              />
              <SafetyTips language={language} />
              <LocationMap 
                city={city} 
                coordinates={listing.coordinates}
                language={language}
              />
            </div>
          </div>
          
          <SimilarListings 
            listings={similarListings}
            language={language}
            formatPrice={formatPrice}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
