// components/layout/Footer.jsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaWhatsapp,
  FaTelegram
} from 'react-icons/fa';
import { getPublicSettings } from '@/lib/services/settingsService';

// Default values as fallback
const DEFAULT_CONTACT = {
  phone1: '+91 99999 99999',
  phone2: '',
  contactEmail: 'info@aarambhtv.com',
  address: 'Mumbai, India',
};

const DEFAULT_SOCIAL = {
  facebook: '#',
  twitter: '#',
  instagram: '#',
  youtube: '#',
  whatsapp: '#',
  telegram: '#',
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [contact, setContact] = useState(DEFAULT_CONTACT);
  const [social, setSocial] = useState(DEFAULT_SOCIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await getPublicSettings();
        if (result.success && result.data) {
          setContact(result.data.contact || DEFAULT_CONTACT);
          setSocial(result.data.social || DEFAULT_SOCIAL);
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Bhajans', href: '/bhajans' },
    { name: 'Spiritual Videos', href: '/spiritual-videos' },
    { name: 'Stories', href: '/stories' },
    { name: 'Temples', href: '/temples' },
    { name: 'Festivals', href: '/festivals' },
  ];

  const supportLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Advertise With Us', href: '/advertise-with-us' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: social.facebook || '#', label: 'Facebook' },
    { icon: FaTwitter, href: social.twitter || '#', label: 'Twitter' },
    { icon: FaInstagram, href: social.instagram || '#', label: 'Instagram' },
    { icon: FaYoutube, href: social.youtube || '#', label: 'YouTube' },
    { icon: FaWhatsapp, href: social.whatsapp || '#', label: 'WhatsApp' },
    { icon: FaTelegram, href: social.telegram || '#', label: 'Telegram' },
  ];

  if (loading) {
    return (
      <footer className="w-full">
        <div className="bg-gradient-to-br from-brown-900 via-brown-800 to-saffron/90 border-t border-gold/20 text-cream-50">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full">
      <div className="bg-gradient-to-br from-brown-900 via-brown-800 to-saffron/90 border-t border-gold/20 text-cream-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
            {/* Column 1 - Logo, Description & Social */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/aarambhlogo.png"
                    alt="Aarambh TV Logo"
                    width={130}
                    height={50}
                    className="object-contain w-32 sm:w-36 lg:w-40 h-auto"
                    priority
                  />
                </Link>
              </div>

              <p className="text-cream-50/70 text-sm leading-relaxed mb-4 max-w-md">
                Your daily destination for spiritual guidance, devotion, and knowledge.
                Experience the divine through our curated content.
              </p>

              <div className="flex flex-wrap gap-2">
                {socialLinks.map((socialItem, index) => {
                  if (!socialItem.href || socialItem.href === '#') return null;
                  return (
                    <a
                      key={index}
                      href={socialItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-cream-50/5 border border-gold/20 flex items-center justify-center hover:bg-gold/20 hover:border-gold/40 transition-all duration-300 group"
                      aria-label={socialItem.label}
                    >
                      <socialItem.icon className="w-4 h-4 text-cream-50/60 group-hover:text-gold transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h4 className="text-base lg:text-lg font-semibold text-gold mb-3 lg:mb-4 pb-1 border-b border-gold/20 inline-block">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-cream-50/70 hover:text-gold transition-colors text-sm flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 text-gold/30 group-hover:text-gold transition-colors flex-shrink-0" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Support */}
            <div>
              <h4 className="text-base lg:text-lg font-semibold text-gold mb-3 lg:mb-4 pb-1 border-b border-gold/20 inline-block">
                Support
              </h4>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-cream-50/70 hover:text-gold transition-colors text-sm flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 text-gold/30 group-hover:text-gold transition-colors flex-shrink-0" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Get in Touch */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-base lg:text-lg font-semibold text-gold mb-3 lg:mb-4 pb-1 border-b border-gold/20 inline-block">
                Get in Touch
              </h4>
              <div className="space-y-3">
                <a
                  href={`mailto:${contact.contactEmail}`}
                  className="flex items-start gap-3 text-cream-50/70 hover:text-gold transition-colors text-sm group"
                >
                  <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{contact.contactEmail}</span>
                </a>
                <a
                  href={`tel:${contact.phone1.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-cream-50/70 hover:text-gold transition-colors text-sm group"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{contact.phone1}</span>
                </a>
                {contact.phone2 && (
                  <a
                    href={`tel:${contact.phone2.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-cream-50/70 hover:text-gold transition-colors text-sm group"
                  >
                    <Phone className="w-4 h-4 text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{contact.phone2}</span>
                  </a>
                )}
                <div className="flex items-start gap-3 text-cream-50/70 text-sm">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>{contact.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brown-900/90 border-t border-gold/10 text-cream-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p className="text-sm text-cream-50/50">
              © {currentYear} Aarambh TV. All rights reserved.
            </p>
            <p className="text-brown-900/30 " >Made By Ashutoh Mohanty</p>
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
