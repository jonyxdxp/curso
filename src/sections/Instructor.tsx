import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, ExternalLink, Mail, Youtube, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Instructor = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Portrait animation
      gsap.fromTo(
        portraitRef.current,
        { x: '-8vw', opacity: 0, scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: portraitRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { x: '8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // CTA animation
      gsap.fromTo(
        ctaRef.current,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socials = [
    { icon: TrendingUp, label: 'X', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
    { icon: TrendingUp, label: 'TikTok', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
  ];

  return (
    <section
      ref={sectionRef}
      id="inscripcion"
      className="relative bg-[#141419] py-20 md:py-32"
    >
      <div className="relative z-10 px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Portrait */}
          <div
            ref={portraitRef}
            className="relative"
            style={{ opacity: 0 }}
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 lg:ml-[4vw]">
              {/* Gold border frame */}
              <div className="absolute -inset-3 border-2 border-[#C7A36D] rounded-sm" />
              
              <img
                src="/images/instructor_portrait.jpg"
                alt="Instructor"
                className="w-full h-full object-cover rounded-sm"
              />
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#141419]/40 to-transparent rounded-sm" />
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="lg:pl-8" style={{ opacity: 0 }}>
            <h2 className="font-serif text-[10vw] md:text-[6vw] lg:text-[64px] font-medium text-[#F4F2EC] leading-[1.05] tracking-[-0.02em]">
              Inscribite hoy
            </h2>

            <p className="mt-6 text-base md:text-lg text-[#B8B4AA] leading-relaxed max-w-lg">
              Este es un grupo reducido. Si querés priorizar tu práctica y recibir acompañamiento directo, reservá tu lugar ahora.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="mt-8 flex flex-col sm:flex-row gap-4" style={{ opacity: 0 }}>
              <a
                href="https://forms.gle/P2qtnPHpnqpDqjjFA"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#C7A36D] text-[#0B0B0D] font-mono text-sm uppercase tracking-[0.14em] font-medium hover:bg-[#d4b07a] transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Completar el formulario
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Contact link */}
            <a
              href="mailto:hola@poeticadelamirada.com"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#B8B4AA] hover:text-[#C7A36D] transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              ¿Preguntas? Escribinos a hola@poeticadelamirada.com
            </a>

            {/* Divider */}
            <div className="my-10 w-16 h-0.5 bg-[rgba(244,242,236,0.15)]" />

            {/* Instructor Info */}
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#C7A36D]">
                Autor del curso
              </span>
              <h3 className="mt-2 font-serif text-2xl md:text-3xl font-medium text-[#F4F2EC]">
                Ernesto Engel
              </h3>
              <p className="mt-3 text-[#B8B4AA] leading-relaxed max-w-md">
                Artista visual y docente. Su trabajo explora el paisaje, la memoria y la pintura como acto de atención.
              </p>

              {/* Social Links */}
              <div className="mt-6 flex gap-4">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="flex items-center gap-2 text-sm text-[#B8B4AA] hover:text-[#C7A36D] transition-colors duration-300"
                  >
                    <social.icon className="w-4 h-4" />
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 md:mt-32 pt-8 border-t border-[rgba(244,242,236,0.08)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-serif text-lg text-[#F4F2EC]">
              Poética de la Mirada
            </span>
            <span className="text-sm text-[#B8B4AA]">
              © 2026 Todos los derechos reservados
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Instructor;
