// components/admin/messages/ContactStatsCards.jsx
'use client';

import { Mail, Inbox, Eye, CheckCircle } from "lucide-react";

export default function ContactStatsCards({ stats, isDark }) {
  const cards = [
    { title: "Total Messages", value: stats.total, icon: Mail, color: "text-yellow-500" },
    { title: "Unread", value: stats.unread, icon: Inbox, color: "text-red-500" },
    { title: "Read", value: stats.read, icon: Eye, color: "text-blue-500" },
    { title: "Replied", value: stats.replied, icon: CheckCircle, color: "text-green-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-2xl border p-5 transition-all duration-300 ${
            isDark 
              ? 'border-gray-700 bg-gray-800/90 shadow-lg' 
              : 'border-gray-200 bg-white/80 shadow-md backdrop-blur-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{card.title}</p>
              <p className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{card.value}</p>
            </div>
            <card.icon className={`w-8 h-8 ${card.color} opacity-50`} />
          </div>
        </div>
      ))}
    </div>
  );
}