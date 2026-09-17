import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { categoryApi } from '../../services/categoryApi';
import { Badge, Button, Skeleton, useToast } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';
import { formatDate } from '../../lib/utils';

export default function CategoryListPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try { const data = await categoryApi.list(); setCategories(data.items || []); setMeta(data.meta || {}); }
    catch { showToast('Failed to load categories', 'error'); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  const remove = async () => { await categoryApi.remove(pendingDelete.id); setPendingDelete(null); showToast('Category deleted successfully'); loadCategories(); };

  const columns = [
    { key: 'name', label: 'Category', render: (row) => <div><p className="font-medium text-slate-900">{row.name}</p><p className="mt-0.5 text-xs text-slate-500">/{row.slug}</p></div> },
    { key: 'active', label: 'Status', render: (row) => <Badge variant={row.active ? 'success' : 'default'}>{row.active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'displayOrder', label: 'Order', render: (row) => <span className="text-slate-500">{row.displayOrder ?? 0}</span> },
    { key: 'createdAt', label: 'Created', render: (row) => <span className="text-slate-500">{formatDate(row.createdAt)}</span> },
    { key: 'actions', label: '', render: (row) => <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}><Button variant="ghost" size="icon" onClick={() => navigate(`/admin/categories/${row.id}/edit`)} aria-label={`Edit ${row.name}`}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setPendingDelete(row)} aria-label={`Delete ${row.name}`}><Trash2 className="h-4 w-4" /></Button></div> },
  ];

  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm text-slate-500"><Tags className="h-4 w-4" />Catalog</div><h1 className="text-2xl font-semibold tracking-tight text-slate-950">Categories</h1><p className="mt-1 text-sm text-slate-500">Organize the product catalog into clear groups.</p></div><Button onClick={() => navigate('/admin/categories/new')}><Plus className="h-4 w-4" />New category</Button></div>{loading ? <div className="k-card p-5"><Skeleton count={6} /></div> : <><DataTable columns={columns} data={categories} emptyMessage="No categories found" onRowClick={(row) => navigate(`/admin/categories/${row.id}/edit`)} />{meta.total !== undefined && <p className="mt-3 text-sm text-slate-500">{meta.total} total categories</p>}</>}{pendingDelete && <ConfirmDialog title="Delete category?" message={`“${pendingDelete.name}” will be permanently removed.`} onClose={() => setPendingDelete(null)} onConfirm={remove} />}</motion.div>;
}

