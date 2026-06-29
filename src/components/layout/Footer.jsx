// components/layout/Footer.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Send,
  ChevronRight
} from 'lucide-react';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegram
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Quick Links
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Bhajans', href: '/bhajans' },
    { name: 'Spiritual Videos', href: '/spiritual-videos' },
    { name: 'Horoscope', href: '/horoscope' },
    { name: 'Temples', href: '/temples' },
    { name: 'Festivals', href: '/festivals' },
    { name: 'Stories', href: '/stories' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Live Darshan', href: '/live-darshan' },
  ];

  // Support Links
  const supportLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Advertise With Us', href: '/advertise' },
  ];

  // Social Media Links
  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaYoutube, href: '#', label: 'YouTube' },
    { icon: FaWhatsapp, href: '#', label: 'WhatsApp' },
  ];

  return (
    <footer className="w-full">
      {/* Main Footer Section - Gradient from Brown to Saffron/Gold */}
      <div className="bg-gradient-to-br from-brown-900 via-brown-800 to-saffron/90 border-t border-gold/20 text-cream-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          
          {/* Desktop: 5 columns */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-8">
            {/* Column 1 - Logo, Description & Social */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/aarambhlogo.png"
                    alt="Aarambh TV Logo"
                    width={130}
                    height={50}
                    className="object-contain w-40 h-12"
                    priority
                  />
                  {/* <div>
                    <span className="text-2xl font-bold">
                      <span className="text-saffron">Aarambh</span>
                      <span className="text-gold">TV</span>
                    </span>
                    <p className="text-[10px] text-cream-50/40 uppercase tracking-wider">Spiritual Media</p>
                  </div> */}
                </Link>
              </div>
              
              <p className="text-cream-50/70 text-sm leading-relaxed mb-4">
                Your daily destination for spiritual guidance, devotion, and knowledge. 
                Experience the divine through our curated content.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-cream-50/5 border border-gold/20 flex items-center justify-center hover:bg-gold/20 hover:border-gold/40 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-cream-50/60 group-hover:text-gold transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gold mb-4 pb-1 border-b border-gold/20 inline-block">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.slice(0, 6).map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-cream-50/70 hover:text-gold transition-colors text-sm flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 text-gold/30 group-hover:text-gold transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - More Links */}
            <div>
              <h4 className="text-lg font-semibold text-gold mb-4 pb-1 border-b border-gold/20 inline-block">
                Explore More
              </h4>
              <ul className="space-y-2">
                {quickLinks.slice(6).map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-cream-50/70 hover:text-gold transition-colors text-sm flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 text-gold/30 group-hover:text-gold transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Support */}
            <div>
              <h4 className="text-lg font-semibold text-gold mb-4 pb-1 border-b border-gold/20 inline-block">
                Support
              </h4>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-cream-50/70 hover:text-gold transition-colors text-sm flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 text-gold/30 group-hover:text-gold transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5 - Quick Contact */}
            <div>
              <h4 className="text-lg font-semibold text-gold mb-4 pb-1 border-b border-gold/20 inline-block">
                Get in Touch
              </h4>
              <div className="space-y-3">
                <a 
                  href="mailto:info@aarambhtv.com" 
                  className="flex items-start gap-3 text-cream-50/70 hover:text-gold transition-colors text-sm group"
                >
                  <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>info@aarambhtv.com</span>
                </a>
                <a 
                  href="tel:+919999999999" 
                  className="flex items-center gap-3 text-cream-50/70 hover:text-gold transition-colors text-sm group"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+91 99999 99999</span>
                </a>
                <div className="flex items-start gap-3 text-cream-50/70 text-sm">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Mumbai, India</span>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-4">
                  <p className="text-xs text-cream-50/50 mb-2">Subscribe for daily wisdom</p>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 text-sm bg-brown-900/50 border border-gold/20 rounded-l-lg focus:outline-none focus:border-gold placeholder:text-cream-50/30 text-cream-50"
                    />
                    <button className="px-3 py-2 bg-gradient-to-r from-saffron to-gold text-brown-900 rounded-r-lg hover:opacity-90 transition-opacity">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Responsive Grid */}
          <div className="lg:hidden">
            {/* Row 1 - Logo & Description */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/aarambhlogo.png"
                    alt="Aarambh TV Logo"
                    width={45}
                    height={45}
                    className="object-contain w-11 h-11"
                    priority
                  />
                  <div>
                    <span className="text-2xl font-bold">
                      <span className="text-saffron">Aarambh</span>
                      <span className="text-gold">TV</span>
                    </span>
                    <p className="text-[10px] text-cream-50/40 uppercase tracking-wider">Spiritual Media</p>
                  </div>
                </Link>
              </div>
              <p className="text-cream-50/70 text-sm leading-relaxed mb-4">
                Your daily destination for spiritual guidance, devotion, and knowledge.
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.slice(0, 4).map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-cream-50/5 border border-gold/20 flex items-center justify-center hover:bg-gold/20 transition-all"
                  >
                    <social.icon className="w-3.5 h-3.5 text-cream-50/60 hover:text-gold transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Row 2 - Quick Links & Explore (2 columns) */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-base font-semibold text-gold mb-3 pb-1 border-b border-gold/20 inline-block">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {quickLinks.slice(0, 5).map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-cream-50/70 hover:text-gold transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-gold mb-3 pb-1 border-b border-gold/20 inline-block">
                  Explore
                </h4>
                <ul className="space-y-2">
                  {quickLinks.slice(5).map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-cream-50/70 hover:text-gold transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Row 3 - Support & Contact (2 columns) */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-base font-semibold text-gold mb-3 pb-1 border-b border-gold/20 inline-block">
                  Support
                </h4>
                <ul className="space-y-2">
                  {supportLinks.slice(0, 3).map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-cream-50/70 hover:text-gold transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-gold mb-3 pb-1 border-b border-gold/20 inline-block">
                  Contact
                </h4>
                <div className="space-y-2 text-sm">
                  <a href="mailto:info@aarambhtv.com" className="flex items-center gap-2 text-cream-50/70 hover:text-gold transition-colors">
                    <Mail className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs">info@aarambhtv.com</span>
                  </a>
                  <a href="tel:+919999999999" className="flex items-center gap-2 text-cream-50/70 hover:text-gold transition-colors">
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    <span>+91 99999 99999</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="bg-brown-900/90 border-t border-gold/10 text-cream-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sm text-cream-50/50">
              © {currentYear} Aarambh TV. All rights reserved.
            </p>
            <p className="text-sm text-cream-50/50 flex items-center gap-1">
              Made with
              <Heart className="w-4 h-4 text-divine-red fill-divine-red" />
              for the divine
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}