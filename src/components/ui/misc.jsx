import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export function Skeleton({ count = 4, className = '' }) { return <>{Array.from({ length: count }).map((_, index) => <div key={index} className={`h-10 animate-pulse rounded bg-slate-200 ${className}`} />)}</>; }
export function EmptyState({ icon, title = 'No records yet', description, action }) { return <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="k-card p-10 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">{icon || <Inbox className="h-5 w-5" />}</div><h3 className="text-base font-semibold text-slate-900">{title}</h3><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{description || 'Get started by creating your first record.'}</p>{action && <div className="mt-5">{action}</div>}</motion.div>; }
