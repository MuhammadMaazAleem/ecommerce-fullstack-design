import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import {
  fetchCart,
  updateCartItemQty,
  removeFromCart,
  clearCart,
  clearCartError,
} from '../features/cart/cartSlice';

const saved = new Array(4).fill(null).map((_, i) => ({
  id: i + 1,
  name: `GoPro HERO ${i + 7} Black Action Camera`,
  price: `$${(99 + i * 22).toFixed(2)}`,
  image: `https://picsum.photos/seed/save-${i + 1}/280/200`,
}));

function CartPage() {
  const dispatch = useDispatch();
  const {
    cart,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCartError());
    }
  }, [dispatch, error]);

  const subtotal = Number(cart?.totalPrice || 0);
  const tax = subtotal * 0.14;
  const total = subtotal + tax;

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success('Item removed');
    } catch (err) {
      toast.error(err);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await dispatch(updateCartItemQty({ productId, quantity })).unwrap();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h1 className="section-title mb-4">My cart ({cart?.totalItems || 0})</h1>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="panel h-24 animate-pulse" />
                ))}
              </div>
            ) : cart?.items?.length > 0 ? (
              cart.items.map((item) => (
                <CartItem
                  key={item.productId?.id || item.productId?._id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                  actionLoading={actionLoading}
                />
              ))
            ) : (
              <div className="panel p-4 text-sm text-slate-600">Your cart is empty. Add products from listing or home page.</div>
            )}

            <div className="flex flex-wrap justify-between gap-3">
              <Link to="/products" className="rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Back to shop</Link>
              <button className="rounded border border-slate-300 px-4 py-2 text-sm" onClick={handleClearCart} disabled={actionLoading}>Remove all</button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {['Secure payment', 'Customer support', 'Free delivery'].map((item) => (
                <div key={item} className="panel p-3 text-sm text-slate-600">{item}</div>
              ))}
            </div>
          </div>

          <aside className="panel h-fit p-4">
            <p className="text-sm font-medium">Have a coupon?</p>
            <div className="mt-2 flex gap-2">
              <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Add coupon" />
              <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Apply</button>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-emerald-600"><span>Tax (14%):</span><span>${tax.toFixed(2)}</span></div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-xl font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link to="/checkout" className="mt-4 block w-full rounded bg-emerald-600 py-2 text-center font-semibold text-white">Checkout</Link>
              <div className="mt-3 flex justify-center gap-2 text-xs text-slate-500">
                <span className="rounded bg-slate-100 px-2 py-1">Visa</span>
                <span className="rounded bg-slate-100 px-2 py-1">Mastercard</span>
                <span className="rounded bg-slate-100 px-2 py-1">PayPal</span>
                <span className="rounded bg-slate-100 px-2 py-1">Apple Pay</span>
              </div>
            </div>
          </aside>
        </section>

        <section>
          <h2 className="section-title mb-4">Saved for later</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {saved.map((item) => (
              <article key={item.id} className="panel p-3">
                <img src={item.image} alt={item.name} className="h-36 w-full rounded object-cover" />
                <p className="mt-2 font-display text-lg font-semibold">{item.price}</p>
                <p className="text-sm text-slate-600">{item.name}</p>
                <button className="mt-3 rounded bg-brand-500 px-3 py-2 text-sm font-semibold text-white">Move to cart</button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-[linear-gradient(120deg,#f97316,#fb923c)] px-5 py-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold">Super discount on more than 100 USD</h3>
            <button className="rounded bg-white px-4 py-2 font-semibold text-orange-600">Shop now</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CartPage;
