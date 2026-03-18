import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import {
  fetchProducts,
  fetchCategories,
  setFilters,
  resetFilters,
  clearProductError,
} from '../features/products/productSlice';
import { addToCart, clearCartError } from '../features/cart/cartSlice';

function ProductListingPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isGrid, setIsGrid] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const {
    items,
    categories,
    brands,
    filters,
    pagination,
    loading,
    error: productError,
  } = useSelector((state) => state.products);
  const { error: cartError } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search');
    const nextFilters = {};

    if (category !== null) {
      nextFilters.category = category;
    }
    if (sort !== null) {
      nextFilters.sort = sort;
    }
    if (search !== null) {
      nextFilters.search = search;
    }

    if (Object.keys(nextFilters).length > 0) {
      dispatch(setFilters({ ...nextFilters, page: 1 }));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchProducts());
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, filters]);

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

  const chips = useMemo(() => {
    const selected = [];
    if (filters.category) selected.push(filters.category);
    if (filters.brands.length > 0) selected.push(...filters.brands);
    if (filters.rating) selected.push(`${filters.rating}+ stars`);
    if (filters.minPrice || filters.maxPrice) {
      selected.push(`$${filters.minPrice || 0} - $${filters.maxPrice || 'Any'}`);
    }
    return selected;
  }, [filters]);

  const handleFilterChange = (payload) => {
    dispatch(setFilters(payload));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
  };

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
      <main className="container-shell space-y-5 py-6">
        <p className="text-sm text-slate-500">Home &gt; Clothings &gt; Men&apos;s wear &gt; Summer clothing</p>

        <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              brands={brands}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleClearFilters}
            />
          </div>

          <div className="space-y-4">
            <div className="panel flex flex-wrap items-center gap-3 p-4">
              <p className="font-semibold text-slate-800">{pagination.total} items found</p>
              <input
                className="min-w-[180px] flex-1 rounded border border-slate-300 px-3 py-1 text-sm md:flex-none"
                placeholder="Search products"
                value={filters.search}
                onChange={(event) => handleFilterChange({ search: event.target.value, page: 1 })}
              />
              <button
                className="rounded border border-slate-300 px-3 py-1 text-sm lg:hidden"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                {showFilters ? 'Hide filters' : 'Filter'}
              </button>
              <select
                className="ml-auto rounded border border-slate-300 px-3 py-1 text-sm"
                value={filters.sort}
                onChange={(event) => handleFilterChange({ sort: event.target.value, page: 1 })}
              >
                <option value="featured">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated</option>
                <option value="bestseller">Best Seller</option>
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
                <FilterSidebar
                  categories={categories}
                  brands={brands}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleClearFilters}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-sm">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full border border-slate-300 px-3 py-1 text-slate-600">
                  {chip}
                </span>
              ))}
              <button className="text-brand-700" onClick={handleClearFilters}>Clear all filter</button>
            </div>

            {loading ? (
              <div className={isGrid ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
                {Array.from({ length: 6 }, (_, index) => (
                  <article key={index} className="panel overflow-hidden p-3">
                    <div className="h-40 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  </article>
                ))}
              </div>
            ) : (
              <div className={isGrid ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
                {items.map((item) => (
                  <article key={item.id || item._id} className="panel overflow-hidden p-3">
                  <div className={`gap-4 ${isGrid ? 'block' : 'grid md:grid-cols-[220px_1fr]'}`}>
                    <img src={item.image} alt={item.name} className={`rounded-lg object-cover ${isGrid ? 'h-44 w-full' : 'h-44 w-full md:h-36'}`} />
                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-slate-800">{item.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="font-display text-xl font-semibold">${Number(item.price).toFixed(2)}</p>
                        {item.originalPrice > 0 && (
                          <p className="text-sm text-slate-400 line-through">${Number(item.originalPrice).toFixed(2)}</p>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Rating {item.rating} | {item.sold} sold | {item.freeShipping ? 'Free Shipping' : 'Shipping charges apply'}</p>
                      {!isGrid && (
                        <>
                          <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                          <Link to={`/product/${item.id || item._id}`} className="mt-2 inline-block text-sm font-medium text-brand-700">View details</Link>
                        </>
                      )}
                      <button
                        className="mt-3 rounded bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white"
                        onClick={() => handleAddToCart(item.id || item._id)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
                ))}
                {items.length === 0 && (
                  <div className="panel p-4 text-sm text-slate-600">No products matched your filters.</div>
                )}
              </div>
            )}

            <div className="panel flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  className="rounded border border-slate-300 px-2 py-1"
                  value={filters.limit}
                  onChange={(event) => handleFilterChange({ limit: Number(event.target.value), page: 1 })}
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </div>
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                <button
                  className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleFilterChange({ page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page <= 1}
                >
                  &lt;
                </button>
                {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
                  .slice(0, 5)
                  .map((page) => (
                    <button
                      key={page}
                      className={`rounded border px-3 py-1 ${filters.page === page ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-300'}`}
                      onClick={() => handleFilterChange({ page })}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  className="rounded border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => handleFilterChange({ page: Math.min(pagination.totalPages, filters.page + 1) })}
                  disabled={filters.page >= pagination.totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="panel bg-slate-50 p-6 text-center">
          <h3 className="font-display text-2xl font-semibold">Subscribe on our newsletter</h3>
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

export default ProductListingPage;
