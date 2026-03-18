import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import { getAuthUser, isAuthenticated } from '../api/auth';

const statusColors = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const user = getAuthUser();
  const isAdmin = user?.role === 'admin';

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [analyticsRes, ordersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/orders', { params: { status: statusFilter || undefined, limit: 50 } }),
      ]);

      setDashboard(analyticsRes.data.data);
      setOrders(ordersRes.data.data.items || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/admin' } });
      return;
    }

    if (!isAdmin) {
      navigate('/');
      toast.error('Admin access required');
      return;
    }

    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, statusFilter]);

  const maxSales = useMemo(() => {
    if (!dashboard?.salesLast7Days?.length) return 1;
    return Math.max(...dashboard.salesLast7Days.map((entry) => entry.sales), 1);
  }, [dashboard]);

  const visibleOrders = useMemo(() => {
    if (!orderSearch.trim()) return orders;
    const q = orderSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = order._id?.toLowerCase() || '';
      const name = order.user?.name?.toLowerCase() || '';
      const email = order.user?.email?.toLowerCase() || '';
      return orderId.includes(q) || name.includes(q) || email.includes(q);
    });
  }, [orders, orderSearch]);

  const exportOrdersCsv = () => {
    if (visibleOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    const header = ['OrderId', 'Customer', 'Email', 'Status', 'Total', 'Date'];
    const rows = visibleOrders.map((order) => [
      order._id,
      order.user?.name || 'N/A',
      order.user?.email || 'N/A',
      order.status,
      Number(order.total).toFixed(2),
      new Date(order.createdAt).toISOString(),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `admin-orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      setOrders((prev) => prev.map((item) => (item._id === orderId ? { ...item, status } : item)));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#ecfccb,#dcfce7)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">Admin Control Center</h1>
              <p className="mt-2 text-sm text-slate-600">Analytics, operational monitoring, and order workflow controls.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/orders" className="rounded border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">Manage Orders</Link>
              <Link to="/admin/products" className="rounded border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">Manage Products</Link>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="panel h-28 animate-pulse" />
            ))}
          </section>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="panel p-4">
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="mt-2 font-display text-3xl font-semibold text-slate-900">${Number(dashboard?.kpis?.totalRevenue || 0).toFixed(2)}</p>
              </article>
              <article className="panel p-4">
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="mt-2 font-display text-3xl font-semibold text-slate-900">{dashboard?.kpis?.totalOrders || 0}</p>
              </article>
              <article className="panel p-4">
                <p className="text-sm text-slate-500">Registered Users</p>
                <p className="mt-2 font-display text-3xl font-semibold text-slate-900">{dashboard?.kpis?.totalUsers || 0}</p>
              </article>
              <article className="panel p-4">
                <p className="text-sm text-slate-500">Low Stock Products</p>
                <p className="mt-2 font-display text-3xl font-semibold text-slate-900">{dashboard?.kpis?.lowStockProducts || 0}</p>
              </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
              <article className="panel p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="section-title">Sales (Last 7 Days)</h2>
                  <button className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={fetchDashboard}>Refresh</button>
                </div>
                <div className="mt-6 flex h-56 items-end gap-2">
                  {(dashboard?.salesLast7Days || []).map((entry) => (
                    <div key={entry._id} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t bg-brand-500/85" style={{ height: `${Math.max((entry.sales / maxSales) * 170, 8)}px` }} />
                      <p className="text-[11px] text-slate-500">{entry._id.slice(5)}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel p-4">
                <h2 className="section-title">Order Status Split</h2>
                <div className="mt-4 space-y-3 text-sm">
                  {Object.entries(dashboard?.orderStatus || {}).map(([status, count]) => (
                    <div key={status}>
                      <div className="mb-1 flex justify-between">
                        <span>{status}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 rounded bg-slate-100">
                        <div className="h-2 rounded bg-brand-500" style={{ width: `${Math.min((count / Math.max(dashboard?.kpis?.totalOrders || 1, 1)) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
              <article className="panel p-4">
                <h2 className="section-title">Top Products</h2>
                <div className="mt-3 space-y-2 text-sm">
                  {(dashboard?.topProducts || []).map((product) => (
                    <div key={product._id} className="rounded border border-slate-200 p-3">
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="mt-1 text-slate-500">Sold: {product.sold} | Stock: {product.stock}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="section-title">Order Management</h2>
                  <div className="flex flex-wrap gap-2">
                    <input
                      className="rounded border border-slate-300 px-3 py-1 text-sm"
                      placeholder="Search order/customer"
                      value={orderSearch}
                      onChange={(event) => setOrderSearch(event.target.value)}
                    />
                    <select className="rounded border border-slate-300 px-3 py-1 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                      <option value="">All Status</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={exportOrdersCsv}>Export CSV</button>
                  </div>
                </div>

                <div className="mt-3 max-h-[440px] space-y-2 overflow-y-auto pr-1">
                  {visibleOrders.map((order) => (
                    <div key={order._id} className="rounded border border-slate-200 p-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800">{order._id.slice(-8).toUpperCase()}</p>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600">{order.user?.name || 'Unknown'} | {order.user?.email || 'N/A'}</p>
                      <p className="mt-1 text-slate-500">${Number(order.total).toFixed(2)} on {new Date(order.createdAt).toLocaleString()}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                          <button
                            key={`${order._id}-${status}`}
                            className={`rounded border px-2 py-1 text-xs ${order.status === status ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-300 text-slate-600'}`}
                            onClick={() => updateStatus(order._id, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {visibleOrders.length === 0 && (
                    <div className="rounded border border-slate-200 p-3 text-sm text-slate-500">No orders matched current filters.</div>
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboardPage;
