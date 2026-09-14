import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PRODUCTS } from '../data/products';
import { DEFAULT_STORES } from '../data/stores';
import { DEFAULT_CONTENT, DEFAULT_SETTINGS } from '../data/siteContent';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('khatra_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem('khatra_stores');
      return saved ? JSON.parse(saved) : DEFAULT_STORES;
    } catch {
      return DEFAULT_STORES;
    }
  });

  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem('khatra_content');
      return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('khatra_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return sessionStorage.getItem('khatra_admin_auth') === 'true' ? { username: 'khatra' } : null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('khatra_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('khatra_stores', JSON.stringify(stores));
    } catch (e) {
      console.error(e);
    }
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem('khatra_content', JSON.stringify(content));
    } catch (e) {
      console.error(e);
    }
  }, [content]);

  useEffect(() => {
    try {
      localStorage.setItem('khatra_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = (username, password) => {
    if (username === 'khatra' && password === 'khatra2026') {
      setUser({ username: 'khatra' });
      sessionStorage.setItem('khatra_admin_auth', 'true');
      showToast('Connexion réussie');
      return { success: true };
    }
    return { success: false, message: 'Identifiants invalides' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('khatra_admin_auth');
    showToast('Déconnexion effectuée');
  };

  const addProduct = (prod) => {
    const newProd = {
      ...prod,
      id: 'p_' + Date.now(),
      slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };
    setProducts(prev => [newProd, ...prev]);
    showToast('Produit ajouté avec succès');
  };

  const updateProduct = (id, updated) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Produit mis à jour');
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Produit supprimé', 'error');
  };

  const addStore = (store) => {
    const newStore = { ...store, id: 's_' + Date.now() };
    setStores(prev => [newStore, ...prev]);
    showToast('Point de vente ajouté');
  };

  const updateStore = (id, updated) => {
    setStores(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
    showToast('Point de vente mis à jour');
  };

  const deleteStore = (id) => {
    setStores(prev => prev.filter(s => s.id !== id));
    showToast('Point de vente supprimé', 'error');
  };

  const updateContent = (fields) => {
    setContent(prev => ({ ...prev, ...fields }));
    showToast('Contenu mis à jour');
  };

  const updateSettings = (fields) => {
    setSettings(prev => ({ ...prev, ...fields }));
    showToast('Paramètres mis à jour');
  };

  return (
    <DataContext.Provider
      value={{
        products,
        stores,
        content,
        settings,
        user,
        toast,
        showToast,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        addStore,
        updateStore,
        deleteStore,
        updateContent,
        updateSettings
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
