import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import { isAuthenticated } from '../api/auth';

function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/orders/${id}` } });
      return;
    }

    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id, navigate]);

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#eff6ff,#dbeafe)] p-6">
          <h1 className="font-display text-3xl font-bold text-slate-900">Order Details</h1>
          <p className="mt-2 text-sm text-slate-600">Track status, shipping, and purchased items for this order.</p>
        </section>

        {loading ? (
          <section className="panel h-56 animate-pulse" />
        ) : order ? (
          <>
            <section className="panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="section-title">Order #{order._id.slice(-8).toUpperCase()}</h2>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">{order.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-800">Shipping</p>
                  <p className="mt-2 text-slate-600">{order.shippingAddress?.fullName}</p>
                  <p className="text-slate-600">{order.shippingAddress?.email}</p>
                  <p className="text-slate-600">{order.shippingAddress?.phone}</p>
                  <p className="text-slate-600">{order.shippingAddress?.addressLine}, {order.shippingAddress?.city}</p>
                </div>
                <div className="rounded border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-800">Payment Summary</p>
                  <div className="mt-2 space-y-1 text-slate-600">
                    <p>Method: {order.paymentMethod}</p>
                    <p>Subtotal: ${Number(order.subtotal).toFixed(2)}</p>
                    <p>Shipping: ${Number(order.shippingFee).toFixed(2)}</p>
                    <p>Tax: ${Number(order.tax).toFixed(2)}</p>
                    <p className="font-semibold text-slate-900">Total: ${Number(order.total).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel p-4">
              <h2 className="section-title">Items</h2>
              <div className="mt-3 space-y-2">
                {order.items.map((item, index) => (
                  <div key={`${item.productId?._id || item.productId || index}`} className="flex items-center justify-between gap-3 rounded border border-slate-200 p-3 text-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{item.name}</p>
                        <p className="text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-900">${Number(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <Link to="/orders" className="text-sm font-semibold text-brand-700">Back to orders</Link>
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

export default OrderDetailsPage;
