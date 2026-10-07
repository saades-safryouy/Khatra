import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight, Building2, MapPin, MessageSquare, Package, RefreshCw, Star, Store, Tags,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Skeleton } from '../../components/ui';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import analyticsApi from '../../services/analyticsApi';

/* numbers count up once on load (skipped for reduced-motion users) */
function useCountUp(target, duration = 700) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce || typeof target !== 'number') {
      setValue(target);
      return undefined;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);
  return value;
}

function MetricCard({ label, value, icon: Icon, onClick }) {
  const shown = useCountUp(value);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}. Open ${label}`}
      className="k-card group relative w-full p-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#091bc2]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091bc2]/40"
    >
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#172be5]/10 text-[#1640e8] transition group-hover:bg-[#1350e0] group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 -translate-x-1 translate-y-1 text-[#1b49e2] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
        {typeof shown === 'number' ? shown.toLocaleString() : shown}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
    </button>
  );
}

function Stars({ rating }) {
  const full = Math.round(rating || 0);
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < full ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAnalytics(await analyticsApi.overview());
      setUpdatedAt(new Date());
    } catch (loadError) {
      // keep showing the previous data if a refresh fails
      setError(loadError.uiMessage || 'Unable to load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // one defensive pass so a missing field can never crash the page
  const stats = useMemo(() => {
    if (!analytics) return null;
    const byCategory = analytics.products?.byCategory ?? [];
    const byStatus = analytics.products?.byStatus ?? {};
    const byCity = analytics.locations?.byCity ?? {};
    const inquiriesByType = analytics.inquiries?.byType ?? [];
    const statusTotal = Object.values(byStatus).reduce((s, v) => s + (Number(v) || 0), 0);
    const active = Number(byStatus.ACTIVE ?? byStatus.active);
    return {
      products: analytics.products?.total ?? 0,
      byCategory,
      byStatus,
      byCity,
      pointsOfSale: analytics.locations?.pointsOfSale ?? 0,
      locationsTotal: analytics.locations?.total ?? 0,
      inquiriesByType,
      inquiries: inquiriesByType.reduce((sum, e) => sum + e.count, 0),
      franchises: analytics.franchises?.total ?? 0,
      google: analytics.googleReviews ?? { available: false },
      topCity: Object.entries(byCity).sort((a, b) => b[1] - a[1])[0],
      topCategory: [...byCategory].sort((a, b) => b.count - a.count)[0],
      activeShare: Number.isFinite(active) && statusTotal > 0 ? Math.round((active / statusTotal) * 100) : null,
    };
  }, [analytics]);

  const overviewCards = stats
    ? [
        { label: 'Products', value: stats.products, icon: Package, link: '/admin/products' },
        { label: 'Categories', value: stats.byCategory.length, icon: Tags, link: '/admin/categories' },
        { label: 'Points of sale', value: stats.pointsOfSale, icon: Store, link: '/admin/stores' },
        { label: 'Locations', value: stats.locationsTotal, icon: MapPin, link: '/admin/locations' },
        { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare, link: '/admin/inquiries' },
        { label: 'Franchises', value: stats.franchises, icon: Building2, link: '/admin/franchises' },
      ]
    : [];

  const fade = reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

  return (
    <motion.div {...fade}>
      {/* header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#000000]">
            {new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {greeting()}, {user?.firstName || 'Admin'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">A quick overview of your Khatra workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          {updatedAt && (
            <span className="hidden text-xs text-slate-400 sm:inline" aria-live="polite">
              Updated {new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(updatedAt)}
            </span>
          )}
          <Button variant="secondary" onClick={loadAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={loadAnalytics} disabled={loading}>Retry</Button>
        </div>
      )}

      {loading && !stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="k-card p-5" key={index}><Skeleton count={2} /></div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {overviewCards.map(({ label, value, icon, link }, index) => (
              <motion.div
                key={label}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <MetricCard label={label} value={value} icon={icon} onClick={() => navigate(link)} />
              </motion.div>
            ))}
          </div>

          {/* insights */}
          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3" aria-label="Highlights">
            <div className="k-card flex items-center gap-4 p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
                <Star className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">Google rating</p>
                {stats.google.available && stats.google.rating !== null ? (
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xl font-semibold text-slate-950">{stats.google.rating.toFixed(1)}</p>
                    <Stars rating={stats.google.rating} />
                  </div>
                ) : (
                  <p className="mt-1 text-xl font-semibold text-slate-950">
                    {stats.google.available ? 'Unavailable' : 'Not configured'}
                  </p>
                )}
                {stats.google.available && stats.google.reviewCount != null && (
                  <p className="text-xs text-slate-500">{stats.google.reviewCount} Google reviews</p>
                )}
              </div>
            </div>

            <div className="k-card p-5">
              <p className="text-sm font-medium text-slate-700">Network coverage</p>
              <p className="mt-1 text-xl font-semibold text-slate-950">
                {Object.keys(stats.byCity).length} {Object.keys(stats.byCity).length === 1 ? 'city' : 'cities'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats.topCity
                  ? `Most locations in ${stats.topCity[0]} (${stats.topCity[1]}) · ${stats.pointsOfSale} points of sale`
                  : `${stats.pointsOfSale} points of sale across ${stats.locationsTotal} locations`}
              </p>
            </div>

            <div className="k-card p-5">
              <p className="text-sm font-medium text-slate-700">Catalogue health</p>
              {stats.activeShare !== null ? (
                <>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-xl font-semibold text-slate-950">{stats.activeShare}%</p>
                    <p className="text-xs text-slate-500">of products active</p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${stats.activeShare}% of products are active`}>
                    <div className="h-full rounded-full bg-[#2929a4] transition-all duration-700" style={{ width: `${stats.activeShare}%` }} />
                  </div>
                </>
              ) : (
                <p className="mt-1 text-xl font-semibold text-slate-950">{stats.products} products</p>
              )}
              {stats.topCategory && (
                <p className="mt-2 text-xs text-slate-500">
                  Largest category: {stats.topCategory.name} ({stats.topCategory.count})
                </p>
              )}
            </div>
          </section>

          {/* charts */}
          <section className="mt-8" aria-labelledby="analytics-heading">
            <div className="mb-4">
              <h2 id="analytics-heading" className="text-lg font-semibold text-slate-950">Analytics</h2>
              <p className="mt-1 text-sm text-slate-500">Live summaries from the Khatra database.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <AnalyticsChart
                title="Products by category"
                type="pie"
                data={stats.byCategory.map(({ name, count }) => ({ name, value: count }))}
              />
              <AnalyticsChart
                title="Products by status"
                data={Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }))}
              />
              <AnalyticsChart
                title="Locations by city"
                data={Object.entries(stats.byCity).map(([name, value]) => ({ name, value }))}
              />
              <AnalyticsChart
                title="Inquiries by type"
                type="pie"
                note="The database does not currently distinguish Coffee Shop and Khatra Market franchise inquiries."
                data={stats.inquiriesByType.map(({ type, count }) => ({ name: type, value: count }))}
              />
            </div>
          </section>
        </>
      ) : (
        !error && <div className="k-card p-8 text-center text-sm text-slate-500">No analytics data available.</div>
      )}
    </motion.div>
  );
}