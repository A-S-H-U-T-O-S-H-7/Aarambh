// components/admin/astro/HoraTable.jsx
'use client';

export default function HoraTable({ hora, isDark }) {
  if (!hora?.horas || hora.horas.length === 0) return null;

  return (
    <div className={`mt-6 rounded-xl overflow-hidden ${
      isDark ? "bg-gray-900/50 border border-gray-700" : "bg-gray-50 border border-gray-200"
    }`}>
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}>
        <h3 className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          🌟 Hora Muhurta
        </h3>
        {hora?.dayOfWeek && (
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {hora.dayOfWeek}
          </span>
        )}
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {hora.horas.map((item, index) => {
            const startTime = item.start ? new Date(item.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : item.start;
            const endTime = item.end ? new Date(item.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : item.end;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  isDark ? "bg-gray-800/50 hover:bg-gray-800" : "bg-white/50 hover:bg-white"
                } transition-colors duration-200`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    {item.hora}
                  </p>
                  {item.lucky_gem && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isDark ? "bg-purple-500/20 text-purple-400" : "bg-purple-100 text-purple-700"
                    }`}>
                      💎 {item.lucky_gem}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {startTime} - {endTime}
                </p>
                {item.benefits && (
                  <p className={`text-[10px] mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {item.benefits}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}