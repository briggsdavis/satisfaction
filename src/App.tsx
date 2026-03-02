import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { ColumnWipe } from './components/ColumnWipe';
import { SmoothScroll } from './components/SmoothScroll';
import { Hero, ProjectShowcase, BrandMarquee, ServiceTrinity } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { Contact } from './pages/Contact';

import { Footer } from './components/Footer';
import { DynamicBackground } from './components/DynamicBackground';

const Home = () => (
  <>
    <Hero />
    <ProjectShowcase />
    <BrandMarquee />
    <ServiceTrinity />
  </>
);

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  // Walk up offsetParents to compute el's distance from the SmoothScroll fixed div,
  // which equals the native scrollY needed to bring the section to the viewport top.
  let top = 0;
  let current: HTMLElement | null = el;
  while (current) {
    top += current.offsetTop;
    const parent = current.offsetParent as HTMLElement | null;
    if (!parent) break;
    if (window.getComputedStyle(parent).position === 'fixed') break;
    current = parent;
  }
  window.scrollTo({ top, behavior: 'smooth' });
};

const ServicesSidebar = () => {
  const location = useLocation();
  if (location.pathname !== '/services') return null;

  const links = [
    { label: 'A', id: 'service-a', title: 'Videography' },
    { label: 'B', id: 'service-b', title: 'Photography' },
    { label: 'C', id: 'service-c', title: 'Graphic Design' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4"
    >
      {links.map(({ label, id, title }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          title={title}
          className="w-8 h-8 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest border border-current/20 bg-black/40 backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-200"
        >
          {label}
        </button>
      ))}
    </motion.div>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const gridOpacity = useTransform(scrollYProgress, [0, 0.2], [0.1, 0.3]);
  const lineColor = useTransform(scrollYProgress, [0, 0.2], ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.1)']);

  return (
    <Router>
      <DynamicBackground>
        <CustomCursor />
        <motion.div
          style={{ opacity: gridOpacity }}
          className="industrial-grid fixed inset-0 pointer-events-none"
        />

        {/* Column Lines — z-[1] keeps them above the background but below page content (z-[2]) */}
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className="column-line"
            style={{
              left: `${(100 / 6) * i}%`,
              backgroundColor: lineColor
            }}
          />
        ))}

        <Navbar />
        <ServicesSidebar />

        <ColumnWipe>
          <SmoothScroll>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
          </SmoothScroll>
        </ColumnWipe>
      </DynamicBackground>
    </Router>
  );
}
