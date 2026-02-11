import { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const scrollLabelRef = useRef<HTMLDivElement>(null);

  // Auto-play entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Background entrance
      tl.fromTo(
        bgRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.1 }
      );

      // Title lines entrance
      tl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
        '-=0.6'
      );

      // Subheadline entrance
      tl.fromTo(
        subheadRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.4'
      );

      // CTA entrance
      tl.fromTo(
        ctaRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.3'
      );

      // Scroll label entrance
      tl.fromTo(
        scrollLabelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set([titleLine1Ref.current, titleLine2Ref.current, subheadRef.current, ctaRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
            });
            gsap.set(bgRef.current, { scale: 1 });
          },
        },
      });

      // ENTRANCE (0-30%): Hold at fully visible (entrance handled by load animation)
      // SETTLE (30-70%): Static
      // EXIT (70-100%): Elements exit

      // Title group exit
      scrollTl.fromTo(
        [titleLine1Ref.current, titleLine2Ref.current],
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Subheadline + CTA exit
      scrollTl.fromTo(
        [subheadRef.current, ctaRef.current],
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      // Background scale
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      );

      // Scroll label fade
      scrollTl.fromTo(
        scrollLabelRef.current,
        { opacity: 1 },
        { opacity: 0 },
        0.75
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToCourse = () => {
    const element = document.getElementById('curso');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned z-10"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0 }}
      >
        <img
          src="/images/hero_bg.jpg"
          alt="Artist studio"
          className="w-full h-full object-cover"
        />
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/70 via-[#0B0B0D]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-[6vw]">
        {/* Title */}
        <div className="max-w-[52vw]">
          <h1
            ref={titleLine1Ref}
            className="font-serif text-[12vw] md:text-[8vw] lg:text-[96px] font-medium text-[#F4F2EC] leading-[0.95] tracking-[-0.02em]"
            style={{ opacity: 0 }}
          >
            Poética
          </h1>
          <h1
            ref={titleLine2Ref}
            className="font-serif text-[12vw] md:text-[8vw] lg:text-[96px] font-medium text-[#F4F2EC] leading-[0.95] tracking-[-0.02em] mt-2"
            style={{ opacity: 0 }}
          >
            de la mirada
          </h1>
        </div>

        {/* Subheadline */}
        <p
          ref={subheadRef}
          className="mt-8 md:mt-12 text-base md:text-lg text-[#B8B4AA] max-w-[34vw] leading-relaxed"
          style={{ opacity: 0 }}
        >
          Un curso para aprender a ver antes de pintar. Ocho módulos, encuentros virtuales y tiempo de decantación.
        </p>

        {/* CTA Button */}
        <button
          ref={ctaRef}
          onClick={scrollToCourse}
          className="mt-8 md:mt-10 px-8 py-4 bg-[#C7A36D] text-[#0B0B0D] font-mono text-sm uppercase tracking-[0.14em] font-medium hover:bg-[#d4b07a] transition-colors duration-300 w-fit"
          style={{ opacity: 0 }}
        >
          Ver el programa
        </button>
      </div>

      {/* Scroll Label */}
      <div
        ref={scrollLabelRef}
        className="absolute bottom-[4vh] right-[4vw] flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA]">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-[#B8B4AA] animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
