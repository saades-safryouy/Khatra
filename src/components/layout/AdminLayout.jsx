import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Grid2X2, LayoutGrid, LogOut, MapPin, MessageSquare, Package, Store, Tags } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn, initials } from '../../lib/utils';
import khatraLogo from '../../../public/khatra_logo_old.png';

const navigation = [
  { label: 'Overview', to: '/admin/dashboard', icon: Grid2X2 }, { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Tags }, { label: 'Stores', to: '/admin/stores', icon: Store },
  { label: 'Franchises', to: '/admin/franchises', icon: Building2 }, { label: 'Locations', to: '/admin/locations', icon: MapPin },
  { label: 'Inquiries', to: '/admin/inquiries', icon: MessageSquare },
];

export default function AdminLayout({ children }) {       
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/admin/login', { replace: true }); };
  return <div className="min-h-screen bg-slate-50 lg:flex">
    <aside className="flex shrink-0 flex-col border-b bg-white lg:fixed lg:inset-y-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg text-white">
          <img src={khatraLogo} alt="Khatra Logo" />
        </div>
        <div>
          <p className="font-semibold text-slate-950">Khatra</p>
          <p className="text-xs text-slate-500">Admin workspace</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t px-3 py-3 lg:flex-col lg:overflow-visible lg:border-t-0 lg:py-4">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => cn('group relative flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors', isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950')}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto hidden border-t p-3 lg:block">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
            {initials(user?.firstName, user?.lastName, user?.email)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {user?.firstName || 'Administrator'}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
    <main className="min-w-0 flex-1 lg:ml-64"><motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</motion.div></main>
  </div>;
}

