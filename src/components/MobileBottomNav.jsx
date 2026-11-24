import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, Package, ShoppingBag, MapPin } from './Icons';
import { useCart } from '../context/cartStore';
import { useLang } from '../context/LanguageContext';

/**
 * App-style bottom navigation for phones. Rendered always, but the
 * .mobile-bottom-nav styles in frontend.css (§16) keep it display:none
 * above 768px — desktop never sees it.
 */
export function MobileBottomNav() {
  const { count } = useCart();
  const { t } = useLang();

  const itemClass = ({ isActive }) => `mobile-bottom-nav__item${isActive ? ' is-active' : ''}`;

  return (
    <nav className="mobile-bottom-nav" aria-label={t('Navigation')}>
      <NavLink to="/" end className={itemClass}>
        <Store s={22} />
        <span>{t('Accueil')}</span>
      </NavLink>
      <NavLink to="/produits" className={itemClass}>
        <Package s={22} />
        <span>{t('Produits')}</span>
      </NavLink>
      <NavLink to="/panier" className={itemClass} aria-label={`Panier, ${count} article${count === 1 ? '' : 's'}`}>
        <span className="mobile-bottom-nav__icon">
          <ShoppingBag s={22} />
          {count > 0 && (
            <span className="mobile-bottom-nav__badge">{count > 99 ? '99+' : count}</span>
          )}
        </span>
        <span>{t('Panier')}</span>
      </NavLink>
      <NavLink to="/points-de-vente" className={itemClass}>
        <MapPin s={22} />
        <span>{t('Magasins')}</span>
      </NavLink>
    </nav>
  );
}

export default MobileBottomNav;
