'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Moon,
  Sun,
  Home,
  Music,
  Video,
  Calendar,
  Building,
  BookOpen,
  Info,
  UserCircle,
  LogOut,
  Settings,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';
import useAuthStore from '@/lib/store/useAuthStore';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout, loading } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserDropdown && !e.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserDropdown]);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Bhajans', href: '/bhajans', icon: Music },
    { name: 'Spiritual Videos', href: '/spiritual-videos', icon: Video },
    { name: 'Festivals', href: '/festivals', icon: Calendar },
    { name: 'Temples', href: '/temples', icon: Building },
    { name: 'Stories', href: '/stories', icon: BookOpen },
    { name: 'Blogs', href: '/blogs', icon: BookOpen },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    setShowUserDropdown(false);
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream-50/95 dark:bg-brown-900/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-r from-rose-50/90 via-cream-50/90 to-amber-50/90 dark:from-brown-900/90 dark:via-brown-800/90 dark:to-brown-900/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-25 h-10 md:w-50 md:h-13 mr-2">
              <Image
                src="/aarambhlogo.png"
                alt="Aarambh TV"
                width={140}
                height={110}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-saffron bg-saffron/10 dark:bg-saffron/20'
                    : 'text-brown-700 dark:text-cream-50 hover:text-saffron hover:bg-saffron/5 dark:hover:bg-saffron/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Search, Dark Mode, Auth */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search spiritual content..."
                className="w-48 lg:w-64 pl-9 pr-4 py-1.5 text-sm bg-white/50 dark:bg-brown-800/50 backdrop-blur-sm border border-gold/20 dark:border-gold/10 rounded-full focus:outline-none focus:border-saffron dark:focus:border-saffron transition-colors placeholder:text-brown-600/60 dark:placeholder:text-cream-50/40"
              />
              <Search className="absolute left-3 w-4 h-4 text-brown-600 dark:text-cream-50/60" />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-saffron/10 dark:hover:bg-saffron/20 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gold" />
              ) : (
                <Moon className="w-5 h-5 text-brown-700" />
              )}
            </button>

            {/* Auth Button / User Profile */}
            <div className="relative user-dropdown">
              {!loading && isAuthenticated ? (
                // User Avatar with Dropdown
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex cursor-pointer items-center space-x-2 p-1.5 rounded-full hover:bg-saffron/10 dark:hover:bg-saffron/20 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-divine flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitial()}
                  </div>
                </button>
              ) : (
                // Sign Up Button
                <Link
                  href="/signup"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-divine rounded-full hover:shadow-lg hover:shadow-saffron/30 transition-all transform hover:scale-105"
                >
                  Sign Up
                </Link>
              )}

              {/* User Dropdown */}
              {isAuthenticated && showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-cream-50 dark:bg-brown-800 rounded-xl shadow-2xl border border-gold/10 dark:border-gold/20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gold/10 dark:border-gold/20">
                    <p className="text-sm font-semibold text-brown-900 dark:text-cream-50">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-brown-600 dark:text-cream-50/60">
                      {getUserEmail()}
                    </p>
                  </div>
                  
                  
                  <div className="border-t  border-gold/10 dark:border-gold/20 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer space-x-3 px-4 py-2.5 text-sm text-divine-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-saffron/10 dark:hover:bg-saffron/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-brown-700 dark:text-cream-50" />
              ) : (
                <Menu className="w-6 h-6 text-brown-700 dark:text-cream-50" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-cream-50/95 dark:bg-brown-900/95 backdrop-blur-md border-t border-gold/10 dark:border-gold/20 shadow-xl">
          <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white/50 dark:bg-brown-800/50 backdrop-blur-sm border border-gold/20 dark:border-gold/10 rounded-lg focus:outline-none focus:border-saffron"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-brown-600 dark:text-cream-50/60" />
            </div>

            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-saffron/10 text-saffron'
                      : 'text-brown-700 dark:text-cream-50 hover:bg-saffron/5 dark:hover:bg-saffron/10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className={`w-5 h-5 ${active ? 'text-saffron' : ''}`} />
                  <span>{link.name}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-saffron" />
                  )}
                </Link>
              );
            })}

            {/* Mobile Auth */}
            <div className="pt-3 mt-3 border-t border-gold/10 dark:border-gold/20">
              {!loading && isAuthenticated ? (
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-divine flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitial()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brown-900 dark:text-cream-50">
                      {getUserName()}
                    </p>
                    <p className="text-xs text-brown-600 dark:text-cream-50/60">
                      {getUserEmail()}
                    </p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/signup"
                  className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-divine rounded-lg hover:shadow-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;