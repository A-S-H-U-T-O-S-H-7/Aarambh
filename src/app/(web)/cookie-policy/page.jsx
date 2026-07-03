// app/(web)/cookie-policy/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Cookie, Info, Settings, Shield, Globe,
  BarChart, Eye, Bell, Mail, CheckCircle, RefreshCw,
  ArrowLeft, Phone, MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getContactInfo } from "@/lib/services/settingsService";

const cookieTypes = [
  {
    name: "Strictly Necessary",
    color: "bg-saffron/10 border-saffron/20",
    badge: "bg-saffron",
    canDisable: false,
    desc: "These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in, setting preferences, or filling in forms.",
    examples: ["Session management", "Login authentication", "Security tokens", "CSRF protection"],
  },
  {
    name: "Analytics & Performance",
    color: "bg-gold/10 border-gold/20",
    badge: "bg-gold",
    canDisable: true,
    desc: "These cookies allow us to count visits and traffic sources so we can measure and improve our site performance. They help us understand which content is most popular.",
    examples: ["Google Analytics", "Page view tracking", "Session duration", "Bounce rate analysis"],
  },
  {
    name: "Personalisation",
    color: "bg-saffron/10 border-saffron/20",
    badge: "bg-saffron",
    canDisable: true,
    desc: "These cookies remember your preferences and reading history to deliver a more personalised experience. They may be used to recommend content and remember your theme preference.",
    examples: ["Reading history", "Theme preference", "Region/language setting", "Bookmarked content"],
  },
];

