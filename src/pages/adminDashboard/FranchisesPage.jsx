import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Pencil, Plus, Trash2 } from 'lucide-react';
import { franchiseApi } from '../../services/franchiseApi';
import { Badge, Button, Skeleton, useToast } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';

export default function FranchisesPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [franchises, setFranchises] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const loadFranchises = useCallback(async () => { setLoading(true); try { const response = await franchiseApi.list(); setFranchises(response.items || response || []); } catch { showToast('Impossible de charger les franchises.', 'error'); } finally { setLoading(false); } }, [showToast]);
  useEffect(() => { loadFranchises(); }, [loadFranchises]);
  const remove = async () => { await franchiseApi.remove(pendingDelete.id); setPendingDelete(null); showToast('Franchise supprimée avec succès.'); loadFranchises(); };
  const columns = [
    { key: 'name', label: 'Franchise', render: (row) => <div><p className="font-medium text-slate-900">{row.name}</p><p className="mt-0.5 text-xs text-slate-500">{row.slug || row.city || 'Concept de franchise'}</p></div> },
    { key: 'city', label: 'Emplacement', render: (row) => <span className="text-slate-600">{row.city || row.country || '—'}</span> },
    { key: 'status', label: 'Statut', render: (row) => <Badge variant={row.status === 'ACTIVE' || row.active ? 'success' : 'default'}>{row.status === 'ACTIVE' || row.active ? 'Actif' : 'Inactif'}</Badge> },
    { key: 'actions', label: 'Actions', render: (row) => <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}><Button variant="ghost" size="icon" onClick={() => navigate(`/admin/franchises/${row.id}/edit`)} aria-label={`Modifier ${row.name}`}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setPendingDelete(row)} aria-label={`Supprimer ${row.name}`}><Trash2 className="h-4 w-4" /></Button></div> },
  ];
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm text-slate-500"><Building2 className="h-4 w-4" />Développement</div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Franchises</h1><p className="mt-1 text-sm text-slate-500">Gérer les concepts de franchise et les opportunités de développement.</p></div><Button onClick={() => navigate('/admin/franchises/new')}><Plus className="h-4 w-4" />Ajouter une franchise</Button></div>{loading ? <div className="k-card p-5"><Skeleton count={6} /></div> : <DataTable columns={columns} data={franchises} emptyMessage="Aucune franchise trouvée" onRowClick={(row) => navigate(`/admin/franchises/${row.id}/edit`)} />}{pendingDelete && <ConfirmDialog title="Supprimer la franchise ?" message={`« ${pendingDelete.name} » sera supprimée définitivement.`} onClose={() => setPendingDelete(null)} onConfirm={remove} />}</motion.div>;
}
