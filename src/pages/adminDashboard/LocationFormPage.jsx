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
          showToast('Failed to load location', 'error');
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
    if (!formData.name.trim()) errs.name = 'Location name is required';
    if (!formData.slug.trim()) errs.slug = 'Slug is required';
    if (!formData.city.trim()) errs.city = 'City name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct highlighted errors', 'error');
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
        showToast('Location updated successfully');
      } else {
        await locationApi.create(payload);
        showToast('Location created successfully');
      }
      navigate('/admin/locations');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to save location', 'error');
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
              <MapPin className="h-3.5 w-3.5" /> Network / Locations
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {id ? 'Edit Location' : 'New Location'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/locations')} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {id ? 'Save Changes' : 'Create Location'}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="k-card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Location Info</h2>
          <p className="text-xs text-slate-500 mb-5">Define region name, URL identifier, and city group.</p>

          <div className="space-y-4">
            <Input
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => !formData.slug && handleAutoSlug()}
              placeholder="e.g. Grand Casablanca"
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
                    <Sparkles className="h-3 w-3" /> Auto
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
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Casablanca"
                error={errors.city}
                required
              />
            </div>

            <Input
              label="Region / Province (Optional)"
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
                placeholder="Coverage notes or area details..."
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
                  <span className="text-sm font-medium text-slate-900">Active Location</span>
                  <p className="text-xs text-slate-500">Enable stores to be listed in this area.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
