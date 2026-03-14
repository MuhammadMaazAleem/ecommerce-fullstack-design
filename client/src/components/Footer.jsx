function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-6">
        <div>
          <h3 className="font-display text-xl font-bold text-brand-700">Brand.</h3>
          <p className="mt-3 text-sm text-slate-500">Best information about the company and services.</p>
          <div className="mt-4 flex gap-2 text-xs text-slate-500">
            <span className="rounded bg-slate-100 px-2 py-1">FB</span>
            <span className="rounded bg-slate-100 px-2 py-1">IG</span>
            <span className="rounded bg-slate-100 px-2 py-1">YT</span>
            <span className="rounded bg-slate-100 px-2 py-1">IN</span>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold">About</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>About Us</li>
            <li>Find store</li>
            <li>Categories</li>
            <li>Blogs</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">Partnership</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>About Us</li>
            <li>Find store</li>
            <li>Categories</li>
            <li>Blogs</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">Information</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Help Center</li>
            <li>Money Refund</li>
            <li>Shipping</li>
            <li>Contact us</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">For users</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Login</li>
            <li>Register</li>
            <li>Settings</li>
            <li>My Orders</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold">Get app</h4>
          <div className="mt-3 space-y-2 text-sm">
            <button className="w-full rounded bg-slate-900 px-3 py-2 text-white">App Store</button>
            <button className="w-full rounded bg-slate-900 px-3 py-2 text-white">Google Play</button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-slate-500">
          <span>2023 Ecommerce</span>
          <span>English - US</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
