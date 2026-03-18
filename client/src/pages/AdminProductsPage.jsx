import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import { getAuthUser, isAuthenticated } from '../api/auth';

const emptyForm = {
  name: '',
  price: '',
  originalPrice: '',
  image: '',
  description: '',
  category: '',
  brand: '',
  stock: '',
  featured: false,
  freeShipping: false,
};

function AdminProductsPage() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [editingProductId, setEditingProductId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [stockEdits, setStockEdits] = useState({});

  const isEditing = Boolean(editingProductId);

  const loadProducts = async (nextPage = page, nextSearch = search) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/products', {
        params: {
          page: nextPage,
          limit: pagination.limit,
          search: nextSearch.trim() || undefined,
        },
      });

      setProducts(response.data.data.items || []);
      setPagination(response.data.data.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
      setPage(nextPage);
      setStockEdits({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/admin/products' } });
      return;
    }

    if (!isAdmin) {
      navigate('/');
      toast.error('Admin access required');
      return;
    }

    loadProducts(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const editedStockCount = useMemo(() => Object.keys(stockEdits).length, [stockEdits]);

  const resetForm = () => {
    setEditingProductId('');
    setForm(emptyForm);
  };

  const startEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name || '',
      price: String(product.price ?? ''),
      originalPrice: String(product.originalPrice ?? ''),
      image: product.image || '',
      description: product.description || '',
      category: product.category || '',
      brand: product.brand || '',
      stock: String(product.stock ?? ''),
      featured: Boolean(product.featured),
      freeShipping: Boolean(product.freeShipping),
    });
  };

  const onFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitProduct = async (event) => {
    event.preventDefault();

    if (!form.name || !form.image || !form.description || !form.category || !form.brand) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
      stock: Number(form.stock),
      rating: 0,
      reviews: 0,
      sold: 0,
      discount: 0,
      images: [form.image],
      tags: [],
    };

    if (Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
      toast.error('Price and stock must be valid numbers');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await api.put(`/admin/products/${editingProductId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product created');
      }
      resetForm();
      loadProducts(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save product');
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (productId) => {
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted');
      loadProducts(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete product');
    }
  };

  const setStockDraft = (productId, stock) => {
    setStockEdits((prev) => ({ ...prev, [productId]: stock }));
  };

  const applyBulkStockUpdate = async () => {
    const updates = Object.entries(stockEdits)
      .map(([productId, stock]) => ({ productId, stock: Number(stock) }))
      .filter((entry) => Number.isFinite(entry.stock) && entry.stock >= 0);

    if (updates.length === 0) {
      toast.error('No valid stock changes to apply');
      return;
    }

    try {
      await api.patch('/admin/products/stock-bulk', { updates });
      toast.success('Bulk stock updated');
      loadProducts(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk stock update failed');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#fee2e2,#fecaca)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">Admin Products</h1>
              <p className="mt-2 text-sm text-slate-600">Create, edit, delete, and bulk-adjust inventory stock values.</p>
            </div>
            <Link to="/admin" className="rounded border border-slate-300 px-3 py-2 text-sm">Back to dashboard</Link>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <article className="panel p-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products by name/brand/category"
                className="min-w-[220px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <button className="rounded border border-slate-300 px-3 py-2 text-sm" onClick={() => loadProducts(1, search)}>Search</button>
              <button className="rounded border border-slate-300 px-3 py-2 text-sm" onClick={() => loadProducts(page, search)}>Refresh</button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button className="rounded border border-brand-300 bg-brand-50 px-3 py-1 text-sm text-brand-700" onClick={applyBulkStockUpdate}>
                Apply Bulk Stock ({editedStockCount})
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div key={index} className="h-14 animate-pulse rounded bg-slate-100" />
                  ))}
                </div>
              ) : (
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-2 py-3 font-medium">Product</th>
                      <th className="px-2 py-3 font-medium">Category</th>
                      <th className="px-2 py-3 font-medium">Price</th>
                      <th className="px-2 py-3 font-medium">Stock</th>
                      <th className="px-2 py-3 font-medium">Bulk Stock</th>
                      <th className="px-2 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-slate-100">
                        <td className="px-2 py-3 text-slate-700">{product.name}</td>
                        <td className="px-2 py-3 text-slate-600">{product.category}</td>
                        <td className="px-2 py-3 text-slate-600">${Number(product.price).toFixed(2)}</td>
                        <td className="px-2 py-3 text-slate-600">{product.stock}</td>
                        <td className="px-2 py-3">
                          <input
                            className="w-24 rounded border border-slate-300 px-2 py-1"
                            type="number"
                            min="0"
                            value={stockEdits[product._id] ?? product.stock}
                            onChange={(event) => setStockDraft(product._id, event.target.value)}
                          />
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex gap-2">
                            <button className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => startEdit(product)}>Edit</button>
                            <button className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700" onClick={() => removeProduct(product._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {!loading && products.length === 0 && (
                <div className="rounded border border-slate-200 p-3 text-sm text-slate-500">No products found.</div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-slate-500">Page {pagination.page} of {pagination.totalPages} | Total {pagination.total}</p>
              <div className="flex gap-2">
                <button
                  className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                  disabled={pagination.page <= 1}
                  onClick={() => loadProducts(Math.max(1, pagination.page - 1), search)}
                >
                  Prev
                </button>
                <button
                  className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadProducts(Math.min(pagination.totalPages, pagination.page + 1), search)}
                >
                  Next
                </button>
              </div>
            </div>
          </article>

          <article className="panel p-4">
            <h2 className="section-title">{isEditing ? 'Edit Product' : 'Create Product'}</h2>
            <form className="mt-3 space-y-3" onSubmit={submitProduct}>
              <input name="name" value={form.name} onChange={onFormChange} placeholder="Product name" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
              <input name="image" value={form.image} onChange={onFormChange} placeholder="Image URL" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
              <textarea name="description" value={form.description} onChange={onFormChange} placeholder="Description" className="h-24 w-full rounded border border-slate-300 px-3 py-2 text-sm" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="category" value={form.category} onChange={onFormChange} placeholder="Category" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
                <input name="brand" value={form.brand} onChange={onFormChange} placeholder="Brand" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onFormChange} placeholder="Price" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
                <input name="originalPrice" type="number" min="0" step="0.01" value={form.originalPrice} onChange={onFormChange} placeholder="Original price" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
                <input name="stock" type="number" min="0" value={form.stock} onChange={onFormChange} placeholder="Stock" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={onFormChange} />
                  Featured
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="freeShipping" checked={form.freeShipping} onChange={onFormChange} />
                  Free shipping
                </label>
              </div>
              <div className="flex gap-2">
                <button className="rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                </button>
                {isEditing && (
                  <button type="button" className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminProductsPage;
