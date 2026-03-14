import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';

const cartItems = [
  { id: 1, name: 'T-shirts with multiple colors, for men and lady', price: '78.99', qty: 9, image: 'https://picsum.photos/seed/cart-1/200/180' },
  { id: 2, name: 'T-shirts with multiple colors, for men and lady', price: '39.00', qty: 3, image: 'https://picsum.photos/seed/cart-2/200/180' },
  { id: 3, name: 'T-shirts with multiple colors, for men and lady', price: '170.50', qty: 1, image: 'https://picsum.photos/seed/cart-3/200/180' },
];

const saved = new Array(4).fill(null).map((_, i) => ({
  id: i + 1,
  name: `GoPro HERO ${i + 7} Black Action Camera`,
  price: `$${(99 + i * 22).toFixed(2)}`,
  image: `https://picsum.photos/seed/save-${i + 1}/280/200`,
}));

function CartPage() {
  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6">
        <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div>
            <h1 className="section-title mb-4">My cart (3)</h1>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <div className="flex flex-wrap justify-between gap-3">
              <button className="rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Back to shop</button>
              <button className="rounded border border-slate-300 px-4 py-2 text-sm">Remove all</button>
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
              <div className="flex justify-between"><span>Subtotal:</span><span>$1403.97</span></div>
              <div className="flex justify-between text-red-500"><span>Discount:</span><span>-$60.00</span></div>
              <div className="flex justify-between text-emerald-600"><span>Tax:</span><span>+$14.00</span></div>
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-xl font-semibold">
                <span>Total:</span>
                <span>$1357.97</span>
              </div>
              <button className="mt-4 w-full rounded bg-emerald-600 py-2 font-semibold text-white">Checkout</button>
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
