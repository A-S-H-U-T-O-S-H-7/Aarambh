// components/admin/astro/ChoghadiyaTable.jsx
'use client';

export default function ChoghadiyaTable({ choghadiya, isDark }) {
  const getTypeColor = (type) => {
    if (type === 'Auspicious' || type === 'Good') {
      return isDark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700';
    } else if (type === 'Inauspicious') {
      return isDark ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-700';
    }
    return isDark ? 'bg-gray-700/40 text-gray-400' : 'bg-gray-100 text-gray-600';
  };

  const hasData = (choghadiya?.day && choghadiya.day.length > 0) || 
                  (choghadiya?.night && choghadiya.night.length > 0);

  if (!hasData) return null;

  return (
    <div className={`mt-6 rounded-xl overflow-hidden ${
      isDark ? "bg-gray-900/50 border border-gray-700" : "bg-gray-50 border border-gray-200"
    }`}>
      <div className={`px-4 py-3 border-b flex items-center justify-between ${
        isDark ? "border-gray-700" : "border-gray-200"
      }`}>
        <h3 className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
          🕐 Choghadiya Muhurta
        </h3>
        {choghadiya?.dayOfWeek && (
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {choghadiya.dayOfWeek}
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Day Choghadiya */}
        {choghadiya?.day && choghadiya.day.length > 0 && (
          <div className="mb-4">
            <h4 className={`text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Day
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {choghadiya.day.map((item, index) => {
                // Extract time from date string
                const startTime = item.start ? new Date(item.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : item.start;
                const endTime = item.end ? new Date(item.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : item.end;
                return (
                  <div
                    key={index}
                    className={`p-2 rounded-lg text-center ${
                      isDark ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <p className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {item.muhurat}
                    </p>
                    <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {startTime} - {endTime}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-1 ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Night Choghadiya */}
        {choghadiya?.night && choghadiya.night.length > 0 && (
          <div>
            <h4 className={`text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Night
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {choghadiya.night.map((item, index) => {
                const startTime = item.start ? new Date(item.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : item.start;
                const endTime = item.end ? new Date(item.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : item.end;
                return (
                  <div
                    key={index}
                    className={`p-2 rounded-lg text-center ${
                      isDark ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <p className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      {item.muhurat}
                    </p>
                    <p className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {startTime} - {endTime}
                    </p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-1 ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}