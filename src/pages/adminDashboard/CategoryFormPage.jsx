import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Tags, Upload, X, Loader2, Sparkles } from 'lucide-react';
import { categoryApi } from '../../services/categoryApi';
import { useToast, Button, Input, Skeleton } from '../../components/ui';
import { mediaUrl, slugify } from '../../lib/utils';

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    active: true,
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (id) {
      categoryApi.get(id)
        .then((data) => {
          if (!isMounted) return;
          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            displayOrder: data.displayOrder ?? 0,
            active: data.active ?? true,
          });
          setCurrentImage(data.image || null);
        })
        .catch((err) => {
          if (!isMounted) return;
          showToast(err?.response?.data?.message || 'Failed to load category', 'error');
          navigate('/admin/categories');
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
    if (!formData.name.trim()) errs.name = 'Category name is required';
    if (!formData.slug.trim()) errs.slug = 'Slug is required';
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
        description: formData.description.trim() || undefined,
        displayOrder: Number(formData.displayOrder) || 0,
        active: formData.active,
      };

      if (id) {
        await categoryApi.update(id, payload, imageFile);
        showToast('Category updated successfully');
      } else {
        await categoryApi.create(payload, imageFile);
        showToast('Category created successfully');
      }
      navigate('/admin/categories');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to save category', 'error');
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
            onClick={() => navigate('/admin/categories')}
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <Tags className="h-3.5 w-3.5" /> Catalog / Categories
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {id ? 'Edit Category' : 'New Category'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/categories')} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {id ? 'Save Changes' : 'Create Category'}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="k-card p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Category Details</h2>
          <p className="text-xs text-slate-500 mb-5">Configure category name, slug, ordering, and media.</p>

          <div className="space-y-4">
            <Input
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => !formData.slug && handleAutoSlug()}
              placeholder="e.g. Café de Spécialité"
              error={errors.name}
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="k-label mb-0" htmlFor="slug">Slug (URL key)</label>
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
                  placeholder="cafe-specialite"
                  required
                />
                {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
              </div>

              <div>
                <label className="k-label" htmlFor="displayOrder">Display Order</label>
                <input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  placeholder="0"
                  className="k-input"
                />
              </div>
            </div>

            <div>
              <label className="k-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of this product collection..."
                className="k-input h-auto resize-y py-2 text-sm"
              />
            </div>

            <div>
              <label className="k-label">Category Image</label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {(imagePreview || currentImage) && (
                  <div className="relative group h-24 w-24 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                    <img
                      src={imagePreview || mediaUrl(currentImage)}
                      alt="Category preview"
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
                    htmlFor="category-image"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 transition rounded-xl p-4 cursor-pointer text-center"
                  >
                    <Upload className="h-5 w-5 text-slate-500 mb-1" />
                    <span className="text-xs font-medium text-slate-800">
                      {imagePreview ? 'Change selected image' : 'Upload category banner'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                    <input
                      id="category-image"
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
                  <span className="text-sm font-medium text-slate-900">Active Category</span>
                  <p className="text-xs text-slate-500">Visible to customers in catalog.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
