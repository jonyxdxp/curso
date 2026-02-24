import { useEffect, useState } from 'react';
import { modulesData } from '../App';

const Navigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showModulesDropdown, setShowModulesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const scrollToModule = () => {
    // Scroll to the modules section first
    const moduloSection = document.getElementById('modulos');
    if (moduloSection) {
      moduloSection.scrollIntoView({ behavior: 'smooth' });
      setShowModulesDropdown(false);
    }
  };

  const navItems = [
    { id: 'curso', label: 'Curso' },
    { id: 'calendario', label: 'Calendario' },
    { id: 'inscripcion', label: 'Inscripción' },
  ];

  return (
    <>
      {/* Wordmark - always visible */}
      <div className={`fixed top-[4vh] left-[4vw] z-[100] max-w-[30vw] md:max-w-full transition-opacity duration-500 ${
        isVisible ? 'opacity-50' : 'opacity-100'
      }`}>
        <span className="font-serif text-base md:text-lg lg:text-xl text-[#F4F2EC] tracking-tight leading-tight break-words">
          Poética de la Mirada
        </span>
      </div>

      {/* Navigation - appears after hero */}
      <nav
        className={`fixed top-[4vh] right-[4vw] z-[100] transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex gap-6 md:gap-8 items-center">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-300 ${
                  activeSection === item.id
                    ? 'text-[#C7A36D]'
                    : 'text-[#B8B4AA] hover:text-[#F4F2EC]'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
          
          {/* Modules Dropdown */}
          <li className="relative">
            <button
              onClick={() => setShowModulesDropdown(!showModulesDropdown)}
              className={`font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-300 ${
                activeSection === 'modulos'
                  ? 'text-[#C7A36D]'
                  : 'text-[#B8B4AA] hover:text-[#F4F2EC]'
              }`}
            >
              Módulos
            </button>
            
            {/* Dropdown Menu */}
            {showModulesDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-[#1a1a1f] border border-[#C7A36D]/30 rounded-lg shadow-lg min-w-[200px] py-2">
                {modulesData.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => scrollToModule()}
                    className="w-full px-4 py-2 text-left text-xs text-[#B8B4AA] hover:text-[#C7A36D] hover:bg-[rgba(199,163,109,0.1)] transition-colors duration-200"
                  >
                    {module.title}
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* Botón Acceder */}
          <li>
            <a
              href="https://curso-nine-psi.vercel.app/#/login"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.14em] px-4 py-2 border border-[#C7A36D] text-[#C7A36D] hover:bg-[#C7A36D] hover:text-[#0B0B0D] transition-all duration-300 rounded-sm"
            >
              Acceder
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
