import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearAuthUser, getAuthUser } from '../api/auth';
import { logoutRequest } from '../api/authApi';

const topLinks = [
  { label: 'Profile', to: '/profile' },
  { label: 'Message', to: '/messages' },
  { label: 'Orders', to: '/orders' },
  { label: 'My Cart', to: '/cart' },
];

const menuLinks = [
  { label: 'All category', to: '/products' },
  { label: 'Hot offers', to: '/products?sort=price_desc' },
  { label: 'Gift boxes', to: '/products?category=Accessories' },
  { label: 'Projects', to: '/products?category=Laptops' },
  { label: 'Menu item', to: '/products?sort=featured' },
  { label: 'Help', to: '/profile' },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = useSelector((state) => state.cart.cart?.totalItems || 0);
  const authUser = useMemo(() => getAuthUser(), [location.pathname]);
  const [search, setSearch] = useState('');

  const resolvedTopLinks = useMemo(() => {
    if (authUser?.role === 'admin') {
      return [...topLinks, { label: 'Admin', to: '/admin' }];
    }
    return topLinks;
  }, [authUser]);

  const handleSearchSubmit = () => {
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Continue local logout even if server revocation fails.
    } finally {
      clearAuthUser();
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell py-4">
        <div className="flex flex-wrap items-center gap-3 lg:gap-5">
          <Link to="/" className="font-display text-2xl font-bold text-brand-700">
            Brand.
          </Link>

          <div className="order-3 w-full rounded-lg border border-slate-200 md:order-2 md:flex-1 md:overflow-hidden lg:order-none">
            <div className="flex flex-col md:flex-row">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-3 py-2 text-sm outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <select className="border-y border-slate-200 px-3 py-2 text-sm md:border-y-0 md:border-l">
                <option>All category</option>
                <option>Electronics</option>
                <option>Fashion</option>
              </select>
              <button className="bg-brand-500 px-5 py-2 text-sm font-semibold text-white" onClick={handleSearchSubmit}>Search</button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <Link to="/products" className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium">Shop</Link>
            <Link to="/cart" className="rounded-md border border-brand-500 bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
              Cart ({cartCount})
            </Link>
            {authUser?.role === 'admin' && (
              <Link to="/admin" className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium">Admin</Link>
            )}
            {!authUser && (
              <>
                <Link to="/login" className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium">Login</Link>
                <Link to="/signup" className="rounded-md bg-brand-500 px-3 py-2 text-xs font-semibold text-white">Sign up</Link>
              </>
            )}
          </div>
          <nav className="hidden items-center gap-4 md:flex">
            {resolvedTopLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-slate-600 hover:text-brand-700"
              >
                {link.label === 'My Cart' ? `My Cart (${cartCount})` : link.label}
              </Link>
            ))}
            {authUser ? (
              <>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {authUser.name}
                </span>
                <button className="text-sm font-medium text-slate-600 hover:text-brand-700" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700">
                  Login
                </Link>
                <Link to="/signup" className="rounded-md bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="mt-4 hidden items-center justify-between border-t border-slate-100 pt-3 text-sm md:flex">
          <div className="flex flex-wrap gap-5">
            {menuLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-slate-600 hover:text-brand-700">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 text-slate-600">
            <span>English, USD</span>
            <span>Ship to: US</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
