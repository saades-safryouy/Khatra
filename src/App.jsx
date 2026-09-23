import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import ScrollToTop from './components/ScrollToTop';
import Toast from './components/Toast';

// Public Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import FranchisePage from './pages/FranchisePage';
import FranchiseCoffeeShopPage from './pages/FranchiseCoffeeShopPage';
import FranchiseMarketPage from './pages/FranchiseMarketPage';
import LocationsPage from './pages/LocationsPage';
import StoryPage from './pages/StoryPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminProductEdit from './admin/AdminProductEdit';
import AdminStores from './admin/AdminStores';
import AdminContent from './admin/AdminContent';
import AdminSettings from './admin/AdminSettings';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloating />
    </>
  );
}

export function App() {
  return (
    <DataProvider>
      <LanguageProvider>
      <ScrollToTop />
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/produits" element={<ProductsPage />} />
          <Route path="/produits/:slug" element={<ProductDetailPage />} />
          <Route path="/franchise" element={<FranchisePage />} />
          <Route path="/franchise/coffee-shop" element={<FranchiseCoffeeShopPage />} />
          <Route path="/franchise/khatra-market" element={<FranchiseMarketPage />} />
          <Route path="/points-de-vente" element={<LocationsPage />} />
          <Route path="/notre-histoire" element={<StoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductEdit />} />
          <Route path="products/:id/edit" element={<AdminProductEdit />} />
          <Route path="stores" element={<AdminStores />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </LanguageProvider>
    </DataProvider>
  );
}

export default App;
