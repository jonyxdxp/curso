import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  FileText,
  Download,
  Clock,
  User,
  Menu,
  X,
  ExternalLink,
  Upload
} from 'lucide-react';
import { modulesData } from '../App';
import ModuleContentViewer from '../components/ModuleContentViewer';

const ModulePage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentModuleId = parseInt(moduleId || '1');
  const module = modulesData.find(m => m.id === currentModuleId);
  const prevModule = modulesData.find(m => m.id === currentModuleId - 1);
  const nextModule = modulesData.find(m => m.id === currentModuleId + 1);

  // Calculate progress
  const progress = Math.round((currentModuleId / modulesData.length) * 100);

  useEffect(() => {
    // Animate content on load
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll('.animate-in');
      gsap.fromTo(
        elements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [currentModuleId]);

  // Scroll to top when module changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentModuleId]);

  if (!module) {
    return <div>Módulo no encontrado</div>;
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'libro': return <BookOpen className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#141419] rounded-lg border border-[rgba(244,242,236,0.08)]"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-[#F4F2EC]" /> : <Menu className="w-5 h-5 text-[#F4F2EC]" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-[280px] bg-[#141419] border-r border-[rgba(244,242,236,0.08)] z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Course Title */}
        <div className="p-6 border-b border-[rgba(244,242,236,0.08)]">
          <Link to="/" className="font-serif text-xl text-[#F4F2EC] hover:text-[#C7A36D] transition-colors">
            Poética de la Mirada
          </Link>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA]">
            Módulos del curso
          </p>
        </div>

        {/* Progress */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA]">
              Progreso
            </span>
            <span className="font-mono text-xs text-[#C7A36D]">{progress}%</span>
          </div>
          <div className="h-1 bg-[rgba(244,242,236,0.08)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#C7A36D] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Module List */}
        <nav className="px-4 pb-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {modulesData.map((m) => {
            const isActive = m.id === currentModuleId;
            const isCompleted = m.id < currentModuleId;
            const isLocked = m.id > currentModuleId + 1;

            return (
              <Link
                key={m.id}
                to={`/modulo/${m.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-start gap-3 p-3 rounded-lg mb-1 transition-all duration-300 ${
                  isActive
                    ? 'bg-[rgba(199,163,109,0.1)] border-l-2 border-[#C7A36D]'
                    : 'hover:bg-[rgba(244,242,236,0.03)] border-l-2 border-transparent'
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-[#C7A36D]" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4 text-[#B8B4AA]/50" />
                  ) : (
                    <Circle className={`w-4 h-4 ${isActive ? 'text-[#C7A36D]' : 'text-[#B8B4AA]'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                    isActive ? 'text-[#C7A36D]' : 'text-[#B8B4AA]/70'
                  }`}>
                    Módulo {m.id}
                  </span>
                  <p className={`text-sm mt-0.5 line-clamp-2 ${
                    isActive ? 'text-[#F4F2EC]' : isLocked ? 'text-[#B8B4AA]/50' : 'text-[#B8B4AA]'
                  }`}>
                    {m.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(244,242,236,0.08)] bg-[#141419]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C7A36D]/20 flex items-center justify-center">
              <User className="w-4 h-4 text-[#C7A36D]" />
            </div>
            <div>
              <p className="text-sm text-[#F4F2EC]">Estudiante</p>
              <p className="text-xs text-[#B8B4AA]">en curso</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main ref={contentRef} className="flex-1 min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#0B0B0D]/95 backdrop-blur-sm border-b border-[rgba(244,242,236,0.08)] px-6 py-4 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-2">
            <Link to="/" className="text-[#B8B4AA] hover:text-[#F4F2EC] transition-colors">
              Curso
            </Link>
            <ChevronRight className="w-4 h-4 text-[#B8B4AA]" />
            <Link to="/" className="text-[#B8B4AA] hover:text-[#F4F2EC] transition-colors">
              Módulos
            </Link>
            <ChevronRight className="w-4 h-4 text-[#B8B4AA]" />
            <span className="text-[#C7A36D]">Módulo {module.id}</span>
          </nav>

          {/* Title & Meta */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl text-[#F4F2EC]">
                {module.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-[#B8B4AA]">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#C7A36D]">
                  {module.badge}
                </span>
              </div>
            </div>

            {/* Mark Complete Button */}
            <button
              onClick={() => setCompleted(!completed)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-[0.14em] transition-all duration-300 ${
                completed
                  ? 'bg-[#C7A36D] text-[#0B0B0D]'
                  : 'bg-[rgba(199,163,109,0.1)] text-[#C7A36D] border border-[#C7A36D]/30 hover:bg-[rgba(199,163,109,0.2)]'
              }`}
            >
              {completed ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Completado
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4" />
                  Marcar completado
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-8 lg:px-10 lg:py-12 max-w-4xl">
          {/* Hero Image */}
          <div className="animate-in relative aspect-video rounded-xl overflow-hidden mb-10">
            <img
              src={module.image}
              alt={module.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/60 to-transparent" />
          </div>

          {/* Introduction */}
          <section className="animate-in mb-12">
            <h2 className="font-serif text-2xl text-[#F4F2EC] mb-4">
              Introducción
            </h2>
            <p className="text-lg text-[#B8B4AA] leading-relaxed">
              {module.description}
            </p>
          </section>

          {/* Learning Objectives */}
          <section className="animate-in mb-12">
            <h2 className="font-serif text-2xl text-[#F4F2EC] mb-4">
              Objetivos de aprendizaje
            </h2>
            <ul className="space-y-3">
              {module.objectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[rgba(199,163,109,0.2)] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#C7A36D] font-medium">{idx + 1}</span>
                  </div>
                  <span className="text-[#B8B4AA]">{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Module Content Viewer */}
          <section className="animate-in mb-12">
            <ModuleContentViewer
              titulo="Contenido del módulo"
              contenidos={module.contenido || []}
              completudPorcentaje={completed ? 100 : 0}
            />
          </section>

          {/* Content Blocks */}
          <section className="animate-in mb-12">
            <h2 className="font-serif text-2xl text-[#F4F2EC] mb-6">
              Materiales adicionales
            </h2>
            <div className="space-y-8">
              {module.content.map((block, index) => {
                if (block.type === 'text') {
                  return (
                    <div key={index} className="space-y-4">
                      <h3 className="font-serif text-xl text-[#F4F2EC]">
                        {block.title}
                      </h3>
                      <div className="text-[#B8B4AA] leading-relaxed whitespace-pre-line">
                        {block.body}
                      </div>
                    </div>
                  );
                }
                if (block.type === 'quote') {
                  return (
                    <blockquote key={index} className="border-l-2 border-[#C7A36D] pl-6 py-2 my-8">
                      <p className="font-serif text-xl lg:text-2xl text-[#F4F2EC] italic leading-relaxed">
                        "{block.quote}"
                      </p>
                      <cite className="block mt-4 text-sm text-[#B8B4AA] not-italic">
                        — {block.author}
                      </cite>
                    </blockquote>
                  );
                }
                return null;
              })}
            </div>
          </section>

          {/* Exercise Section */}
          <section className="animate-in mb-12">
            <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] rounded-xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[rgba(199,163,109,0.15)] flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#C7A36D]" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-[#F4F2EC]">
                    Ejercicio práctico
                  </h2>
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA]">
                    Entrega: {module.exercise.deadline}
                  </span>
                </div>
              </div>

              <h3 className="text-lg text-[#F4F2EC] font-medium mb-3">
                {module.exercise.title}
              </h3>
              <p className="text-[#B8B4AA] leading-relaxed mb-6">
                {module.exercise.description}
              </p>

              <button className="flex items-center gap-2 px-6 py-3 bg-[#C7A36D] text-[#0B0B0D] font-mono text-sm uppercase tracking-[0.14em] font-medium rounded-lg hover:bg-[#d4b07a] transition-colors">
                <Upload className="w-4 h-4" />
                Subir trabajo
              </button>
            </div>
          </section>

          {/* Resources Section */}
          <section className="animate-in mb-12">
            <h2 className="font-serif text-2xl text-[#F4F2EC] mb-4">
              Recursos y referencias
            </h2>
            <div className="grid gap-3">
              {module.resources.map((resource, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center gap-4 p-4 bg-[rgba(244,242,236,0.03)] border border-[rgba(244,242,236,0.08)] rounded-lg hover:bg-[rgba(244,242,236,0.05)] hover:border-[rgba(199,163,109,0.3)] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[rgba(199,163,109,0.1)] flex items-center justify-center group-hover:bg-[rgba(199,163,109,0.2)] transition-colors">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#F4F2EC] group-hover:text-[#C7A36D] transition-colors">
                      {resource.title}
                    </p>
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA]">
                      {resource.type}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#B8B4AA] group-hover:text-[#C7A36D] transition-colors" />
                </a>
              ))}
            </div>
          </section>

          {/* Navigation Footer */}
          <footer className="animate-in pt-8 border-t border-[rgba(244,242,236,0.08)]">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {prevModule ? (
                <Link
                  to={`/modulo/${prevModule.id}`}
                  className="flex items-center gap-2 px-6 py-3 border border-[rgba(244,242,236,0.15)] rounded-lg text-[#B8B4AA] hover:text-[#F4F2EC] hover:border-[rgba(244,242,236,0.3)] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <div className="text-left">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em]">Anterior</span>
                    <span className="text-sm">{prevModule.title}</span>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextModule ? (
                <Link
                  to={`/modulo/${nextModule.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-[#C7A36D] text-[#0B0B0D] rounded-lg hover:bg-[#d4b07a] transition-colors"
                >
                  <div className="text-right">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">Siguiente</span>
                    <span className="text-sm font-medium">{nextModule.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-6 py-3 bg-[#C7A36D] text-[#0B0B0D] rounded-lg hover:bg-[#d4b07a] transition-colors"
                >
                  <div className="text-right">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] opacity-70">Finalizar</span>
                    <span className="text-sm font-medium">Volver al inicio</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ModulePage;
