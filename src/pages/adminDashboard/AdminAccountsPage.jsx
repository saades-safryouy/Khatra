import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyRound, Pencil, Plus, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import AdminAccountDialog from '../../components/adminAccounts/AdminAccountDialog';
import { Badge, Button, useToast } from '../../components/ui';
import { DataTable } from '../../components/ui/DataTable';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import adminAccountApi from '../../services/adminAccountApi';

const PAGE_SIZE = 10;

function displayDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}

export default function AdminAccountsPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [accounts, setAccounts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [dialog, setDialog] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await adminAccountApi.list({ page, limit: PAGE_SIZE });
      setAccounts(result.items);
      setMeta(result.meta || { page, pages: 1, total: result.items.length });
    } catch (error) {
      setLoadError(error.uiMessage || 'Unable to load administrator accounts.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const showToastMessage = (message, type = 'success') => {
    if (typeof toast === 'function') toast(message, type);
  };

  const saveAccount = async (form) => {
    if (dialog.mode === 'create') {
      await adminAccountApi.create(form);
      if (page === 1) await loadAccounts();
      else setPage(1);
      showToastMessage('Administrator account created.');
    } else if (dialog.mode === 'edit') {
      await adminAccountApi.update(dialog.account.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });
      showToastMessage('Administrator details updated.');
    } else {
      await adminAccountApi.changePassword(dialog.account.id, form.password);
      showToastMessage('Administrator password updated.');
    }
    if (dialog.mode !== 'create') await loadAccounts();
  };

  const confirmAccountAction = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      if (pendingAction.kind === 'delete') {
        await adminAccountApi.remove(pendingAction.account.id);
        if (accounts.length === 1 && page > 1) setPage((current) => current - 1);
        else await loadAccounts();
        showToastMessage('Administrator account deleted.');
      } else {
        await adminAccountApi.update(pendingAction.account.id, { active: false });
        await loadAccounts();
        showToastMessage('Administrator deactivated.');
      }
      setPendingAction(null);
    } finally {
      setActionLoading(false);
    }
  };

  const activateAccount = async (account) => {
    try {
      await adminAccountApi.update(account.id, { active: true });
      await loadAccounts();
      showToastMessage('Administrator activated.');
    } catch (error) {
      showToastMessage(error.uiMessage || 'Unable to activate administrator.', 'error');
    }
  };

  const columns = useMemo(() => [
    { key: 'name', label: 'Name', render: (account) => <span className="font-medium text-slate-900">{account.firstName} {account.lastName}</span> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: () => <Badge variant="info">ADMIN</Badge> },
    { key: 'active', label: 'Status', render: (account) => <Badge variant={account.active ? 'success' : 'danger'}>{account.active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'createdAt', label: 'Created', render: (account) => displayDate(account.createdAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (account) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label={`Edit ${account.email}`} title="Edit" onClick={() => setDialog({ mode: 'edit', account })}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" aria-label={`Change password for ${account.email}`} title="Change password" onClick={() => setDialog({ mode: 'password', account })}><KeyRound className="h-4 w-4" /></Button>
          {account.active ? (
            <Button variant="ghost" size="icon" aria-label={`Deactivate ${account.email}`} title="Deactivate" disabled={account.id === currentUser?.id} onClick={() => setPendingAction({ kind: 'deactivate', account })}><ShieldOff className="h-4 w-4 text-amber-600" /></Button>
          ) : (
            <Button variant="ghost" size="icon" aria-label={`Activate ${account.email}`} title="Activate" onClick={() => activateAccount(account)}><ShieldCheck className="h-4 w-4 text-emerald-600" /></Button>
          )}
          <Button variant="ghost" size="icon" aria-label={`Delete ${account.email}`} title="Delete" disabled={account.id === currentUser?.id} onClick={() => setPendingAction({ kind: 'delete', account })}><Trash2 className="h-4 w-4 text-red-600" /></Button>
        </div>
      ),
    },
  ], [currentUser?.id]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Security & access</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Admin Accounts</h1>
          <p className="mt-2 text-sm text-slate-500">Manage administrator access and credentials.</p>
        </div>
        <Button onClick={() => setDialog({ mode: 'create', account: null })}><Plus className="h-4 w-4" />Add admin</Button>
      </div>

      {loadError && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <span>{loadError}</span>
          <Button variant="secondary" size="sm" onClick={loadAccounts} disabled={loading}>Retry</Button>
        </div>
      )}

      <div className="mb-3 text-sm text-slate-500" aria-live="polite">
        {loading ? 'Loading administrators…' : `${meta.total || 0} administrator${meta.total === 1 ? '' : 's'}`}
      </div>

      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={accounts}
          loading={loading}
          emptyMessage="No administrator accounts found."
        />
      </div>

      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="k-card space-y-3 p-4"><div className="h-4 animate-pulse rounded bg-slate-100" /><div className="h-4 animate-pulse rounded bg-slate-100" /></div>
        ) : accounts.length ? accounts.map((account) => (
          <article className="k-card p-4" key={account.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-slate-900">{account.firstName} {account.lastName}</h2>
                <p className="mt-1 break-all text-sm text-slate-500">{account.email}</p>
              </div>
              <Badge variant={account.active ? 'success' : 'danger'}>{account.active ? 'Active' : 'Inactive'}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
              <div>
                <Badge variant="info">ADMIN</Badge>
                <p className="mt-2 text-xs text-slate-500">Created {displayDate(account.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" aria-label={`Edit ${account.email}`} onClick={() => setDialog({ mode: 'edit', account })}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" aria-label={`Change password for ${account.email}`} onClick={() => setDialog({ mode: 'password', account })}><KeyRound className="h-4 w-4" /></Button>
                {account.active
                  ? <Button variant="ghost" size="icon" aria-label={`Deactivate ${account.email}`} disabled={account.id === currentUser?.id} onClick={() => setPendingAction({ kind: 'deactivate', account })}><ShieldOff className="h-4 w-4 text-amber-600" /></Button>
                  : <Button variant="ghost" size="icon" aria-label={`Activate ${account.email}`} onClick={() => activateAccount(account)}><ShieldCheck className="h-4 w-4 text-emerald-600" /></Button>}
                <Button variant="ghost" size="icon" aria-label={`Delete ${account.email}`} disabled={account.id === currentUser?.id} onClick={() => setPendingAction({ kind: 'delete', account })}><Trash2 className="h-4 w-4 text-red-600" /></Button>
              </div>
            </div>
          </article>
        )) : (
          <div className="k-card grid min-h-48 place-items-center p-6 text-center text-sm text-slate-500">No administrator accounts found.</div>
        )}
      </div>

      {meta.pages > 1 && (
        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="secondary" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>Previous</Button>
          <span className="text-sm text-slate-500">Page {page} of {meta.pages}</span>
          <Button variant="secondary" disabled={page >= meta.pages || loading} onClick={() => setPage((current) => current + 1)}>Next</Button>
        </div>
      )}

      {dialog && (
        <AdminAccountDialog
          mode={dialog.mode}
          account={dialog.account}
          onClose={() => setDialog(null)}
          onSubmit={saveAccount}
        />
      )}

      {pendingAction && (
        <ConfirmDialog
          title={pendingAction.kind === 'delete' ? 'Delete administrator?' : 'Deactivate administrator?'}
          message={pendingAction.kind === 'delete'
            ? `This permanently removes ${pendingAction.account.email}. This cannot be undone.`
            : `${pendingAction.account.firstName} ${pendingAction.account.lastName} will no longer be able to sign in.`}
          confirmLabel={pendingAction.kind === 'delete' ? 'Delete admin' : 'Deactivate'}
          onClose={() => !actionLoading && setPendingAction(null)}
          onConfirm={confirmAccountAction}
        />
      )}
    </div>
  );
}
