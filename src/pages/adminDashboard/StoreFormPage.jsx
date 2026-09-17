import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Store as StoreIcon, Upload, X, Loader2 } from 'lucide-react';
import { storeApi } from '../../services/storeApi';
import { locationApi } from '../../services/locationApi';
import { useToast, Button, Input, Skeleton } from '../../components/ui';
import { mediaUrl } from '../../lib/utils';

export default function StoreFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    locationId: '',
    address: '',
    phone: '',
    googleMapsUrl: '',
    description: '',
    active: true,
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const locRes = await locationApi.list({ limit: 100 });
        if (!isMounted) return;
        setLocations(locRes.items || []);

        if (id) {
          const store = await storeApi.get(id);
          if (!isMounted) return;
          setFormData({
            name: store.name || '',
            locationId: store.locationId ? String(store.locationId) : '',
            address: store.address || '',
            phone: store.phone || '',
            googleMapsUrl: store.googleMapsUrl || '',
            description: store.description || '',
            active: store.active ?? true,
          });
          setCurrentImage(store.image || null);
        }
      } catch (err) {
        if (!isMounted) return;
        showToast(err?.response?.data?.message || 'Failed to load store', 'error');
        navigate('/admin/stores');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Store name is required';
    if (!formData.locationId) errs.locationId = 'Please select a location / city';
    if (!formData.address.trim()) errs.address = 'Store address is required';
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
        locationId: Number(formData.locationId),
        address: formData.address.trim(),
        phone: formData.phone.trim() || undefined,
        googleMapsUrl: formData.googleMapsUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
        active: formData.active,
      };

      if (id) {
        await storeApi.update(id, payload, imageFile);
        showToast('Store updated successfully');
      } else {
        await storeApi.create(payload, imageFile);
        showToast('Store created successfully');
      }
      navigate('/admin/stores');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to save store', 'error');
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
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-12 max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/stores')}
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <StoreIcon className="h-3.5 w-3.5" /> Network / Stores
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {id ? 'Edit Store' : 'New Store'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/stores')} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {id ? 'Save Changes' : 'Create Store'}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="k-card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Store Information</h2>
          <p className="text-xs text-slate-500 mb-5">Name, location area, physical address, and contact details.</p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Store Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Khatra Coffee Corner - Maarif"
                error={errors.name}
                required
              />

              <div>
                <label className="k-label" htmlFor="locationId">Region / City Area</label>
                <select
                  id="locationId"
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  className="k-input bg-white"
                  required
                >
                  <option value="">Select a region / city</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.city})
                    </option>
                  ))}
                </select>
                {errors.locationId && <p className="text-xs text-red-600 mt-1">{errors.locationId}</p>}
              </div>
            </div>

            <Input
              label="Physical Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 45 Bd Al Massira Al Khadra, Casablanca"
              error={errors.address}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+212 5 22 00 00 00"
              />

              <Input
                label="Google Maps URL"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/?q=..."
                hint="Link or coordinates for navigation"
              />
            </div>

            <div>
              <label className="k-label" htmlFor="description">Store Notes / Hours</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Opening hours, parking info, services..."
                className="k-input h-auto resize-y py-2 text-sm"
              />
            </div>

            <div>
              <label className="k-label">Store Photo</label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {(imagePreview || currentImage) && (
                  <div className="relative group h-24 w-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                    <img
                      src={imagePreview || mediaUrl(currentImage)}
                      alt="Store storefront"
                      className="h-full w-full object-cover"
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                        title="Remove new image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex-1 w-full">
                  <label
                    htmlFor="store-image"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 transition rounded-xl p-4 cursor-pointer text-center"
                  >
                    <Upload className="h-5 w-5 text-slate-500 mb-1" />
                    <span className="text-xs font-medium text-slate-800">
                      {imagePreview ? 'Change photo' : 'Upload photo'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                    <input
                      id="store-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
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
                  <span className="text-sm font-medium text-slate-900">Active Store</span>
                  <p className="text-xs text-slate-500">Show this point of sale in locator and map.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
