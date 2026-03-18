import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import { isAuthenticated } from '../api/auth';

function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/my');
        setOrders(response.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#fff7ed,#ffedd5)] p-6">
          <h1 className="font-display text-3xl font-bold text-slate-900">My Orders</h1>
          <p className="mt-2 text-sm text-slate-600">Review order status, download invoices, and quickly reorder items.</p>
        </section>

        <section className="panel overflow-x-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-16 animate-pulse rounded bg-slate-200" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-sm text-slate-600">
              No orders yet. <Link to="/products" className="font-semibold text-brand-700">Start shopping</Link>
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-2 py-3 font-medium">Order ID</th>
                  <th className="px-2 py-3 font-medium">Date</th>
                  <th className="px-2 py-3 font-medium">Total</th>
                  <th className="px-2 py-3 font-medium">Status</th>
                  <th className="px-2 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-100">
                    <td className="px-2 py-3 font-semibold text-slate-800">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-2 py-3 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-2 py-3 text-slate-600">${Number(order.total).toFixed(2)}</td>
                    <td className="px-2 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{order.status}</span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/orders/${order._id}`} className="text-sm font-medium text-brand-700">View</Link>
                        <Link to="/products" className="text-sm font-medium text-slate-600">Reorder</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OrdersPage;
