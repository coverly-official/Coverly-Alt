import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';
import { NoiseOverlay } from '@/components/layout/NoiseOverlay';
import { SkipLink } from '@/components/layout/SkipLink';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Skeleton } from '@/components/ui/Skeleton';

// Route-level code splitting via React.lazy
const HomePage = lazy(() => import('@/routes/HomePage'));
const CatalogPage = lazy(() => import('@/routes/CatalogPage'));
const ProductPage = lazy(() => import('@/routes/ProductPage'));
const SignInPage = lazy(() => import('@/routes/SignInPage'));
const SignUpPage = lazy(() => import('@/routes/SignUpPage'));
const NotFoundPage = lazy(() => import('@/routes/NotFoundPage'));

// Dashboards
const DashboardLayout = lazy(() => import('@/routes/dashboard/DashboardLayout'));
const BuyerDashboard = lazy(() => import('@/routes/dashboard/BuyerDashboard'));
const SellerDashboard = lazy(() => import('@/routes/dashboard/SellerDashboard'));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
    <Skeleton className="h-10 w-48 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-64 rounded-card" />
      <Skeleton className="h-64 rounded-card" />
      <Skeleton className="h-64 rounded-card" />
    </div>
  </div>
);

// Route wrapper to conditionally render standard public layout vs dashboard layout
const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAuthRoute = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans relative selection:bg-gold/30 selection:text-white">
      <NoiseOverlay />
      <SkipLink />

      {!isDashboardRoute && !isAuthRoute && (
        <>
          <AnnouncementBar />
          <Navbar />
        </>
      )}

      <div id="main-content" className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes location={location}>
                {/* Public Marketplace Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardLayout />
                    </RequireAuth>
                  }
                >
                  <Route
                    path="buyer"
                    element={
                      <RequireAuth allowedRole="buyer">
                        <BuyerDashboard />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="seller"
                    element={
                      <RequireAuth allowedRole="seller">
                        <SellerDashboard />
                      </RequireAuth>
                    }
                  />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {!isDashboardRoute && !isAuthRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </MotionConfig>
  );
};

export default App;
