import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { AlertTriangle, LoaderCircle, X } from 'lucide-react';
import { Button } from './index';
import { useToast } from './index';

// icon colour follows the variant (it was always red before)
const ICON_STYLE = {
  danger: 'bg-red-50 text-red-600',
  primary: 'bg-[#5C1D24]/10 text-[#5C1D24]',
  secondary: 'bg-slate-100 text-slate-600',
};

export function ConfirmDialog({
  title = 'Confirm action',
  message,
  confirmLabel = 'Delete',
  variant = 'danger',
  onClose,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm?.();
      onClose?.();
    } catch (error) {
      toast(error?.uiMessage || error?.message || 'Unable to complete this action', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && !loading && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm"
          />
        </Dialog.Overlay>

        {/* The old box was centred with Tailwind's -translate-x/y-1/2, but framer-motion
            writes its own inline `transform` (scale / y) which REPLACES those classes,
            so the dialog ended up off-centre. A flex wrapper centres it instead and
            leaves the transform free for the animation. */}
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="pointer-events-auto relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xl sm:p-8"
            >
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  aria-label="Close"
                  className="absolute right-3 top-3 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>

              <div
                className={`mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full ${
                  ICON_STYLE[variant] || ICON_STYLE.danger
                }`}
              >
                <AlertTriangle className="h-6 w-6" />
              </div>

              <Dialog.Title className="text-lg font-semibold text-slate-950">{title}</Dialog.Title>
              <Dialog.Description className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {message}
              </Dialog.Description>

              <div className="mt-6 flex flex-col-reverse justify-center gap-3 sm:flex-row">
                <Dialog.Close asChild>
                  <Button variant="secondary" disabled={loading} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  variant={variant}
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {loading ? 'Working...' : confirmLabel}
                </Button>
              </div>
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}