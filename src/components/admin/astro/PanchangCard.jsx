// components/admin/astro/PanchangCard.jsx
'use client';

export default function PanchangCard({ icon: Icon, label, value, isDark }) {
  return (
    <div className={`p-4 rounded-xl ${
      isDark ? "bg-gray-900/50" : "bg-gray-50"
    }`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 text-yellow-500" />
        <p className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {label}
        </p>
      </div>
      <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
        {value || '—'}
      </p>
    </div>
  );
}