import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ModuleSectionProps {
  badge: string;
  title: string;
  description: string;
  image: string;
  zIndex: number;
  moduleId?: number;  // ← Add this line
}

const ModuleSection = ({ badge, title, description, image, zIndex }: ModuleSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });

      // ENTRANCE (0-30%)
      // Background entrance
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.08, opacity: 0.7 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Badge entrance
      scrollTl.fromTo(
        badgeRef.current,
        { x: '20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Headline entrance
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-55vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.06
      );

      // Body entrance
      scrollTl.fromTo(
        bodyRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      // CTA entrance
      scrollTl.fromTo(
        ctaRef.current,
        { y: '5vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.14
      );

      // SETTLE (30-70%): Static

      // EXIT (70-100%)
      scrollTl.fromTo(
        badgeRef.current,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        ctaRef.current,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bgRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.05, opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="modulos"
      className="section-pinned"
      style={{ zIndex }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.7, transform: 'scale(1.08)' }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/85 via-[#0B0B0D]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-[6vw]">
        {/* Badge */}
        <span
          ref={badgeRef}
          className="font-mono text-xs uppercase tracking-[0.14em] text-[#C7A36D] mb-6"
          style={{ opacity: 0, transform: 'translateX(20vw)' }}
        >
          {badge}
        </span>

        {/* Title */}
        <h2
          ref={headlineRef}
          className="font-serif text-[8vw] md:text-[6vw] lg:text-[64px] font-medium text-[#F4F2EC] leading-[1.05] tracking-[-0.02em] max-w-[38vw]"
          style={{ opacity: 0, transform: 'translateX(-55vw)' }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          ref={bodyRef}
          className="mt-6 md:mt-8 text-base md:text-lg text-[#B8B4AA] leading-relaxed max-w-[38vw]"
          style={{ opacity: 0, transform: 'translateY(10vh)' }}
        >
          {description}
        </p>

        {/* CTA Button - Removed */}
        <div
          ref={ctaRef}
          className="mt-8 md:mt-10"
          style={{ opacity: 0, transform: 'translateY(5vh)' }}
        ></div>
      </div>
    </section>
  );
};

export default ModuleSection;
