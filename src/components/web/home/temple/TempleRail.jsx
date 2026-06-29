// components/home/TempleRail.jsx
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Star,
  Video
} from 'lucide-react';

export default function TempleRail({ temples }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (temples.length === 0) return null;

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {temples.map((temple) => (
          <Link
            key={temple.id}
            href={`/temples/${temple.id}`}
            className="flex-shrink-0 cursor-pointer group/card transition-all duration-300 hover:scale-[1.02]"
            style={{ width: "240px" }}
          >
            <div 
              className="relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
              style={{ height: "340px" }}
            >
              {/* Image */}
              <div className="relative w-full h-full">
                <Image
                  src={temple.image}
                  alt={temple.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-saffron text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                    {temple.deity}
                  </span>
                </div>

                {temple.liveDarshan && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-divine-red text-white text-[9px] font-bold rounded-full uppercase flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Live
                    </span>
                  </div>
                )}

                {/* Explore Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-sm">
                  <div className="px-6 py-2.5 bg-gradient-to-r from-saffron to-gold text-white font-medium rounded-full hover:shadow-lg transition-all">
                    Explore Temple
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white text-sm font-bold leading-snug line-clamp-2 mb-2">
                    {temple.name}
                  </h4>
                  <div className="flex items-center gap-3 text-white/70 text-[10px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {temple.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold" />
                      {temple.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}