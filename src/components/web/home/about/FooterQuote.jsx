'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GiLotus } from 'react-icons/gi';
import { FaYoutube, FaInstagram, FaFacebook, FaXTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';
import { getPublicSettings } from '@/lib/services/settingsService';

// Default social links as fallback
const DEFAULT_SOCIAL = {
  facebook: '#',
  twitter: '#',
  instagram: '#',
  youtube: '#',
  linkedin: '#',
  whatsapp: '#',
};

export default function FooterQuote() {
  const [social, setSocial] = useState(DEFAULT_SOCIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await getPublicSettings();
        if (result.success && result.data) {
          setSocial(result.data.social || DEFAULT_SOCIAL);
        }
      } catch (error) {
        console.error('Error fetching social settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Define social links with icons and dynamic URLs
  const socialLinks = [
    { 
      icon: FaYoutube, 
      href: social.youtube || '#', 
      label: 'YouTube',
      color: 'hover:text-red-500'
    },
    { 
      icon: FaInstagram, 
      href: social.instagram || '#', 
      label: 'Instagram',
      color: 'hover:text-pink-500'
    },
    { 
      icon: FaFacebook, 
      href: social.facebook || '#', 
      label: 'Facebook',
      color: 'hover:text-blue-600'
    },
    { 
      icon: FaXTwitter, 
      href: social.twitter || '#', 
      label: 'X (Twitter)',
      color: 'hover:text-white'
    },
    { 
      icon: FaLinkedin, 
      href: social.linkedin || '#', 
      label: 'LinkedIn',
      color: 'hover:text-blue-700'
    },
    { 
      icon: FaWhatsapp, 
      href: social.whatsapp || '#', 
      label: 'WhatsApp',
      color: 'hover:text-green-500'
    },
  ];

  // Filter out links that don't have valid URLs
  const activeSocialLinks = socialLinks.filter(link => 
    link.href && link.href !== '#'
  );

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-r from-saffron/90 to-gold/90 dark:from-saffron/80 dark:to-gold/80 py-12 md:py-14">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-saffron/90 to-gold/90 dark:from-saffron/80 dark:to-gold/80 py-12 md:py-14">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <GiLotus className="w-12 h-12 mx-auto text-white/80 mb-3" />
          
          <blockquote className="text-lg md:text-xl text-white/90 font-light italic max-w-2xl mx-auto leading-relaxed">
            "Spirituality is not about perfection, it's about connection. 
            Connect with the divine, connect with yourself, connect with the world."
          </blockquote>
          <p className="text-sm text-white/70 mt-3 font-medium">
            — Aarambh TV
          </p>

          {activeSocialLinks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">
                Follow us on
              </p>
              <div className="flex items-center justify-center gap-4">
                {activeSocialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white/60 transition-all duration-300 hover:scale-110 ${link.color}`}
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}