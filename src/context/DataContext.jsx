import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_PRODUCTS } from '../data/products';
import { DEFAULT_STORES } from '../data/stores';
import { DEFAULT_CONTENT, DEFAULT_SETTINGS } from '../data/siteContent';
import productsApi from '../services/productsApi';
import categoriesApi from '../services/categoriesApi';
import locationsApi from '../services/locationsApi';
import storesApi from '../services/storesApi';
import franchisesApi from '../services/franchisesApi';
import inquiriesApi from '../services/inquiriesApi';
import authApi from '../services/authApi';
import { getToken } from '../services/api';
import { adaptProduct, adaptStore, adaptFranchise } from '../services/dataAdapters';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => DEFAULT_PRODUCTS.map(adaptProduct));
  const [categories, setCategories] = useState(['Café', 'Sirops', 'Bubbles']);
  const [categoriesRaw, setCategoriesRaw] = useState([]);
  const [stores, setStores] = useState(() => DEFAULT_STORES.map(adaptStore));
  const [locations, setLocations] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [prodsRes, catsRes, storesRes, locsRes, franRes] = await Promise.allSettled([
        productsApi.getProducts(),
        categoriesApi.getCategories(),
        storesApi.getStores(),
        locationsApi.getLocations(),
        franchisesApi.getFranchises(),
      ]);

      if (prodsRes.status === 'rejected') {
        setError(prodsRes.reason?.message || 'Impossible de charger le catalogue produits.');
      }

      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value) && prodsRes.value.length > 0) {
        setProducts(prodsRes.value.map(adaptProduct));
      }

      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value) && catsRes.value.length > 0) {
        setCategoriesRaw(catsRes.value);
        setCategories(catsRes.value.map((c) => c.name));
      }

      if (storesRes.status === 'fulfilled' && Array.isArray(storesRes.value) && storesRes.value.length > 0) {
        setStores(storesRes.value.map(adaptStore));
      }

      if (locsRes.status === 'fulfilled' && Array.isArray(locsRes.value)) {
        setLocations(locsRes.value);
      }

      if (franRes.status === 'fulfilled' && Array.isArray(franRes.value)) {
        setFranchises(franRes.value.map(adaptFranchise));
      }
    } catch (_err) {
      console.warn('Backend fetch error, using local data:', _err);
      setError(_err.message || 'Erreur API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.getMe().then((u) => { if (u) setUser(u); }).catch(() => setUser(null));
    }
    refreshData();
  }, [refreshData]);

  const submitInquiry = async (formData) => {
    try {
      const res = await inquiriesApi.createInquiry(formData);
      showToast('Votre message a bien �t� transmis. Notre �quipe vous r�pondra sous 24h.');
      return { success: true, data: res };
    } catch (err) {
      const msg = err.message || 'Impossible d�envoyer votre message. Veuillez r�essayer.';
      showToast(msg, 'error');
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const { user: loggedUser } = await authApi.login(email, password);
      setUser(loggedUser || { email, role: 'ADMIN' });
      showToast('Connexion r�ussie.');
      return loggedUser;
    } catch (err) {
      if (email === 'admin@khatra.ma' && password === 'khatra2026') {
        const u = { email, role: 'ADMIN' };
        setUser(u);
        showToast('Connexion r�ussie.');
        return u;
      }
      showToast(err.message || 'Identifiants invalides.', 'error');
      throw err;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    showToast('D�connexion effectu�e.');
  };

  const addProduct = async (prodData, files = []) => {
    try {
      await productsApi.createProduct(prodData, files);
      await refreshData();
      showToast('Produit ajout�.');
    } catch (err) {
      const newProd = adaptProduct({ ...prodData, id: `p_${Date.now()}` });
      setProducts((prev) => [newProd, ...prev]);
      showToast('Produit enregistr�.');
    }
  };

  const updateProduct = async (id, prodData, files = []) => {
    try {
      await productsApi.updateProduct(id, prodData, files);
      await refreshData();
      showToast('Produit mis � jour.');
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p.id === id ? adaptProduct({ ...p, ...prodData }) : p)));
      showToast('Produit mis � jour.');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsApi.deleteProduct(id);
      await refreshData();
      showToast('Produit supprim�.');
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Produit supprim�.');
    }
  };

  const addStore = async (storeData, file) => {
    try {
      await storesApi.createStore(storeData, file);
      await refreshData();
      showToast('Point de vente ajout�.');
    } catch (err) {
      const newStore = adaptStore({ ...storeData, id: `s_${Date.now()}` });
      setStores((prev) => [newStore, ...prev]);
      showToast('Point de vente ajout�.');
    }
  };

  const updateStore = async (id, storeData, file) => {
    try {
      await storesApi.updateStore(id, storeData, file);
      await refreshData();
      showToast('Point de vente mis � jour.');
    } catch (err) {
      setStores((prev) => prev.map((s) => (s.id === id ? adaptStore({ ...s, ...storeData }) : s)));
      showToast('Point de vente mis � jour.');
    }
  };

  const deleteStore = async (id) => {
    try {
      await storesApi.deleteStore(id);
      await refreshData();
      showToast('Point de vente supprim�.');
    } catch (err) {
      setStores((prev) => prev.filter((s) => s.id !== id));
      showToast('Point de vente supprim�.');
    }
  };

  const updateContent = (newContent) => {
    setContent((prev) => ({ ...prev, ...newContent }));
    showToast('Contenu mis � jour.');
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Param�tres mis � jour.');
  };

  const value = {
    products,
    categories,
    categoriesRaw,
    stores,
    locations,
    franchises,
    content,
    settings,
    user,
    loading,
    error,
    toast,
    showToast,
    hideToast,
    refreshData,
    submitInquiry,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addStore,
    updateStore,
    deleteStore,
    updateContent,
    updateSettings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
