
import { useState } from 'react';
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
    // Here would be the API call to save the profile
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
            </div>
            
            {/* Main content area */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="profile">
                        {language === 'ru' ? 'Профиль' : 'Профиль'}
                      </TabsTrigger>
                      <TabsTrigger value="password">
                        {language === 'ru' ? 'Пароль' : 'Құпия сөз'}
                      </TabsTrigger>
                      <TabsTrigger value="notifications">
                        {language === 'ru' ? 'Уведомления' : 'Хабарландырулар'}
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
                    
                    <TabsContent value="password" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">
                          {language === 'ru' ? 'Текущий пароль' : 'Ағымдағы құпия сөз'}
                        </Label>
                        <Input 
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">
                          {language === 'ru' ? 'Новый пароль' : 'Жаңа құпия сөз'}
                        </Label>
                        <Input 
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          {language === 'ru' ? 'Подтвердите пароль' : 'Құпия сөзді растаңыз'}
                        </Label>
                        <Input 
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      
                      <Button onClick={handlePasswordChange}>
                        {language === 'ru' ? 'Изменить пароль' : 'Құпия сөзді өзгерту'}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="notifications" className="space-y-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {language === 'ru' 
                            ? 'Управляйте настройками уведомлений' 
                            : 'Хабарландыру параметрлерін басқарыңыз'}
                        </p>
                        
                        {/* Notification settings would go here */}
                        <Card>
                          <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">
                              {language === 'ru' 
                                ? 'Настройки уведомлений будут доступны в ближайшее время' 
                                : 'Хабарландыру параметрлері жақын арада қол жетімді болады'}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
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
