// app/(auth)/forgot-password/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { FaOm } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAuthStore from '@/lib/store/useAuthStore';

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const result = await resetPassword(email);

    if (result.success) {
      setIsSent(true);
      toast.success('Password reset email sent!');
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <FaOm className="w-14 h-14 text-saffron" />
        </div>
        <h2 className="text-2xl font-bold text-brown-900 dark:text-cream-50">
          Reset Password
        </h2>
        <p className="text-sm text-brown-600 dark:text-cream-50/60 mt-1">
          We'll send you a link to reset your password
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-brown-900 dark:text-cream-50 mb-2">
              Check Your Email
            </h3>
            <p className="text-sm text-brown-600 dark:text-cream-50/60 mb-2">
              We've sent a password reset link to
            </p>
            <p className="text-sm font-medium text-brown-900 dark:text-cream-50 mb-6">
              {email}
            </p>
            <div className="space-y-3">
              <p className="text-xs text-brown-400 dark:text-cream-50/40">
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="text-gold hover:text-saffron text-sm font-medium transition-colors"
              >
                Try again
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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
                  className="w-full pl-10 pr-4 py-2.5 bg-cream-50/50 dark:bg-brown-900/50 border border-gold/20 dark:border-gold/10 rounded-xl focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/30"
                  placeholder="you@example.com"
                  required
                />
              </div>
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
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </>
                )}
              </span>
            </motion.button>
          </form>
        )}
      </AnimatePresence>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-brown-600 dark:text-cream-50/60 hover:text-gold transition-colors inline-flex items-center gap-2"
        >
          ← Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}