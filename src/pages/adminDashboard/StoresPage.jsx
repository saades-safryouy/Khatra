import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Plus, Store, Trash2 } from 'lucide-react';
import { storeApi } from '../../services/storeApi';
import { Badge, Button, Skeleton, useToast } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';

export default function StoresPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const loadStores = useCallback(async () => { setLoading(true); try { const response = await storeApi.list(); setStores(response.items || response || []); } catch { showToast('Impossible de charger les points de vente.', 'error'); } finally { setLoading(false); } }, [showToast]);
  useEffect(() => { loadStores(); }, [loadStores]);
  const remove = async () => { await storeApi.remove(pendingDelete.id); setPendingDelete(null); showToast('Point de vente supprimé avec succès.'); loadStores(); };
  const columns = [
    { key: 'name', label: 'Point de vente', render: (row) => <div><p className="font-medium text-slate-900">{row.name}</p><p className="mt-0.5 text-xs text-slate-500">{row.address || row.city || 'Adresse non renseignée'}</p></div> },
    { key: 'city', label: 'Ville', render: (row) => <span className="text-slate-600">{row.city || '—'}</span> },
    { key: 'phone', label: 'Contact', render: (row) => <span className="text-slate-600">{row.phone || '—'}</span> },
    { key: 'active', label: 'Statut', render: (row) => <Badge variant={row.active ? 'success' : 'default'}>{row.active ? 'Actif' : 'Inactif'}</Badge> },
    { key: 'actions', label: 'Actions', render: (row) => <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}><Button variant="ghost" size="icon" onClick={() => navigate(`/admin/stores/${row.id}/edit`)} aria-label={`Modifier ${row.name}`}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setPendingDelete(row)} aria-label={`Supprimer ${row.name}`}><Trash2 className="h-4 w-4" /></Button></div> },
  ];
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm text-slate-500"><Store className="h-4 w-4" />Réseau</div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Points de vente</h1><p className="mt-1 text-sm text-slate-500">Gérer les boutiques et leurs coordonnées.</p></div><Button onClick={() => navigate('/admin/stores/new')}><Plus className="h-4 w-4" />Ajouter un point de vente</Button></div>{loading ? <div className="k-card p-5"><Skeleton count={6} /></div> : <DataTable columns={columns} data={stores} emptyMessage="Aucun point de vente trouvé" onRowClick={(row) => navigate(`/admin/stores/${row.id}/edit`)} />}{pendingDelete && <ConfirmDialog title="Supprimer le point de vente ?" message={`« ${pendingDelete.name} » sera supprimé définitivement.`} onClose={() => setPendingDelete(null)} onConfirm={remove} />}</motion.div>;
}
