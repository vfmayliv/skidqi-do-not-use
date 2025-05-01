
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';

const Login = () => {
  const { language, login, setUserRole } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const isOwnerLogin = searchParams.get('owner') === 'true';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset form when switching between owner and user login
    setEmail('');
    setPassword('');
  }, [isOwnerLogin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      const title = language === 'ru' ? 'Ошибка' : 'Қате';
      const description = language === 'ru' 
        ? 'Пожалуйста, заполните все поля' 
        : 'Барлық өрістерді толтырыңыз';
        
      toast({
        title,
        description,
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Check if this is an owner login
    if (isOwnerLogin) {
      // Verify owner credentials
      if (email === 'ceo' && password === 'world2025/') {
        // Set as authenticated admin
        login();
        setUserRole('admin');
        
        const title = language === 'ru' ? 'Успешно' : 'Сәтті';
        const description = language === 'ru' 
          ? 'Вы успешно вошли как администратор' 
          : 'Сіз әкімші ретінде сәтті кірдіңіз';
          
        toast({
          title,
          description
        });
        
        // Redirect to owner panel
        console.log('Redirecting to owner panel');
        navigate('/owner');
      } else {
        const title = language === 'ru' ? 'Ошибка' : 'Қате';
        const description = language === 'ru' 
          ? 'Неверные учетные данные администратора' 
          : 'Әкімшінің жарамсыз тіркелгі деректері';
          
        toast({
          title,
          description,
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }
    } else {
      // Regular user login - In a real app, this would verify against saved users
      // For demo, we'll check if the user is registered
      const registeredUserData = localStorage.getItem('registeredUser');
      
      if (registeredUserData) {
        try {
          const userData = JSON.parse(registeredUserData);
          
          if (userData.email === email && userData.password === password) {
            // Set as authenticated user
            login();
            setUserRole('user');
            
            const title = language === 'ru' ? 'Успешно' : 'Сәтті';
            const description = language === 'ru' 
              ? 'Вы успешно вошли в аккаунт' 
              : 'Сіз аккаунтқа сәтті кірдіңіз';
              
            toast({
              title,
              description
            });
            
            // Redirect to profile
            navigate('/profile');
          } else {
            const title = language === 'ru' ? 'Ошибка' : 'Қате';
            const description = language === 'ru' 
              ? 'Неверный email или пароль' 
              : 'Қате email немесе құпия сөз';
              
            toast({
              title,
              description,
              variant: 'destructive'
            });
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          const title = language === 'ru' ? 'Ошибка' : 'Қате';
          const description = language === 'ru' 
            ? 'Произошла ошибка при входе' 
            : 'Кіру кезінде қате орын алды';
            
          toast({
            title,
            description,
            variant: 'destructive'
          });
          setIsSubmitting(false);
          return;
        }
      } else {
        // For demo purposes, allow login without registration
        // In a real app, you would reject this login
        login();
        setUserRole('user');
        
        const title = language === 'ru' ? 'Демо режим' : 'Демо режимі';
        const description = language === 'ru' 
          ? 'Вход выполнен в демонстрационном режиме' 
          : 'Кіру демонстрациялық режимде жасалды';
          
        toast({
          title,
          description
        });
        
        navigate('/profile');
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isOwnerLogin 
                ? (language === 'ru' ? 'Вход для администратора' : 'Әкімші кірісі')
                : (language === 'ru' ? 'Вход' : 'Кіру')
              }
            </CardTitle>
            <CardDescription>
              {isOwnerLogin
                ? (language === 'ru' 
                  ? 'Введите данные для доступа к панели администратора'
                  : 'Әкімші тақтасына қол жеткізу үшін деректерді енгізіңіз')
                : (language === 'ru' 
                  ? 'Введите свои данные для входа в аккаунт'
                  : 'Аккаунтқа кіру үшін деректеріңізді енгізіңіз')
              }
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {isOwnerLogin 
                    ? (language === 'ru' ? 'Логин' : 'Логин')
                    : 'Email'
                  }
                </Label>
                <Input 
                  id="email" 
                  type={isOwnerLogin ? "text" : "email"}
                  placeholder={isOwnerLogin ? "ceo" : "email@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    {language === 'ru' ? 'Пароль' : 'Құпия сөз'}
                  </Label>
                  {!isOwnerLogin && (
                    <Link 
                      to="/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      {language === 'ru' ? 'Забыли пароль?' : 'Құпия сөзді ұмыттыңыз ба?'}
                    </Link>
                  )}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (language === 'ru' ? 'Выполняется вход...' : 'Кіру жүргізілуде...')
                  : (language === 'ru' ? 'Войти' : 'Кіру')
                }
              </Button>
              
              {!isOwnerLogin && (
                <div className="text-center text-sm">
                  {language === 'ru' ? 'Нет аккаунта?' : 'Аккаунтыңыз жоқ па?'}{' '}
                  <Link 
                    to="/register"
                    className="text-primary hover:underline"
                  >
                    {language === 'ru' ? 'Зарегистрироваться' : 'Тіркелу'}
                  </Link>
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
