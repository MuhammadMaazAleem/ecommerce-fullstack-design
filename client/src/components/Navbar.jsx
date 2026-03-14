import { Link } from 'react-router-dom';

const topLinks = ['Profile', 'Message', 'Orders', 'My Cart'];
const menuLinks = ['All category', 'Hot offers', 'Gift boxes', 'Projects', 'Menu item', 'Help'];

function Navbar() {
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
              />
              <select className="border-y border-slate-200 px-3 py-2 text-sm md:border-y-0 md:border-l">
                <option>All category</option>
                <option>Electronics</option>
                <option>Fashion</option>
              </select>
              <button className="bg-brand-500 px-5 py-2 text-sm font-semibold text-white">Search</button>
            </div>
          </div>

          <button className="ml-auto rounded-md border border-slate-200 p-2 text-sm md:hidden">Menu</button>
          <nav className="hidden items-center gap-4 md:flex">
            {topLinks.map((link) => (
              <Link
                key={link}
                to={link === 'My Cart' ? '/cart' : '/products'}
                className="text-sm font-medium text-slate-600 hover:text-brand-700"
              >
                {link}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-4 hidden items-center justify-between border-t border-slate-100 pt-3 text-sm md:flex">
          <div className="flex gap-5">
            {menuLinks.map((link) => (
              <a key={link} href="#" className="text-slate-600 hover:text-brand-700">
                {link}
              </a>
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
