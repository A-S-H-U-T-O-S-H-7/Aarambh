import ShortsPage from '@/components/web/shorts/ShortsPage';

export const metadata = {
  title: 'Spiritual Shorts',
  description:
    'Watch short devotional videos from Aarambh TV — mantras, aarti, darshan, bhajans and spiritual moments in under a minute.',
  alternates: { canonical: 'https://aarambhtv.com/shorts' },
};

export default function Page() {
  return <ShortsPage />;
}
