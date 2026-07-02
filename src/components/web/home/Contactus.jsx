// app/(web)/contact/page.jsx
'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, User, MessageSquare, Tag, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitContactForm } from "@/lib/services/contactService";
import { getContactInfo } from "@/lib/services/settingsService";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Fetch contact info from settings
  useEffect(() => {
    const fetchContactInfo = async () => {
      const result = await getContactInfo();
      if (result.success) {
        setContactInfo(result.contact);
      }
      setLoading(false);
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

    const result = await submitContactForm(formData);

    if (result.success) {
      setIsSuccess(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setIsSuccess(false), 6000);
    } else {
      toast.error(result.error || "Failed to send message");
    }

    setIsSubmitting(false);
  };

  // Dynamic contact items based on fetched data
  const contactItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: contactInfo?.phone1 || "+91 99999 99999",
      href: `tel:${(contactInfo?.phone1 || "9999999999").replace(/\s/g, '')}`,
      iconBg: "bg-saffron/10",
      iconColor: "text-saffron",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: contactInfo?.contactEmail || "info@aarambhtv.com",
      href: `mailto:${contactInfo?.contactEmail || "info@aarambhtv.com"}`,
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Address",
      value: contactInfo?.address || "Mumbai, India",
      href: null,
      iconBg: "bg-cream-100 dark:bg-brown-800/40",
      iconColor: "text-brown-600 dark:text-cream-50/70",
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-saffron border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100/50 to-cream-50 dark:from-brown-950 dark:via-brown-900 dark:to-brown-950 py-4 pb-14 px-4 md:px-6 transition-colors duration-300">

      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-saffron/10 dark:bg-saffron/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gold/10 dark:bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 cursor-pointer"
        >
          <button
            onClick={() => router.back()}
            className="group cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm border border-gold/20 dark:border-gold/10 text-brown-600 dark:text-cream-50/70 hover:text-saffron dark:hover:text-gold hover:border-saffron/40 dark:hover:border-gold/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-brown-800/80 border border-gold/20 dark:border-gold/10 text-brown-700 dark:text-cream-50/80 backdrop-blur-sm mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
            We're here to help
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-brown-900 dark:text-cream-50 mb-4 leading-tight">
            Let's start a{" "}
            <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">
              conversation
            </span>
          </h1>

          <p className="text-base text-brown-500 dark:text-cream-50/60 max-w-md mx-auto leading-relaxed">
            Have a question or want to collaborate? Drop us a message and we'll get back to you promptly.
          </p>

          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-saffron to-gold mx-auto mt-5" />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="h-full bg-white/70 dark:bg-brown-800/70 backdrop-blur-xl border border-gold/20 dark:border-gold/10 rounded-2xl shadow-xl shadow-saffron/5 dark:shadow-none p-7">
              <h2 className="text-xl font-bold text-brown-900 dark:text-cream-50 mb-7">
                Get in touch
              </h2>

              <div className="space-y-6">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg} ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-brown-400 dark:text-cream-50/40 mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-brown-700 dark:text-cream-50/80 hover:text-saffron dark:hover:text-gold transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-brown-700 dark:text-cream-50/80 leading-relaxed">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show second phone if exists */}
              {contactInfo?.phone2 && (
                <div className="mt-4 pt-4 border-t border-gold/10 dark:border-gold/5">
                  <p className="text-xs text-brown-500 dark:text-cream-50/40 mb-1">Alternate Number</p>
                  <a
                    href={`tel:${contactInfo.phone2.replace(/\s/g, '')}`}
                    className="text-sm font-medium text-brown-700 dark:text-cream-50/80 hover:text-saffron"
                  >
                    {contactInfo.phone2}
                  </a>
                </div>
              )}

              <div className="mt-6 h-1.5 w-full rounded-full bg-gradient-to-r from-saffron via-gold to-saffron opacity-60" />
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/70 dark:bg-brown-800/70 backdrop-blur-xl border border-gold/20 dark:border-gold/10 rounded-2xl shadow-xl shadow-gold/5 dark:shadow-none p-3 md:p-5">

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron/20 to-gold/20 dark:from-saffron/30 dark:to-gold/30 flex items-center justify-center mb-5 shadow-inner">
                      <CheckCircle className="w-10 h-10 text-saffron" />
                    </div>
                    <h3 className="text-2xl font-bold text-brown-900 dark:text-cream-50 mb-2">
                      Message sent!
                    </h3>
                    <p className="text-sm text-brown-500 dark:text-cream-50/60 mb-6 leading-relaxed max-w-xs">
                      Thank you for reaching out. We'll get back to you within one business day.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-saffron to-gold text-white hover:opacity-90 transition-opacity shadow-md"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Heading */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-1 h-5 rounded-full bg-gradient-to-b from-saffron to-gold" />
                      <h3 className="text-base font-bold text-brown-900 dark:text-cream-50">
                        Send us a message
                      </h3>
                    </div>

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-brown-500 dark:text-cream-50/50 mb-1.5">
                          Full name <span className="text-saffron">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-brown-900 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/40 border border-gold/20 dark:border-gold/10 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-brown-500 dark:text-cream-50/50 mb-1.5">
                          Email <span className="text-saffron">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@email.com"
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-brown-900 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/40 border border-gold/20 dark:border-gold/10 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-brown-500 dark:text-cream-50/50 mb-1.5">
                          Phone <span className="text-saffron">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10-digit number"
                            maxLength={10}
                            required
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-brown-900 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/40 border border-gold/20 dark:border-gold/10 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-brown-500 dark:text-cream-50/50 mb-1.5">
                          Subject
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400" />
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Optional subject"
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-brown-900 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/40 border border-gold/20 dark:border-gold/10 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-brown-500 dark:text-cream-50/50 mb-1.5">
                        Message <span className="text-saffron">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write your message here…"
                        required
                        className="w-full px-4 py-2.5 text-sm rounded-xl resize-none bg-white dark:bg-brown-900 text-brown-900 dark:text-cream-50 placeholder:text-brown-400 dark:placeholder:text-cream-50/40 border border-gold/20 dark:border-gold/10 focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all duration-200"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-bold tracking-wide text-white bg-gradient-to-r from-saffron to-gold hover:from-saffron/90 hover:to-gold/90 focus:outline-none focus:ring-2 focus:ring-saffron/50 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-saffron/25 dark:shadow-saffron/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}