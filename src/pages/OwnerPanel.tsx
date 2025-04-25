import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mockListings, Listing } from '@/data/mockListings';
import { useAppContext } from '@/contexts/AppContext';
import { ListingCard } from '@/components/ListingCard';
import { uploadImage } from '@/utils/imageUtils';
import { 
  Users, Layers, Settings, AlertCircle, BarChart4, Mail, Search, 
  PawPrint, Layout, FileImage, Palette, Globe, Wrench, Plus,
  Edit, Trash, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Navigate, Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';

const mockImageUpload = async (blob: Blob, filename: string): Promise<string> => {
  console.log(`Uploading ${filename}...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return URL.createObjectURL(blob);
};

const OwnerPanel = () => {
  const { language, isAuthenticated } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedListing, setExpandedListing] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const imageUrl = await uploadImage(file, mockImageUpload);
      setUploadedImageUrl(imageUrl);
      toast({
        title: language === 'ru' ? 'Изображение загружено' : 'Сурет жүктелді',
        description: language === 'ru' 
          ? 'Изображение успешно конвертировано в WebP и загружено' 
          : 'Сурет WebP форматына сәтті түрлендірілді және жүктелді'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: language === 'ru' ? 'Ошибка загрузки' : 'Жүктеу қатесі',
        description: language === 'ru' 
          ? 'Не удалось загрузить изображение' 
          : 'Суретті жүктеу мүмкін болмады',
        variant: 'destructive'
      });
    }
  };
  
  const toggleListingExpand = (id: string) => {
    if (expandedListing === id) {
      setExpandedListing(null);
    } else {
      setExpandedListing(id);
    }
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name[language as keyof typeof category.name] : language === 'ru' ? 'Категория' : 'Санат';
  };
  
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ru' ? 'Всего объявлений' : 'Барлық хабарландырулар'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockListings.length}</div>
          <p className="text-xs text-muted-foreground">
            +12% {language === 'ru' ? 'с прошлого месяца' : 'өткен айдан'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ru' ? 'Активные пользователи' : 'Белсенді пайдаланушылар'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">243</div>
          <p className="text-xs text-muted-foreground">
            +18% {language === 'ru' ? 'с прошлого месяца' : 'өткен айдан'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ru' ? 'Просмотры объявлений' : 'Хабарландыру қаралымдары'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,456</div>
          <p className="text-xs text-muted-foreground">
            +32% {language === 'ru' ? 'с прошлого месяца' : 'өткен айдан'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {language === 'ru' ? 'Активность за неделю' : 'Апталық белсенділік'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <BarChart4 className="h-16 w-16 text-muted" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ru' ? 'Последние уведомления' : 'Соңғы хабарламалар'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {language === 'ru' ? 'Новый отчет' : 'Жаңа есеп'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ru' ? '2 часа назад' : '2 сағат бұрын'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {language === 'ru' ? 'Новое сообщение' : 'Жаңа хабарлама'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ru' ? '5 часов назад' : '5 сағат бұрын'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {language === 'ru' ? 'Управление объявлениями' : 'Хабарландыруларды басқару'}
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'ru' ? 'Поиск...' : 'Іздеу...'}
              className="pl-8 w-[200px]"
            />
          </div>
          <Button>
            {language === 'ru' ? 'Добавить' : 'Қосу'}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 font-medium border-b">
              <div>{language === 'ru' ? 'Заголовок' : 'Тақырып'}</div>
              <div>{language === 'ru' ? 'Категория' : 'Санат'}</div>
              <div>{language === 'ru' ? 'Цена' : 'Баға'}</div>
              <div>{language === 'ru' ? 'Статус' : 'Күй'}</div>
              <div>{language === 'ru' ? 'Действия' : 'Әрекеттер'}</div>
            </div>
            
            {mockListings.slice(0, 10).map(listing => (
              <div key={listing.id} className="border-b">
                <div className="grid grid-cols-5 p-4 items-center">
                  <div className="text-sm font-medium">{listing.title[language as keyof typeof listing.title]}</div>
                  <div className="text-sm text-muted-foreground">{getCategoryName(listing.categoryId)}</div>
                  <div className="text-sm">{listing.discountPrice} ₸</div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {language === 'ru' ? 'Активно' : 'Белсенді'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleListingExpand(listing.id)}>
                      {expandedListing === listing.id ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {expandedListing === listing.id && (
                  <div className="p-4 bg-slate-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${listing.id}`}>
                            {language === 'ru' ? 'Заголовок' : 'Тақырып'}
                          </Label>
                          <Input 
                            id={`title-${listing.id}`} 
                            defaultValue={listing.title[language as keyof typeof listing.title]} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`price-${listing.id}`}>
                            {language === 'ru' ? 'Цена' : 'Баға'}
                          </Label>
                          <Input 
                            id={`price-${listing.id}`} 
                            type="number" 
                            defaultValue={listing.discountPrice.toString()} 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`category-${listing.id}`}>
                            {language === 'ru' ? 'Категория' : 'Санат'}
                          </Label>
                          <Select defaultValue={listing.categoryId}>
                            <SelectTrigger id={`category-${listing.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name[language as keyof typeof category.name]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`description-${listing.id}`}>
                            {language === 'ru' ? 'Описание' : 'Сипаттама'}
                          </Label>
                          <Textarea 
                            id={`description-${listing.id}`} 
                            rows={4}
                            defaultValue={listing.description[language as keyof typeof listing.description]}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>
                            {language === 'ru' ? 'Изображения' : 'Суреттер'}
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative group">
                              <img 
                                src={listing.imageUrl} 
                                alt={listing.title[language as keyof typeof listing.title].toString()}
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 rounded-md">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors">
                              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                <Plus className="h-6 w-6" />
                                <span className="mt-1 text-xs">
                                  {language === 'ru' ? 'Добавить' : 'Қосу'}
                                </span>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>
                            {language === 'ru' ? 'Настройки объявления' : 'Хабарландыру параметрлері'}
                          </Label>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>
                                  {language === 'ru' ? 'Рекомендуемое' : 'Ұсынылған'}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {language === 'ru' ? 'Выделить объявление в списке' : 'Тізімдегі хабарландыруды бөлектеу'}
                                </p>
                              </div>
                              <Switch defaultChecked={listing.isFeatured} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>
                                  {language === 'ru' ? 'Активное' : 'Белсенді'}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {language === 'ru' ? 'Видно ли объявление пользователям' : 'Хабарландыру пайдаланушыларға көрінеді ме'}
                                </p>
                              </div>
                              <Switch defaultChecked={true} />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>
                                  {language === 'ru' ? 'Срочная продажа' : 'Жедел сату'}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {language === 'ru' ? 'Пометить как срочное' : 'Шұғыл деп белгілеңіз'}
                                </p>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline">
                        {language === 'ru' ? 'Отмена' : 'Болдырмау'}
                      </Button>
                      <Button>
                        {language === 'ru' ? 'Сохранить изменения' : 'Өзгерістерді сақтау'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {language === 'ru' ? 'Пользователи' : 'Пайдаланушылар'}
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'ru' ? 'Поиск...' : 'Іздеу...'}
              className="pl-8 w-[200px]"
            />
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 font-medium border-b">
              <div>ID</div>
              <div>{language === 'ru' ? 'Имя' : 'Аты'}</div>
              <div>{language === 'ru' ? 'Email' : 'Email'}</div>
              <div>{language === 'ru' ? 'Объявления' : 'Хабарландырулар'}</div>
              <div>{language === 'ru' ? 'Действия' : 'Әрекеттер'}</div>
            </div>
            
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 p-4 border-b">
                <div className="text-sm">#{1000 + i}</div>
                <div className="text-sm">
                  {language === 'ru' ? 'Пользователь' : 'Пайдаланушы'} {i + 1}
                </div>
                <div className="text-sm">user{i + 1}@example.com</div>
                <div className="text-sm">{Math.floor(Math.random() * 10)}</div>
                <div>
                  <Button variant="ghost" size="sm">
                    {language === 'ru' ? 'Детали' : 'Егжей-тегжейлі'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {language === 'ru' ? 'Внешний вид' : 'Сыртқы түрі'}
      </h3>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            {language === 'ru' ? 'Общие' : 'Жалпы'}
          </TabsTrigger>
          <TabsTrigger value="homepage">
            {language === 'ru' ? 'Главная страница' : 'Басты бет'}
          </TabsTrigger>
          <TabsTrigger value="theme">
            {language === 'ru' ? 'Тема' : 'Тақырып'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'ru' ? 'Цветовая схема' : 'Түс схемасы'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div 
                  className="h-10 bg-primary rounded-md cursor-pointer ring-2 ring-offset-2 ring-primary"
                  title={language === 'ru' ? 'Основной цвет' : 'Негізгі түс'}
                ></div>
                <div 
                  className="h-10 bg-secondary rounded-md cursor-pointer"
                  title={language === 'ru' ? 'Вторичный цвет' : 'Қосымша түс'}
                ></div>
                <div 
                  className="h-10 bg-accent rounded-md cursor-pointer"
                  title={language === 'ru' ? 'Акцентный цвет' : 'Акцент түсі'}
                ></div>
              </div>
              
              <Button className="w-full">
                {language === 'ru' ? 'Применить изменения' : 'Өзгерістерді қолдану'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'ru' ? 'Логотип и иконка' : 'Логотип және белгіше'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <img src="/placeholder.svg" alt="Logo" className="h-10 w-10" />
                </div>
                <div className="flex-1">
                  <Label className="block mb-1">
                    {language === 'ru' ? 'Загрузить логотип' : 'Логотипті жүктеу'}
                  </Label>
                  <Input type="file" onChange={handleImageUpload} />
                </div>
              </div>
              
              <Button className="w-full">
                {language === 'ru' ? 'Сохранить' : 'Сақтау'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="homepage" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'ru' ? 'Настройки главной страницы' : 'Басты бет параметрлері'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {language === 'ru' ? 'Количество избранных объявлений' : 'Таңдаулы хабарландырулар саны'}
                </Label>
                <Input type="number" defaultValue="6" min="0" max="12" />
              </div>
              
              <div className="space-y-2">
                <Label>
                  {language === 'ru' ? 'Количество новых объявлений' : 'Жаңа хабарландырулар саны'}
                </Label>
                <Input type="number" defaultValue="12" min="0" max="24" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>
                    {language === 'ru' ? 'Показывать категории' : 'Санаттарды көрсету'}
                  </Label>
                </div>
                <Switch defaultChecked={true} />
              </div>
              
              <Button className="w-full">
                {language === 'ru' ? 'Сохранить изменения' : 'Өзгерістерді сақтау'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="theme" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'ru' ? 'Настройки темы' : 'Тақырып параметрлері'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="border rounded-md p-4 cursor-pointer ring-2 ring-offset-2 ring-primary"
                >
                  <div className="mb-2 font-medium">
                    {language === 'ru' ? 'Светлая' : 'Жарық'}
                  </div>
                  <div className="h-20 bg-white border rounded-md"></div>
                </div>
                <div 
                  className="border rounded-md p-4 cursor-pointer"
                >
                  <div className="mb-2 font-medium">
                    {language === 'ru' ? 'Темная' : 'Қараңғы'}
                  </div>
                  <div className="h-20 bg-gray-900 border rounded-md"></div>
                </div>
              </div>
              
              <Button className="w-full">
                {language === 'ru' ? 'Применить тему' : 'Тақырыпты қолда��у'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  const renderMedia = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {language === 'ru' ? 'Медиафайлы' : 'Медиа файлдар'}
        </h3>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => document.getElementById('upload-media')?.click()}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'ru' ? 'Загрузить' : 'Жүктеу'}
          </Button>
          <input 
            id="upload-media" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {uploadedImageUrl ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={uploadedImageUrl} 
                  alt="Uploaded" 
                  className="max-h-64 rounded-md shadow-sm" 
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {language === 'ru' ? 'Изображение успешно конвертировано в WebP' : 'Сурет WebP форматына сәтті түрлендірілді'}
                </p>
                <p className="text-xs text-muted-foreground">
                  URL: {uploadedImageUrl}
                </p>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm" onClick={() => setUploadedImageUrl(null)}>
                  {language === 'ru' ? 'Загрузить другое' : 'Басқасын жүктеу'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileImage className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {language === 'ru' ? 'Перетащите файлы сюда' : 'Файлдарды осында сүйреңіз'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                {language === 'ru' 
                  ? 'Поддерживаются форматы JPG, PNG и GIF. Файлы будут автоматически конвертированы в WebP для ускорения загрузки.' 
                  : 'JPG, PNG және GIF форматтары қолдау көрсетіледі. Файлдар жүктеуді жылдамдату үшін WebP пішіміне автоматты түрде түрлендіріледі.'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('upload-media')?.click()}
              >
                {language === 'ru' ? 'Выбрать файлы' : 'Файлдарды таңдау'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mockListings.slice(0, 12).map((listing, index) => (
          <div key={index} className="group relative">
            <div className="aspect-square rounded-md overflow-hidden">
              <img 
                src={listing.imageUrl} 
                alt={listing.title[language as keyof typeof listing.title].toString()}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white text-red-400">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {language === 'ru' ? 'Настройки сайта' : 'Сайт параметрлері'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'ru' ? 'Основные настройки' : 'Негізгі параметрлер'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {language === 'ru' ? 'Название сайта' : 'Сайт атауы'}
              </Label>
              <Input defaultValue="SKIDQI.COM" />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {language === 'ru' ? 'Email администратора' : 'Әкімші email-і'}
              </Label>
              <Input defaultValue="admin@skidqi.com" />
            </div>
            
            <Button className="w-full">
              {language === 'ru' ? 'Сохранить изменения' : 'Өзгерістерді сақтау'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'ru' ? 'Настройки уведомлений' : 'Хабарландыру параметрлері'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {language === 'ru' ? 'Email уведомления' : 'Email хабарламалары'}
              </label>
              <Button variant="outline" size="sm">
                {language === 'ru' ? 'Включено' : 'Қосылған'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {language === 'ru' ? 'Push уведомления' : 'Push хабарламалары'}
              </label>
              <Button variant="outline" size="sm">
                {language === 'ru' ? 'Отключено' : 'Өшірілген'}
              </Button>
            </div>
            
            <Button className="w-full">
              {language === 'ru' ? 'Сохранить изменения' : 'Өзгерістерді сақтау'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'listings':
        return renderListings();
      case 'users':
        return renderUsers();
      case 'appearance':
        return renderAppearance();
      case 'media':
        return renderMedia();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language === 'ru' ? 'Панель управления' : 'Басқару тақтасы'}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 space-y-1">
            <Card>
              <CardContent className="p-0">
                <Button 
                  onClick={() => setActiveTab('dashboard')}
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
                  className="w-full justify-start rounded-none"
                >
                  <Layers className="mr-2" />
                  {language === 'ru' ? 'Обзор' : 'Шолу'}
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('listings')}
                  variant={activeTab === 'listings' ? 'default' : 'ghost'} 
                  className="w-full justify-start rounded-none"
                >
                  <Layout className="mr-2" />
                  {language === 'ru' ? 'Объявления' : 'Хабарландырулар'}
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('users')}
                  variant={activeTab === 'users' ? 'default' : 'ghost'} 
                  className="w-full justify-start rounded-none"
                >
                  <Users className="mr-2" />
                  {language === 'ru' ? 'Пользователи' : 'Пайдаланушылар'}
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('appearance')}
                  variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
                  className="w-full justify-start rounded-none"
                >
                  <Palette className="mr-2" />
                  {language === 'ru' ? 'Внешний вид' : 'Сыртқы түрі'}
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('media')}
                  variant={activeTab === 'media' ? 'default' : 'ghost'} 
                  className="w-full justify-start rounded-none"
                >
                  <FileImage className="mr-2" />
                  {language === 'ru' ? 'Медиафайлы' : 'Медиа файлдар'}
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('settings')}
                  variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                  className="w-full justify-start rounded-none"
                >
                  <Settings className="mr-2" />
                  {language === 'ru' ? 'Настройки' : 'Параметрлер'}
                </Button>
              </CardContent>
            </Card>
          </aside>
          
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OwnerPanel;
