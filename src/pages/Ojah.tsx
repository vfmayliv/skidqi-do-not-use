
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { OjahLayout } from '@/components/admin/OjahLayout';
import { OjahLogin } from '@/components/admin/OjahLogin';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const Ojah = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
    
    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setIsAdminVerified(false);
          setIsLoading(false);
        } else if (event === 'SIGNED_IN' && session) {
          // Проверяем админскую роль при входе
          await verifyAdminRole(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await verifyAdminRole(session);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Ошибка проверки статуса аутентификации:', error);
      setIsLoading(false);
    }
  };

  const verifyAdminRole = async (session: Session) => {
    try {
      const { data: isAdmin, error } = await supabase.rpc('check_admin_role');
      
      if (error) {
        console.error('Ошибка проверки админской роли:', error);
        toast({
          title: 'Ошибка доступа',
          description: 'Не удалось проверить права доступа.',
          variant: 'destructive',
        });
        await supabase.auth.signOut();
        return;
      }

      if (isAdmin) {
        setSession(session);
        setIsAdminVerified(true);
        console.log('Админская роль подтверждена для:', session.user.email);
      } else {
        toast({
          title: 'Доступ запрещен',
          description: 'У вас нет прав администратора.',
          variant: 'destructive',
        });
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Критическая ошибка проверки роли:', error);
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (session: Session) => {
    setSession(session);
    setIsAdminVerified(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setIsAdminVerified(false);
      toast({
        title: 'Выход выполнен',
        description: 'Вы успешно вышли из системы.',
      });
    } catch (error) {
      console.error('Ошибка выхода:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при выходе из системы.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Ojah Admin Panel</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>
      
      {!session || !isAdminVerified ? (
        <OjahLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <OjahLayout onLogout={handleLogout} />
      )}
    </>
  );
};

export default Ojah;
