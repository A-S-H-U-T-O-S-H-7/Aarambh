// app/(web)/terms/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Users, Scale, AlertTriangle, Ban,
  Copyright, Gavel, RefreshCw, Mail, Globe, CheckCircle,
  ArrowLeft, Phone, MapPin
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getContactInfo } from "@/lib/services/settingsService";

const sections = [
  {
    icon: <FileText className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Acceptance of Terms",
    content: (
      <p className="text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        By accessing or using the Aarambh TV website or any related services ("Aarambh TV", "we", "our", "us"),
        you confirm that you are at least 13 years of age and agree to be legally bound by these Terms of Use
        and our{' '}
        <a href="/privacy-policy" className="text-saffron hover:text-gold transition-colors font-medium">Privacy Policy</a>{' '}
        and{' '}
        <a href="/cookie-policy" className="text-saffron hover:text-gold transition-colors font-medium">Cookie Policy</a>.
        If you do not agree with any part of these terms, you must discontinue use of our services immediately.
      </p>
    ),
  },
  {
    icon: <Users className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "User Accounts",
    content: (
      <div className="space-y-3 text-sm text-brown-600 dark:text-cream-50/70">
        <p className="leading-relaxed">When you create an account with Aarambh TV, you agree to the following:</p>
        <ul className="space-y-1.5">
          {[
            "Provide accurate, current, and complete registration information",
            "Maintain the confidentiality of your password and account credentials",
            "Notify us immediately of any unauthorised use of your account",
            "Be solely responsible for all activity that occurs under your account",
            "Not share your account with others or create accounts for the purpose of abuse",
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
    icon: <Copyright className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Intellectual Property & Content Usage",
    content: (
      <div className="space-y-3 text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        <p>
          All content published on Aarambh TV — including but not limited to articles, photographs, videos,
          graphics, logos, and editorial copy — is the exclusive intellectual property of Aarambh TV
          or its licensed content providers and is protected under applicable copyright laws.
        </p>
        <div>
          <p className="font-semibold text-brown-700 dark:text-cream-50/80 mb-2">You may:</p>
          <ul className="space-y-1.5">
            {[
              "Read and access content for personal, non-commercial use",
              "Share links to our articles on social media or personal websites with proper attribution",
              "Quote brief excerpts (up to 50 words) with a clear credit and link back to the original content",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-saffron flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-brown-700 dark:text-cream-50/80 mb-2">You may not:</p>
          <ul className="space-y-1.5">
            {[
              "Reproduce, republish, or distribute full articles without prior written consent",
              "Scrape or crawl our website for bulk content collection",
              "Use our content for AI model training or commercial purposes without a licence",
              "Remove or alter any copyright, trademark, or proprietary notices",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: <Ban className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Prohibited Conduct",
    content: (
      <div className="space-y-2 text-sm text-brown-600 dark:text-cream-50/70">
        <p className="leading-relaxed">You agree not to use Aarambh TV's services to:</p>
        <ul className="space-y-1.5">
          {[
            "Post, upload, or share content that is defamatory, obscene, hateful, or unlawful",
            "Harass, threaten, or intimidate other users or Aarambh TV staff",
            "Impersonate any person or entity, or misrepresent your affiliation",
            "Spread misinformation, fake news, or deliberately misleading content",
            "Introduce malware, viruses, or any code designed to disrupt our services",
            "Attempt to gain unauthorised access to our systems, databases, or user accounts",
            "Use automated bots or scripts to access, scrape, or interact with the platform",
            "Engage in any activity that violates applicable law",
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
    icon: <AlertTriangle className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Disclaimers & Limitation of Liability",
    content: (
      <div className="space-y-2 text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        <p>
          Aarambh TV's content is provided for informational and spiritual guidance purposes only. While we strive
          for accuracy, we make no warranties — express or implied — regarding the completeness,
          accuracy, reliability, or timeliness of any content.
        </p>
        <p>
          Aarambh TV shall not be liable for any direct, indirect, incidental, consequential, or punitive
          damages arising from your use of, or inability to use, our services. Use of Aarambh TV is at your own risk.
        </p>
      </div>
    ),
  },
  {
    icon: <Gavel className="w-5 h-5" />,
    iconBg: "bg-gold/10",
    iconColor: "text-gold",
    title: "Governing Law & Dispute Resolution",
    content: (
      <div className="space-y-2 text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        <p>
          These Terms of Use are governed by and construed in accordance with the laws of India.
          Any disputes arising out of or in connection with these Terms shall be subject to the exclusive
          jurisdiction of the courts located in India.
        </p>
        <p>
          We encourage users to resolve disputes informally first by contacting us. We will make reasonable
          efforts to address your concern within 15 business days.
        </p>
      </div>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    iconBg: "bg-saffron/10",
    iconColor: "text-saffron",
    title: "Changes to These Terms",
    content: (
      <p className="text-sm text-brown-600 dark:text-cream-50/70 leading-relaxed">
        We reserve the right to update or modify these Terms of Use at any time. Significant changes will be
        communicated via a notice on our website or by email. Continued use of Aarambh TV after changes are posted
        constitutes your acceptance of the revised Terms.
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

export default function TermsPage() {
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
        <p>For questions about these Terms, please contact our Legal Team:</p>
        <div className="bg-gradient-to-br from-cream-50/50 to-gold/5 dark:from-brown-900/50 dark:to-gold/5 rounded-xl p-4 border border-gold/10 dark:border-gold/5 space-y-2">
          <p className="font-semibold text-brown-800 dark:text-cream-50">Aarambh TV — Legal Team</p>
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
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron/20 to-gold/20 dark:from-saffron/30 dark:to-gold/30 mb-3 shadow-lg border border-white/80 dark:border-brown-700/50">
              <Scale className="w-8 h-8 text-saffron dark:text-gold" />
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-brown-800/80 border border-gold/20 dark:border-gold/10 text-brown-700 dark:text-cream-50/80 backdrop-blur-sm mb-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
              Please read carefully
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 dark:text-cream-50 mb-2 leading-tight">
            Terms of{' '}
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Use</span>
          </h1>
          <p className="text-sm text-brown-500 dark:text-cream-50/60">
            Last updated: <span className="font-medium text-brown-600 dark:text-cream-50/80">January 1, 2025</span>
          </p>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-saffron to-gold mx-auto mt-5" />
        </div>

        {/* Quick nav chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {["Acceptance", "User Accounts", "IP & Content", "Prohibited Conduct", "Liability", "Governing Law"].map((label) => (
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