// components/home/FestivalCountdown.jsx
'use client';

import { useState, useEffect } from 'react';

export default function FestivalCountdown({ targetDate, size = 'md' }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const { days, hours, minutes, seconds } = timeLeft;
  const isSmall = size === 'sm';

  const Unit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span
        className={`font-bold text-[#B8860B] dark:text-[#F4B400] tabular-nums ${
          isSmall ? 'text-sm' : 'text-xl sm:text-2xl'
        }`}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className={`uppercase tracking-wider text-[#8C7456] dark:text-[#9C8569] ${isSmall ? 'text-[7px]' : 'text-[8px]'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={`flex items-center ${isSmall ? 'gap-1' : 'gap-1.5 sm:gap-2'}`}>
      <Unit value={days} label="Days" />
      <span className="text-[#F4B400]/50 font-bold">:</span>
      <Unit value={hours} label="Hrs" />
      <span className="text-[#F4B400]/50 font-bold">:</span>
      <Unit value={minutes} label="Min" />
      <span className="text-[#F4B400]/50 font-bold">:</span>
      <Unit value={seconds} label="Sec" />
    </div>
  );
}