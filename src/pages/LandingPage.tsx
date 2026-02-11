import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../sections/Hero';
import CourseOverview from '../sections/CourseOverview';
import ModuleSection from '../sections/ModuleSection';
import Calendar from '../sections/Calendar';
import Instructor from '../sections/Instructor';
import Navigation from '../sections/Navigation';
import { modulesData } from '../App';

// Registrar el plugin de GSAP
gsap.registerPlugin(ScrollTrigger);



const LandingPage: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global snap for pinned sections
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Course Overview */}
      <CourseOverview />
      
      {/* Module Sections */}
      {modulesData.map((module, index) => (
        <ModuleSection
          key={module.id}
          badge={module.badge}
          title={module.title}
          description={module.description}
          image={module.image}
          zIndex={30 + index * 10}
          moduleId={module.id}
        />
      ))}
      
      {/* Calendar Section */}
      <Calendar />
      
      {/* Instructor & Enrollment */}
      <Instructor />
    </div>
  );
}

export default LandingPage;
