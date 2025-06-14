
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

// Import Ojah directly without lazy loading to avoid import issues
const Ojah = lazy(() => import("./pages/Ojah"));

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <AdminProvider>
            <TooltipProvider>
              <Toaster />
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <CitySelectionModal />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<SearchResults />} />
                  {/* SEO-friendly listing URLs БЕЗ ID */}
                  <Route path="/category/:categorySlug/:titleSlug" element={<ListingDetail />} />
                  {/* Fallback for old listing URLs */}
                  <Route path="/listing/:id" element={<ListingDetail />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/category/:parentSlug/:slug" element={<SubcategoryPage />} />
                  <Route path="/create-listing" element={<CreateListing />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/confirm-email" element={<ConfirmEmail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/transport" element={<TransportPage />} />
                  <Route path="/property" element={<PropertyPage />} />
                  <Route path="/electronics" element={<ElectronicsPageWrapper />} />
                  <Route path="/fashion" element={<FashionPage />} />
                  <Route path="/pets" element={<PetsPage />} />
                  {/* Admin panel route */}
                  <Route path="/ojah" element={<Ojah />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </TooltipProvider>
          </AdminProvider>
        </SupabaseProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
