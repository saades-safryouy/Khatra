import React from 'react';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = React.createContext(null);

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: { primary: 'bg-blue-600 text-white hover:bg-blue-700', secondary: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100', ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-950', danger: 'bg-red-600 text-white hover:bg-red-700' },
      size: { default: 'h-10 px-4 py-2', sm: 'h-8 px-3 text-xs', icon: 'h-10 w-10' },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

export function Button({ children, variant = 'primary', size, onClick, type = 'button', disabled, className, icon, asChild = false, ...props }) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild && React.isValidElement(children)) return React.cloneElement(children, { ...props, className: cn(classes, children.props.className) });
  return <button type={type} onClick={onClick} disabled={disabled} className={classes} {...props}>{icon}{children}</button>;
}

export function Badge({ children, variant = 'default', className }) {
  const styles = { default: 'border-slate-200 bg-slate-100 text-slate-700', success: 'border-emerald-200 bg-emerald-50 text-emerald-700', warning: 'border-amber-200 bg-amber-50 text-amber-700', danger: 'border-red-200 bg-red-50 text-red-700', info: 'border-blue-200 bg-blue-50 text-blue-700' };
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', styles[variant] || styles.default, className)}>{children}</span>;
}

export function Input({ label, error, hint, id, className, ...props }) {
  const inputId = id || props.name;
  return <div className="space-y-2">{label && <label htmlFor={inputId} className="k-label">{label}</label>}<input id={inputId} className={cn('k-input', error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20', className)} {...props} />{hint && !error && <p className="text-xs text-slate-500">{hint}</p>}{error && <p className="text-xs text-red-600">{error}</p>}</div>;
}

export function Skeleton({ count = 1, className }) { return <div className="space-y-3">{Array.from({ length: count }).map((_, index) => <div key={index} className={cn('h-4 animate-pulse rounded bg-slate-200', className)} />)}</div>; }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const showToast = React.useCallback((message, type = 'success') => { const id = `${Date.now()}-${Math.random()}`; setToasts((current) => [...current, { id, message, type }]); window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000); }, []);
  const dismiss = React.useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
  const tones = { success: 'border-emerald-200 text-emerald-700', error: 'border-red-200 text-red-700', info: 'border-blue-200 text-blue-700' };
  return <ToastContext.Provider value={showToast}>{children}<div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm space-y-3" aria-live="polite"><AnimatePresence>{toasts.map((toast) => { const Icon = icons[toast.type] || Info; return <motion.div key={toast.id} initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 24 }} className={cn('flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg', tones[toast.type] || tones.info)}><Icon className="mt-0.5 h-5 w-5 shrink-0" /><p className="flex-1 text-sm font-medium text-slate-800">{toast.message}</p><button type="button" onClick={() => dismiss(toast.id)} className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss notification"><X className="h-4 w-4" /></button></motion.div>; })}</AnimatePresence></div></ToastContext.Provider>;
}

export function useToast() { const context = React.useContext(ToastContext); if (!context) throw new Error('useToast must be used inside ToastProvider'); return context; }


