import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { fetchFeaturedProducts, clearProductError } from '../features/products/productSlice';
import { addToCart, clearCartError } from '../features/cart/cartSlice';

const dealItems = [
  { name: 'Smart watches', discount: '-25%', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300' },
  { name: 'Laptops', discount: '-15%', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300' },
  { name: 'GoPro cameras', discount: '-40%', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300' },
  { name: 'Headphones', discount: '-25%', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300' },
  { name: 'Canon cameras', discount: '-25%', image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=300' },
];

const services = [
  'Source from Industry Hubs',
  'Customize Your Products',
  'Fast reliable shipping',
  'Product monitoring and inspection',
];

const countries = ['UAE', 'Australia', 'United States', 'Russia', 'Italy', 'Denmark', 'France', 'Arabic Emirates', 'China', 'Great Britain'];

function HomePage() {
  const dispatch = useDispatch();
  const {
    featured,
    featuredLoading,
    error: productError,
  } = useSelector((state) => state.products);
  const { error: cartError } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  useEffect(() => {
    if (productError) {
      toast.error(productError);
      dispatch(clearProductError());
    }
  }, [dispatch, productError]);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
      dispatch(clearCartError());
    }
  }, [dispatch, cartError]);

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="container-shell space-y-8 py-6">
        <section className="grid gap-4 lg:grid-cols-12">
          <aside className="panel hidden p-4 lg:col-span-3 lg:block">
            <ul className="space-y-2 text-sm text-slate-700">
              {['Automobiles', 'Clothes and wear', 'Home interiors', 'Computer and tech', 'Tools', 'Sports and outdoor', 'Animal and pets', 'Machinery tools', 'More category'].map((item) => (
                <li key={item} className="rounded px-2 py-1 hover:bg-slate-100">{item}</li>
              ))}
            </ul>
          </aside>

          <div className="panel overflow-hidden p-6 lg:col-span-6" style={{ background: 'linear-gradient(120deg, var(--hero-a), var(--hero-b))' }}>
            <p className="text-sm font-medium text-slate-700">Latest trending</p>
            <h1 className="mt-1 max-w-sm font-display text-3xl font-bold text-slate-900">Electronic items</h1>
            <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Learn more</button>
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=620" alt="Hero product" className="mt-5 h-56 w-full rounded-lg object-cover" />
          </div>

          <aside className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:col-span-3 lg:block lg:space-y-4">
            <div className="panel p-4">
              <p className="text-sm text-slate-600">Hi, user lets get started</p>
              <button className="mt-3 w-full rounded bg-brand-500 py-2 text-sm font-semibold text-white">Join now</button>
              <button className="mt-2 w-full rounded border border-slate-300 py-2 text-sm">Log in</button>
            </div>
            <div className="rounded-xl bg-orange-500 p-4 text-sm text-white">Get US $10 off with a new supplier</div>
            <div className="rounded-xl bg-cyan-500 p-4 text-sm text-white">Send quotes with supplier preferences</div>
          </aside>
        </section>

        <section className="panel p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="section-title">Deals and offers</h2>
              <p className="text-sm text-slate-500">Hygiene equipments</p>
            </div>
            <div className="flex gap-2 text-center text-xs font-semibold">
              {['04h', '13m', '34s', '56ms'].map((time) => (
                <span key={time} className="rounded bg-slate-900 px-2 py-1 text-white">{time}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {dealItems.map((item) => (
              <article key={item.name} className="rounded-lg border border-slate-200 p-3 text-center">
                <img src={item.image} alt={item.name} className="mx-auto h-28 w-full rounded object-cover" />
                <p className="mt-2 text-sm font-medium">{item.name}</p>
                <span className="badge-chip mt-2 inline-block">{item.discount}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="panel flex items-end p-5" style={{ background: 'linear-gradient(150deg, #d8ffe7, #dff3ff)' }}>
            <div>
              <h3 className="font-display text-2xl font-semibold">Home and outdoor</h3>
              <button className="mt-3 rounded bg-white px-4 py-2 text-sm font-semibold">Source now</button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Soft chairs', 'Sofa and chair', 'Kitchen dishes', 'Smart watches', 'Kitchen mixer', 'Blenders', 'Home appliance', 'Coffee maker'].map((item, i) => (
              <article key={item} className="panel p-3">
                <img src={`https://picsum.photos/seed/home-${i + 1}/260/160`} alt={item} className="h-24 w-full rounded object-cover" />
                <p className="mt-2 text-sm font-medium">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="panel flex items-end p-5" style={{ background: 'linear-gradient(150deg, #ffe9df, #ffe7b3)' }}>
            <div>
              <h3 className="font-display text-2xl font-semibold">Consumer electronics and gadgets</h3>
              <button className="mt-3 rounded bg-white px-4 py-2 text-sm font-semibold">Source now</button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['Smart watches', 'Cameras', 'Headphones', 'Smart watches', 'Gaming set', 'Laptops and PC', 'Smartphones', 'Electric kettle'].map((item, i) => (
              <article key={`${item}-${i}`} className="panel p-3">
                <img src={`https://picsum.photos/seed/electronics-${i + 1}/260/160`} alt={item} className="h-24 w-full rounded object-cover" />
                <p className="mt-2 text-sm font-medium">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-xl bg-[linear-gradient(120deg,#0f3b79,#1f6bff)] p-5 text-white lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-semibold">An easy way to send requests to all suppliers</h3>
            <p className="mt-2 text-sm text-blue-100">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </div>
          <form className="rounded-lg bg-white p-4 text-slate-700">
            <h4 className="font-display font-semibold">Send quote to suppliers</h4>
            <input className="mt-3 w-full rounded border border-slate-300 px-3 py-2" placeholder="What item you need?" />
            <textarea className="mt-2 h-24 w-full rounded border border-slate-300 px-3 py-2" placeholder="Type more details" />
            <div className="mt-2 flex gap-2">
              <select className="rounded border border-slate-300 px-3 py-2">
                <option>Quantity</option>
              </select>
              <button className="rounded bg-brand-500 px-4 py-2 font-semibold text-white">Send Inquiry</button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="section-title mb-4">Recommended items</h2>
          {featuredLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }, (_, index) => (
                <article key={index} className="panel overflow-hidden p-3">
                  <div className="h-28 w-full animate-pulse rounded-lg bg-slate-200" />
                  <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                </article>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {featured.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  compact
                  showDescription
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="panel p-4 text-sm text-slate-600">No featured products available right now.</div>
          )}
        </section>

        <section>
          <h2 className="section-title mb-4">Our extra services</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <article key={service} className="panel overflow-hidden">
                <img src={`https://picsum.photos/seed/service-${i + 1}/320/140`} alt={service} className="h-28 w-full object-cover" />
                <p className="p-3 text-sm font-semibold">{service}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-4">Suppliers by region</h2>
          <div className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
            {countries.map((country) => (
              <div key={country} className="rounded border border-slate-200 px-3 py-2 text-sm text-slate-600">
                <strong className="mr-2 text-slate-900">[{country.slice(0, 2).toUpperCase()}]</strong>
                {country}
              </div>
            ))}
          </div>
        </section>

        <section className="panel bg-slate-50 p-6 text-center">
          <h3 className="font-display text-2xl font-semibold">Subscribe on our newsletter</h3>
          <p className="mt-2 text-sm text-slate-500">Get daily news on upcoming offers from many suppliers all over the world</p>
          <div className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
            <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Email" />
            <button className="rounded bg-brand-500 px-4 py-2 font-semibold text-white">Subscribe</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
