import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/adminDashboard/DashboardPage';
import AdminAccountsPage from './pages/adminDashboard/AdminAccountsPage';
import CategoryListPage from './pages/adminDashboard/CategoriesPage';
import CategoryFormPage from './pages/adminDashboard/CategoryFormPage';
import ProductsPage from './pages/adminDashboard/ProductsPage';
import ProductFormPage from './pages/adminDashboard/ProductFormPage';
import StoresPage from './pages/adminDashboard/StoresPage';
import StoreFormPage from './pages/adminDashboard/StoreFormPage';
import FranchisesPage from './pages/adminDashboard/FranchisesPage';
import FranchiseFormPage from './pages/adminDashboard/FranchiseFormPage';
import LocationsPage from './pages/adminDashboard/LocationsPage';
import LocationFormPage from './pages/adminDashboard/LocationFormPage';
import InquiriesPage from './pages/adminDashboard/InquiriesPage';
import InquiryDetailPage from './pages/adminDashboard/InquiryDetailPage';
import DashboardLayout from './components/layout/AdminLayout';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-950">Chargement…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

function MainApp() {
  const { user, loading, restore } = useAuth();

  useEffect(() => {
    // CAVEMAN: app start once. Check saved token once. No token = show login. No redirect loop.
    restore();
  }, [restore]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-950">Chargement de l’application…</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={!user ? <LoginPage /> : <Navigate to="/admin/dashboard" replace />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="accounts" element={<AdminAccountsPage />} />
                
                <Route path="categories" element={<CategoryListPage />} />
                <Route path="categories/new" element={<CategoryFormPage />} />
                <Route path="categories/:id/edit" element={<CategoryFormPage />} />
                
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/:id/edit" element={<ProductFormPage />} />
                
                <Route path="stores" element={<StoresPage />} />
                <Route path="stores/new" element={<StoreFormPage />} />
                <Route path="stores/:id/edit" element={<StoreFormPage />} />
                
                <Route path="franchises" element={<FranchisesPage />} />
                <Route path="franchises/:id/edit" element={<FranchiseFormPage />} />
                
                <Route path="locations" element={<LocationsPage />} />
                <Route path="locations/new" element={<LocationFormPage />} />
                <Route path="locations/:id/edit" element={<LocationFormPage />} />
                
                <Route path="inquiries" element={<InquiriesPage />} />
                <Route path="inquiries/:id" element={<InquiryDetailPage />} />
                
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
