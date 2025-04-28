
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import { CategoryPage } from '@/pages/CategoryPage';
import SubcategoryPage from '@/pages/SubcategoryPage';
import ListingDetail from '@/pages/ListingDetail';
import SearchResults from '@/pages/SearchResults';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import UserProfile from '@/pages/UserProfile';
import CreateListing from '@/pages/CreateListing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Help from '@/pages/Help';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import NotFound from '@/pages/NotFound';
import OwnerPanel from '@/pages/OwnerPanel';
import ConfirmEmail from '@/pages/ConfirmEmail';
import { AuthProtection } from '@/components/AuthProtection';
import { PropertyPage } from '@/pages/PropertyPage';
import TransportPage from '@/pages/TransportPage';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/category/:categoryId/:subcategoryId" element={<SubcategoryPage />} />
        
        {/* Категории с индивидуальным содержимым */}
        <Route path="/property" element={<PropertyPage />} />
        <Route path="/transport" element={<TransportPage />} />
        
        <Route path="/listing/:listingId" element={<ListingDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/profile" element={
          <AuthProtection>
            <UserProfile />
          </AuthProtection>
        } />
        <Route path="/create-listing" element={
          <AuthProtection>
            <CreateListing />
          </AuthProtection>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/owner" element={
          <AuthProtection requiredRole="admin">
            <OwnerPanel />
          </AuthProtection>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </React.Fragment>
  );
};

export default App;
