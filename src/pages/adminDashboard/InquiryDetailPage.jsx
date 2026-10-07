import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Mail, Phone, Building, Calendar, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { inquiryApi } from '../../services/inquiryApi';
import { Button, Skeleton, useToast } from '../../components/ui';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatDateTime, inquiryLabel, statusLabel } from '../../lib/utils';

export default function InquiryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [inquiry, setInquiry] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    inquiryApi.get(id)
      .then((data) => {
        if (!isMounted) return;
        setInquiry(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        showToast(err?.uiMessage || 'Impossible de charger la demande.', 'error');
        navigate('/admin/inquiries');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [id, navigate, showToast]);

  const updateStatus = async (newStatus) => {
    if (!inquiry || updating) return;
    setUpdating(true);
    try {
      const updated = await inquiryApi.update(id, { status: newStatus });
      setInquiry((prev) => ({ ...prev, status: newStatus, ...(updated || {}) }));
      showToast('Statut mis à jour : ' + statusLabel(newStatus));
    } catch (err) {
      showToast(err?.uiMessage || 'Impossible de mettre à jour le statut.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const remove = async () => {
    try {
      await inquiryApi.remove(id);
      showToast('Demande supprimée.');
      navigate('/admin/inquiries');
    } catch (err) {
      showToast(err?.uiMessage || 'Impossible de supprimer la demande.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="k-card p-6"><Skeleton count={6} /></div>
      </div>
    );
  }

  if (!inquiry) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-12 max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/inquiries')}
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <MessageSquare className="h-3.5 w-3.5" /> Demandes / Détail du message
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {inquiry.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="k-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Message de la demande
              </span>
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
                {inquiryLabel(inquiry.type)}
              </span>
            </div>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[140px]">
              {inquiry.message || 'Aucun contenu dans le message.'}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="k-card p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Gestion du statut</h2>
            <p className="text-xs text-slate-500 mb-4">Mettre à jour l’avancement du traitement.</p>
            <div className="space-y-2">
              <button
                type="button"
                disabled={updating || inquiry.status === 'NEW'}
                onClick={() => updateStatus('NEW')}
                className={'w-full flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition ' + (inquiry.status === 'NEW' ? 'border-red-500 bg-red-50 text-red-700 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700')}
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Nouveau
                </span>
                {inquiry.status === 'NEW' && <span className="h-2 w-2 rounded-full bg-red-600" />}
              </button>

              <button
                type="button"
                disabled={updating || inquiry.status === 'CONTACTED'}
                onClick={() => updateStatus('CONTACTED')}
                className={'w-full flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition ' + (inquiry.status === 'CONTACTED' ? 'border-amber-500 bg-amber-50 text-amber-700 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700')}
              >
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Contacté
                </span>
                {inquiry.status === 'CONTACTED' && <span className="h-2 w-2 rounded-full bg-amber-600" />}
              </button>

              <button
                type="button"
                disabled={updating || inquiry.status === 'CLOSED'}
                onClick={() => updateStatus('CLOSED')}
                className={'w-full flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition ' + (inquiry.status === 'CLOSED' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold' : 'border-slate-200 hover:bg-slate-50 text-slate-700')}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Clôturé
                </span>
                {inquiry.status === 'CLOSED' && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
              </button>
            </div>
          </div>

          <div className="k-card p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">Coordonnées du prospect</h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Adresse e-mail</span>
                <a href={'mailto:' + inquiry.email} className="font-medium text-blue-600 hover:underline flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {inquiry.email}
                </a>
              </div>
              {inquiry.phone && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Téléphone</span>
                  <a href={'tel:' + inquiry.phone} className="font-medium text-slate-800 hover:text-blue-600 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {inquiry.phone}
                  </a>
                </div>
              )}
              {inquiry.company && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Entreprise</span>
                  <p className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-400" /> {inquiry.company}
                  </p>
                </div>
              )}
              <div>
                <span className="text-slate-400 block mb-0.5">Date de réception</span>
                <p className="font-medium text-slate-600 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" /> {formatDateTime(inquiry.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="Supprimer la demande ?"
          message={'Voulez-vous vraiment supprimer définitivement ce message de « ' + inquiry.name + ' » ?'}
          onClose={() => setShowDelete(false)}
          onConfirm={remove}
        />
      )}
    </motion.div>
  );
}
