import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/useToast';
import { Link } from 'react-router-dom';

// Компонент панели администратора
const OwnerPanel = () => {
  const { language, isAuthenticated, userRole, login, setUserRole } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated || userRole !== 'admin');
  const { toast } = useToast();
  
  // Обработчик входа в админ-панель
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' ? 'Введите пароль' : 'Құпия сөзді енгізіңіз',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Проверка учетных данных администратора
    if (password === 'admin123') {
      login();
      setUserRole('admin');
      
      toast({
        title: language === 'ru' ? 'Успешно' : 'Сәтті',
        description: language === 'ru' 
          ? 'Вы успешно вошли как администратор' 
          : 'Сіз әкімші ретінде сәтті кірдіңіз'
      });
      
      setShowLoginForm(false);
    } else {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Неверный пароль' 
          : 'Жарамсыз құпия сөз',
        variant: 'destructive'
      });
    }
    
    setIsSubmitting(false);
  };
  
  // Форма авторизации администратора
  if (showLoginForm) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader className="pb-4 border-b border-slate-700">
              <CardTitle className="text-2xl font-bold text-white">
                {language === 'ru' ? 'Панель администратора' : 'Әкімші тақтасы'}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="pt-6 space-y-6">                
                <div className="text-center">
                  <h2 className="text-xl font-medium text-white mb-1">
                    {language === 'ru' ? 'Вход для администратора' : 'Әкімші кірісі'}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {language === 'ru' ? 'Доступ только для авторизованных лиц' : 'Тек өкілетті адамдар үшін қол жеткізу'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-white">
                    {language === 'ru' ? 'Пароль' : 'Құпия сөз'}
                  </label>
                  <Input 
                    id="password" 
                    type="password" 
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (language === 'ru' ? 'Выполняется вход...' : 'Кіру жүргізілуде...')
                    : (language === 'ru' ? 'Войти' : 'Кіру')
                  }
                </Button>
                
                <div className="text-center text-sm text-slate-500 mt-4">
                  <Link to="/" className="text-indigo-400 hover:text-indigo-300">
                    {language === 'ru' ? 'Вернуться на главную' : 'Басты бетке оралу'}
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Простая версия панели администратора
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language === 'ru' ? 'Панель администратора' : 'Әкімші тақтасы'}
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600 mb-4">
            {language === 'ru' 
              ? 'Административная панель находится в разработке. Скоро здесь появятся все необходимые функции.' 
              : 'Әкімшілік панелі әзірленуде. Жақын арада барлық қажетті функциялар осында пайда болады.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ru' ? 'Объявления' : 'Хабарландырулар'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{language === 'ru' ? 'Управление объявлениями' : 'Хабарландыруларды басқару'}</p>
                <Button className="mt-4">
                  {language === 'ru' ? 'Перейти' : 'Өту'}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ru' ? 'Пользователи' : 'Пайдаланушылар'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{language === 'ru' ? 'Управление пользователями' : 'Пайдаланушыларды басқару'}</p>
                <Button className="mt-4">
                  {language === 'ru' ? 'Перейти' : 'Өту'}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ru' ? 'Настройки' : 'Параметрлер'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{language === 'ru' ? 'Настройки сайта' : 'Сайт параметрлері'}</p>
                <Button className="mt-4">
                  {language === 'ru' ? 'Перейти' : 'Өту'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OwnerPanel;
