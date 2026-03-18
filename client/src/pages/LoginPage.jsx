import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setAuthSession } from '../api/auth';
import { loginRequest } from '../api/authApi';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    return location.state?.from || '/';
  }, [location.state]);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = await loginRequest(form);
      setAuthSession(payload);
      toast.success('Login successful');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container-shell py-8">
        <section className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card lg:grid-cols-2">
          <div className="bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-7 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Welcome Back</p>
            <h1 className="mt-2 font-display text-3xl font-bold">Sign in to continue shopping</h1>
            <p className="mt-3 max-w-md text-sm text-blue-100">Track orders, save addresses, and complete checkout faster with your account.</p>
          </div>

          <form className="p-7" onSubmit={onSubmit}>
            <h2 className="font-display text-2xl font-semibold text-slate-900">Login</h2>
            <p className="mt-1 text-sm text-slate-500">Use your account credentials to continue.</p>

            <label className="mt-5 block text-sm font-medium text-slate-700">Email</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
            />

            <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter password"
            />

            <button className="mt-5 w-full rounded-lg bg-brand-500 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="mt-4 text-sm text-slate-600">
              New here? <Link to="/signup" className="font-medium text-brand-700">Create an account</Link>
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;
