import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, MapPin, Loader2, Sparkles } from 'lucide-react';
import { locationApi } from '../../services/locationApi';
import { useToast, Button, Input, Skeleton } from '../../components/ui';
import { slugify } from '../../lib/utils';

export default function LocationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    city: '',
    region: '',
    description: '',
    active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (id) {
      locationApi.list({ limit: 100 })
        .then((res) => {
          if (!isMounted) return;
          const items = Array.isArray(res) ? res : res.items || [];
          const item = items.find((l) => String(l.id) === String(id));
          if (item) {
            setFormData({
              name: item.name || '',
              slug: item.slug || '',
              city: item.city || '',
              region: item.region || '',
              description: item.description || '',
              active: item.active ?? true,
            });
          }
        })
        .catch(() => {
          if (!isMounted) return;
          showToast('Impossible de charger l’emplacement.', 'error');
          navigate('/admin/locations');
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [id, navigate, showToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleAutoSlug = () => {
    if (formData.name) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }));
      if (errors.slug) setErrors((prev) => ({ ...prev, slug: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Le nom de l’emplacement est obligatoire.';
    if (!formData.slug.trim()) errs.slug = 'L’identifiant URL est obligatoire.';
    if (!formData.city.trim()) errs.city = 'Le nom de la ville est obligatoire.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Veuillez corriger les erreurs signalées.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        city: formData.city.trim(),
        region: formData.region.trim() || undefined,
        description: formData.description.trim() || undefined,
        active: formData.active,
      };

      if (id) {
        await locationApi.update(id, payload);
        showToast('Emplacement mis à jour avec succès.');
      } else {
        await locationApi.create(payload);
        showToast('Emplacement créé avec succès.');
      }
      navigate('/admin/locations');
    } catch (err) {
      showToast(err?.uiMessage || 'Impossible d’enregistrer l’emplacement.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="k-card p-6"><Skeleton count={5} /></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-12 max-w-3xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/locations')}
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5" /> Réseau / Emplacements
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {id ? 'Modifier l’emplacement' : 'Nouvel emplacement'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/locations')} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {id ? 'Enregistrer les modifications' : 'Créer l’emplacement'}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="k-card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Informations sur l’emplacement</h2>
          <p className="text-xs text-slate-500 mb-5">Définir le nom, l’identifiant URL et la ville.</p>

          <div className="space-y-4">
            <Input
              label="Nom de l’emplacement"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => !formData.slug && handleAutoSlug()}
              placeholder="Ex. : Grand Casablanca"
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="k-label mb-0" htmlFor="slug">Slug</label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Sparkles className="h-3 w-3" /> Générer
                  </button>
                </div>
                <input
                  id="slug"
                  name="slug"
                  className="k-input font-mono text-xs"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="grand-casablanca"
                  required
                />
                {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
              </div>

              <Input
                label="Ville"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Casablanca"
                error={errors.city}
                required
              />
            </div>

            <Input
              label="Région / Province (facultatif)"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Casablanca-Settat"
            />

            <div>
              <label className="k-label" htmlFor="description">Notes / Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Informations sur la zone couverte…"
                className="k-input h-auto resize-y py-2 text-sm"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900">Emplacement actif</span>
                  <p className="text-xs text-slate-500">Autoriser l’affichage des points de vente de cette zone.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
