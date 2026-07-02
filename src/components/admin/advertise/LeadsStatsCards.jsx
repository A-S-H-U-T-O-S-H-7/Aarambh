// components/admin/leads/LeadsStatsCards.jsx
'use client';

import { Building, Clock, Phone, CheckCircle, XCircle } from "lucide-react";

export default function LeadsStatsCards({ stats, isDark }) {
  const cards = [
    { title: "Total", value: stats.total, icon: Building, color: "text-yellow-500" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { title: "Contacted", value: stats.contacted, icon: Phone, color: "text-blue-500" },
    { title: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-500" },
    { title: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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