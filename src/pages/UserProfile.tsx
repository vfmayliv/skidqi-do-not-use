import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { processImageForUpload, uploadImage } from '@/utils/imageUtils';
import { Bell, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Listing } from '@/types/listingType';

// Import profile components
import { MyListings } from '@/components/profile/MyListings';
import { MessagesInbox } from '@/components/profile/MessagesInbox';
import { ReviewsList } from '@/components/profile/ReviewsList';
import { NotificationsList } from '@/components/profile/NotificationsList';

// User profile localstorage key
const USER_PROFILE_STORAGE_KEY = 'userProfileData';
const USER_LISTINGS_KEY = 'userListings';
const USER_MESSAGES_KEY = 'userMessages';
const USER_REVIEWS_KEY = 'userReviews';
const USER_NOTIFICATIONS_KEY = 'userNotifications';

const UserProfile = () => {
  const { language, setLanguage } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // User state
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+7 (777) 123-45-67');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile photo
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // User listings
  const [userListings, setUserListings] = useState<Listing[]>([]);
  
  // User messages
  const [messages, setMessages] = useState<any[]>([]);
  
  // User reviews
  const [reviews, setReviews] = useState<any[]>([]);
  
  // User notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Load saved profile data and user listings on component mount
  useEffect(() => {
    // Load profile data
    const savedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const profileData = JSON.parse(savedProfile);
        setFirstName(profileData.firstName || firstName);
        setLastName(profileData.lastName || lastName);
        setEmail(profileData.email || email);
        setPhone(profileData.phone || phone);
        if (profileData.profilePhoto) {
          setProfilePhoto(profileData.profilePhoto);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
    
    // Load user listings
    const savedListings = localStorage.getItem(USER_LISTINGS_KEY);
    if (savedListings) {
      try {
        const listingsData = JSON.parse(savedListings);
        setUserListings(listingsData);
      } catch (error) {
        console.error('Error loading user listings:', error);
      }
    }
    
    // Load messages
    const savedMessages = localStorage.getItem(USER_MESSAGES_KEY);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    } else {
      // Добавляем пример сообщения
      const exampleMessages = [
        {
          id: 1,
          sender: 'Асқар Жұмабаев',
          content: language === 'ru' ? 'Здравствуйте, интересует ваше объявление' : 'Сәлеметсіз бе, сіздің хабарландыруыңыз қызықтырады',
          date: new Date().toISOString(),
          read: false
        }
      ];
      setMessages(exampleMessages);
      localStorage.setItem(USER_MESSAGES_KEY, JSON.stringify(exampleMessages));
    }
    
    // Load reviews
    const savedReviews = localStorage.getItem(USER_REVIEWS_KEY);
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    } else {
      // Добавляем пример отзыва
      const exampleReviews = [
        {
          id: 1,
          author: 'Мария К.',
          rating: 5,
          comment: language === 'ru' ? 'Отличный продавец, быстрая доставка!' : 'Керемет сатушы, жылдам жеткізу!',
          date: new Date().toISOString()
        }
      ];
      setReviews(exampleReviews);
      localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(exampleReviews));
    }
    
    // Load notifications
    const savedNotifications = localStorage.getItem(USER_NOTIFICATIONS_KEY);
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      // Добавляем пример уведомлений
      const exampleNotifications = [
        {
          id: 1,
          title: language === 'ru' ? 'Новое сообщение' : 'Жаңа хабарлама',
          content: language === 'ru' ? 'У вас новое сообщение от пользователя Асқар Жұмабаев' : 'Сізде Асқар Жұмабаевтан жаңа хабарлама бар',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          title: language === 'ru' ? 'Новый отзыв' : 'Жаңа пікір',
          content: language === 'ru' ? 'Пользователь оставил вам новый отзыв' : 'Пайдаланушы сізге жаңа пікір қалдырды',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: true
        }
      ];
      setNotifications(exampleNotifications);
      localStorage.setItem(USER_NOTIFICATIONS_KEY, JSON.stringify(exampleNotifications));
    }
  }, [language]);
  
  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Convert to WebP format
      const processedFile = await processImageForUpload(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(processedFile);
      setProfilePhoto(previewUrl);
      setNewProfilePhoto(processedFile);
      
      toast({
        title: language === 'ru' ? 'Фото загружено' : 'Фото жүктелді',
        description: language === 'ru' ? 'Фото профиля обновлено' : 'Профиль фотосы жаңартылды',
      });
    }
  };
  
  const handleSaveProfile = () => {
    // Save profile data to local storage
    const profileData = {
      firstName,
      lastName,
      email,
      phone,
      profilePhoto
    };
    
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profileData));
    setIsEditingProfile(false);
    
    toast({
      title: language === 'ru' ? 'Профиль обновлен' : 'Профиль жаңартылды',
      description: language === 'ru' 
        ? 'Ваш профиль был успешно обновлен' 
        : 'Сіздің профиліңіз сәтті жаңартылды',
    });
  };
  
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пароли не совпадают' 
          : 'Құпия сөздер сәйкес келмейді',
        variant: 'destructive',
      });
      return;
    }
    
    // Here would be the API call to change the password
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast({
      title: language === 'ru' ? 'Пароль обновлен' : 'Құпия сөз жаңартылды',
      description: language === 'ru' 
        ? 'Ваш пароль был успешно изменен' 
        : 'Сіздің құпия сөзіңіз сәтті өзгертілді',
    });
  };
  
  const handleLanguageChange = (lang: 'ru' | 'kz') => {
    if (language !== lang) {
      setLanguage(lang);
      
      toast({
        title: lang === 'ru' ? 'Язык изменен' : 'Тіл өзгертілді',
        description: lang === 'ru' 
          ? 'Язык интерфейса изменен на русский' 
          : 'Интерфейс тілі қазақшаға өзгертілді',
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₸';
  };
  
  const markNotificationAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    localStorage.setItem(USER_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  };
  
  const getUnreadCount = (items: any[]) => {
    return items.filter(item => !item.read).length;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {language === 'ru' ? 'Личный кабинет' : 'Жеке кабинет'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar with user info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                        {profilePhoto ? (
                          <img 
                            src={profilePhoto} 
                            alt="Profile" 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                            {firstName.charAt(0)}{lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      {isEditingProfile && (
                        <div className="absolute bottom-0 right-0">
                          <label htmlFor="profile-photo" className="cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </div>
                            <input 
                              id="profile-photo" 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleProfilePhotoChange}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{firstName} {lastName}</h2>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <p className="text-sm text-muted-foreground">{phone}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile 
                      ? (language === 'ru' ? 'Отменить' : 'Болдырмау')
                      : (language === 'ru' ? 'Редактировать профиль' : 'Профильді өңдеу')
                    }
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ru' ? 'Язык интерфейса' : 'Интерфейс тілі'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant={language === 'ru' ? 'default' : 'outline'}
                      onClick={() => handleLanguageChange('ru')}
                      className="flex-1"
                    >
                      Русский
                    </Button>
                    <Button 
                      variant={language === 'kz' ? 'default' : 'outline'}
                      onClick={() => handleLanguageChange('kz')}
                      className="flex-1"
                    >
                      Қазақша
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Статистика объявлений */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ru' ? 'Статистика объявлений' : 'Хабарландырулар статистикасы'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ru' ? 'Активные:' : 'Белсенді:'}
                      </span>
                      <span className="font-medium">{userListings.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ru' ? 'Просмотры:' : 'Қаралымдар:'}
                      </span>
                      <span className="font-medium">
                        {userListings.reduce((sum, listing) => sum + (listing.views || 0), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ru' ? 'Избранное:' : 'Таңдаулы:'}
                      </span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content area */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5">
                      <TabsTrigger value="profile">
                        {language === 'ru' ? 'Профиль' : 'Профиль'}
                      </TabsTrigger>
                      <TabsTrigger value="listings">
                        {language === 'ru' ? 'Объявления' : 'Хабарландырулар'}
                      </TabsTrigger>
                      <TabsTrigger value="messages">
                        {language === 'ru' ? 'Сообщения' : 'Хабарламалар'}
                        {getUnreadCount(messages) > 0 && (
                          <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-white rounded-full">
                            {getUnreadCount(messages)}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="reviews">
                        {language === 'ru' ? 'Отзывы' : 'Пікірлер'}
                      </TabsTrigger>
                      <TabsTrigger value="notifications">
                        {language === 'ru' ? 'Уведомления' : 'Хабарландырулар'}
                        {getUnreadCount(notifications) > 0 && (
                          <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-white rounded-full">
                            {getUnreadCount(notifications)}
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab}>
                    <TabsContent value="profile" className="space-y-4">
                      {isEditingProfile ? (
                        // Edit profile form
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">
                                {language === 'ru' ? 'Имя' : 'Аты'}
                              </Label>
                              <Input 
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">
                                {language === 'ru' ? 'Фамилия' : 'Тегі'}
                              </Label>
                              <Input 
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">
                              {language === 'ru' ? 'Телефон' : 'Телефон'}
                            </Label>
                            <Input 
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          
                          <Button onClick={handleSaveProfile}>
                            {language === 'ru' ? 'Сохранить изменения' : 'Өзгерістерді сақтау'}
                          </Button>
                        </div>
                      ) : (
                        // Profile info
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="font-medium text-sm text-muted-foreground mb-1">
                                {language === 'ru' ? 'Имя' : 'Аты'}
                              </div>
                              <div>{firstName}</div>
                            </div>
                            <div>
                              <div className="font-medium text-sm text-muted-foreground mb-1">
                                {language === 'ru' ? 'Фамилия' : 'Тегі'}
                              </div>
                              <div>{lastName}</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-1">
                              Email
                            </div>
                            <div>{email}</div>
                          </div>
                          
                          <div>
                            <div className="font-medium text-sm text-muted-foreground mb-1">
                              {language === 'ru' ? 'Телефон' : 'Телефон'}
                            </div>
                            <div>{phone}</div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="listings">
                      <MyListings listings={userListings} />
                    </TabsContent>
                    
                    <TabsContent value="messages">
                      <MessagesInbox messages={messages} formatDate={formatDate} />
                    </TabsContent>
                    
                    <TabsContent value="reviews">
                      <ReviewsList reviews={reviews} formatDate={formatDate} />
                    </TabsContent>
                    
                    <TabsContent value="notifications">
                      <NotificationsList 
                        notifications={notifications} 
                        formatDate={formatDate}
                        onMarkAsRead={markNotificationAsRead}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
