import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, MessageSquare, Package, Store, Tags } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { categoryApi } from '../../services/categoryApi';
import { productApi } from '../../services/productApi';
import { storeApi } from '../../services/storeApi';
import { locationApi } from '../../services/locationApi';
import { inquiryApi } from '../../services/inquiryApi';
import { franchiseApi } from '../../services/franchiseApi';
import { Skeleton } from '../../components/ui';

const cards = [
  { label: 'Products', key: 'products', link: '/admin/products', icon: Package }, { label: 'Categories', key: 'categories', link: '/admin/categories', icon: Tags },
  { label: 'Stores', key: 'stores', link: '/admin/stores', icon: Store }, { label: 'Locations', key: 'locations', link: '/admin/locations', icon: MapPin },
  { label: 'Inquiries', key: 'inquiries', link: '/admin/inquiries', icon: MessageSquare }, { label: 'Franchises', key: 'franchises', link: '/admin/franchises', icon: Building2 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  useEffect(() => { async function load() { try { const [categories, products, stores, locations, inquiries, franchises] = await Promise.all([categoryApi.list({ limit: 1 }), productApi.list({ limit: 1 }), storeApi.list({ limit: 1 }), locationApi.list({ limit: 1 }), inquiryApi.list({ limit: 1 }), franchiseApi.list({ limit: 1 })]); setStats({ categories: categories.meta?.total || categories.items?.length || 0, products: products.meta?.total || products.items?.length || 0, stores: stores.meta?.total || stores.items?.length || 0, locations: locations.meta?.total || locations.items?.length || 0, inquiries: inquiries.meta?.total || inquiries.items?.length || 0, franchises: franchises.meta?.total || franchises.items?.length || 0 }); } catch { setStats({}); } } load(); }, []);
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="mb-8"><p className="text-sm text-slate-500">Overview</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Welcome back, {user?.firstName || 'Admin'}</h1><p className="mt-2 text-sm text-slate-500">A quick overview of your Khatra workspace.</p></div>{!stats ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div className="k-card p-5" key={index}><Skeleton count={2} /></div>)}</div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ label, key, link, icon: Icon }, index) => <motion.button key={key} type="button" onClick={() => navigate(link)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="k-card group p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></div><span className="text-sm text-slate-400 group-hover:text-blue-600">Open →</span></div><p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{stats[key] || 0}</p><p className="mt-1 text-sm font-medium text-slate-600">{label}</p></motion.button>)}</div>}</motion.div>;
}
