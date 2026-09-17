import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Eye, Trash2, Mail, Phone } from 'lucide-react';
import { inquiryApi } from '../../services/inquiryApi';
import { Badge, Button, Skeleton, useToast } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable } from '../../components/ui/DataTable';
import { formatDate, inquiryLabel, statusLabel } from '../../lib/utils';

export default function InquiriesPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [meta, setMeta] = useState({});
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await inquiryApi.list();
      setInquiries(data.items || []);
      setMeta(data.meta || {});
    } catch {
      showToast('Failed to load inquiries', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const remove = async () => {
    if (!pendingDelete) return;
    try {
      await inquiryApi.remove(pendingDelete.id);
      setPendingDelete(null);
      showToast('Inquiry deleted successfully');
      loadInquiries();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete inquiry', 'error');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'NEW': return 'danger';
      case 'CONTACTED': return 'warning';
      case 'CLOSED': return 'success';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Prospect / Client',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="mt-0.5 text-xs text-slate-500">{row.company || 'Direct Contact'}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Subject Type',
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {inquiryLabel(row.type)}
        </span>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1 text-slate-700">
            <Mail className="h-3 w-3 text-slate-400" />
            <a href={'mailto:' + row.email} className="hover:underline hover:text-blue-600 truncate max-w-[180px]">
              {row.email}
            </a>
          </div>
          {row.phone && (
            <div className="flex items-center gap-1 text-slate-500">
              <Phone className="h-3 w-3 text-slate-400" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {statusLabel(row.status)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Received',
      render: (row) => (
        <span className="text-xs text-slate-500 tabular-nums">
          {formatDate(row.createdAt)}
        </span>
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
            onClick={() => navigate('/admin/inquiries/' + row.id)}
            aria-label="View Details"
          >
            <Eye className="h-4 w-4" />
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
            <MessageSquare className="h-4 w-4" /> CRM
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Inquiries</h1>
          <p className="mt-1 text-sm text-slate-500">Track and respond to incoming customer and partner inquiries.</p>
        </div>
      </div>

      {loading ? (
        <div className="k-card p-5"><Skeleton count={6} /></div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={inquiries}
            emptyMessage="No inquiries received yet"
            onRowClick={(row) => navigate('/admin/inquiries/' + row.id)}
          />
          {meta.total !== undefined && (
            <p className="mt-3 text-sm text-slate-500">{meta.total} total inquiries</p>
          )}
        </>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete inquiry?"
          message={'Inquiry from “' + pendingDelete.name + '” will be removed.'}
          onClose={() => setPendingDelete(null)}
          onConfirm={remove}
        />
      )}
    </motion.div>
  );
}
