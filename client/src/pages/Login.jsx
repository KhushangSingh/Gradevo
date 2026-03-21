import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const serverMsg = err.response?.data?.message || '';
      const isNotFound =
        serverMsg.toLowerCase().includes('invalid credentials') ||
        serverMsg.toLowerCase().includes('not found') ||
        err.response?.status === 401;

      if (isNotFound) {
        addToast('No account found. Redirecting to registration…', 'error', 3000);
        setTimeout(() => navigate('/register'), 3000);
      } else {
        addToast(serverMsg || 'Login failed', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors group"
      >
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        Back to Home
      </Link>

      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-4">
                <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Sign in to view your academic rank</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase ml-1">College Email</label>
            <input
                type="email"
                className="w-full bg-slate-50 border border-slate-200 hover:border-primary/50 hover:bg-white rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="sheersh@college.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 uppercase ml-1">Password</label>
            <input
                type="password"
                className="w-full bg-slate-50 border border-slate-200 hover:border-primary/50 hover:bg-white rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <button type="submit" className="bg-primary hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95 mt-2">
            Sign In
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-primary hover:text-orange-600 transition-colors font-medium">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
