
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { mockListings } from '@/data/mockListings';
import { Listing } from '@/types/listingType';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Ключ для хранения объявлений пользователя в localStorage
const USER_LISTINGS_KEY = 'userListings';

export function EnhancedFeaturedListings() {
  const { language } = useAppContext();
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "user">("all");
  const [displayedListings, setDisplayedListings] = useState<Listing[]>([]);
  
  // Загрузка объявлений пользователя при монтировании компонента
  useEffect(() => {
    const savedUserListings = localStorage.getItem(USER_LISTINGS_KEY);
    if (savedUserListings) {
      try {
        const parsed = JSON.parse(savedUserListings);
        setUserListings(parsed);
      } catch (error) {
        console.error('Error parsing user listings:', error);
      }
    }
  }, []);
  
  // Обновляем отображаемые объявления при изменении вкладки
  useEffect(() => {
    if (activeTab === "all") {
      // Комбинируем встроенные объявления и объявления пользователя
      setDisplayedListings([...userListings, ...mockListings]);
    } else if (activeTab === "featured") {
      // Только рекомендуемые объявления
      const featured = mockListings.filter(listing => listing.isFeatured);
      setDisplayedListings(featured);
    } else if (activeTab === "user") {
      // Только объявления пользователя
      setDisplayedListings(userListings);
    }
  }, [activeTab, userListings]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">
          {language === 'ru' ? 'Объявления' : 'Хабарландырулар'}
        </h2>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="all">
              {language === 'ru' ? 'Все' : 'Барлығы'}
            </TabsTrigger>
            <TabsTrigger value="featured">
              {language === 'ru' ? 'Рекомендуемые' : 'Ұсынылатын'}
            </TabsTrigger>
            <TabsTrigger value="user">
              {language === 'ru' ? 'Мои' : 'Менің'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedListings.slice(0, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedListings.slice(0, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="user">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedListings.slice(0, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="text-center mt-10">
        <Button asChild>
          <Link to="/search">
            {language === 'ru' ? 'Показать все объявления' : 'Барлық хабарландыруларды көрсету'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
