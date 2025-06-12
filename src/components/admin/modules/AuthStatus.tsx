import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

/**
 * Компонент для отображения статуса авторизации
 */
export const AuthStatus = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsUserLoggedIn(!!data.session);
        
        if (data.session) {
          setUserEmail(data.session.user.email);
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setIsUserLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isUserLoggedIn === null) {
    return <Alert><AlertDescription>Проверка статуса авторизации...</AlertDescription></Alert>;
  }

  if (isUserLoggedIn === false) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Необходимо авторизоваться для импорта объявлений
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <AlertDescription>
        Пользователь авторизован: {userEmail}
      </AlertDescription>
    </Alert>
  );
};