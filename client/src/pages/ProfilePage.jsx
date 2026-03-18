import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const quickStats = [
  { label: 'Orders', value: '24' },
  { label: 'Wishlist', value: '8' },
  { label: 'Saved Carts', value: '3' },
  { label: 'Coupons', value: '5' },
];

function ProfilePage() {
  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#e0f2fe,#dbeafe)] p-6">
          <p className="text-sm text-slate-600">Account Overview</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">Welcome back, Shopper</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Manage your profile details, saved addresses, and order preferences in one place.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((item) => (
            <article key={item.label} className="panel p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-slate-900">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <article className="panel p-5">
            <h2 className="section-title">Profile Information</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input className="rounded border border-slate-300 px-3 py-2" defaultValue="John Carter" />
              <input className="rounded border border-slate-300 px-3 py-2" defaultValue="john.carter@email.com" />
              <input className="rounded border border-slate-300 px-3 py-2" defaultValue="+1 210 555 6012" />
              <input className="rounded border border-slate-300 px-3 py-2" defaultValue="United States" />
            </div>
            <button className="mt-4 rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Save Changes</button>
          </article>

          <article className="panel p-5">
            <h2 className="section-title">Shipping Address</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><strong>Default:</strong> 245 Market Street, San Diego, CA</p>
              <p><strong>ZIP:</strong> 92101</p>
              <p><strong>Delivery Notes:</strong> Leave at front desk.</p>
            </div>
            <button className="mt-4 rounded border border-slate-300 px-4 py-2 text-sm font-medium">Update Address</button>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;
