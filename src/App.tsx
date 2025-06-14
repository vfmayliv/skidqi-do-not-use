
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { CitySelectionModal } from "@/components/CitySelectionModal";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ElectronicsPageWrapper from "@/components/ElectronicsPageWrapper";

// Import i18n configuration
import "./i18n";

const queryClient = new QueryClient();

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SubcategoryPage = lazy(() => import("./pages/SubcategoryPage"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ConfirmEmail = lazy(() => import("./pages/ConfirmEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/Help"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const TransportPage = lazy(() => import("./pages/TransportPage"));
const PropertyPage = lazy(() => import("./pages/PropertyPage"));
const FashionPage = lazy(() => import("./pages/FashionPage"));
const PetsPage = lazy(() => import("./pages/PetsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Import Ojah directly without lazy loading
import Ojah from "./pages/Ojah";

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Routes>
                {/* Admin panel route - no Suspense needed */}
                <Route path="/ojah" element={<Ojah />} />
                
                <Route path="/" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <CitySelectionModal />
                    <Index />
                  </Suspense>
                } />
                
                <Route path="/search" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <SearchResults />
                  </Suspense>
                } />
                
                {/* SEO-friendly listing URLs БЕЗ ID */}
                <Route path="/category/:categorySlug/:titleSlug" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <ListingDetail />
                  </Suspense>
                } />
                
                {/* Fallback for old listing URLs */}
                <Route path="/listing/:id" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <ListingDetail />
                  </Suspense>
                } />
                
                <Route path="/category/:slug" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <CategoryPage />
                  </Suspense>
                } />
                
                <Route path="/category/:parentSlug/:slug" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <SubcategoryPage />
                  </Suspense>
                } />
                
                <Route path="/create-listing" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <CreateListing />
                  </Suspense>
                } />
                
                <Route path="/profile" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <UserProfile />
                  </Suspense>
                } />
                
                <Route path="/login" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <Login />
                  </Suspense>
                } />
                
                <Route path="/register" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <Register />
                  </Suspense>
                } />
                
                <Route path="/confirm-email" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <ConfirmEmail />
                  </Suspense>
                } />
                
                <Route path="/dashboard" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <Dashboard />
                  </Suspense>
                } />
                
                <Route path="/about" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <About />
                  </Suspense>
                } />
                
                <Route path="/contact" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <Contact />
                  </Suspense>
                } />
                
                <Route path="/help" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <Help />
                  </Suspense>
                } />
                
                <Route path="/privacy-policy" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <PrivacyPolicy />
                  </Suspense>
                } />
                
                <Route path="/terms-of-service" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <TermsOfService />
                  </Suspense>
                } />
                
                <Route path="/transport" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <TransportPage />
                  </Suspense>
                } />
                
                <Route path="/property" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <PropertyPage />
                  </Suspense>
                } />
                
                <Route path="/electronics" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <ElectronicsPageWrapper />
                  </Suspense>
                } />
                
                <Route path="/fashion" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <FashionPage />
                  </Suspense>
                } />
                
                <Route path="/pets" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <PetsPage />
                  </Suspense>
                } />
                
                <Route path="*" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                    <NotFound />
                  </Suspense>
                } />
              </Routes>
            </TooltipProvider>
          </AdminProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
