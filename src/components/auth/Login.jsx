'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, 
  Sparkles, Tv
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaOm } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/lib/store/useAuthStore';

export default function LoginPage() {
  const { signIn, googleLogin, isAuthenticated, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    const result = await signIn(email, password);
    if (result.success) {
      toast.success('Welcome back! 🙏');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await googleLogin();
    if (result.success) {
      toast.success('Welcome to Aarambh TV! 🙏');
    } else {
      toast.error(result.error || 'Google login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"  // ← Changed from max-w-5xl to max-w-2xl for better width
    >
      <div className="bg-white/95 dark:bg-brown-800/95 backdrop-blur-sm rounded-2xl border-2 border-gold/30 dark:border-gold/20 shadow-2xl px-8 md:px-10 py-8">

        {/* Logo + Heading */}
        <div className="flex items-center gap-4 mb-5">
          <div className="p-2.5 bg-gradient-to-br from-saffron/10 to-gold/10 rounded-full border border-gold/20">
            <FaOm className="w-10 h-10 text-saffron flex-shrink-0" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brown-900 dark:text-cream-50 leading-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-brown-500 dark:text-cream-50/60">
              Sign in to continue your spiritual journey
            </p>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-saffron/10 dark:bg-saffron/20 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-saffron" />
            <span className="text-[10px] font-medium text-brown-700 dark:text-cream-50/70">Daily Panchang</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-saffron/10 dark:bg-saffron/20 rounded-full">
            <Tv className="w-3.5 h-3.5 text-saffron" />
            <span className="text-[10px] font-medium text-brown-700 dark:text-cream-50/70">Bhajans</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 dark:bg-gold/20 rounded-full">
            <Tv className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] font-medium text-brown-700 dark:text-cream-50/70">Spiritual Videos</span>
          </div>
        </div>

        {/* ─── GOOGLE SIGN IN - ENHANCED ─── */}
        <motion.button
          onClick={handleGoogleLogin}
          disabled={loading}
          onMouseEnter={() => setIsGoogleHovered(true)}
          onMouseLeave={() => setIsGoogleHovered(false)}
          className="relative w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer group mb-5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Outer Glow */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-saffron via-gold to-saffron opacity-25 group-hover:opacity-50 blur-sm transition-opacity duration-300" />
          
          {/* Main Button Background */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/90 via-cream-50/90 to-white/90 dark:from-brown-700/90 dark:via-brown-800/90 dark:to-brown-700/90 border-2 border-gold/40 dark:border-gold/30 group-hover:border-gold/60 transition-all duration-300" />
          
          {/* Hover Background Overlay */}
          <div 
            className={`absolute inset-0 rounded-xl bg-gradient-to-r from-saffron/10 via-gold/10 to-saffron/10 transition-opacity duration-300 ${
              isGoogleHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-3 text-brown-700 dark:text-cream-50/90">
            <FcGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </span>
        </motion.button>

        {/* Divider */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gold/20 dark:border-gold/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-brown-800 px-4 text-xs text-brown-400 dark:text-cream-50/40 uppercase tracking-wider">
              Or sign in with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 rounded-lg border border-divine-red/50 bg-divine-red/10 p-3"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-divine-red" />
                <p className="text-sm text-divine-red">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brown-700 dark:text-cream-50/80 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 dark:text-cream-50/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50/50 dark:bg-brown-900/50 border-2 border-gold/20 dark:border-gold/10 rounded-xl focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30 text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-brown-700 dark:text-cream-50/80">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-gold hover:text-saffron transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 dark:text-cream-50/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-cream-50/50 dark:bg-brown-900/50 border-2 border-gold/20 dark:border-gold/10 rounded-xl focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30 text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 dark:hover:text-cream-50/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gold/30 text-saffron focus:ring-saffron/20"
              />
              <span className="text-sm text-brown-600 dark:text-cream-50/60">Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-saffron to-gold px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-saffron/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </>
              )}
            </span>
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-5 text-center">
          <p className="text-sm text-brown-600 dark:text-cream-50/60">
            Don't have an account?{' '}
            <Link href="/signup" className="text-gold hover:text-saffron font-semibold transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}