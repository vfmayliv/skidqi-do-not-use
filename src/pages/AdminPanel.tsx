
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { Navigate } from 'react-router-dom';
import { 
  Users, Settings, Activity, BarChart3, Shield, 
  Lock, AlertCircle, CheckCircle, Globe 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Login Form Component
function AdminLoginForm() {
  const { language } = useAppWithTranslations();
  const { login, isLoading } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError(language === 'ru' ? 'Заполните все поля' : 'Барлық өрістерді толтырыңыз');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Ошибка входа');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {language === 'ru' ? 'Панель администратора' : 'Әкімші панелі'}
          </CardTitle>
          <p className="text-gray-600">
            {language === 'ru' ? 'Вход в систему управления' : 'Басқару жүйесіне кіру'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">
                {language === 'ru' ? 'Имя пользователя' : 'Пайдаланушы аты'}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === 'ru' ? 'Введите имя пользователя' : 'Пайдаланушы атын енгізіңіз'}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {language === 'ru' ? 'Пароль' : 'Құпия сөз'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'ru' ? 'Введите пароль' : 'Құпия сөзді енгізіңіз'}
                disabled={isSubmitting}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (language === 'ru' ? 'Вход...' : 'Кіру...')
                : (language === 'ru' ? 'Войти' : 'Кіру')
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Admin Dashboard
function AdminDashboard() {
  const { language } = useAppWithTranslations();
  const { adminUser, logout } = useAdmin();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    totalViews: 0
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold">
                {language === 'ru' ? 'Панель администратора' : 'Әкімші панелі'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">
                  {language === 'ru' ? 'Добро пожаловать' : 'Қош келдіңіз'}, 
                </span>
                <span className="font-medium ml-1">{adminUser?.username}</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {adminUser?.role}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                {language === 'ru' ? 'Выйти' : 'Шығу'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'ru' ? 'Обзор' : 'Шолу'}
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              {language === 'ru' ? 'Пользователи' : 'Пайдаланушылар'}
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              {language === 'ru' ? 'Активность' : 'Белсенділік'}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              {language === 'ru' ? 'Настройки' : 'Параметрлер'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {language === 'ru' ? 'Всего пользователей' : 'Барлық пайдаланушылар'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-green-600">
                    +12% {language === 'ru' ? 'с прошлого месяца' : 'өткен айдан'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {language === 'ru' ? 'Всего объявлений' : 'Барлық хабарландырулар'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalListings}</div>
                  <p className="text-xs text-green-600">
                    +8% {language === 'ru' ? 'с прошлого месяца' : 'өткен айдан'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {language === 'ru' ? 'Активные объявления' : 'Белсенді хабарландырулар'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeListings}</div>
                  <p className="text-xs text-blue-600">
                    {language === 'ru' ? 'Сейчас активно' : 'Қазір белсенді'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {language === 'ru' ? 'Просмотры' : 'Қаралымдар'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
                  <p className="text-xs text-green-600">
                    +24% {language === 'ru' ? 'с прошлого месяца' : 'өткен айдан'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ru' ? 'Последние действия' : 'Соңғы әрекеттер'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {language === 'ru' ? 'Новое объявление создано' : 'Жаңа хабарландыру жасалды'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'ru' ? '2 минуты назад' : '2 минут бұрын'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {language === 'ru' ? 'Новый пользователь зарегистрирован' : 'Жаңа пайдаланушы тіркелді'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'ru' ? '15 минут назад' : '15 минут бұрын'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">
                        {language === 'ru' ? 'Настройки сайта обновлены' : 'Сайт параметрлері жаңартылды'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'ru' ? '1 час назад' : '1 сағат бұрын'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ru' ? 'Управление пользователями' : 'Пайдаланушыларды басқару'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {language === 'ru' 
                    ? 'Функциональность управления пользователями будет добавлена в следующем обновлении.'
                    : 'Пайдаланушыларды басқару функциясы келесі жаңартуда қосылады.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ru' ? 'Журнал активности' : 'Белсенділік журналы'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {language === 'ru' 
                    ? 'Журнал активности администраторов будет доступен в следующем обновлении.'
                    : 'Әкімшілер белсенділік журналы келесі жаңартуда қол жетімді болады.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ru' ? 'Настройки системы' : 'Жүйе параметрлері'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {language === 'ru' 
                    ? 'Настройки системы будут доступны в следующем обновлении.'
                    : 'Жүйе параметрлері келесі жаңартуда қол жетімді болады.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Main Component
export default function AdminPanel() {
  const { isAuthenticated, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLoginForm />;
}
