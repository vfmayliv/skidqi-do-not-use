import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { mockListings } from '@/data/mockListings';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { ListingGallery } from '@/components/listing-detail/ListingGallery';
import { ListingHeader } from '@/components/listing-detail/ListingHeader';
import { ListingPrice } from '@/components/listing-detail/ListingPrice';
import { ListingDescription } from '@/components/listing-detail/ListingDescription';
import { SellerInfo } from '@/components/listing-detail/SellerInfo';
import { ListingStats } from '@/components/listing-detail/ListingStats';
import { SafetyTips } from '@/components/listing-detail/SafetyTips';
import { SimilarListings } from '@/components/listing-detail/SimilarListings';
import { Breadcrumbs } from '@/components/listing-detail/Breadcrumbs';
import { PropertyTourViewer } from '@/components/property/PropertyTourViewer';

const ListingDetail = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const { language, t } = useAppContext();
  const { toast } = useToast();
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("Current listing ID:", listingId);
    console.log("Available listings:", mockListings.map(l => l.id));
  }, [listingId]);
  
  const listing = mockListings.find(l => l.id === listingId);
  
  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">
              {language === 'ru' ? 'Объявление не найдено' : 'Хабарландыру табылмады'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ru' 
                ? 'Данное объявление не существует или было удалено' 
                : 'Бұл хабарландыру жоқ немесе жойылды'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ' + t('tenge');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const mockAdditionalImages = [
    listing.imageUrl,
    "https://via.placeholder.com/600x400?text=Image2",
    "https://via.placeholder.com/600x400?text=Image3",
    "https://via.placeholder.com/600x400?text=Image4",
    "https://via.placeholder.com/600x400?text=Image5"
  ];

  const sellerInfo = {
    name: "Arman Karimov",
    phone: "+7 (777) 123-45-67",
    rating: 4.8,
    deals: 56,
    memberSince: '2020',
    response: language === 'ru' ? 'Обычно отвечает в течение часа' : 'Әдетте бір сағат ішінде жауап береді',
    lastOnline: language === 'ru' ? 'Был онлайн сегодня в 14:30' : 'Бүгін 14:30-да онлайн болды'
  };

  const similarListings = mockListings
    .filter(l => l.categoryId === listing.categoryId && l.id !== listingId)
    .slice(0, 4);
    
  const handleShowPhone = () => {
    setIsPhoneVisible(true);
    toast({
      title: language === 'ru' ? 'Номер телефона' : 'Телефон нөмірі',
      description: sellerInfo.phone,
    });
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: language === 'ru' 
        ? (!isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного')
        : (!isFavorite ? 'Таңдаулыларға қосылды' : 'Таңдаулылардан жойылды'),
      description: listing.title[language],
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: language === 'ru' ? 'Ссылка скопирована' : 'Сілтеме көшірілді',
      description: language === 'ru' ? 'Ссылка на объявление скопирована в буфер обмена' : 'Хабарландыру сілтемесі буферге көшірілді',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Breadcrumbs */}
      <Breadcrumbs 
        categoryId={listing.categoryId}
        title={listing.title[language]}
        language={language}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Back button (Mobile only) */}
        <div className="mb-4 lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>{language === 'ru' ? 'Назад' : 'Артқа'}</span>
          </Button>
        </div>
        
        {/* Listing Title for Mobile */}
        <ListingHeader 
          title={listing.title[language]}
          city={listing.city[language]}
          createdAt={listing.createdAt}
          views={listing.views}
          id={listing.id}
          price={listing.discountPrice}
          originalPrice={listing.originalPrice}
          discount={listing.discount}
          isFeatured={listing.isFeatured}
          isFavorite={isFavorite}
          language={language}
          formatPrice={formatPrice}
          formatDate={formatDate}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
          isMobile={true}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image Carousel */}
            <ListingGallery 
              images={mockAdditionalImages} 
              title={listing.title[language]}
              language={language}
            />
            
            {/* Desktop Title Section */}
            <ListingHeader 
              title={listing.title[language]}
              city={listing.city[language]}
              createdAt={listing.createdAt}
              views={listing.views}
              id={listing.id}
              price={listing.discountPrice}
              originalPrice={listing.originalPrice}
              discount={listing.discount}
              isFeatured={listing.isFeatured}
              isFavorite={isFavorite}
              language={language}
              formatPrice={formatPrice}
              formatDate={formatDate}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
            
            {/* 3D Tour Button - Добавляем кнопку 3D-тура */}
            {listing.categoryId === 'real-estate' && (
              <PropertyTourViewer 
                imageUrl={listing.imageUrl}
                propertyId={listing.id}
                title={listing.title[language]}
              />
            )}
            
            {/* Description Section */}
            <ListingDescription 
              description={listing.description[language]}
              language={language}
            />
            
            {/* Seller information (mobile view) */}
            <SellerInfo 
              name={sellerInfo.name}
              phone={sellerInfo.phone}
              rating={sellerInfo.rating}
              deals={sellerInfo.deals}
              memberSince={sellerInfo.memberSince}
              response={sellerInfo.response}
              lastOnline={sellerInfo.lastOnline}
              isPhoneVisible={isPhoneVisible}
              language={language}
              onShowPhone={handleShowPhone}
              isMobile={true}
            />
            
            {/* Similar Listings */}
            <SimilarListings 
              listings={similarListings}
              language={language}
              formatPrice={formatPrice}
            />
            
            {/* Listing statistics */}
            <ListingStats 
              createdAt={listing.createdAt}
              id={listing.id}
              views={listing.views}
              isFavorite={isFavorite}
              language={language}
              formatDate={formatDate}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
              isMobile={true}
            />
          </div>
          
          {/* Right Column - Price & Seller Info */}
          <div className="space-y-4">
            {/* Mobile Price Box */}
            <ListingPrice 
              price={listing.discountPrice}
              originalPrice={listing.originalPrice}
              discount={listing.discount}
              formatPrice={formatPrice}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
            
            {/* Seller Card */}
            <SellerInfo 
              name={sellerInfo.name}
              phone={sellerInfo.phone}
              rating={sellerInfo.rating}
              deals={sellerInfo.deals}
              memberSince={sellerInfo.memberSince}
              response={sellerInfo.response}
              lastOnline={sellerInfo.lastOnline}
              isPhoneVisible={isPhoneVisible}
              language={language}
              onShowPhone={handleShowPhone}
            />
            
            {/* Listing statistics for desktop */}
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
            
            {/* Safety Tips */}
            <SafetyTips language={language} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;
