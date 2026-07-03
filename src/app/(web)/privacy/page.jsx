// app/(web)/privacy-policy/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Shield, Database, Eye, Share2, Lock,
  UserX, RefreshCw, Mail, Globe, CheckCircle,
  ArrowLeft, Phone, MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getContactInfo } from "@/lib/services/settingsService";

const sections = [
  {
    icon: <Shield className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Introduction",
    content: (
      <p className="text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        At Aarambh TV ("we", "our", or "us"), we are committed to protecting your privacy and
        ensuring transparency in how we handle your personal data. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you visit our website, subscribe to our
        newsletters, or otherwise interact with our spiritual media services. By using our services, you
        agree to the practices described in this policy.
      </p>
    ),
  },
  {
    icon: <Database className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-brown-700 dark:text-cream-50/80 mb-2">Information you provide directly:</p>
          <ul className="space-y-1.5">
            {[
              "Name, email address, and phone number when registering or contacting us",
              "Subscription preferences and newsletter choices",
              "Comments, feedback, or messages you submit on our platform",
              "Your spiritual interests and content preferences",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-brown-600 dark:text-cream-50/70">
                <CheckCircle className="w-3.5 h-3.5 text-saffron flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-brown-700 dark:text-cream-50/80 mb-2">Information collected automatically:</p>
          <ul className="space-y-1.5">
            {[
              "IP address, browser type, operating system, and device identifiers",
              "Pages visited, articles read, time spent, and referral sources",
              "Content preferences and engagement patterns",
              "Approximate geolocation (country/city) for content personalisation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-brown-600 dark:text-cream-50/70">
                <CheckCircle className="w-3.5 h-3.5 text-saffron flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: <Eye className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "How We Use Your Information",
    content: (
      <ul className="space-y-1.5">
        {[
          "Deliver, personalise, and improve our spiritual content and services",
          "Process subscriptions and manage your account",
          "Send newsletters, spiritual updates, and festival notifications (with your consent)",
          "Respond to your comments, inquiries, and support requests",
          "Analyse audience behaviour to improve content and site performance",
          "Display contextually relevant content to enhance your spiritual journey",
          "Comply with applicable legal obligations and enforce our Terms of Use",
          "Detect, investigate, and prevent fraudulent or abusive activity",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-brown-600 dark:text-cream-50/70">
            <CheckCircle className="w-3.5 h-3.5 text-saffron flex-shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Sharing Your Information",
    content: (
      <div className="space-y-3 text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        <p>
          We do <span className="font-semibold text-brown-700 dark:text-cream-50/80">not sell</span> your
          personal information to third parties. We may share your data only in the following limited circumstances:
        </p>
        <ul className="space-y-1.5">
          {[
            "Service providers who assist in operating our website, analytics, and email delivery",
            "Legal authorities when required by law, court order, or to protect rights and safety",
            "Business transfers in the event of a merger, acquisition, or sale of assets",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-saffron flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    icon: <Lock className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Data Security & Retention",
    content: (
      <div className="space-y-2 text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        <p>
          We implement industry-standard security measures including SSL/TLS encryption, access controls,
          and regular security audits to protect your personal data. However, no internet transmission is completely secure.
        </p>
        <p>
          We retain personal data only as long as necessary to fulfil the purposes described in this policy,
          comply with legal obligations, resolve disputes, and enforce agreements.
        </p>
      </div>
    ),
  },
  {
    icon: <UserX className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Your Rights & Choices",
    content: (
      <div className="space-y-3 text-sm text-brown-600 dark:text-cream-50/70">
        <p className="leading-relaxed">Depending on your location, you may have the following rights regarding your personal data:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { right: "Access", desc: "Request a copy of personal data we hold about you." },
            { right: "Correction", desc: "Request correction of inaccurate or incomplete data." },
            { right: "Deletion", desc: "Request deletion of your personal data (right to be forgotten)." },
            { right: "Objection", desc: "Object to processing based on legitimate interests." },
            { right: "Withdraw Consent", desc: "Unsubscribe from newsletters or marketing at any time." },
          ].map((r) => (
            <div key={r.right} className="bg-cream-50/50 dark:bg-brown-900/50 rounded-xl p-3 border border-gold/10 dark:border-gold/5">
              <p className="font-semibold text-brown-700 dark:text-cream-50/80 text-xs mb-1">{r.right}</p>
              <p className="text-xs leading-relaxed text-brown-600 dark:text-cream-50/60">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Changes to This Policy",
    content: (
      <p className="text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        We may update this Privacy Policy periodically. When we make material changes, we will notify you
        via a prominent notice on our website or by email. The "Last Updated" date at the top always reflects
        the most recent version.
      </p>
    ),
  },
  {
    icon: <Mail className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Contact Us",
    content: null, // Will be populated with dynamic data
  },
];

export default function PrivacyPolicyPage() {
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
        <p>For any questions or requests regarding this Privacy Policy, contact our team:</p>
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

  // Replace the last section with dynamic contact
  const finalSections = [...sections.slice(0, -1), contactSection];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-cream-50 via-cream-100/50 to-cream-50 dark:from-brown-950 dark:via-brown-900 dark:to-brown-950 py-4 pb-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron/20 to-gold/20 dark:from-saffron/30 dark:to-gold/30 mb-5 shadow-lg border border-white/80 dark:border-brown-700/50">
              <Shield className="w-8 h-8 text-saffron dark:text-gold" />
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-brown-800/80 border border-gold/20 dark:border-gold/10 text-brown-700 dark:text-cream-50/80 backdrop-blur-sm mb-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
              Your data, protected
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 dark:text-cream-50 mb-3 leading-tight">
            Privacy{' '}
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-sm text-brown-500 dark:text-cream-50/60">
            Last updated: <span className="font-medium text-brown-600 dark:text-cream-50/80">January 1, 2025</span>
          </p>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-saffron to-gold mx-auto mt-5" />
        </div>

        {/* Quick nav chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["Data Collection", "How We Use It", "Your Rights", "Security", "Contact"].map((label) => (
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