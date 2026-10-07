import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash, WhatsApp } from '../components/Icons';
import { useCart } from '../context/cartStore';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';
import inquiriesApi from '../services/inquiriesApi';
import SEO from '../components/SEO';

const COPY = {
  fr: {
    title: 'Votre panier professionnel',
    intro: 'Préparez une demande de prix personnalisée. Aucun paiement ne sera effectué.',
    empty: 'Votre panier est vide.',
    browse: 'Découvrir les produits',
    product: 'Produit',
    unitPrice: 'Prix unitaire',
    quantity: 'Quantité',
    lineTotal: 'Total produit',
    remove: 'Retirer',
    totalQty: 'Quantité totale',
    cartTotal: 'Total de la demande',
    customer: 'Vos coordonnées',
    name: 'Nom complet',
    company: 'Entreprise (facultatif)',
    email: 'Adresse e-mail',
    phone: 'Téléphone (facultatif)',
    notes: 'Votre message (facultatif)',
    whatsapp: 'Envoyer via WhatsApp',
    emailAction: 'Envoyer par e-mail',
    sending: 'Envoi en cours…',
    clear: 'Vider le panier',
    sentWa: 'Votre demande a été enregistrée. Ouvrez WhatsApp pour transmettre le récapitulatif.',
    sentEmail: 'Votre demande a été enregistrée et envoyée par e-mail.',
    emailNotConfigured: 'Votre demande est enregistrée, mais l’envoi par e-mail n’est pas configuré sur le serveur. Vous pouvez transmettre le même récapitulatif par WhatsApp.',
    emailFailed: 'Votre demande est enregistrée, mais le serveur n’a pas pu envoyer l’e-mail. Vous pouvez transmettre le même récapitulatif par WhatsApp.',
    error: 'Impossible d’enregistrer la demande. Vérifiez les informations et réessayez.',
    openWhatsApp: 'Continuer sur WhatsApp',
    priceOnRequest: 'Prix sur demande',
  },
  ar: {
    title: 'سلة منتجاتكم المهنية',
    intro: 'أعدّوا طلب أسعار مخصصاً. لن يتم أي دفع.',
    empty: 'سلتكم فارغة.',
    browse: 'اكتشفوا المنتجات',
    product: 'المنتج',
    unitPrice: 'سعر الوحدة',
    quantity: 'الكمية',
    lineTotal: 'إجمالي المنتج',
    remove: 'إزالة',
    totalQty: 'الكمية الإجمالية',
    cartTotal: 'إجمالي الطلب',
    customer: 'معلومات التواصل',
    name: 'الاسم الكامل',
    company: 'الشركة (اختياري)',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف (اختياري)',
    notes: 'رسالتكم (اختياري)',
    whatsapp: 'إرسال عبر واتساب',
    emailAction: 'إرسال بالبريد الإلكتروني',
    sending: 'جارٍ الإرسال…',
    clear: 'إفراغ السلة',
    sentWa: 'تم تسجيل طلبكم. افتحوا واتساب لإرسال الملخص.',
    sentEmail: 'تم تسجيل طلبكم وإرساله بالبريد الإلكتروني.',
    emailNotConfigured: 'تم تسجيل الطلب، لكن البريد الإلكتروني غير مهيأ على الخادم. يمكنكم إرسال الملخص نفسه عبر واتساب.',
    emailFailed: 'تم تسجيل الطلب، لكن الخادم لم يتمكن من إرسال البريد الإلكتروني. يمكنكم إرسال الملخص نفسه عبر واتساب.',
    error: 'تعذر تسجيل الطلب. تحققوا من المعلومات وحاولوا مجدداً.',
    openWhatsApp: 'المتابعة عبر واتساب',
    priceOnRequest: 'السعر عند الطلب',
  },
};

function formatMoney(value, lang) {
  return `${new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} MAD`;
}

