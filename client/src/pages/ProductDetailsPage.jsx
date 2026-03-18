import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProductById, clearProductError } from '../features/products/productSlice';
import { addToCart, clearCartError } from '../features/cart/cartSlice';

const related = new Array(6).fill(null).map((_, i) => ({
  id: i + 1,
  name: `Product item ${i + 1}`,
  price: '$32.00 - $40.00',
  image: `https://picsum.photos/seed/related-${i + 1}/220/150`,
}));
const mayLike = new Array(5).fill(null).map((_, i) => ({
  id: i + 1,
  name: `Men blazer set elegant formal ${i + 1}`,
  price: '$7.00 - $99.50',
  image: `https://picsum.photos/seed/like-${i + 1}/160/120`,
}));

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState('');

  const {
    singleProduct: product,
    productLoading,
    error: productError,
  } = useSelector((state) => state.products);
  const { error: cartError } = useSelector((state) => state.cart);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

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

  const thumbs = useMemo(() => {
    if (!product) return [];
    const gallery = [product.image, ...(product.images || [])].filter(Boolean);
    return Array.from(new Set(gallery));
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(addToCart({ productId: product.id || product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error);
    }
  };

  if (productLoading || !product) {
    return (
      <div>
        <Navbar />
        <main className="container-shell py-6">
          <section className="panel p-4">
            <div className="h-80 w-full animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-5 py-6">
        <p className="text-sm text-slate-500">Home &gt; Clothings &gt; Men&apos;s wear &gt; Summer clothing</p>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="panel p-4">
            <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-[360px_minmax(0,1fr)_260px]">
              <div>
                <img src={selectedImage || product.image} alt={product.name} className="h-80 w-full rounded-lg object-cover" />
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {thumbs.map((src) => (
                    <button key={src} onClick={() => setSelectedImage(src)}>
                      <img src={src} alt="Thumb" className="h-14 w-full rounded border border-slate-200 object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
                </p>
                <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">{product.name}</h1>
                <p className="mt-2 text-sm text-slate-600">Rating {product.rating} | {product.reviews} reviews | {product.sold} sold</p>

                <div className="mt-4 grid grid-cols-2 rounded-lg border border-slate-200 text-sm lg:grid-cols-3">
                  <div className="border-b border-r border-slate-200 p-3 lg:border-b-0">
                    <p className="font-semibold">${Number(product.price).toFixed(2)}</p>
                    <p className="text-slate-500">1 - 10 pcs</p>
                  </div>
                  <div className="bg-orange-50 border-b border-r border-slate-200 p-3 lg:border-b-0">
                    <p className="font-semibold text-orange-700">${Math.max(product.price * 0.92, 1).toFixed(2)}</p>
                    <p className="text-slate-500">11 - 50 pcs</p>
                  </div>
                  <div className="col-span-2 p-3 lg:col-span-1">
                    <p className="font-semibold">${Math.max(product.price * 0.85, 1).toFixed(2)}</p>
                    <p className="text-slate-500">51+ pcs</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Discount:</strong> {product.discount}%</p>
                  <p><strong>Shipping:</strong> {product.freeShipping ? 'Free Shipping' : 'Shipping charges apply'}</p>
                  <p><strong>Product ID:</strong> {product.id}</p>
                </div>

                <button
                  className="mt-4 rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleAddToCart}
                  disabled={product.stock < 1}
                >
                  Add to cart
                </button>
              </div>

              <aside className="rounded-lg border border-slate-200 p-4 lg:col-span-2 2xl:col-span-1">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-200 font-semibold">R</span>
                  <div>
                    <p className="font-semibold">{product.brand} Official</p>
                    <p className="text-sm text-slate-500">Global Seller</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Verified Seller</p>
                  <p>Worldwide shipping</p>
                </div>
                <button className="mt-4 w-full rounded bg-brand-500 py-2 text-sm font-semibold text-white" onClick={handleAddToCart}>Buy now</button>
                <button className="mt-2 w-full rounded border border-slate-300 py-2 text-sm">Seller profile</button>
                <button className="mt-2 w-full text-sm text-brand-700">Save for later</button>
              </aside>
            </div>
          </div>

          <aside className="panel p-4">
            <h3 className="font-display text-lg font-semibold">You may like</h3>
            <div className="mt-3 space-y-3">
              {mayLike.map((item) => (
                <article key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
                  <div>
                    <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.price}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="panel p-4">
            <div className="flex gap-5 border-b border-slate-200 pb-3 text-sm font-medium">
              {['Description', 'Reviews', 'Shipping', 'About seller'].map((tab, i) => (
                <button key={tab} className={i === 0 ? 'text-brand-700' : 'text-slate-500'}>{tab}</button>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">
              {product.description}
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border border-slate-200 text-sm">
                <tbody>
                  {[
                    ['Model', product.id],
                    ['Brand', product.brand],
                    ['Category', product.category],
                    ['Stock', String(product.stock)],
                    ['Reviews', String(product.reviews)],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-t border-slate-200">
                      <td className="w-1/3 bg-slate-50 p-2">{k}</td>
                      <td className="p-2">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              {(product.tags || []).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>

          <div />
        </section>

        <section>
          <h3 className="section-title mb-3">Related products</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {related.map((item) => (
              <article key={item.id} className="panel p-3">
                <img src={item.image} alt={item.name} className="h-24 w-full rounded object-cover" />
                <p className="mt-2 text-sm font-medium">{item.name}</p>
                <p className="text-xs text-slate-500">{item.price}</p>
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

export default ProductDetailsPage;
