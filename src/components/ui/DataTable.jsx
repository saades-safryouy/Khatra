import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export function DataTable({ columns, data, loading, emptyMessage, onRowClick }) {
  if (loading) return <div className="k-card p-5"><div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-11 animate-pulse rounded bg-slate-100" />)}</div></div>;
  if (!data?.length) return <div className="k-card grid min-h-60 place-items-center p-8 text-center"><div><div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500"><Inbox className="h-5 w-5" /></div><p className="text-sm font-medium text-slate-700">{emptyMessage || 'Aucun enregistrement trouvé'}</p><p className="mt-1 text-sm text-slate-500">Les nouveaux enregistrements apparaîtront ici.</p></div></div>;
  return <div className="k-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead><tr className="border-b bg-slate-50">{columns.map((column) => <th key={column.key} className="px-5 py-3 text-left text-xs font-medium text-slate-500">{column.label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{data.map((row, index) => <motion.tr key={row.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.025, 0.2) }} className={onRowClick ? 'cursor-pointer transition-colors hover:bg-slate-50' : ''} onClick={() => onRowClick?.(row)}>{columns.map((column) => <td key={column.key} className="px-5 py-4 text-slate-700">{column.render ? column.render(row) : row[column.key] ?? '—'}</td>)}</motion.tr>)}</tbody></table></div></div>;
}
