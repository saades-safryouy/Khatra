import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button, Input } from '../ui';

const EMPTY_ACCOUNT = { firstName: '', lastName: '', email: '', password: '' };

export default function AdminAccountDialog({ account, mode, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_ACCOUNT);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(account
      ? { firstName: account.firstName, lastName: account.lastName, email: account.email, password: '' }
      : EMPTY_ACCOUNT);
  }, [account]);

  const setField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (mode === 'password' && form.password.length < 12) {
      setError('Use at least 12 characters for the new password.');
      return;
    }
    if (mode === 'create' && form.password.length < 12) {
      setError('Use at least 12 characters for the initial password.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (submitError) {
      setError(submitError.uiMessage || submitError.message || 'Unable to save administrator.');
    } finally {
      setSaving(false);
    }
  };

  const title = mode === 'create'
    ? 'Create administrator'
    : mode === 'password'
      ? `Change password · ${account?.email}`
      : 'Edit administrator';

  return (
    <Dialog.Root open onOpenChange={(open) => !open && !saving && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border bg-white p-5 shadow-xl sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-950">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-slate-500">
                {mode === 'password'
                  ? 'Choose a unique password of at least 12 characters.'
                  : 'Administrator access is assigned automatically.'}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" disabled={saving} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode !== 'password' && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="First name" name="firstName" autoComplete="given-name" value={form.firstName} onChange={setField} required maxLength={100} />
                  <Input label="Last name" name="lastName" autoComplete="family-name" value={form.lastName} onChange={setField} required maxLength={100} />
                </div>
                <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={setField} required maxLength={255} />
              </>
            )}
            {(mode === 'create' || mode === 'password') && (
              <Input
                label={mode === 'create' ? 'Initial password' : 'New password'}
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={setField}
                required
                minLength={12}
                maxLength={72}
                hint="At least 12 characters."
              />
            )}
            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
            <div className="flex flex-col-reverse justify-end gap-2 border-t pt-4 sm:flex-row">
              <Dialog.Close asChild>
                <Button variant="secondary" disabled={saving}>Cancel</Button>
              </Dialog.Close>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : mode === 'password' ? 'Update password' : mode === 'create' ? 'Create admin' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
