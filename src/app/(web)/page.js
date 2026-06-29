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

export default function Home() {
  return (
    <div className="min-h-screen">
      
        
        <HeroSection/>
        <DailySpiritualGuide/>
        <MyAstroBanner/>
        <BhajanHub/>
        <FestivalHub/>
        <SpiritualVideos />
        <SpiritualStories />
        <TempleDirectory />
        <NewsletterSection/>

      </div>
    
  );
}