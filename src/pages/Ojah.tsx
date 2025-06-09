
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { OjahLayout } from '@/components/admin/OjahLayout';
import { OjahLogin } from '@/components/admin/OjahLogin';
import { useAdmin } from '@/contexts/AdminContext';

const Ojah = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { adminUser } = useAdmin();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const ojahAuth = localStorage.getItem('ojah_authenticated');
    if (ojahAuth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleLogin = async (password: string) => {
    try {
      const { data, error } = await supabase
        .from('ojpw')
        .select('id')
        .limit(1)
        .single();

      if (error) {
        console.error('Error checking password:', error);
        return false;
      }

      if (data?.id === password) {
        localStorage.setItem('ojah_authenticated', 'true');
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ojah_authenticated');
    setIsAuthenticated(false);
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
      
      {!isAuthenticated ? (
        <OjahLogin onLogin={handleLogin} />
      ) : (
        <OjahLayout onLogout={handleLogout} />
      )}
    </>
  );
};

export default Ojah;
