import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { ArrowRight, WhatsApp } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import productsIntroImage from '../assets/design/PRODUCTS_bg.jpeg';
import productsApi from '../services/productsApi';
import { adaptProduct } from '../services/dataAdapters';
import { useLang } from '../context/LanguageContext';

const PRODUCTS_PER_PAGE = 12;

export function ProductsPage() {
  const { products, categories: backendCategories, categoriesRaw, settings, loading, error, refreshData } = useData();
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);
  const requestId = useRef(0);

  const categories = useMemo(() => [
    ...new Set([
      'Tout',
      ...(backendCategories || []),
      ...(products || []).map((product) => product.category),
    ]),
  ].filter(Boolean), [backendCategories, products]);

  const categorySlug = useMemo(() => {
    if (activeCategory === 'Tout') return '';
    return categoriesRaw.find((category) => category.name === activeCategory)?.slug
      || activeCategory.toLowerCase();
  }, [activeCategory, categoriesRaw]);

  useEffect(() => {
    const request = ++requestId.current;
    let cancelled = false;

    productsApi.getProductsPage({
      page: currentPage,
      limit: PRODUCTS_PER_PAGE,
      category: categorySlug,
      search: searchQuery.trim(),
    }).then(({ items, meta }) => {
      if (cancelled || request !== requestId.current) return;
      const pages = Number(meta.pages) || 0;
      if (pages > 0 && currentPage > pages) {
        setCurrentPage(pages);
        return;
      }
      setPageData({
        items: items.map(adaptProduct).filter(Boolean),
        meta: {
          ...meta,
          page: Number(meta.page) || currentPage,
          limit: Number(meta.limit) || PRODUCTS_PER_PAGE,
          total: Number(meta.total) || 0,
          pages,
        },
      });
    }).catch((requestError) => {
      if (cancelled || request !== requestId.current) return;
      setPageData(null);
      setPageError(requestError.message || 'Impossible de charger les produits.');
    }).finally(() => {
      if (!cancelled && request === requestId.current) setPageLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [categorySlug, currentPage, retryToken, searchQuery]);

  const fallbackFiltered = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return (products || []).filter((product) => {
      const matchesCategory = activeCategory === 'Tout'
        || product.category === activeCategory
        || product.categorySlug === categorySlug;
      const searchableText = `${product.name || ''} ${product.short || ''} ${product.desc || ''} ${product.reference || ''}`
        .toLocaleLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [activeCategory, categorySlug, products, searchQuery]);

  const totalPages = pageData
    ? pageData.meta.pages
    : Math.ceil(fallbackFiltered.length / PRODUCTS_PER_PAGE);
  const displayPage = pageData
    ? currentPage
    : Math.min(currentPage, Math.max(totalPages, 1));
  const visibleProducts = pageData
    ? pageData.items
    : fallbackFiltered.slice((displayPage - 1) * PRODUCTS_PER_PAGE, displayPage * PRODUCTS_PER_PAGE);
  const resultCount = pageData ? pageData.meta.total : fallbackFiltered.length;

  const waNum = settings?.whatsapp || '212661000000';
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent("Bonjour Khatra, je souhaite recevoir le catalogue tarifaire professionnel B2B.")}`;

  const changeCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setPageLoading(true);
    setPageError(null);
    setPageData(null);
  };

  const changeSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    setPageLoading(true);
    setPageError(null);
    setPageData(null);
  };

  const changePage = (page) => {
    setCurrentPage(page);
    setPageLoading(true);
    setPageError(null);
    setPageData(null);
  };

  const retryCatalogue = () => {
    setRetryToken((value) => value + 1);
    setPageLoading(true);
    setPageError(null);
    setPageData(null);
    refreshData();
  };

  return (
    <div className="products-page">
      <SEO
        title="Catalogue Professionnel B2B"
        description="Découvrez la gamme professionnelle Khatra : grains de café sélectionnés, sirops pour boissons et bubbles de fruits."
      />

      <header className="products-intro">
        <div className="products-intro-bg" aria-hidden="true">
          <img src={productsIntroImage} alt="" fetchPriority="high" />
        </div>
        <div className="products-intro-inner">
          <span className="eyebrow">Catalogue & Épicerie Pro</span>
          <h1>Nos Produits</h1>
          <p>
            Des ingrédients de haute volée pensés pour les baristas, mixologues, salons de thé et concepts de restauration moderne.
          </p>
          <span className="products-intro-index">Khatra · Sélection professionnelle</span>
        </div>
      </header>

      <nav className="products-filters container" aria-label="Filtrer par catégorie">
        <div className="products-filters-list">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => changeCategory(cat)}
              className={`products-filter${activeCategory === cat ? ' is-active' : ''}`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="products-search">
          <span className="sr-only">{t('Rechercher un produit')}</span>
          <input
            type="search"
            value={searchQuery}
            onChange={changeSearch}
            placeholder={t('Rechercher un produit')}
            aria-label={t('Rechercher un produit')}
          />
        </label>
        <span className="products-count" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'référence' : 'références'}
        </span>
      </nav>

      <section className="container products-catalogue" aria-label="Catalogue produits">
        {error && (
          <div className="products-state products-state--notice" role="status">
            <p>Le catalogue est affiché avec les données disponibles. La synchronisation est momentanément indisponible.</p>
            <button type="button" className="btn-text" onClick={retryCatalogue}>Réessayer</button>
          </div>
        )}
        {pageError && !error && (
          <div className="products-state products-state--notice" role="status">
            <p>La pagination en ligne est indisponible. Les produits disponibles sont affichés localement.</p>
            <button type="button" className="btn-text" onClick={retryCatalogue}>Réessayer</button>
          </div>
        )}
        {(loading && products.length === 0) || (pageLoading && !pageData && products.length === 0) ? (
          <div className="products-state" role="status" aria-live="polite">Chargement du catalogue…</div>
        ) : pageLoading && !pageData ? (
          <div className="products-state" role="status" aria-live="polite">Mise à jour des produits…</div>
        ) : visibleProducts.length > 0 ? (
          <>
          <div className="products-grid">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <Pagination
            page={displayPage}
            pages={totalPages}
            onPageChange={changePage}
            disabled={pageLoading}
            t={t}
          />
          </>
        ) : (
          <div className="products-state">
            <h2>{t(searchQuery.trim() ? 'Aucun résultat pour cette recherche' : 'Aucun produit dans cette catégorie')}</h2>
            <p>{t(searchQuery.trim()
              ? 'Essayez un autre terme ou choisissez une catégorie différente.'
              : 'Choisissez une autre catégorie pour parcourir notre sélection professionnelle.')}</p>
            <button type="button" className="btn-text" onClick={() => { setSearchQuery(''); changeCategory('Tout'); }}>
              {t('Voir tout le catalogue')} <ArrowRight s={15} />
            </button>
          </div>
        )}
      </section>

      <motion.section
        className="products-b2b"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container products-b2b-inner">
          <div>
            <span className="eyebrow">Commande volumique & Échantillons</span>
            <h2>Besoin d’un devis sur-mesure ?</h2>
            <p>
              Livraison pro rapide sur tout le Maroc et tarification dégressive par carton / palette.
            </p>
          </div>
          <div className="products-b2b-actions">
            <Link to="/contact" className="btn btn-primary">
              Demander un devis B2B <ArrowRight s={16} />
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsApp s={18} color="#fff" /> Commander via WhatsApp
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default ProductsPage;
