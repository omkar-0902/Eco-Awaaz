import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SystemSection from './components/SystemSection';
import CommandCenter from './components/CommandCenter';
import ImpactSection from './components/ImpactSection';
import Footer from './components/Footer';

// Per-section color mapping (saturated, vivid versions from logo)
const SECTION_COLORS: Record<string, string> = {
  hero:    'rgba(34, 139, 34, 0.55)',    // Forest green
  command: 'rgba(30, 100, 220, 0.55)',    // Vivid blue
  problem: 'rgba(240, 150, 20, 0.55)',    // Orange-yellow
  system:  'rgba(34, 139, 34, 0.55)',     // Forest green
  impact:  'rgba(30, 100, 220, 0.55)',    // Vivid blue
  footer:  'rgba(34, 139, 34, 0.55)',     // Forest green
};

function App() {
  const [bgColor, setBgColor] = useState(SECTION_COLORS.hero);

  const heroRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionMap: { ref: React.RefObject<HTMLDivElement | null>; key: string }[] = [
      { ref: heroRef, key: 'hero' },
      { ref: commandRef, key: 'command' },
      { ref: problemRef, key: 'problem' },
      { ref: systemRef, key: 'system' },
      { ref: impactRef, key: 'impact' },
      { ref: footerRef, key: 'footer' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        });
        if (best) {
          const key = (best as IntersectionObserverEntry).target.getAttribute('data-section');
          if (key && SECTION_COLORS[key]) {
            setBgColor(SECTION_COLORS[key]);
          }
        }
      },
      { threshold: [0.1, 0.3, 0.5, 0.7], rootMargin: '-10% 0px -10% 0px' }
    );

    sectionMap.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white">
      {/* Scroll-driven color background */}
      <div
        className="fixed inset-0 z-[-2] min-h-screen pointer-events-none"
        style={{ backgroundColor: bgColor, transition: 'background-color 0.4s ease' }}
      />
      {/* Subtle grid texture */}
      <div className="fixed inset-0 z-[-1] min-h-screen grid-bg pointer-events-none opacity-30" />

      <Navbar />

      <main className="flex flex-col gap-16 md:gap-32 pb-32 pt-16 relative z-10">
        <div ref={heroRef} data-section="hero"><Hero /></div>
        <div ref={commandRef} data-section="command"><CommandCenter /></div>
        <div ref={problemRef} data-section="problem"><ProblemSection /></div>
        <div ref={systemRef} data-section="system"><SystemSection /></div>
        <div ref={impactRef} data-section="impact"><ImpactSection /></div>
      </main>

      <div ref={footerRef} data-section="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
