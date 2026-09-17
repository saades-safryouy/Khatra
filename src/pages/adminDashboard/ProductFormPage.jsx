import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Package, Upload, X, Loader2, Sparkles } from 'lucide-react';
import { productApi } from '../../services/productApi';
import { categoryApi } from '../../services/categoryApi';
import { useToast, Button, Input, Skeleton } from '../../components/ui';
import { mediaUrl, slugify } from '../../lib/utils';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    reference: '',
    price: '',
    status: 'ACTIVE',
    featured: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const catRes = await categoryApi.list({ limit: 1000 });
        if (!isMounted) return;
        setCategories(catRes.items || []);

        if (id) {
          const product = await productApi.get(id);
          if (!isMounted) return;
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            categoryId: product.categoryId ? String(product.categoryId) : '',
            shortDescription: product.shortDescription || '',
            description: product.description || '',
            reference: product.reference || '',
            price: product.price !== null && product.price !== undefined ? String(product.price) : '',
            status: product.status || 'ACTIVE',
            featured: Boolean(product.featured),
          });
          setExistingImages(product.images || []);
        }
      } catch (err) {
        if (!isMounted) return;
        showToast(err?.response?.data?.message || 'Failed to load product data', 'error');
        navigate('/admin/products');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      url: URL.createObjectURL(file),
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.slug.trim()) errs.slug = 'Slug is required';
    if (!formData.categoryId) errs.categoryId = 'Please select a category';
    if (formData.price !== '') {
      const priceNum = Number(formData.price);
      if (Number.isNaN(priceNum) || priceNum < 0) {
        errs.price = 'Price must be a valid non-negative number';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct the highlighted errors', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        categoryId: Number(formData.categoryId),
        shortDescription: formData.shortDescription.trim() || undefined,
        description: formData.description.trim() || undefined,
        reference: formData.reference.trim() || undefined,
        price: formData.price !== '' ? Number(formData.price) : '',
        status: formData.status,
        featured: formData.featured,
      };
      if (id) {
        await productApi.update(id, payload, newImageFiles);
        showToast('Product updated successfully');
      } else {
        await productApi.create(payload, newImageFiles);
        showToast('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="k-card p-6"><Skeleton count={6} /></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pb-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/products')}
            className="rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <Package className="h-3.5 w-3.5" /> Catalog / Products
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {id ? 'Edit Product' : 'New Product'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/admin/products')} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="min-w-[120px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> {id ? 'Save Changes' : 'Create Product'}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="k-card p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">General Information</h2>
            <p className="text-xs text-slate-500 mb-5">Basic title, identification, category, and pricing.</p>
            <div className="space-y-4">
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => !formData.slug && handleAutoSlug()}
                placeholder="e.g. Grain de Café Khatra Signature"
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
                    placeholder="grain-cafe-khatra"
                    required
                  />
                  {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
                </div>
                <div>
                  <label className="k-label" htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="k-input bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-xs text-red-600 mt-1">{errors.categoryId}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="k-label" htmlFor="price">Price (MAD)</label>
                  <div className="relative">
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="k-input pr-14 font-medium"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-xs font-semibold text-slate-500">MAD</span>
                    </div>
                  </div>
                  {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
                  <p className="text-xs text-slate-500 mt-1">Leave empty if price is upon request.</p>
                </div>
                <div>
                  <Input
                    label="Reference / SKU"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="e.g. KHT-COF-001"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="k-card p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Descriptions</h2>
            <p className="text-xs text-slate-500 mb-5">Short summary and detailed descriptions.</p>
            <div className="space-y-4">
              <div>
                <label className="k-label" htmlFor="shortDescription">Short Description</label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  rows={2}
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief summary displayed on listings..."
                  className="k-input h-auto resize-y py-2 text-sm"
                />
              </div>
              <div>
                <label className="k-label" htmlFor="description">Full Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed specifications, notes..."
                  className="k-input h-auto resize-y py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="k-card p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Status & Visibility</h2>
            <p className="text-xs text-slate-500 mb-5">Control product availability.</p>
            <div className="space-y-4">
              <div>
                <label className="k-label" htmlFor="status">Publication Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="k-input bg-white"
                >
                  <option value="ACTIVE">ACTIVE (Published)</option>
                  <option value="INACTIVE">INACTIVE (Hidden)</option>
                </select>
              </div>
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900">Featured Product</span>
                    <p className="text-xs text-slate-500">Highlight this product on homepage showcases.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="k-card p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Product Images</h2>
            <p className="text-xs text-slate-500 mb-4">Upload product imagery.</p>
            {existingImages.length > 0 && (
              <div className="mb-4 space-y-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Current Images ({existingImages.length})
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, i) => (
                    <div key={img.id || i} className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                      <img src={mediaUrl(img.imageUrl)} alt={img.altText || ''} className="h-full w-full object-cover" />
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Cover</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2">
              <label htmlFor="images-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 transition rounded-xl p-5 cursor-pointer text-center">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 mb-2">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-800">Click to upload images</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP</p>
                <input id="images-upload" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            {imagePreviews.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">New Uploads ({imagePreviews.length})</span>
                <div className="space-y-2">
                  {imagePreviews.map((prev, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={prev.url} alt="" className="h-8 w-8 rounded object-cover border" />
                        <div className="truncate">
                          <p className="font-medium text-slate-800 truncate">{prev.name}</p>
                          <p className="text-slate-400">{prev.size}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleRemoveNewImage(idx)} className="text-slate-400 hover:text-red-600 p-1 rounded">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
}
