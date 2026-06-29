'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Mail, ArrowRight, AlertCircle, Sparkles, Tv, Newspaper, 
  Eye, EyeOff, User
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/lib/store/useAuthStore';

export default function SignupPage() {
  const { signUp, googleLogin, isAuthenticated, loading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    const result = await signUp(name, email, password);

    if (result.success) {
      toast.success('Account created successfully! Welcome to Aarambh TV 🙏');
      router.push('/');
    } else {
      toast.error(result.error || 'Signup failed');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await googleLogin();
    if (result.success) {
      toast.success('Welcome to Aarambh TV! 🙏');
      router.push('/');
    } else {
      toast.error(result.error || 'Google login failed');
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gradient-to-br from-cream-50 via-amber-50/40 to-yellow-50/30 dark:from-brown-950 dark:via-brown-900 dark:to-brown-950 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center lg:text-left hidden lg:block"
        >
          <div className="mb-4">
            <Image
              src="/aarambhlogo.png"
              alt="Aarambh TV Logo"
              width={120}
              height={120}
              className="object-contain mx-auto lg:mx-0"
              priority
            />
          </div>
          
          <h1 className="text-4xl font-bold text-brown-900 dark:text-cream-50">
            Join <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Aarambh TV</span>
          </h1>
          <p className="mt-1 text-base text-brown-600 dark:text-cream-50/70">
            Begin your daily spiritual journey
          </p>
          
          <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-saffron/10 dark:bg-saffron/20 rounded-full">
              <Sparkles className="h-3.5 w-3.5 text-saffron" />
              <span className="text-[10px] font-medium text-brown-700 dark:text-cream-50/70">Daily Panchang</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 dark:bg-gold/20 rounded-full">
              <Tv className="h-3.5 w-3.5 text-gold" />
              <span className="text-[10px] font-medium text-brown-700 dark:text-cream-50/70">Bhajans</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-divine-red/10 dark:bg-divine-red/20 rounded-full">
              <Newspaper className="h-3.5 w-3.5 text-divine-red" />
              <span className="text-[10px] font-medium text-brown-700 dark:text-cream-50/70">Spiritual Stories</span>
            </div>
          </div>
          
          <p className="mt-4 text-xs text-brown-500 dark:text-cream-50/40">
            Join thousands of spiritual seekers worldwide
          </p>
        </motion.div>

        {/* Right Side - Signup Form (Compact) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
        >
          <div className="bg-white/95 dark:bg-brown-800/95 backdrop-blur-sm rounded-2xl border-2 border-gold/30 dark:border-gold/20 shadow-2xl p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-brown-900 dark:text-cream-50">
                Create Account
              </h2>
              <p className="text-xs text-brown-600 dark:text-cream-50/60">
                Begin your spiritual journey with Aarambh TV
              </p>
            </div>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-gold/20 dark:border-gold/10 rounded-xl hover:bg-saffron/5 dark:hover:bg-saffron/10 transition-all duration-200 text-sm"
            >
              <FcGoogle className="h-4 w-4" />
              <span className="font-medium text-brown-700 dark:text-cream-50/70">Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gold/20 dark:border-gold/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-brown-800 px-3 text-[10px] text-brown-400 dark:text-cream-50/40">
                  Or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start gap-2 rounded-lg border border-divine-red/50 bg-divine-red/10 p-2"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-divine-red" />
                    <p className="text-xs text-divine-red">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Name */}
              <div>
                <label className="mb-1 block text-xs font-medium text-brown-700 dark:text-cream-50/80">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brown-400 dark:text-cream-50/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border-2 py-2 pl-9 pr-3 text-sm outline-none transition-all focus:border-saffron bg-cream-50/50 dark:bg-brown-900/50 border-gold/20 dark:border-gold/10 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-xs font-medium text-brown-700 dark:text-cream-50/80">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brown-400 dark:text-cream-50/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border-2 py-2 pl-9 pr-3 text-sm outline-none transition-all focus:border-saffron bg-cream-50/50 dark:bg-brown-900/50 border-gold/20 dark:border-gold/10 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Fields - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-brown-700 dark:text-cream-50/80">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brown-400 dark:text-cream-50/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-2 py-2 pl-9 pr-9 text-sm outline-none transition-all focus:border-saffron bg-cream-50/50 dark:bg-brown-900/50 border-gold/20 dark:border-gold/10 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30"
                      placeholder="Min 6 chars"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 dark:text-cream-50/40 dark:hover:text-cream-50"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-brown-700 dark:text-cream-50/80">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brown-400 dark:text-cream-50/30" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border-2 py-2 pl-9 pr-9 text-sm outline-none transition-all focus:border-saffron bg-cream-50/50 dark:bg-brown-900/50 border-gold/20 dark:border-gold/10 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30"
                      placeholder="Confirm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 dark:text-cream-50/40 dark:hover:text-cream-50"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gold/30 text-saffron focus:ring-saffron/20"
                />
                <span className="text-[10px] text-brown-600 dark:text-cream-50/60">
                  I agree to{' '}
                  <Link href="/terms" className="text-gold hover:text-saffron transition-colors">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link href="/privacy" className="text-gold hover:text-saffron transition-colors">
                    Privacy policy
                  </Link>
                </span>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-saffron to-gold px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-saffron/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className={`h-3.5 w-3.5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Login Link */}
            <div className="mt-3 text-center">
              <p className="text-xs text-brown-600 dark:text-cream-50/60">
                Already have an account?{' '}
                <Link href="/login" className="text-gold hover:text-saffron font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}