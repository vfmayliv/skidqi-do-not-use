
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const { language, t } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пожалуйста, заполните все поля' 
          : 'Барлық өрістерді толтырыңыз',
        variant: 'destructive'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пароли не совпадают' 
          : 'Құпия сөздер сәйкес келмейді',
        variant: 'destructive'
      });
      return;
    }
    
    if (!agreedToTerms) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Вы должны согласиться с условиями использования' 
          : 'Пайдалану шарттарымен келісуіңіз керек',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would make an API call to register the user
    // For this demo, we're simulating the process
    setTimeout(() => {
      // Store user data (in a real app, this would be stored on the server)
      const userData = { firstName, lastName, email, phone, password };
      localStorage.setItem('pendingUser', JSON.stringify(userData));
      
      // Simulate sending a confirmation email
      toast({
        title: language === 'ru' ? 'Регистрация успешна' : 'Тіркелу сәтті',
        description: language === 'ru' 
          ? 'На ваш email отправлено письмо с ссылкой для подтверждения' 
          : 'Растау сілтемесі бар хат сіздің электрондық поштаңызға жіберілді'
      });
      
      // For demo purposes, simulate confirmation directly
      localStorage.setItem('confirmationSent', 'true');
      
      setIsSubmitting(false);
      
      // Redirect to confirmation page
      navigate('/confirm-email');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {t('register')}
            </CardTitle>
            <CardDescription>
              {language === 'ru' 
                ? 'Создайте аккаунт, чтобы размещать объявления'
                : 'Хабарландырулар орналастыру үшін аккаунт жасаңыз'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">
                    {language === 'ru' ? 'Имя' : 'Аты'}
                  </Label>
                  <Input 
                    id="first-name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">
                    {language === 'ru' ? 'Фамилия' : 'Тегі'}
                  </Label>
                  <Input 
                    id="last-name" 
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
                  placeholder="email@example.com" 
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
                  placeholder="+7 (___) ___-__-__" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {language === 'ru' 
                    ? 'Я согласен с ' 
                    : 'Мен келісемін '} 
                  <Link to="/terms" className="text-primary hover:underline">
                    {language === 'ru' 
                      ? 'условиями использования' 
                      : 'пайдалану шарттарымен'}
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  (language === 'ru' ? 'Обработка...' : 'Өңдеу...') : 
                  (language === 'ru' ? 'Зарегистрироваться' : 'Тіркелу')
                }
              </Button>
              <div className="text-center text-sm">
                {language === 'ru' ? 'Уже есть аккаунт?' : 'Аккаунтыңыз бар ма?'}{' '}
                <Link 
                  to="/login"
                  className="text-primary hover:underline"
                >
                  {language === 'ru' ? 'Войти' : 'Кіру'}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
