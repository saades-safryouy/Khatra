import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, Pencil, Plus, Trash2, Tag, Star } from 'lucide-react';
import { productApi } from '../../services/productApi';
import { Badge, Button, Skeleton, useToast } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';
import { formatCurrency, productImage } from '../../lib/utils';

export default function ProductsPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.list();
      setProducts(data.items || []);
      setMeta(data.meta || {});
    } catch {
      showToast('Impossible de charger les produits.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const remove = async () => {
    if (!pendingDelete) return;
    try {
      await productApi.remove(pendingDelete.id);
      setPendingDelete(null);
      showToast('Produit supprimé avec succès.');
      loadProducts();
    } catch (err) {
      showToast(err?.uiMessage || 'Impossible de supprimer le produit.', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Produit',
      render: (row) => {
        const img = productImage(row);
        return (
          <div className="flex items-center gap-3">
            {img ? (
              <img src={img} alt={row.name} className="h-10 w-10 rounded-lg border border-slate-200 object-cover bg-slate-100" />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400">
                <Image className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-medium text-slate-900 truncate">{row.name}</p>
                {row.featured && (
                  <span title="Produit à la une" className="inline-flex items-center text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate font-mono">
                {row.reference ? `Ref: ${row.reference}` : `/${row.slug}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'category',
      label: 'Catégorie',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-slate-600 text-xs font-medium bg-slate-100 px-2.5 py-1 rounded-md">
          <Tag className="h-3 w-3 text-slate-400" />
          {row.category?.name || row.categoryName || '—'}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Prix / Promotion',
      render: (row) => (
        <span className="flex flex-col font-medium text-slate-900 tabular-nums">
          {row.promoActive ? <del className="text-xs text-slate-400">{formatCurrency(row.price)}</del> : null}
          <span>{formatCurrency(row.promoActive ? row.effectivePrice : row.price)}</span>
          {row.promoActive && <span className="text-xs font-semibold text-emerald-700">-{row.promo}%</span>}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' || row.active ? 'success' : 'default'}>
          {row.status === 'ACTIVE' || (!row.status && row.active) ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/${row.id}/edit`)} aria-label="Modifier">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setPendingDelete(row)} aria-label="Supprimer">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Image className="h-4 w-4" /> Catalogue
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Produits</h1>
          <p className="mt-1 text-sm text-slate-500">Gérer les produits, les prix, la disponibilité et les images.</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="h-4 w-4" /> Ajouter un produit
        </Button>
      </div>
      {loading ? (
        <div className="k-card p-5"><Skeleton count={6} /></div>
      ) : (
        <>
          <DataTable columns={columns} data={products} emptyMessage="Aucun produit trouvé" onRowClick={(row) => navigate(`/admin/products/${row.id}/edit`)} />
          {meta.total !== undefined && <p className="mt-3 text-sm text-slate-500">{meta.total} produits au total</p>}
        </>
      )}
      {pendingDelete && (
        <ConfirmDialog
        
          title="Supprimer le produit ?"
          message={`« ${pendingDelete.name} » sera supprimé définitivement.`}
          onClose={() => setPendingDelete(null)}
          onConfirm={remove}
        />
      )}
    </motion.div>
  );
}
