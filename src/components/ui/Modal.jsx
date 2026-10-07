import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './index';

export function Modal({ title, onClose, children, footer }) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => { setLoading(true); try { await footer?.onConfirm?.(); onClose?.(); } finally { setLoading(false); } };
  return <Dialog.Root open onOpenChange={(open) => !open && !loading && onClose?.()}><Dialog.Portal><Dialog.Overlay asChild><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" /></Dialog.Overlay><Dialog.Content asChild><motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-white p-6 shadow-xl"><div className="mb-5 flex items-center justify-between"><Dialog.Title className="text-lg font-semibold text-slate-950">{title}</Dialog.Title><Dialog.Close asChild><button type="button" aria-label="Fermer" className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></Dialog.Close></div><div className="space-y-4">{children}</div>{footer && <div className="mt-6 flex justify-end gap-3 border-t pt-4"><Dialog.Close asChild><Button variant="secondary" disabled={loading}>Annuler</Button></Dialog.Close><Button onClick={handleConfirm} disabled={loading}>{loading ? 'Enregistrement…' : footer.label || 'Enregistrer'}</Button></div>}</motion.div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