function makeWhatsAppUrl(number, message) {
  const phone = String(number || '').replace(/\D/g, '');
  if (!phone) return '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function CartPage() {
  const { items, count, total, removeProduct, setQuantity, syncProducts, clearCart } = useCart();
  const { settings } = useData();
  const { lang } = useLang();
  const text = COPY[lang] || COPY.fr;
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [quoteState, setQuoteState] = useState({ signature: '', error: '' });
  const [quoteRefresh, setQuoteRefresh] = useState(0);
  const cartSignature = JSON.stringify(items.map(({ id, quantity }) => ({ productId: id, quantity })));
  const quoteRequestKey = `${cartSignature}:${lang}:${quoteRefresh}`;
  const quoteLoading = items.length > 0 && quoteState.signature !== quoteRequestKey;
  const quoteError = items.length > 0 && quoteState.signature === quoteRequestKey ? quoteState.error : '';

  useEffect(() => {
    const requestedItems = JSON.parse(cartSignature);
    if (!requestedItems.length) return undefined;
    let active = true;
    inquiriesApi.quoteCart(requestedItems, lang)
      .then((quote) => {
        if (!active) return;
        syncProducts(quote.items || []);
        setQuoteState({ signature: quoteRequestKey, error: '' });
      })
      .catch((error) => {
        if (active) setQuoteState({ signature: quoteRequestKey, error: error.message || text.error });
      });
    return () => { active = false; };
  }, [cartSignature, items.length, lang, quoteRequestKey, syncProducts, text.error]);

  useEffect(() => {
    if (!items.length) return undefined;
    const now = Date.now();
    const expiries = items
      .filter((item) => item.promo !== null && item.promo !== undefined)
      .map((item) => new Date(item.promoExpiresAt).getTime())
      .filter((time) => Number.isFinite(time) && time > now);
    const nextExpiry = expiries.length ? Math.min(...expiries) - now : 60_000;
    const timer = window.setTimeout(() => setQuoteRefresh((value) => value + 1), Math.max(0, Math.min(nextExpiry, 60_000)));
    return () => window.clearTimeout(timer);
  }, [items]);

  const submit = async (channel, event) => {
    event.preventDefault();
    if (event.type === 'click' && !event.currentTarget.form?.reportValidity()) return;
    if (submitting || quoteLoading || quoteError || !items.length) return;
    setSubmitting(true);
    setFeedback(null);
    setWhatsappUrl('');
    try {
      const result = await inquiriesApi.createInquiry({
        type: 'PRODUCT',
        channel,
        language: lang,
        ...form,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });
      const summary = result?.summary || result?.inquiry?.message || '';
      setWhatsappUrl(makeWhatsAppUrl(settings?.whatsapp, summary));
      const delivery = result?.emailDelivery;
      setEmailSent(delivery?.sent === true);
      setFeedback(channel === 'email'
        ? delivery?.sent ? text.sentEmail : delivery?.configured ? text.emailFailed : text.emailNotConfigured
        : text.sentWa);
      clearCart();
    } catch (error) {
      setFeedback(error.message || text.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="cart-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <SEO title={text.title} description={text.intro} />
      <div className="container">
        <div className="cart-heading">
          <span className="eyebrow">Khatra · B2B</span>
          <h1>{text.title}</h1>
          <p>{text.intro}</p>
        </div>

        {!items.length ? (
          <section className="cart-empty">
            <p>{feedback || text.empty}</p>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsApp s={18} color="#fff" /> {text.openWhatsApp}
              </a>
            )}
            <Link to="/produits" className="btn btn-primary">{text.browse}</Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-panel" aria-label={text.product}>
              <div className="cart-table-head">
                <span>{text.product}</span><span>{text.unitPrice}</span><span>{text.quantity}</span><span>{text.lineTotal}</span><span />
              </div>
              {items.map((item) => (
                <article className="cart-row" key={item.id}>
                  <div className="cart-product">
                    {item.image && <img src={item.image} alt="" />}
                    <strong>{item.name}</strong>
                  </div>
                  <span className="cart-unit-price" data-label={text.unitPrice}>
                    {item.promo !== null && item.promo !== undefined && new Date(item.promoExpiresAt).getTime() > Date.now() && (
                      <del>{formatMoney(item.originalPrice, lang)}</del>
                    )}
                    <strong>{formatMoney(item.price, lang)}</strong>
                    {item.promo !== null && item.promo !== undefined && new Date(item.promoExpiresAt).getTime() > Date.now()
                      && <span className="product-promo-badge">-{item.promo}%</span>}
                  </span>
                  <div className="cart-quantity" data-label={text.quantity}>
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={lang === 'ar' ? 'تقليل الكمية' : 'Diminuer la quantité'}>−</button>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={item.quantity}
                      onChange={(event) => setQuantity(item.id, event.target.value)}
                      aria-label={`${text.quantity} — ${item.name}`}
                    />
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= 10000} aria-label={lang === 'ar' ? 'زيادة الكمية' : 'Augmenter la quantité'}>+</button>
                  </div>
                  <strong className="cart-line-total" data-label={text.lineTotal}>{formatMoney(Math.round(item.price * 100) * item.quantity / 100, lang)}</strong>
                  <button type="button" className="cart-remove" onClick={() => removeProduct(item.id)} aria-label={`${text.remove} ${item.name}`}>
                    <Trash s={17} />
                  </button>
                </article>
              ))}
              <div className="cart-clear-wrap">
                <button type="button" className="cart-clear" onClick={clearCart}>{text.clear}</button>
              </div>
            </section>

            <aside className="cart-summary-panel">
              <h2>{text.cartTotal}</h2>
              <div className="cart-summary-line"><span>{text.totalQty}</span><strong>{count}</strong></div>
              <div className="cart-summary-line cart-summary-total"><span>{text.cartTotal}</span><strong>{formatMoney(total, lang)}</strong></div>
              <form onSubmit={(event) => submit('whatsapp', event)} className="cart-inquiry-form">
                <h3>{text.customer}</h3>
                <label>{text.name}<input required maxLength="200" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
                <label>{text.company}<input maxLength="200" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></label>
                <label>{text.email}<input required type="email" maxLength="255" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
                <label>{text.phone}<input type="tel" maxLength="50" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
                <label>{text.notes}<textarea rows="3" maxLength="2000" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
                {quoteLoading && <p className="cart-feedback" role="status">{lang === 'ar' ? 'جارٍ تحديث الأسعار من الكتالوج…' : 'Actualisation des prix du catalogue…'}</p>}
                {quoteError && <p className="cart-feedback" role="alert">{quoteError}</p>}
                {feedback && <p className={`cart-feedback${emailSent || feedback === text.sentWa ? ' is-success' : ''}`} role="status">{feedback}</p>}
                {whatsappUrl && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp cart-action">
                    <WhatsApp s={18} color="#fff" /> {text.openWhatsApp}
                  </a>
                )}
                <button type="submit" className="btn btn-whatsapp cart-action" disabled={submitting || quoteLoading || Boolean(quoteError)}>
                  <WhatsApp s={18} color="#fff" /> {submitting || quoteLoading ? text.sending : text.whatsapp}
                </button>
                <button type="button" className="btn btn-outline cart-action" disabled={submitting || quoteLoading || Boolean(quoteError)} onClick={(event) => submit('email', event)}>
                  {submitting || quoteLoading ? text.sending : text.emailAction}
                </button>
              </form>
            </aside>
          </div>
        )}
        <Link to="/produits" className="cart-back-link"><ArrowLeft s={16} /> {text.browse}</Link>
      </div>
    </main>
  );
}
