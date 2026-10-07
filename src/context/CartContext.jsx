import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { resolveImageUrl } from '../services/api';
import { CartContext } from './cartStore';

const STORAGE_KEY = 'khatra_inquiry_cart';

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((item) =>
      item && item.id !== undefined && typeof item.name === 'string'
      && item.price !== null && item.price !== undefined && item.price !== '' && Number.isFinite(Number(item.price)) && Number(item.price) >= 0
      && Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0 && Number(item.quantity) <= 10000
    ).map((item) => ({
      id: item.id,
      name: item.name,
      image: typeof item.image === 'string' ? item.image : '',
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));
  } catch (error) {
    console.warn('Unable to restore the saved Khatra inquiry cart.', error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Unable to persist the Khatra inquiry cart.', error);
    }
  }, [items]);

  const addProduct = useCallback((product) => {
    if (product?.price === null || product?.price === undefined || product?.price === '') return false;
    const price = Number(product?.price);
    if (!product || product.id === undefined || !Number.isFinite(price) || price < 0) return false;
    const existing = items.find((item) => String(item.id) === String(product.id));
    if (existing && existing.quantity >= 10000) return false;
    setItems((current) => {
      const existing = current.find((item) => String(item.id) === String(product.id));
      if (existing) {
        return current.map((item) => String(item.id) === String(product.id)
          ? { ...item, name: product.name, image: product.img || item.image, price, quantity: item.quantity + 1 }
          : item);
      }
      return [...current, {
        id: product.id,
        name: product.name,
        image: product.img || '',
        price,
        quantity: 1,
      }];
    });
    return true;
  }, [items]);

  const removeProduct = useCallback((id) => {
    setItems((current) => current.filter((item) => String(item.id) !== String(id)));
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    const nextQuantity = Number(quantity);
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1 || nextQuantity > 10000) return false;
    setItems((current) => current.map((item) => String(item.id) === String(id)
      ? { ...item, quantity: nextQuantity }
      : item));
    return true;
  }, []);

  const syncProducts = useCallback((products) => {
    const byId = new Map(products.map((product) => [String(product.productId), product]));
    setItems((current) => {
      let changed = false;
      const next = current.map((item) => {
        const product = byId.get(String(item.id));
        if (!product) return item;
        const updated = {
          ...item,
          name: product.productName,
          image: product.productImage ? resolveImageUrl(product.productImage) : item.image,
          price: Number(product.unitPrice),
        };
        if (updated.name === item.name && updated.image === item.image && updated.price === item.price) return item;
        changed = true;
        return updated;
      });
      return changed ? next : current;
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    total: items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0) / 100,
    addProduct,
    removeProduct,
    setQuantity,
    syncProducts,
    clearCart,
  }), [items, addProduct, removeProduct, setQuantity, syncProducts, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
