import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const conversations = [
  {
    id: 1,
    seller: 'Aperture Official Store',
    message: 'Your camera lens is packed and ready for pickup.',
    time: '10:42 AM',
    unread: true,
  },
  {
    id: 2,
    seller: 'Nimbus Audio',
    message: 'We can offer free shipping for your next order.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 3,
    seller: 'CloudBook Devices',
    message: 'Invoice for your laptop purchase is now available.',
    time: 'Mon',
    unread: false,
  },
];

function MessagesPage() {
  return (
    <div>
      <Navbar />
      <main className="container-shell space-y-6 py-6 sm:py-8">
        <section className="rounded-2xl bg-[linear-gradient(120deg,#ecfeff,#dbeafe)] p-6">
          <h1 className="font-display text-3xl font-bold text-slate-900">Messages</h1>
          <p className="mt-2 text-sm text-slate-600">Track your conversations with suppliers and support in real time.</p>
        </section>

        <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <aside className="panel p-4">
            <h2 className="section-title">Inbox</h2>
            <div className="mt-3 space-y-2">
              {conversations.map((item) => (
                <button key={item.id} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left hover:border-brand-300 hover:bg-brand-50/40">
                  <p className="text-sm font-semibold text-slate-800">{item.seller}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.message}</p>
                </button>
              ))}
            </div>
          </aside>

          <article className="panel p-4">
            <h2 className="section-title">Recent Updates</h2>
            <div className="mt-4 space-y-3">
              {conversations.map((item) => (
                <div key={`thread-${item.id}`} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{item.seller}</p>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.message}</p>
                  {item.unread && <span className="mt-2 inline-block rounded bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">Unread</span>}
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default MessagesPage;
