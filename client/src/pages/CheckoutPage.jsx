import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import { clearCart } from '../features/cart/cartSlice';
import { getAuthUser } from '../api/auth';

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = getAuthUser();
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    city: '',
    addressLine: '',
    paymentMethod: 'Card',
  });

  const cart = useSelector((state) => state.cart.cart);
  const subtotal = Number(cart?.totalPrice || 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.14;
  const total = subtotal + shipping + tax;

  const lineItems = useMemo(() => {
    return cart?.items || [];
  }, [cart?.items]);

  const onFieldChange = (event) => {
    setCheckoutForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const placeOrder = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!lineItems.length) {
      toast.error('Your cart is empty');
      navigate('/products');
      return;
    }

    if (!checkoutForm.fullName || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.city || !checkoutForm.addressLine) {
      toast.error('Please complete all delivery fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/orders', {
        items: lineItems.map((item) => ({
          productId: item.productId?._id || item.productId?.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: checkoutForm.fullName,
          email: checkoutForm.email,
          phone: checkoutForm.phone,
          city: checkoutForm.city,
          addressLine: checkoutForm.addressLine,
        },
        paymentMethod: checkoutForm.paymentMethod,
      });
      await dispatch(clearCart()).unwrap();
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#dcfce7,#f0fdf4)] p-6">
          <h1 className="font-display text-3xl font-bold text-slate-900">Secure Checkout</h1>
          <p className="mt-2 text-sm text-slate-600">Review your order details and complete payment securely.</p>
        </section>

        {!user && (
          <section className="panel p-4 text-sm text-slate-600">
            Please <Link to="/login" className="font-semibold text-brand-700">sign in</Link> or <Link to="/signup" className="font-semibold text-brand-700">create an account</Link> to place your order.
          </section>
        )}

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="panel p-4">
            <h2 className="section-title">Delivery Information</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className="rounded border border-slate-300 px-3 py-2" name="fullName" value={checkoutForm.fullName} onChange={onFieldChange} placeholder="Full Name" />
              <input className="rounded border border-slate-300 px-3 py-2" name="email" value={checkoutForm.email} onChange={onFieldChange} placeholder="Email" />
              <input className="rounded border border-slate-300 px-3 py-2" name="phone" value={checkoutForm.phone} onChange={onFieldChange} placeholder="Phone Number" />
              <input className="rounded border border-slate-300 px-3 py-2" name="city" value={checkoutForm.city} onChange={onFieldChange} placeholder="City" />
              <input className="rounded border border-slate-300 px-3 py-2 md:col-span-2" name="addressLine" value={checkoutForm.addressLine} onChange={onFieldChange} placeholder="Street Address" />
            </div>

            <h2 className="section-title mt-6">Payment Method</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {['Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <label key={method} className="flex cursor-pointer items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm">
                  <input type="radio" name="paymentMethod" checked={checkoutForm.paymentMethod === method} onChange={onFieldChange} value={method} />
                  {method}
                </label>
              ))}
            </div>

            <h2 className="section-title mt-6">Order Items</h2>
            <div className="mt-3 space-y-2">
              {lineItems.length > 0 ? lineItems.map((item) => (
                <div key={item.productId?.id || item.productId?._id} className="flex items-center justify-between rounded border border-slate-200 p-3 text-sm">
                  <span className="line-clamp-1 pr-2">{item.productId?.name || 'Product'}</span>
                  <span className="font-medium">{item.quantity} x ${Number(item.price).toFixed(2)}</span>
                </div>
              )) : (
                <div className="rounded border border-slate-200 p-3 text-sm text-slate-500">No items in cart.</div>
              )}
            </div>
          </div>

          <aside className="panel h-fit p-4">
            <h3 className="font-display text-xl font-semibold text-slate-900">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <button
                className="mt-4 w-full rounded bg-emerald-600 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || !lineItems.length}
                onClick={placeOrder}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
              <Link to="/cart" className="mt-3 inline-block text-sm font-medium text-brand-700">Back to cart</Link>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
