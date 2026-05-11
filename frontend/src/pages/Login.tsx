import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      if (data.token && data.user) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh dark:bg-slate-950 px-4 transition-colors duration-300 grain-overlay">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <CheckCircle2 size={32} />
            </div>
            <span className="text-3xl font-black tracking-tight dark:text-white">CollabFlow</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-600 dark:text-slate-400">Welcome back to excellence.</h2>
        </div>

        <div className="card p-10 shadow-lift">
          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@company.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className={`btn-primary w-full py-4 text-lg group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm font-medium text-slate-500">
              New to the platform?{' '}
              <Link to="/register" className="text-primary hover:text-primary-hover font-bold transition-colors">
                Initialize Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
