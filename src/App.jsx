import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
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


function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      {/* <WhatsAppFloating /> */}
    </>
  );
}

export function App() {
  return (
    <DataProvider>
      <ThemeProvider>
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
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </LanguageProvider>
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;
