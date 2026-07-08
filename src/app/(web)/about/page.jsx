'use client';

import { useState, useEffect } from 'react';
import AboutHeroSection from '@/components/web/home/about/HeroSection';
import MissionSection from '@/components/web/home/about/MissionSection';
import ValuesSection from '@/components/web/home/about/ValuesSection';
import JourneySection from '@/components/web/home/about/JourneySection';
import TeamSection from '@/components/web/home/about/TeamSection';
import FooterQuote from '@/components/web/home/about/FooterQuote';

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroImage = isMobile ? '/aboutus1.png' : '/aboutus.png';

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AboutHeroSection isMobile={isMobile} heroImage={heroImage} />
      <MissionSection />
      <ValuesSection />
      <JourneySection />
      <TeamSection />
      <FooterQuote />
    </div>
  );
}