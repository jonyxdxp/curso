import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Video, BookOpen, Clock, Library } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CourseOverview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardTitleRef = useRef<HTMLHeadingElement>(null);
  const bulletsRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.5,
        },
      });

      // ENTRANCE (0-30%)
      // Background entrance
      scrollTl.fromTo(
        bgRef.current,
        { scale: 1.1, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

      // Headline entrance
      scrollTl.fromTo(
        headlineRef.current,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Body entrance
      scrollTl.fromTo(
        bodyRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.08
      );

      // Card entrance
      scrollTl.fromTo(
        cardRef.current,
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.1
      );

      // Card title + bullets entrance
      scrollTl.fromTo(
        cardTitleRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.14
      );

      if (bulletsRef.current) {
        const bullets = bulletsRef.current.querySelectorAll('li');
        scrollTl.fromTo(
          bullets,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'power2.out' },
          0.16
        );
      }

      // SETTLE (30-70%): Static - no animations

      // EXIT (70-100%)
      scrollTl.fromTo(
        headlineRef.current,
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        bodyRef.current,
        { y: 0, opacity: 1 },
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
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

  const features = [
    { icon: Video, text: '1 encuentro virtual por semana' },
    { icon: BookOpen, text: 'Ejercicios prácticos con feedback' },
    { icon: Clock, text: 'Tiempo de decantación entre sesiones' },
    { icon: Library, text: 'Material de lectura y referencias' },
  ];

  return (
    <section
      ref={sectionRef}
      id="curso"
      className="section-pinned z-20"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6, transform: 'scale(1.1)' }}
      >
        <img
          src="/images/overview_bg.jpg"
          alt="Artist sketching"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/80 via-[#0B0B0D]/50 to-[#0B0B0D]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-[6vw]">
        {/* Left Text Block */}
        <div className="w-[40vw]">
          <h2
            ref={headlineRef}
            className="font-serif text-[6vw] md:text-[5vw] lg:text-[56px] font-medium text-[#F4F2EC] leading-[1.05] tracking-[-0.02em]"
            style={{ opacity: 0, transform: 'translateX(-50vw)' }}
          >
            Ocho módulos.
            <br />
            Un encuentro por semana.
          </h2>

          <p
            ref={bodyRef}
            className="mt-6 md:mt-8 text-base md:text-lg text-[#B8B4AA] leading-relaxed max-w-[32vw]"
            style={{ opacity: 0, transform: 'translateY(10vh)' }}
          >
            Cada módulo combina teoría, práctica guiada y tiempo de decantación. Los encuentros son virtuales, en vivo, con espacio para preguntas y revisión de ejercicios.
          </p>
        </div>

        {/* Right Floating Card */}
        <div
          ref={cardRef}
          className="absolute right-[6vw] top-[22vh] w-[34vw] min-h-[56vh] bg-[rgba(11,11,13,0.72)] backdrop-blur-md border border-[rgba(244,242,236,0.08)] rounded-lg p-7 md:p-8"
          style={{ opacity: 0, transform: 'translateX(60vw)' }}
        >
          {/* Accent line */}
          <div className="w-12 h-0.5 bg-[#C7A36D] mb-6" />

          <h3
            ref={cardTitleRef}
            className="font-serif text-2xl md:text-3xl font-medium text-[#F4F2EC] mb-8"
            style={{ opacity: 0 }}
          >
            Estructura del curso
          </h3>

          <ul ref={bulletsRef} className="space-y-5">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-4 text-[#B8B4AA]"
                style={{ opacity: 0 }}
              >
                <feature.icon className="w-5 h-5 text-[#C7A36D] flex-shrink-0" />
                <span className="text-sm md:text-base">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CourseOverview;
