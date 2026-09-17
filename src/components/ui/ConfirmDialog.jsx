import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, LoaderCircle, X } from 'lucide-react';
import { Button } from './index';
import { useToast } from './index';

export function ConfirmDialog({ title = 'Confirm action', message, confirmLabel = 'Delete', variant = 'danger', onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleConfirm = async () => { setLoading(true); try { await onConfirm?.(); onClose?.(); } catch (error) { toast(error?.uiMessage || error?.message || 'Unable to complete this action', 'error'); } finally { setLoading(false); } };
  return <Dialog.Root open onOpenChange={(open) => !open && !loading && onClose?.()}><Dialog.Portal><AnimatePresence><Dialog.Overlay asChild><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" /></Dialog.Overlay><Dialog.Content asChild><motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-6 shadow-xl"><div className="mb-4 flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></div><Dialog.Close asChild><button type="button" disabled={loading} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button></Dialog.Close></div><Dialog.Title className="text-lg font-semibold text-slate-950">{title}</Dialog.Title><Dialog.Description className="mt-2 text-sm leading-6 text-slate-500">{message}</Dialog.Description><div className="mt-6 flex justify-end gap-3"><Dialog.Close asChild><Button variant="secondary" disabled={loading}>Cancel</Button></Dialog.Close><Button variant={variant} onClick={handleConfirm} disabled={loading}>{loading && <LoaderCircle className="h-4 w-4 animate-spin" />}{loading ? 'Working...' : confirmLabel}</Button></div></motion.div></Dialog.Content></AnimatePresence></Dialog.Portal></Dialog.Root>;
}

