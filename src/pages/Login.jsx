import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@styleaura.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const fillDemo = () => {
    setEmail('admin@styleaura.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#200B3B] via-[#351556] to-[#1A062F] relative overflow-hidden">
      
      {/* Background Decorative Floral & Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 text-purple-400/20 text-3xl pointer-events-none">✦</div>
      <div className="absolute bottom-1/4 left-1/4 text-purple-400/20 text-2xl pointer-events-none">✦</div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-purple-200/50">
        
        {/* StyleAura Official Logo - Reference Image 2 */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-pink-400 to-purple-300 shadow-xl mb-4 group hover:scale-105 transition-transform duration-300">
            <img
              src="/assets/logo/styleaura-logo.png"
              alt="Official StyleAura Logo"
              className="w-full h-full object-cover rounded-full bg-white shadow-inner"
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D124D] tracking-tight font-serif">
            StyleAura
          </h1>
          <p className="text-xs text-purple-700/80 font-medium tracking-wide mt-1">
            Fashion Store CRM & Administration Portal
          </p>
        </div>

        {/* Form Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2D124D] mb-1.5 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-purple-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@styleaura.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 focus:bg-white text-sm text-[#2D124D] placeholder-purple-300 border border-purple-200/80 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D124D] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-purple-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-purple-50/50 hover:bg-purple-50 focus:bg-white text-sm text-[#2D124D] placeholder-purple-300 border border-purple-200/80 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-purple-500 hover:text-purple-800 p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-purple-700/80 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-400 border-purple-300"
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              onClick={fillDemo}
              className="text-purple-700 hover:text-purple-900 font-semibold underline decoration-dotted"
            >
              Fill Demo Credentials
            </button>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#7C3AED] hover:from-[#3B0764] hover:to-[#6D28D9] text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to CRM Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Security Notice */}
        <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-center gap-2 text-center text-[11px] text-purple-900/60 font-medium">
          <ShieldCheck className="w-4 h-4 text-purple-500 flex-shrink-0" />
          <span>StyleAura LocalStorage Frontend Demo Mode</span>
        </div>

      </div>

    </div>
  );
}
