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
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/95 dark:bg-brown-800/95 backdrop-blur-sm rounded-2xl border-2 border-gold/30 dark:border-gold/20 shadow-2xl px-8 py-6">

        {/* Logo + Heading */}
        <div className="flex items-center gap-4 mb-4">
          <FaOm className="w-12 h-12 text-saffron flex-shrink-0" />
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
        <div className="flex gap-2 mb-4">
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

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 border-2 border-gold/20 dark:border-gold/10 rounded-xl hover:bg-saffron/5 dark:hover:bg-saffron/10 transition-all duration-200 mb-4"
        >
          <FcGoogle className="h-5 w-5" />
          <span className="text-sm font-medium text-brown-700 dark:text-cream-50/70">Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gold/20 dark:border-gold/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-brown-800 px-3 text-xs text-brown-400 dark:text-cream-50/40">
              Or sign in with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-3 rounded-lg border border-divine-red/50 bg-divine-red/10 p-2.5"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-divine-red" />
                <p className="text-sm text-divine-red">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brown-700 dark:text-cream-50/80 mb-1">
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
            <label className="block text-sm font-medium text-brown-700 dark:text-cream-50/80 mb-1">
              Password
            </label>
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gold/30 text-saffron focus:ring-saffron/20"
              />
              <span className="text-sm text-brown-600 dark:text-cream-50/60">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-gold hover:text-saffron transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-saffron to-gold px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-saffron/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-4 text-center">
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