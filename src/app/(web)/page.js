// app/(web)/page.jsx
import HeroSection from '@/components/web/home/HeroSection';
import MyAstroBanner from '../../components/web/home/MyAstroBanner';
import NewsletterSection from '@/components/web/home/NewsletterSection';
import DailySpiritualGuide from '@/components/web/home/panchnag-horoscope/DailySpiritualGuide';
import BhajanHub from '@/components/web/home/bhajan/BhajanHub';
import FestivalHub from '@/components/web/home/festival/FestivalHub';
import TempleDirectory from '@/components/web/home/temple/TempleDirectory';
import SpiritualStories from '@/components/web/home/story/SpiritualStories';
import SpiritualVideos from '@/components/web/home/spiritual-videos/SpiritualVideos';
import ShortsSection from '@/components/web/home/shorts/ShortsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      
        
        <HeroSection/>
        <DailySpiritualGuide/>
        <MyAstroBanner/>
        <BhajanHub/>
        <ShortsSection />
        <SpiritualVideos />
        <FestivalHub/>
        <SpiritualStories />
        <TempleDirectory />
        <NewsletterSection/>

      </div>
    
  );
}