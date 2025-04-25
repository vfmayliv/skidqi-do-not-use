import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockListings } from '@/data/mockListings';
import { useAppContext } from '@/contexts/AppContext';
import { categories } from '@/data/categories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import CsvImporter from '@/components/admin/CsvImporter';
import JsonImporter from '@/components/admin/JsonImporter';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Search, 
  Edit, 
  Trash2, 
  Check,
  X,
  BarChart4,
  TrendingUp,
  ShoppingBag,
  Eye,
  FileImage,
  Upload,
  Palette,
  Globe,
  Grid,
  List,
  LayoutGrid,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';

const AdminPanel = () => {
  const { language } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeContentTab, setActiveContentTab] = useState('listings');
  const [viewMode, setViewMode] = useState('grid');
  
  const stats = [
    {
      title: language === 'ru' ? 'Объявления' : 'Хабарландырулар',
      value: '1,234',
      change: '+12%',
      icon: <Package className="h-4 w-4" />,
      chartData: [12, 15, 18, 14, 20, 25, 22],
    },
    {
      title: language === 'ru' ? 'Пользователи' : 'Пайдаланушылар',
      value: '5,678',
      change: '+8%',
      icon: <Users className="h-4 w-4" />,
      chartData: [45, 50, 52, 53, 57, 60, 62],
    },
    {
      title: language === 'ru' ? 'Просмотры' : 'Қаралымдар',
      value: '45,982',
      change: '+24%',
      icon: <Eye className="h-4 w-4" />,
      chartData: [320, 380, 420, 450, 510, 550, 620],
    },
  ];
  
  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} {language === 'ru' ? 'с прошлого месяца' : 'өткен айдан'}
              </p>
              <div className="h-16 mt-4">
                <div className="flex items-end h-full gap-1">
                  {stat.chartData.map((value, i) => (
                    <div 
                      key={i} 
                      className="bg-primary/80 rounded-sm w-full" 
                      style={{ height: `${(value / Math.max(...stat.chartData)) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ru' ? 'Последние объявления' : 'Соңғы хабарландырулар'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ru' ? 'Название' : 'Атауы'}</TableHead>
                  <TableHead>{language === 'ru' ? 'Цена' : 'Бағасы'}</TableHead>
                  <TableHead>{language === 'ru' ? 'Статус' : 'Күйі'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockListings.slice(0, 5).map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>{listing.title[language]}</TableCell>
                    <TableCell>{listing.discountPrice.toLocaleString()} ₸</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {language === 'ru' ? 'Активно' : 'Белсенді'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{language === 'ru' ? 'Новые пользователи' : 'Жаңа пайдаланушылар'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'ru' ? 'Имя' : 'Аты'}</TableHead>
                  <TableHead>{language === 'ru' ? 'Email' : 'Email'}</TableHead>
                  <TableHead>{language === 'ru' ? 'Дата' : 'Күні'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>{`User ${index + 1}`}</TableCell>
                    <TableCell>{`user${index + 1}@example.com`}</TableCell>
                    <TableCell>{new Date(Date.now() - index * 86400000).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {language === 'ru' ? 'Управление объявлениями' : 'Хабарландыруларды басқару'}
        </h3>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={language === 'ru' ? 'Поиск...' : 'Іздеу...'} className="pl-8 w-64" />
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>{language === 'ru' ? 'Название' : 'Атауы'}</TableHead>
                <TableHead>{language === 'ru' ? 'Цена' : 'Бағасы'}</TableHead>
                <TableHead>{language === 'ru' ? 'Статус' : 'Күйі'}</TableHead>
                <TableHead>{language === 'ru' ? 'Город' : 'Қала'}</TableHead>
                <TableHead className="text-right">{language === 'ru' ? 'Действия' : 'Әрекеттер'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.id.split('-')[1]}</TableCell>
                  <TableCell>{listing.title[language]}</TableCell>
                  <TableCell>{listing.discountPrice.toLocaleString()} ₸</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {language === 'ru' ? 'Активно' : 'Белсенді'}
                    </span>
                  </TableCell>
                  <TableCell>{listing.city[language]}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {language === 'ru' ? 'Управление пользователями' : 'Пайдаланушыларды басқару'}
        </h3>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={language === 'ru' ? 'Поиск...' : 'Іздеу...'} className="pl-8 w-64" />
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>{language === 'ru' ? 'Имя' : 'Аты'}</TableHead>
                <TableHead>{language === 'ru' ? 'Email' : 'Email'}</TableHead>
                <TableHead>{language === 'ru' ? 'Объявления' : 'Хабарландырулар'}</TableHead>
                <TableHead>{language === 'ru' ? 'Статус' : '��үйі'}</TableHead>
                <TableHead className="text-right">{language === 'ru' ? 'Действия' : 'Әрекеттер'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, index) => {
                const isActive = Math.random() > 0.2;
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{`user-${index + 1}`}</TableCell>
                    <TableCell>{`User ${index + 1}`}</TableCell>
                    <TableCell>{`user${index + 1}@example.com`}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 20)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isActive 
                          ? (language === 'ru' ? 'Активен' : 'Белсенді') 
                          : (language === 'ru' ? 'На паузе' : 'Кідіртілген')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isActive ? (
                          <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-700 hover:bg-amber-50">
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700 hover:bg-green-50">
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {language === 'ru' ? 'Настройки системы' : 'Жүйе параметрлері'}
      </h3>
      
      <Card>
        <CardContent className="p-6">
          <form className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-base font-medium">
                {language === 'ru' ? 'Основные настройки' : 'Негізгі параметрлер'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="site-name" className="text-sm font-medium">
                    {language === 'ru' ? 'Название сайта' : 'Сайт атауы'}
                  </label>
                  <Input id="site-name" defaultValue="SKIDQI.COM" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="site-description" className="text-sm font-medium">
                    {language === 'ru' ? 'Описание сайта' : 'Сайт сипаттамасы'}
                  </label>
                  <Input 
                    id="site-description" 
                    defaultValue={language === 'ru' 
                      ? 'Доска объявлений со скидками в Казахстане'
                      : 'Қазақстандағы жеңілдіктер тақтасы'
                    } 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-base font-medium">
                {language === 'ru' ? 'Настройки объявлений' : 'Хабарландырулар параметрлері'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="max-listings" className="text-sm font-medium">
                    {language === 'ru' ? 'Максимум объявлений на странице' : 'Беттегі хабарландырулардың максимумы'}
                  </label>
                  <Input id="max-listings" type="number" defaultValue="20" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="listing-duration" className="text-sm font-medium">
                    {language === 'ru' ? 'Срок активности объявления (дней)' : 'Хабарландыру белсенділігінің мерзімі (күндер)'}
                  </label>
                  <Input id="listing-duration" type="number" defaultValue="30" />
                </div>
              </div>
            </div>
            
            <Button type="submit">
              {language === 'ru' ? 'Сохранить настройки' : 'Параметрлерді сақтау'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentPanel = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {language === 'ru' ? 'Управление контентом' : 'Мазмұнды басқару'}
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={language === 'ru' ? 'Поиск...' : 'Іздеу...'} className="pl-8 w-64" />
          </div>
          
          <Button>
            {language === 'ru' ? 'Добавить новый' : 'Жаңасын қосу'}
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <aside className="w-52 flex-shrink-0">
          <Card>
            <CardContent className="p-3">
              <nav className="space-y-1">
                <Button
                  variant={activeContentTab === 'listings' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm h-9"
                  onClick={() => setActiveContentTab('listings')}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Объявления' : 'Хабарландырулар'}
                </Button>
                <Button
                  variant={activeContentTab === 'pages' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm h-9"
                  onClick={() => setActiveContentTab('pages')}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Страницы' : 'Беттер'}
                </Button>
                <Button
                  variant={activeContentTab === 'categories' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm h-9"
                  onClick={() => setActiveContentTab('categories')}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Категории' : 'Санаттар'}
                </Button>
                <Button
                  variant={activeContentTab === 'media' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm h-9"
                  onClick={() => setActiveContentTab('media')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Медиа' : 'Медиа'}
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>
        
        <div className="flex-1">
          {activeContentTab === 'listings' && (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockListings.slice(0, 9).map((listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={listing.imageUrl} 
                        alt={listing.title[language]} 
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium truncate">{listing.title[language]}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm text-muted-foreground">
                          {listing.city[language]}
                        </div>
                        <div className="text-sm font-medium">
                          {listing.discountPrice.toLocaleString()} ₸
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>{language === 'ru' ? 'Название' : 'Атауы'}</TableHead>
                        <TableHead>{language === 'ru' ? 'Цена' : 'Бағасы'}</TableHead>
                        <TableHead>{language === 'ru' ? 'Город' : 'Қала'}</TableHead>
                        <TableHead>{language === 'ru' ? 'Статус' : 'Күйі'}</TableHead>
                        <TableHead className="text-right">{language === 'ru' ? 'Действия' : 'Әрекеттер'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockListings.slice(0, 10).map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell className="font-medium">{listing.id.split('-')[1]}</TableCell>
                          <TableCell>{listing.title[language]}</TableCell>
                          <TableCell>{listing.discountPrice.toLocaleString()} ₸</TableCell>
                          <TableCell>{listing.city[language]}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {language === 'ru' ? 'Активно' : 'Белсенді'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )
          )}
          
          {activeContentTab === 'categories' && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      {language === 'ru' ? 'Все категории' : 'Барлық санаттар'}
                    </h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between border-b py-2">
                          <div className="flex items-center gap-2">
                            <span>{category.name[language]}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      {language === 'ru' ? 'Добавить категорию' : 'Санат қосу'}
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'ru' ? 'Название (Русский)' : 'Атауы (Орысша)'}
                        </label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'ru' ? 'Название (Казахский)' : 'Атауы (Қазақша)'}
                        </label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'ru' ? 'Иконка' : 'Белгіше'}
                        </label>
                        <Input placeholder="icon-name" />
                      </div>
                      <Button>
                        {language === 'ru' ? 'Добавить категорию' : 'Санат қосу'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeContentTab === 'media' && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-6">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h4 className="mt-2 text-lg font-medium">
                      {language === 'ru' ? 'Загрузить медиа' : 'Медиа жүктеу'}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'ru' 
                        ? 'Перетащите файлы сюда или нажмите, чтобы выбрать файлы'
                        : 'Файлдарды осында сүйреңіз немесе файлдарды таңдау үшін басыңыз'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ru' 
                        ? 'Изображения будут автоматически конвертированы в фор��ат WebP'
                        : 'Суреттер автоматты түрде WebP форматына түрлендіріледі'}
                    </p>
                    <Button className="mt-4">
                      {language === 'ru' ? 'Выбрать файлы' : 'Файлдарды таңдау'}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(15)].map((_, index) => (
                      <div key={index} className="group relative aspect-square overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={`https://via.placeholder.com/150?text=Image${index + 1}`}
                          alt={`Image ${index + 1}`}
                          className="h-full w-full object-cover transition-all group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 hover:bg-white text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeContentTab === 'pages' && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      {language === 'ru' ? 'Все страницы' : 'Барлық беттер'}
                    </h4>
                    <div className="space-y-2">
                      {['Главная', 'О нас', 'Контакты', 'Помощь', 'Условия использования', 'Политика конфиденциальности'].map((page, index) => (
                        <div key={index} className="flex items-center justify-between border-b py-2">
                          <span>{page}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      {language === 'ru' ? 'Добавить страницу' : 'Бет қосу'}
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'ru' ? 'Заголовок (Русский)' : 'Тақырып (Орысша)'}
                        </label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'ru' ? 'Заголовок (Казахский)' : 'Тақырып (Қазақша)'}
                        </label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'ru' ? 'Содержание (Русский)' : 'Мазмұны (Орысша)'}
                        </label>
                        <Textarea rows={5} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {language === 'ru' ? 'Содержание (Казахский)' : 'Мазмұны (Қазақша)'}
                        </label>
                        <Textarea rows={5} />
                      </div>
                      <Button>
                        {language === 'ru' ? 'Добавить страницу' : 'Бет қосу'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {language === 'ru' ? 'Настройки внешнего вида' : 'Сыртқы көрініс параметрлері'}
      </h3>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-base font-medium">
                {language === 'ru' ? 'Цвета и темы' : 'Түстер мен тақырыптар'}
              </h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ru' ? 'Основной цвет' : 'Негізгі түс'}
                </label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 bg-blue-500 hover:bg-blue-600 text-white">
                    {language === 'ru' ? 'Синий' : 'Көк'}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-red-500 hover:bg-red-600 text-white">
                    {language === 'ru' ? 'Красный' : 'Қызыл'}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-green-500 hover:bg-green-600 text-white">
                    {language === 'ru' ? 'Зеленый' : 'Жасыл'}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-purple-500 hover:bg-purple-600 text-white">
                    {language === 'ru' ? 'Фиолетовый' : 'Күлгін'}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ru' ? 'Шрифт' : 'Қаріп'}
                </label>
                <Select defaultValue="inter">
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ru' ? 'Выберите шрифт' : 'Қаріпті таңдаңыз'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="opensans">Open Sans</SelectItem>
                    <SelectItem value="montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="darkmode" />
                <label htmlFor="darkmode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {language === 'ru' ? 'Включить темную тему' : 'Қараңғы тақырыпты қосу'}
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-base font-medium">
                {language === 'ru' ? 'Логотип и иконки' : 'Логотип және белгішелер'}
              </h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ru' ? 'Логотип сайта' : 'Сайт логотипі'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-32 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xl font-bold">SKIDQI.COM</span>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'ru' ? 'Изменить' : 'Өзгерту'}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {language === 'ru' ? 'Фавикон' : 'Фавикон'}
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">SQ</span>
                  </div>
                  <Button variant="outline" size="sm">
                    {language === 'ru' ? 'Изменить' : 'Өзгерту'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <Button className="mt-6">
            {language === 'ru' ? 'Сохранить изменения' : 'Өзгерістерді сақтау'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderImportTools = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {language === 'ru' ? 'Инструменты импорта' : 'Импорт құралдары'}
      </h3>
      
      <Tabs defaultValue="csv">
        <TabsList className="mb-4">
          <TabsTrigger value="csv">CSV</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="csv">
          <CsvImporter />
        </TabsContent>
        
        <TabsContent value="json">
          <JsonImporter />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'content':
        return renderContentPanel();
      case 'users':
        return renderUsers();
      case 'appearance':
        return renderAppearanceSettings();
      case 'settings':
        return renderSettings();
      case 'import':
        return renderImportTools();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <h2 className="text-lg font-medium mb-4">
                {language === 'ru' ? 'Админ панель' : 'Әкімші панелі'}
              </h2>
              
              <Button 
                variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Дашборд' : 'Басқару тақтасы'}
              </Button>
              
              <Button 
                variant={activeTab === 'content' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('content')}
              >
                <Package className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Контент' : 'Мазмұн'}
              </Button>
              
              <Button 
                variant={activeTab === 'users' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Пользователи' : 'Пайдаланушылар'}
              </Button>
              
              <Button 
                variant={activeTab === 'appearance' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('appearance')}
              >
                <Palette className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Внешний вид' : 'Сыртқы көрініс'}
              </Button>
              
              <Button 
                variant={activeTab === 'import' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('import')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Импорт данных' : 'Деректерді импорттау'}
              </Button>
              
              <Button 
                variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                {language === 'ru' ? 'Настройки' : 'Параметрлер'}
              </Button>
            </div>
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

export default AdminPanel;
