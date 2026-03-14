import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';

const items = new Array(9).fill(null).map((_, i) => ({
  id: i + 1,
  name: `Canon C${i + 10} camera black, 100x zoom`,
  price: '99.50',
  oldPrice: '1128.00',
  rating: (7.2 + i * 0.1).toFixed(1),
  orders: 120 + i * 8,
  image: `https://picsum.photos/seed/list-${i + 1}/360/240`,
}));

const chips = ['Samsung', 'Apple', 'Poco', 'Metallic', '4 star', '3 star'];

function ProductListingPage() {
  const [isGrid, setIsGrid] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const visibleItems = useMemo(() => items, []);

  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-5 py-6">
        <p className="text-sm text-slate-500">Home &gt; Clothings &gt; Men&apos;s wear &gt; Summer clothing</p>

        <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          <div className="space-y-4">
            <div className="panel flex flex-wrap items-center gap-3 p-4">
              <p className="font-semibold text-slate-800">12,911 items in Mobile accessory</p>
              <button
                className="rounded border border-slate-300 px-3 py-1 text-sm lg:hidden"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                {showFilters ? 'Hide filters' : 'Filter'}
              </button>
              <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" /> Verified only
              </label>
              <select className="rounded border border-slate-300 px-3 py-1 text-sm">
                <option>Featured</option>
              </select>
              <div className="flex gap-1">
                <button
                  className={`rounded border px-3 py-1 text-sm ${isGrid ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-300'}`}
                  onClick={() => setIsGrid(true)}
                >
                  Grid
                </button>
                <button
                  className={`rounded border px-3 py-1 text-sm ${!isGrid ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-300'}`}
                  onClick={() => setIsGrid(false)}
                >
                  List
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="lg:hidden">
                <FilterSidebar />
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-sm">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full border border-slate-300 px-3 py-1 text-slate-600">
                  {chip} x
                </span>
              ))}
              <button className="text-brand-700">Clear all filter</button>
            </div>

            <div className={isGrid ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
              {visibleItems.map((item) => (
                <article key={item.id} className="panel overflow-hidden p-3">
                  <div className={`gap-4 ${isGrid ? 'block' : 'grid md:grid-cols-[220px_1fr]'}`}>
                    <img src={item.image} alt={item.name} className={`rounded-lg object-cover ${isGrid ? 'h-44 w-full' : 'h-44 w-full md:h-36'}`} />
                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="font-display text-xl font-semibold">${item.price}</p>
                        <p className="text-sm text-slate-400 line-through">${item.oldPrice}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Rating {item.rating} | {item.orders} orders | Free Shipping</p>
                      {!isGrid && (
                        <>
                          <p className="mt-2 text-sm text-slate-500">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi.
                          </p>
                          <a href="#" className="mt-2 inline-block text-sm font-medium text-brand-700">View details</a>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="panel flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select className="rounded border border-slate-300 px-2 py-1">
                  <option>10</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button className="rounded border border-slate-300 px-3 py-1">&lt;</button>
                <button className="rounded border border-brand-500 bg-brand-50 px-3 py-1 text-brand-700">1</button>
                <button className="rounded border border-slate-300 px-3 py-1">2</button>
                <button className="rounded border border-slate-300 px-3 py-1">3</button>
                <button className="rounded border border-slate-300 px-3 py-1">&gt;</button>
              </div>
            </div>
          </div>
        </section>

        <section className="panel bg-slate-50 p-6 text-center">
          <h3 className="font-display text-2xl font-semibold">Subscribe on our newsletter</h3>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Email" />
            <button className="rounded bg-brand-500 px-4 py-2 font-semibold text-white">Subscribe</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ProductListingPage;
