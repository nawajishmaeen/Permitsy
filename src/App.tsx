
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Countries from '@/pages/Countries';
import VisaFinder from '@/pages/VisaFinder';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboard from '@/pages/AdminDashboard';
import AddonServiceDetail from '@/pages/AddonServiceDetail';
import AddonServices from '@/pages/AddonServices';
import Testimonials from '@/pages/Testimonials';
import CountryDetails from '@/pages/CountryDetails';
import VisaApplication from '@/pages/VisaApplication';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Cookies from '@/pages/Cookies';
import Refunds from '@/pages/Refunds';
import FAQs from '@/pages/FAQs';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

// Create a QueryClient instance with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minute cache
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      retry: 2, // Retry failed requests twice
      // In newer versions of react-query, use onSettled instead of onError
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/country/:id" element={<CountryDetails />} />
          <Route path="/visa-finder" element={<VisaFinder />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/addon-services" element={<AddonServices />} />
          <Route path="/addon-services/:id" element={<AddonServiceDetail />} />
          <Route path="/visa-application/:countryId/:packageId" element={<VisaApplication />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin">{<AdminDashboard />}</ProtectedRoute>} />
          
          {/* Policy Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* 404 Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
