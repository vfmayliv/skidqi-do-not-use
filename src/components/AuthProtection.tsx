
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';

interface AuthProtectionProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const AuthProtection: React.FC<AuthProtectionProps> = ({ 
  children, 
  requiredRole = 'user' 
}) => {
  const { isAuthenticated, userRole, language } = useAppStore();
  const { toast } = useToast();
  
  // Check if user has required authentication
  const hasAccess = isAuthenticated && (
    requiredRole === 'user' ? 
      (userRole === 'user' || userRole === 'admin') : 
      userRole === 'admin'
  );
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        description: language === 'ru' 
          ? 'Пожалуйста, войдите в систему для доступа к этой странице' 
          : 'Бұл бетке кіру үшін жүйеге кіріңіз'
      });
    } else if (!hasAccess) {
      toast({
        description: language === 'ru' 
          ? 'У вас нет необходимых прав для доступа к этой странице' 
          : 'Бұл бетке кіру үшін қажетті құқықтарыңыз жоқ'
      });
    }
  }, [isAuthenticated, hasAccess, toast, language]);
  
  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  if (!hasAccess) {
    // User doesn't have required role
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
