import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const thumbs = new Array(6).fill(null).map((_, i) => `https://picsum.photos/seed/thumb-${i + 1}/120/100`);
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
  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-5 py-6">
        <p className="text-sm text-slate-500">Home &gt; Clothings &gt; Men&apos;s wear &gt; Summer clothing</p>

        <section className="grid gap-4 xl:grid-cols-[1fr_280px]">
          <div className="panel p-4">
            <div className="grid gap-5 lg:grid-cols-[360px_1fr_260px]">
              <div>
                <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700" alt="Main product" className="h-80 w-full rounded-lg object-cover" />
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {thumbs.map((src) => (
                    <img key={src} src={src} alt="Thumb" className="h-14 w-full rounded border border-slate-200 object-cover" />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-600">In stock</p>
                <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">Mens Long Sleeve T-shirt Cotton Base Layer Slim Muscle</h1>
                <p className="mt-2 text-sm text-slate-600">Rating 9.3 | 32 reviews | 154 sold</p>

                <div className="mt-4 grid grid-cols-2 rounded-lg border border-slate-200 text-sm lg:grid-cols-3">
                  <div className="border-b border-r border-slate-200 p-3 lg:border-b-0">
                    <p className="font-semibold">$90.00</p>
                    <p className="text-slate-500">50-100 pcs</p>
                  </div>
                  <div className="bg-orange-50 border-b border-r border-slate-200 p-3 lg:border-b-0">
                    <p className="font-semibold text-orange-700">$78.00</p>
                    <p className="text-slate-500">100-700 pcs</p>
                  </div>
                  <div className="col-span-2 p-3 lg:col-span-1">
                    <p className="font-semibold">$68.00</p>
                    <p className="text-slate-500">700+ pcs</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><strong>Price:</strong> Negotiable</p>
                  <p><strong>Type:</strong> Classic shoes</p>
                  <p><strong>Material:</strong> Plastic material</p>
                  <p><strong>Design:</strong> Modern nice</p>
                  <p><strong>Customization:</strong> Customized logo and custom packages</p>
                  <p><strong>Protection:</strong> Refund Policy</p>
                  <p><strong>Warranty:</strong> 2 years full warranty</p>
                </div>
              </div>

              <aside className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-200 font-semibold">R</span>
                  <div>
                    <p className="font-semibold">Guanjoi Trading LLC</p>
                    <p className="text-sm text-slate-500">Germany, Berlin</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>Verified Seller</p>
                  <p>Worldwide shipping</p>
                </div>
                <button className="mt-4 w-full rounded bg-brand-500 py-2 text-sm font-semibold text-white">Send inquiry</button>
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

        <section className="grid gap-4 xl:grid-cols-[1fr_280px]">
          <div className="panel p-4">
            <div className="flex gap-5 border-b border-slate-200 pb-3 text-sm font-medium">
              {['Description', 'Reviews', 'Shipping', 'About seller'].map((tab, i) => (
                <button key={tab} className={i === 0 ? 'text-brand-700' : 'text-slate-500'}>{tab}</button>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisl vitae purus finibus viverra. Cras aliquet diam vel lorem posuere, ac egestas odio fermentum.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border border-slate-200 text-sm">
                <tbody>
                  {[
                    ['Model', '#8786867'],
                    ['Style', 'Classic style'],
                    ['Certificate', 'ISO-898921212'],
                    ['Size', '34mm x 450mm x 19mm'],
                    ['Memory', '36GB RAM'],
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
              <li>Checked quality control process</li>
              <li>Eco-friendly manufacturing</li>
              <li>Warehouse delivery support</li>
              <li>Money-back guaranteed option</li>
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
