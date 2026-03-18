import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import { getAuthUser, isAuthenticated } from '../api/auth';

const allStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

function AdminOrdersPage() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });

  const loadOrders = async (nextPage = page) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders', {
        params: {
          page: nextPage,
          limit: pagination.limit,
          status: statusFilter || undefined,
        },
      });

      setOrders(response.data.data.items || []);
      setPagination(response.data.data.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
      setPage(nextPage);
      setSelectedIds([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admin orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/admin/orders' } });
      return;
    }

    if (!isAdmin) {
      navigate('/');
      toast.error('Admin access required');
      return;
    }

    loadOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, statusFilter]);

  const visibleOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) => {
      const id = order._id?.toLowerCase() || '';
      const name = order.user?.name?.toLowerCase() || '';
      const email = order.user?.email?.toLowerCase() || '';
      return id.includes(q) || name.includes(q) || email.includes(q);
    });
  }, [orders, search]);

  const allVisibleSelected = visibleOrders.length > 0 && visibleOrders.every((order) => selectedIds.includes(order._id));

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  const toggleSelectVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleOrders.some((order) => order._id === id)));
      return;
    }

    const visibleSet = new Set(visibleOrders.map((order) => order._id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visibleSet.forEach((id) => next.add(id));
      return Array.from(next);
    });
  };

  const updateSingleStatus = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((item) => (item._id === orderId ? { ...item, status } : item)));
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const bulkUpdateStatus = async (status) => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one order');
      return;
    }

    try {
      const response = await api.patch('/admin/orders/status-bulk', {
        orderIds: selectedIds,
        status,
      });

      setOrders((prev) => prev.map((item) => (selectedIds.includes(item._id) ? { ...item, status } : item)));
      setSelectedIds([]);
      toast.success(`Updated ${response.data.data.modified || 0} orders`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk update failed');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#fef3c7,#fde68a)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">Admin Orders</h1>
              <p className="mt-2 text-sm text-slate-600">Paginated operations, bulk status updates, and live order controls.</p>
            </div>
            <Link to="/admin" className="rounded border border-slate-300 px-3 py-2 text-sm">Back to dashboard</Link>
          </div>
        </section>

        <section className="panel p-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order id/customer"
              className="min-w-[220px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <select className="rounded border border-slate-300 px-3 py-2 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">All Status</option>
              {allStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="rounded border border-slate-300 px-3 py-2 text-sm" onClick={() => loadOrders(page)}>Refresh</button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={toggleSelectVisible}>
              {allVisibleSelected ? 'Unselect visible' : 'Select visible'}
            </button>
            {allStatuses.map((status) => (
              <button key={status} className="rounded border border-brand-300 bg-brand-50 px-3 py-1 text-sm text-brand-700" onClick={() => bulkUpdateStatus(status)}>
                Mark {status}
              </button>
            ))}
            <span className="text-xs text-slate-500">Selected: {selectedIds.length}</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="h-14 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            ) : (
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-2 py-3 font-medium">Select</th>
                    <th className="px-2 py-3 font-medium">Order</th>
                    <th className="px-2 py-3 font-medium">Customer</th>
                    <th className="px-2 py-3 font-medium">Total</th>
                    <th className="px-2 py-3 font-medium">Date</th>
                    <th className="px-2 py-3 font-medium">Status</th>
                    <th className="px-2 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-100">
                      <td className="px-2 py-3">
                        <input type="checkbox" checked={selectedIds.includes(order._id)} onChange={() => toggleSelect(order._id)} />
                      </td>
                      <td className="px-2 py-3 font-semibold text-slate-800">{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-2 py-3 text-slate-600">{order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})</td>
                      <td className="px-2 py-3 text-slate-600">${Number(order.total).toFixed(2)}</td>
                      <td className="px-2 py-3 text-slate-600">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="px-2 py-3 text-slate-700">{order.status}</td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap gap-1">
                          {allStatuses.map((status) => (
                            <button
                              key={`${order._id}-${status}`}
                              className={`rounded border px-2 py-1 text-xs ${order.status === status ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-300 text-slate-600'}`}
                              onClick={() => updateSingleStatus(order._id, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!loading && visibleOrders.length === 0 && (
              <div className="rounded border border-slate-200 p-3 text-sm text-slate-500">No orders matched filters.</div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-slate-500">Page {pagination.page} of {pagination.totalPages} | Total {pagination.total}</p>
            <div className="flex gap-2">
              <button
                className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                disabled={pagination.page <= 1}
                onClick={() => loadOrders(Math.max(1, pagination.page - 1))}
              >
                Prev
              </button>
              <button
                className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadOrders(Math.min(pagination.totalPages, pagination.page + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AdminOrdersPage;
