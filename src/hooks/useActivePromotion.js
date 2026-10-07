import { useEffect, useState } from 'react';

export function useActivePromotion(product) {
  const [now, setNow] = useState(Date.now());
  const expiration = product?.promoExpiresAt ? new Date(product.promoExpiresAt).getTime() : 0;

  useEffect(() => {
    if (!product?.promoActive || !Number.isFinite(expiration) || expiration <= Date.now()) return undefined;
    const timer = window.setTimeout(() => setNow(Date.now()), expiration - Date.now() + 1);
    return () => window.clearTimeout(timer);
  }, [expiration, product?.promoActive]);

  return product?.promoActive === true
    && Number(product.promo) > 0
    && Number(product.promo) < 100
    && Number.isFinite(expiration)
    && expiration > now;
}
