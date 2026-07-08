'use client';

import { useState } from 'react';

export default function ValueCard({ value, Icon }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl p-6 h-full cursor-default overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? `linear-gradient(145deg, ${value.from}30, ${value.to}20)`
          : '#ffffff',
        boxShadow: hovered
          ? `12px 14px 0px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,0.95), 0 0 0 2px ${value.from}80`
          : "8px 8px 0px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-6px) rotate(-0.8deg)" : "translateY(0) rotate(0deg)",
        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, background 0.4s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dark mode base - Dark background for better visibility */}
      <div
        className="absolute inset-0 rounded-2xl dark:block hidden"
        style={{ 
          background: "linear-gradient(145deg, #1a1420, #2d1f33)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />
      
      {/* Light mode color tint */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300 dark:hidden"
        style={{ 
          background: value.soft, 
          opacity: hovered ? 0.9 : 0.7,
        }}
      />

      {/* Dark mode color tint - more visible */}
      <div
        className="absolute inset-0 rounded-2xl hidden dark:block transition-opacity duration-300"
        style={{ 
          background: `radial-gradient(circle at 30% 20%, ${value.from}50, ${value.to}20, transparent 80%)`,
          opacity: hovered ? 0.9 : 0.6,
        }}
      />

      <div className="relative z-10">
        {/* Claymorphism icon - enhanced 3D effect with vibrant colors */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
          style={{
            background: `linear-gradient(145deg, ${value.from}, ${value.to})`,
            boxShadow: hovered
              ? `inset 0 -4px 8px rgba(0,0,0,0.35), inset 0 4px 8px rgba(255,255,255,0.7), 0 12px 28px ${value.glow}`
              : `inset 0 -2px 4px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.6), 0 8px 20px ${value.glow}`,
            transform: hovered ? "scale(1.1) rotate(3deg)" : "scale(1) rotate(0deg)",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease",
          }}
        >
          <Icon className="w-5 h-5 text-white drop-shadow-md" />
        </div>

        <h3 className={`text-sm font-black mb-1.5 transition-colors duration-300 ${
          hovered ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-white'
        }`}>
          {value.title}
        </h3>
        <p className={`text-xs leading-relaxed transition-colors duration-300 ${
          hovered ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-300'
        }`}>
          {value.description}
        </p>
      </div>

      {/* Vibrant edge highlight */}
      <div
        className="absolute top-0 left-4 right-4 h-px transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${value.from}80, transparent)`,
          opacity: hovered ? 1 : 0.6,
        }}
      />

      {/* Vibrant corner glow - increased opacity */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full transition-all duration-500 ${
          hovered ? 'opacity-80 scale-100' : 'opacity-30 scale-50'
        }`}
        style={{
          background: `radial-gradient(circle, ${value.from}40, transparent 70%)`,
        }}
      />

      {/* Dark mode corner glow */}
      <div
        className={`absolute -bottom-8 -left-8 w-24 h-24 rounded-full transition-all duration-500 hidden dark:block ${
          hovered ? 'opacity-60 scale-100' : 'opacity-20 scale-50'
        }`}
        style={{
          background: `radial-gradient(circle, ${value.to}30, transparent 70%)`,
        }}
      />
    </div>
  );
}