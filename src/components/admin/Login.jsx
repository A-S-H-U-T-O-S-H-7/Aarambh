// app/(admin)/admin/login/page.jsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { toast } from "react-hot-toast";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Sun,
  Moon,
  Eye,
  EyeOff
  
} from "lucide-react";
import { FaOm } from "react-icons/fa";

function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className={`relative h-8 w-14 rounded-full p-1 transition-all duration-300 ${
        darkMode ? "bg-saffron/20" : "bg-saffron/10"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          darkMode ? "bg-saffron text-white" : "bg-saffron text-white"
        }`}
        animate={{ x: darkMode ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      </motion.div>
    </motion.button>
  );
}

export default function AdminLoginPage() {
  const { adminLogin, loading, error, isAuthenticated, clearError } = useAdminAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    const result = await adminLogin(email, password);

    if (result.success) {
      toast.success("Welcome back to Aarambh TV Admin!");
      router.push("/admin/dashboard");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <div className={`min-h-screen overflow-hidden ${isDark ? "dark bg-brown-900" : "bg-cream-50"}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? "bg-gradient-to-br from-brown-950 via-brown-900 to-brown-950"
              : "bg-gradient-to-br from-cream-50 via-cream-100 to-cream-50"
          }`}
        />
        
        {/* Animated blobs - Saffron and Gold */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-saffron/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-3xl" />
        
        {/* Floating Om */}
        <div className="absolute top-10 left-10 text-8xl text-saffron/5 font-serif">ॐ</div>
        <div className="absolute bottom-10 right-10 text-8xl text-gold/5 font-serif">ॐ</div>
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-8 lg:grid-cols-2">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <motion.div 
            className="mx-auto mb-6 h-28 w-28 lg:mx-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/aarambhlogo.png"
              alt="Aarambh TV Logo"
              width={112}
              height={112}
              className="h-full w-full object-contain"
              priority
            />
          </motion.div>
          
          <h1 className={`text-4xl font-bold lg:text-5xl ${isDark ? "text-cream-50" : "text-brown-900"}`}>
            Aarambh <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">TV</span>
          </h1>
          <p className={`mt-2 text-lg ${isDark ? "text-cream-50/60" : "text-brown-600"}`}>
            Admin Management Portal
          </p>
          
          <motion.div 
            className="mt-6 flex items-center justify-center gap-4 lg:justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? "bg-saffron/20" : "bg-saffron/10"}`}>
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-xs font-medium text-gold">Spiritual</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? "bg-saffron/20" : "bg-saffron/10"}`}>
              <FaOm className="h-4 w-4 text-saffron" />
              <span className="text-xs font-medium text-saffron">Devotion</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? "bg-saffron/20" : "bg-saffron/10"}`}>
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-xs font-medium text-gold">Wisdom</span>
            </div>
          </motion.div>
          
          <p className={`mt-6 text-sm ${isDark ? "text-cream-50/40" : "text-brown-500"}`}>
            Secure access for authorized Aarambh TV team members only.
          </p>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div className="mx-auto mb-4 flex w-full max-w-md justify-end">
            <ThemeToggle darkMode={isDark} toggleTheme={toggleTheme} />
          </div>

          <motion.div
            className={`mx-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl ${
              isDark
                ? "border-gold/20 bg-brown-800/50"
                : "border-gold/30 bg-white/85"
            }`}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Top gradient bar */}
            <div className="h-1.5 bg-gradient-to-r from-saffron via-gold to-saffron" />
            
            <div className="p-6 lg:p-8">
              <div className="mb-6 text-center">
                <h2 className={`text-2xl font-bold ${isDark ? "text-cream-50" : "text-brown-900"}`}>
                  Welcome Back
                </h2>
                <p className={`mt-1 text-sm ${isDark ? "text-cream-50/60" : "text-brown-600"}`}>
                  Sign in to access the admin dashboard
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 rounded-lg border border-divine-red/50 bg-divine-red/10 p-3"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-divine-red" />
                      <p className="text-sm text-divine-red">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className={`mb-2 block text-sm font-medium ${isDark ? "text-cream-50/70" : "text-brown-700"}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-cream-50/40" : "text-brown-400"}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-lg border-2 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-saffron ${
                        isDark
                          ? "border-gold/20 bg-brown-900/60 text-cream-50 placeholder-cream-50/30"
                          : "border-gold/30 bg-white text-brown-900 placeholder-brown-400"
                      }`}
                      placeholder="admin@aarambhtv.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-medium ${isDark ? "text-cream-50/70" : "text-brown-700"}`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-cream-50/40" : "text-brown-400"}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-lg border-2 py-2.5 pl-10 pr-12 text-sm outline-none transition-all focus:border-saffron ${
                        isDark
                          ? "border-gold/20 bg-brown-900/60 text-cream-50 placeholder-cream-50/30"
                          : "border-gold/30 bg-white text-brown-900 placeholder-brown-400"
                      }`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                        isDark ? "text-cream-50/40 hover:text-cream-50" : "text-brown-400 hover:text-brown-600"
                      }`}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-saffron to-gold px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Access Admin Panel
                        <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              <div className="relative my-6">
                <div className={`absolute inset-0 flex items-center ${isDark ? "border-gold/20" : "border-gold/30"}`}>
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className={`bg-transparent px-3 text-xs ${isDark ? "text-cream-50/40" : "text-brown-400"}`}>
                    Secure Admin Access
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-center">
                <Link 
                  href="/" 
                  className={`block text-xs font-medium transition-all hover:translate-x-[-2px] ${isDark ? "text-cream-50/40 hover:text-cream-50" : "text-brown-400 hover:text-brown-600"}`}
                >
                  Back to Aarambh TV Website
                </Link>
                <p className={`text-xs ${isDark ? "text-cream-50/30" : "text-brown-400"}`}>
                  Secure Admin Access - Authorized Personnel Only
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}