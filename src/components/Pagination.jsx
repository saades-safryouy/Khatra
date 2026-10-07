import React from 'react';
import { ArrowLeft, ArrowRight } from './Icons';

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const items = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push(`ellipsis-${page}`);
    items.push(page);
  });

  return items;
}

export function Pagination({ page, pages, onPageChange, disabled = false, t = (text) => text }) {
  if (pages <= 1) return null;

  return (
    <nav className="pagination" aria-label={t('Pagination des produits')}>
      <button
        type="button"
        className="pagination__control"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label={t('Page précédente')}
      >
        <ArrowLeft s={15} />
        <span>{t('Précédent')}</span>
      </button>

      <div className="pagination__pages" aria-label={t('Pages')}>
        {getPageItems(page, pages).map((item) => (
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              className={`pagination__page${item === page ? ' is-active' : ''}`}
              onClick={() => onPageChange(item)}
              disabled={disabled}
              aria-label={`${t('Page')} ${item}`}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="pagination__ellipsis" aria-hidden="true">…</span>
          )
        ))}
      </div>

      <button
        type="button"
        className="pagination__control"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= pages}
        aria-label={t('Page suivante')}
      >
        <span>{t('Suivant')}</span>
        <ArrowRight s={15} />
      </button>
    </nav>
  );
}

export default Pagination;
