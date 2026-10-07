import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from '../../components/Icons';
import { useLang } from '../../context/LanguageContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import googleReviewsApi, { GOOGLE_MAPS_LISTING_URL } from '../../services/googleReviewsApi';

const EASE = [0.22, 1, 0.36, 1];

function formatReviewDate(value, lang) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'fr', {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

function ReviewStars({ rating }) {
  if (typeof rating !== 'number' || !Number.isFinite(rating)) return null;
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="google-review-stars" aria-label={`${rating} / 5`}>
      {'★'.repeat(roundedRating)}<span>{'★'.repeat(5 - roundedRating)}</span>
    </span>
  );
}

export function HomeReviews() {
  const { t, lang } = useLang();
  const { ref, isInView } = useScrollReveal();
  const [reviewData, setReviewData] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    googleReviewsApi.getReviews()
      .then((data) => {
        if (active) setReviewData(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const reviews = Array.isArray(reviewData?.reviews) ? reviewData.reviews : [];
  const configured = reviewData?.configured === true;

  return (
    <section className="home-reviews-section" ref={ref} aria-labelledby="home-reviews-title">
      <div className="container">
        <motion.div
          className="home-reviews__header"
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <div>
            <span className="eyebrow">{t('La voix de nos clients')}</span>
            <h2 id="home-reviews-title">{t('Ils parlent de Khatra')}</h2>
            <p>{t('Les expériences partagées par notre communauté sur Google.')}</p>
          </div>
          {configured && (reviewData.rating !== null || reviewData.reviewCount !== null) && (
            <div className="home-reviews__summary" aria-label={t('Note Google')}>
              {reviewData.rating !== null && (
                <>
                  <strong>{reviewData.rating.toFixed(1)}</strong>
                  <ReviewStars rating={reviewData.rating} />
                </>
              )}
              {reviewData.reviewCount !== null && (
                <span>
                  {reviewData.reviewCount} {t('avis Google')}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {reviews.length > 0 ? (
          <div className="home-reviews__grid">
            {reviews.map((review, index) => (
              <motion.article
                key={`${review.publishTime || 'review'}-${index}`}
                className="google-review"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease: EASE, delay: index * 0.1 }}
              >
                <div className="google-review__rating">
                  <ReviewStars rating={review.rating} />
                  {review.publishTime && (
                    <time dateTime={review.publishTime}>
                      {formatReviewDate(review.publishTime, lang)}
                    </time>
                  )}
                </div>
                {review.text && <blockquote>{t(review.text)}</blockquote>}
                {(review.authorPhotoUri || review.authorName) && (
                  <div className="google-review__author">
                    {review.authorPhotoUri && (
                      <img src={review.authorPhotoUri} alt="" loading="lazy" referrerPolicy="no-referrer" />
                    )}
                    {review.authorName && (review.authorUri ? (
                      <a href={review.authorUri} target="_blank" rel="noopener noreferrer">
                        {review.authorName}
                      </a>
                    ) : (
                      <span>{review.authorName}</span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="home-reviews__empty" role="status">
            {loadError
              ? t('Les avis Google ne sont pas disponibles pour le moment.')
              : reviewData && !configured
                ? t('Les avis Google seront affichés ici dès que la connexion officielle sera configurée.')
                : configured
                  ? t('Aucun avis Google n’est disponible pour le moment.')
                  : t('Chargement des avis Google…')}
          </div>
        )}

        <motion.div
          className="home-reviews__footer"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.65, ease: EASE, delay: 0.2 }}
        >
          <a href={GOOGLE_MAPS_LISTING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">
            {t('Voir tous les avis sur Google')} <ArrowRight s={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeReviews;
