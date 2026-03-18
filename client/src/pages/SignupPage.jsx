import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { setAuthSession } from '../api/auth';
import { registerRequest } from '../api/authApi';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = await registerRequest({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setAuthSession(payload);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container-shell py-8">
        <section className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card lg:grid-cols-2">
          <div className="bg-[linear-gradient(135deg,#14532d,#16a34a)] p-7 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Create Account</p>
            <h1 className="mt-2 font-display text-3xl font-bold">Start your shopping journey</h1>
            <p className="mt-3 max-w-md text-sm text-emerald-100">Create your profile to save carts, access faster checkout, and manage orders.</p>
          </div>

          <form className="p-7" onSubmit={onSubmit}>
            <h2 className="font-display text-2xl font-semibold text-slate-900">Sign Up</h2>
            <p className="mt-1 text-sm text-slate-500">Create your account in under a minute.</p>

            <label className="mt-5 block text-sm font-medium text-slate-700">Full Name</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="John Carter"
            />

            <label className="mt-4 block text-sm font-medium text-slate-700">Email</label>
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
              placeholder="Minimum 6 characters"
            />

            <label className="mt-4 block text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Re-enter password"
            />

            <button className="mt-5 w-full rounded-lg bg-brand-500 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="mt-4 text-sm text-slate-600">
              Already have an account? <Link to="/login" className="font-medium text-brand-700">Sign in</Link>
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default SignupPage;