const sections = [
  {
    icon: <Info className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "What Are Cookies?",
    content: (
      <div className="space-y-2 text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        <p>
          Cookies are small text files that are placed on your device when you visit a website.
          They are widely used to make websites work efficiently, remember your preferences, and provide
          information to website owners about how their site is being used.
        </p>
        <p>
          Cookies are not harmful programs. They cannot access other files on your device or carry viruses.
          Aarambh TV uses cookies and similar technologies to deliver a better, faster, and more personalised
          spiritual experience.
        </p>
      </div>
    ),
  },
  {
    icon: <Cookie className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Types of Cookies We Use",
    content: (
      <div className="space-y-4">
        {cookieTypes.map((type) => (
          <div key={type.name} className={`rounded-xl p-4 border ${type.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${type.badge}`} />
                <p className="text-sm font-bold text-brown-800 dark:text-cream-50">{type.name}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.canDisable ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-cream-100 dark:bg-brown-700 text-brown-500 dark:text-cream-50/40"}`}>
                {type.canDisable ? "Optional" : "Required"}
              </span>
            </div>
            <p className="text-xs text-brown-600 dark:text-cream-50/70 leading-relaxed mb-2">{type.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {type.examples.map((ex) => (
                <span key={ex} className="text-xs px-2 py-0.5 rounded-full bg-white/70 dark:bg-brown-900/70 border border-gold/10 text-brown-500 dark:text-cream-50/50">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Bell className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Cookie Duration",
    content: (
      <div className="space-y-3 text-sm text-brown-600 dark:text-cream-50/70">
        <p className="leading-relaxed">Cookies can be categorised by how long they remain on your device:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-cream-50/50 dark:bg-brown-900/50 rounded-xl p-4 border border-gold/10 dark:border-gold/5">
            <p className="font-semibold text-brown-700 dark:text-cream-50/80 text-xs mb-1.5">Session Cookies</p>
            <p className="text-xs leading-relaxed text-brown-600 dark:text-cream-50/60">
              Temporary cookies that exist only while your browser is open. They are automatically deleted
              when you close your browser tab or window. Used for login sessions and form data.
            </p>
          </div>
          <div className="bg-cream-50/50 dark:bg-brown-900/50 rounded-xl p-4 border border-gold/10 dark:border-gold/5">
            <p className="font-semibold text-brown-700 dark:text-cream-50/80 text-xs mb-1.5">Persistent Cookies</p>
            <p className="text-xs leading-relaxed text-brown-600 dark:text-cream-50/60">
              Remain on your device for a set period (days to years) or until manually deleted.
              Used for remembering preferences, analytics, and personalisation across visits.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Settings className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Managing & Controlling Cookies",
    content: (
      <div className="space-y-3 text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        <p>
          You have several options to control how cookies are used. Please note that restricting certain
          cookies may affect the functionality and personalisation of our website:
        </p>
        <div>
          <p className="font-semibold text-brown-700 dark:text-cream-50/80 mb-2">Browser Settings</p>
          <p className="mb-2">Most browsers allow you to view, delete, and block cookies through their settings:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: "Chrome", url: "https://support.google.com/chrome/answer/95647" },
              { name: "Firefox", url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" },
              { name: "Safari", url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
              { name: "Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" },
            ].map((b) => (
              <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer"
                className="text-center text-xs font-medium px-3 py-2 rounded-xl bg-cream-50/50 dark:bg-brown-900/50 border border-gold/10 dark:border-gold/5 text-saffron hover:text-gold hover:bg-cream-100 dark:hover:bg-brown-800 transition-colors">
                {b.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Updates to This Policy",
    content: (
      <p className="text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        We may update this Cookie Policy from time to time to reflect changes in technology, regulation,
        or our business practices. Any changes will be posted on this page with an updated "Last Updated"
        date. Significant changes may also be communicated through a notice on our website.
      </p>
    ),
  },
  {
    icon: <Mail className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Contact Us",
    content: null,
  },
];

export default function CookiePolicyPage() {
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      const result = await getContactInfo();
      if (result.success) {
        setContact(result.contact);
      }
      setLoading(false);
    };
    fetchContact();
  }, []);

  // Build contact section with dynamic data
  const contactSection = {
    icon: <Mail className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Contact Us",
    content: (
      <div className="space-y-3 text-sm text-brown-600 dark:text-cream-50/70">
        <p>For questions about our use of cookies, please contact our Privacy Team:</p>
        <div className="bg-gradient-to-br from-cream-50/50 to-gold/5 dark:from-brown-900/50 dark:to-gold/5 rounded-xl p-4 border border-gold/10 dark:border-gold/5 space-y-2">
          <p className="font-semibold text-brown-800 dark:text-cream-50">Aarambh TV — Privacy Team</p>
          <p className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-saffron" />
            <a href={`mailto:${contact?.contactEmail || 'info@aarambhtv.com'}`} className="text-saffron hover:text-gold transition-colors font-medium">
              {contact?.contactEmail || 'info@aarambhtv.com'}
            </a>
          </p>
          {contact?.phone1 && (
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-saffron" />
              <a href={`tel:${contact.phone1.replace(/\s/g, '')}`} className="text-saffron hover:text-gold transition-colors font-medium">
                {contact.phone1}
              </a>
            </p>
          )}
          {contact?.address && (
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-saffron" />
              <span>{contact.address}</span>
            </p>
          )}
        </div>
      </div>
    ),
  };

  const finalSections = [...sections.slice(0, -1), contactSection];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100/50 to-cream-50 dark:from-brown-950 dark:via-brown-900 dark:to-brown-950 py-4 pb-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="fixed top-0 right-0 w-96 h-96 bg-saffron/10 dark:bg-saffron/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gold/10 dark:bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm border border-gold/20 dark:border-gold/10 text-brown-600 dark:text-cream-50/70 hover:text-saffron dark:hover:text-gold hover:border-saffron/40 dark:hover:border-gold/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron/20 to-gold/20 dark:from-saffron/30 dark:to-gold/30 mb-3 shadow-lg border border-white/80 dark:border-brown-700/50">
              <Cookie className="w-8 h-8 text-saffron dark:text-gold" />
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-brown-800/80 border border-gold/20 dark:border-gold/10 text-brown-700 dark:text-cream-50/80 backdrop-blur-sm mb-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
              Transparency first
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 dark:text-cream-50 mb-3 leading-tight">
            Cookie{' '}
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-sm text-brown-500 dark:text-cream-50/60">
            Last updated: <span className="font-medium text-brown-600 dark:text-cream-50/80">January 1, 2025</span>
          </p>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-saffron to-gold mx-auto mt-5" />
        </div>

        {/* Quick nav chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          {["What Are Cookies", "Cookie Types", "Manage Cookies", "Your Consent", "Contact"].map((label) => (
            <span key={label} className="px-3 py-1 text-xs font-medium rounded-full bg-white/70 dark:bg-brown-800/70 border border-gold/20 dark:border-gold/10 text-brown-600 dark:text-cream-50/60 backdrop-blur-sm">
              {label}
            </span>
          ))}
        </div>

        {/* Sections */}
        <div className="bg-white/70 dark:bg-brown-800/70 backdrop-blur-xl border border-gold/20 dark:border-gold/10 rounded-2xl shadow-xl shadow-saffron/5 dark:shadow-none overflow-hidden">
          {finalSections.map((section, index) => (
            <div key={section.title} className={`p-4 md:p-8 ${index !== finalSections.length - 1 ? "border-b border-gold/10 dark:border-gold/5" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${section.iconBg} ${section.iconColor}`}>
                  {section.icon}
                </div>
                <h2 className="text-base font-bold text-brown-900 dark:text-cream-50">{section.title}</h2>
              </div>
              {section.content}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-brown-400 dark:text-cream-50/40 mt-8">
          © {new Date().getFullYear()} Aarambh TV. All rights reserved. Governed by the laws of India.
        </p>
      </div>
    </div>
  );
}