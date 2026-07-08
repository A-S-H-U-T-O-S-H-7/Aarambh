'use client';

import { motion } from 'framer-motion';
import { FaCamera, FaChartBar, FaChartLine, FaCog, FaComment, FaCrown, FaFilm, FaPalette, FaPen, FaUsers } from 'react-icons/fa';
import TeamCard from './TeamCard';

const teamMembers = [
  {
    id: 1,
    name: "Dr. Manoranjan Mohanty",
    role: "Founder & Chairman",
    initials: "MM",
    icon: FaCrown,
    tag: "FOUNDER",
    gradient: "from-saffron to-gold",
    color: "#FF7A00",
    quote: "Bringing spirituality to the digital age",
    isFounder: true,
  },
  {
    id: 2,
    name: "Reva Solanki",
    role: "Manager",
    initials: "RS",
    icon: FaCog,
    tag: "OPS",
    gradient: "from-indigo-500 to-blue-500",
    color: "#4F46E5",
    quote: "Managing divine operations with grace",
  },
  {
    id: 3,
    name: "Manbir Singh Negi",
    role: "Sr. Cameraman & Video Editor",
    initials: "MN",
    icon: FaCamera,
    tag: "VIDEO",
    gradient: "from-orange-500 to-amber-500",
    color: "#E8742C",
    quote: "Visual stories that touch the soul",
  },
  {
    id: 4,
    name: "Deepak Kumar",
    role: "Animation & Video Editor",
    initials: "DK",
    icon: FaFilm,
    tag: "MOTION",
    gradient: "from-purple-500 to-violet-500",
    color: "#6A1B9A",
    quote: "Animating divine stories",
  },
  {
    id: 5,
    name: "Manish Batra",
    role: "Graphic Designer",
    initials: "MB",
    icon: FaPalette,
    tag: "DESIGN",
    gradient: "from-blue-500 to-cyan-500",
    color: "#0284c7",
    quote: "Designing spirituality with color",
  },
  {
    id: 6,
    name: "Lal Yadav",
    role: "SEO Specialist",
    initials: "LY",
    icon: FaChartLine,
    tag: "GROWTH",
    gradient: "from-emerald-500 to-green-500",
    color: "#059669",
    quote: "Spreading divine content to the world",
  },
  {
    id: 7,
    name: "Ankita Mohanty",
    role: "Social Media Handler",
    initials: "AM",
    icon: FaComment,
    tag: "SOCIAL",
    gradient: "from-pink-500 to-rose-500",
    color: "#DB2777",
    quote: "Connecting souls through social media",
  },
  {
    id: 8,
    name: "Rajneesh Verma",
    role: "Content Writer & Digital Strategist",
    initials: "RV",
    icon: FaPen,
    tag: "CONTENT",
    gradient: "from-lime-500 to-green-500",
    color: "#65A30D",
    quote: "Weaving words of wisdom",
  },
  {
    id: 9,
    name: "Nirmalya Mohanty",
    role: "SEO & SMO Specialist",
    initials: "NM",
    icon: FaChartBar,
    tag: "SEO/SMO",
    gradient: "from-cyan-500 to-teal-500",
    color: "#0891B2",
    quote: "Optimizing the divine presence",
  },
];

export default function TeamSection() {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-cream-50/30 to-white dark:from-brown-900/20 dark:to-brown-900">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-brown-800/80 backdrop-blur-sm rounded-full border border-gold/20 dark:border-gold/10 shadow-sm mb-3">
            <FaUsers className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-brown-700 dark:text-cream-50/70 uppercase tracking-wider">
              Our Team
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-brown-900 dark:text-cream-50">
            Meet the <span className="bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent">Makers</span>
          </h2>
          <p className="mt-2 text-sm text-brown-600 dark:text-cream-50/50 max-w-2xl mx-auto">
            The passionate individuals behind Aarambh TV, dedicated to bringing
            spirituality to the digital world.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}