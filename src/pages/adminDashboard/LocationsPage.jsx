import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { locationApi } from '../../services/locationApi';
import { Badge, Button, Skeleton, useToast } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';

export default function LocationsPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [meta, setMeta] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadLocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await locationApi.list();
      setLocations(data.items || []);
      setMeta(data.meta || {});
    } catch {
      showToast('Failed to load locations', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const remove = async () => {
    if (!pendingDelete) return;
    try {
      await locationApi.remove(pendingDelete.id);
      setPendingDelete(null);
      showToast('Location deleted successfully');
      loadLocations();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete location', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Location / City',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="mt-0.5 text-xs text-slate-500 font-mono">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'city',
      label: 'City / Region',
      render: (row) => (
        <span className="text-slate-600">
          {row.city} {row.region ? '(' + row.region + ')' : ''}
        </span>
      ),
    },
    {
      key: 'stores',
      label: 'Stores',
      render: (row) => (
        <span className="text-slate-600 font-medium">
          {row.stores?.length ?? 0} stores
        </span>
      ),
    },
    {
      key: 'active',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.active ? 'success' : 'default'}>
          {row.active ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/locations/' + row.id + '/edit')}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setPendingDelete(row)}
            aria-label="Delete"
          >
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
            <MapPin className="h-4 w-4" /> Network
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Locations</h1>
          <p className="mt-1 text-sm text-slate-500">Manage operating cities and coverage regions.</p>
        </div>
        <Button onClick={() => navigate('/admin/locations/new')}>
          <Plus className="h-4 w-4" /> New location
        </Button>
      </div>

      {loading ? (
        <div className="k-card p-5"><Skeleton count={5} /></div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={locations}
            emptyMessage="No locations found"
            onRowClick={(row) => navigate('/admin/locations/' + row.id + '/edit')}
          />
          {meta.total !== undefined && (
            <p className="mt-3 text-sm text-slate-500">{meta.total} total locations</p>
          )}
        </>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete location?"
          message={'“' + pendingDelete.name + '” will be removed. Associated stores must be reassigned.'}
          onClose={() => setPendingDelete(null)}
          onConfirm={remove}
        />
      )}
    </motion.div>
  );
}
