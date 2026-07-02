// app/(admin)/admin/settings/page.jsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import useAdminAuthStore from "@/lib/store/useAdminAuthStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import SeoSettings from "./SeoSettings";
import SocialLinks from "./SocialLinks";
import ContactSettings from "./ContactSettings";
import { 
  getSettings, 
  updateSeoSettings, 
  updateSocialLinks, 
  updateContactSettings 
} from "@/lib/services/settingsService";

const tabs = [
  { id: "seo", name: "SEO", icon: "🔍" },
  { id: "social", name: "Social Links", icon: "📱" },
  { id: "contact", name: "Contact", icon: "📞" },
];

export default function SettingsPage() {
  const { theme } = useThemeStore();
  const { admin } = useAdminAuthStore();
  const { log } = useActivityLogger();
  const router = useRouter();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("seo");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const result = await getSettings();
      if (result.success) {
        setSettings(result.settings);
      } else {
        toast.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSeo = async (data) => {
    const result = await updateSeoSettings(data, admin);
    if (result.success) {
      await log({
        action: 'UPDATE',
        entityType: 'settings',
        entityId: 'seo',
        entityTitle: 'SEO Settings',
        details: 'Updated SEO settings'
      });
      toast.success("SEO settings updated");
      fetchSettings();
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  const handleUpdateSocial = async (data) => {
    const result = await updateSocialLinks(data, admin);
    if (result.success) {
      await log({
        action: 'UPDATE',
        entityType: 'settings',
        entityId: 'social',
        entityTitle: 'Social Links',
        details: 'Updated social media links'
      });
      toast.success("Social links updated");
      fetchSettings();
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  const handleUpdateContact = async (data) => {
    const result = await updateContactSettings(data, admin);
    if (result.success) {
      await log({
        action: 'UPDATE',
        entityType: 'settings',
        entityId: 'contact',
        entityTitle: 'Contact Settings',
        details: 'Updated contact information'
      });
      toast.success("Contact information updated");
      fetchSettings();
    } else {
      toast.error(result.error || "Failed to update contact info");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className={`p-2 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isDark
              ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              : "border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Settings
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}>
            Manage your website configuration
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? "border-yellow-500 text-yellow-500"
                : isDark
                  ? "border-transparent text-gray-400 hover:text-gray-200"
                  : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "seo" && settings?.seo && (
          <SeoSettings
            settings={settings.seo}
            onUpdate={handleUpdateSeo}
            isDark={isDark}
          />
        )}
        
        {activeTab === "social" && settings?.social && (
          <SocialLinks
            settings={settings.social}
            onUpdate={handleUpdateSocial}
            isDark={isDark}
          />
        )}
        
        {activeTab === "contact" && settings?.contact && (
          <ContactSettings
            settings={settings.contact}
            onUpdate={handleUpdateContact}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
}