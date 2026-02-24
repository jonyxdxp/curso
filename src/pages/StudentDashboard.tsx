import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { BookOpen, CheckCircle, Clock, Play, Award, LogOut, User, ChevronRight, Lock, Settings, X, Bell, Star } from 'lucide-react';
import ThemeToggle from '../components/shared/ThemeToggle';
import { MODULOS_MOCK, PROGRESO_MOCK, CONFIG_MOCK } from '../components/shared/mockData';

const ME_INITIAL = { id: "est-01", nombre: "Ana López", email: "ana@ejemplo.com", pais: "Chile", telefono: "+56 9 8765 4321", fecha_inscripcion: "2026-02-20" };

const getModuleProgress = (estudianteId, moduloId) => PROGRESO_MOCK.find(p => p.estudiante_id === estudianteId && p.modulo_id === moduloId);

export default function StudentDashboard() {
  const [me, setMe] = useState(ME_INITIAL);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "El módulo 2 ya está disponible", time: "Hace 2 días", read: false },
    { id: 2, text: "Nuevo encuentro Zoom agendado para el lunes", time: "Hace 3 días", read: false },
    { id: 3, text: "Recordatorio: entrega del ejercicio módulo 1", time: "Hace 5 días", read: true },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  const progreso = MODULOS_MOCK.map(m => ({ ...m, progress: getModuleProgress(me.id, m.id) }));
  const completados = progreso.filter(m => m.progress?.completado).length;
  const totalProgress = Math.round((completados / MODULOS_MOCK.length) * 100);
  const moduloActual = progreso.find(m => !m.progress?.completado && m.estado === 'publicado');
  const allCompleted = completados === MODULOS_MOCK.length;

  if (activeModuleId) {
    return <ModuleViewer moduloId={activeModuleId} onBack={() => setActiveModuleId(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      {/* Header */}
      <header className="bg-[#141419] border-b border-[rgba(244,242,236,0.08)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <span className="font-serif text-lg text-[#F4F2EC]">Poética de la Mirada</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative p-2 text-[#B8B4AA] hover:text-[#F4F2EC] transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C7A36D] rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#141419] border border-[rgba(244,242,236,0.12)] shadow-xl z-50">
                  <div className="p-4 border-b border-[rgba(244,242,236,0.08)] flex justify-between items-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA]">Notificaciones</p>
                    <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-[#B8B4AA]" /></button>
                  </div>
                  <div>
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-[rgba(244,242,236,0.04)] ${!n.read ? 'bg-[rgba(199,163,109,0.04)]' : ''}`}>
                        <div className="flex gap-3">
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#C7A36D] mt-1.5 shrink-0" />}
                          <div className={n.read ? 'pl-4' : ''}>
                            <p className="text-sm text-[#F4F2EC] mb-1">{n.text}</p>
                            <p className="text-xs text-[#B8B4AA]">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-2 p-1.5 hover:bg-[rgba(244,242,236,0.05)] transition-colors rounded"
              >
                <div className="w-7 h-7 rounded-full bg-[rgba(199,163,109,0.2)] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#C7A36D]" />
                </div>
                <span className="hidden md:block text-sm text-[#B8B4AA]">{me.nombre}</span>
              </button>
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#141419] border border-[rgba(244,242,236,0.12)] shadow-xl z-50">
                  <div className="p-4 border-b border-[rgba(244,242,236,0.08)]">
                    <p className="text-sm text-[#F4F2EC]">{me.nombre}</p>
                    <p className="text-xs text-[#B8B4AA]">{me.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => { setShowProfile(false); document.getElementById('perfil-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#B8B4AA] hover:text-[#C7A36D] hover:bg-[rgba(199,163,109,0.05)] transition-colors"
                    >
                      <Settings className="w-4 h-4" /> Editar perfil
                    </button>
                    <button
                      onClick={() => window.location.href = createPageUrl('Landing')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#B8B4AA] hover:text-red-400 hover:bg-red-400/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10" onClick={() => { setShowNotifications(false); setShowProfile(false); }}>
        {/* Welcome */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7A36D] mb-2">Bienvenida de vuelta</p>
            <h1 className="font-serif text-3xl text-[#F4F2EC]">{me.nombre}</h1>
          </div>
          {moduloActual && (
            <button
              onClick={() => setActiveModuleId(moduloActual.id)}
              className="flex items-center gap-3 px-6 py-3 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors"
            >
              <Play className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-[0.14em]">Continuar: {moduloActual.titulo}</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Award, label: "Progreso general", value: `${totalProgress}%`, color: "text-[#C7A36D]", bg: "bg-[rgba(199,163,109,0.1)]" },
            { icon: CheckCircle, label: "Completados", value: completados, color: "text-green-400", bg: "bg-green-400/10" },
            { icon: Clock, label: "En progreso", value: progreso.filter(m => m.progress && !m.progress.completado && m.estado === 'publicado').length, color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: BookOpen, label: "Total módulos", value: MODULOS_MOCK.length, color: "text-[#C7A36D]", bg: "bg-[rgba(199,163,109,0.1)]" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-[#B8B4AA]">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-10 bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA]">Progreso del curso</span>
            <span className="font-mono text-xs text-[#C7A36D]">{completados} / {MODULOS_MOCK.length} módulos</span>
          </div>
          <div className="h-1.5 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C7A36D] rounded-full transition-all duration-700"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Modules */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl text-[#F4F2EC] mb-6">Módulos del curso</h2>
          <div className="space-y-3">
            {progreso.map((m, i) => {
              const prog = m.progress;
              const isCompleted = prog?.completado;
              const isInProgress = prog && !prog.completado;
              const isLocked = m.estado === 'borrador' || (!prog && i > 0 && !progreso[i - 1]?.progress?.completado);

              return (
                <div
                  key={m.id}
                  className={`group flex items-center gap-5 p-5 border transition-all duration-200 cursor-pointer ${
                    isLocked
                      ? 'border-[rgba(244,242,236,0.04)] opacity-50 cursor-not-allowed'
                      : 'border-[rgba(244,242,236,0.08)] hover:border-[rgba(199,163,109,0.3)] hover:bg-[rgba(199,163,109,0.03)]'
                  }`}
                  onClick={() => !isLocked && setActiveModuleId(m.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                    isCompleted ? 'bg-[rgba(199,163,109,0.15)] border-[rgba(199,163,109,0.4)]' :
                    isInProgress ? 'bg-blue-400/10 border-blue-400/30' :
                    'bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.1)]'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-[#C7A36D]" /> :
                     isLocked ? <Lock className="w-4 h-4 text-[#B8B4AA]" /> :
                     <Play className="w-4 h-4 text-[#B8B4AA]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C7A36D] opacity-70">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      {isCompleted && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C7A36D] bg-[rgba(199,163,109,0.1)] px-2 py-0.5">Completado</span>}
                      {isInProgress && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-400 bg-blue-400/10 px-2 py-0.5">En progreso</span>}
                    </div>
                    <h3 className="font-serif text-lg text-[#F4F2EC] group-hover:text-[#C7A36D] transition-colors">{m.titulo}</h3>
                    <p className="text-sm text-[#B8B4AA] mt-1 line-clamp-1">{m.descripcion}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-[#B8B4AA]">{m.duracion}</p>
                      {prog && !isCompleted && (
                        <p className="text-xs text-blue-400">{prog.porcentaje}% completado</p>
                      )}
                    </div>
                    {prog && !isCompleted && (
                      <div className="w-20 h-1 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${prog.porcentaje}%` }} />
                      </div>
                    )}
                    {!isLocked && <ChevronRight className="w-4 h-4 text-[#B8B4AA] group-hover:text-[#C7A36D] transition-colors" />}
                  </div>
                </div>
              );
            })}

            {/* Certificate row */}
            <div className={`flex items-center gap-5 p-5 border transition-all duration-200 ${
              allCompleted
                ? 'border-[rgba(199,163,109,0.4)] bg-[rgba(199,163,109,0.06)] cursor-pointer hover:bg-[rgba(199,163,109,0.1)]'
                : 'border-[rgba(244,242,236,0.04)] opacity-40 cursor-not-allowed'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                allCompleted ? 'bg-[rgba(199,163,109,0.2)] border-[#C7A36D]' : 'bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.1)]'
              }`}>
                <Star className={`w-5 h-5 ${allCompleted ? 'text-[#C7A36D]' : 'text-[#B8B4AA]'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C7A36D] opacity-70">
                    Certificado
                  </p>
                  {allCompleted && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C7A36D] bg-[rgba(199,163,109,0.1)] px-2 py-0.5">Desbloqueado</span>}
                </div>
                <h3 className={`font-serif text-lg ${allCompleted ? 'text-[#C7A36D]' : 'text-[#F4F2EC]'}`}>
                  Certificado de finalización
                </h3>
                <p className="text-sm text-[#B8B4AA] mt-1">
                  {allCompleted
                    ? 'Completaste el curso. Podés descargar tu certificado.'
                    : `Completá los ${MODULOS_MOCK.length} módulos para desbloquear el certificado.`}
                </p>
              </div>
              {allCompleted && (
                <button className="font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 border border-[#C7A36D] text-[#C7A36D] hover:bg-[rgba(199,163,109,0.1)] transition-colors">
                  Descargar
                </button>
              )}
              {!allCompleted && <Lock className="w-4 h-4 text-[#B8B4AA]" />}
            </div>
          </div>
        </div>

        {/* Profile settings */}
        <div id="perfil-section" className="mb-10">
          <h2 className="font-serif text-2xl text-[#F4F2EC] mb-6">Mi perfil</h2>
          <ProfileEditor me={me} onSave={setMe} />
        </div>
      </main>
    </div>
  );
}

// ── Profile Editor ────────────────────────────────────────────────
function ProfileEditor({ me, onSave }) {
  const [form, setForm] = useState(me);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6 max-w-2xl">
      {saved && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          ✓ Perfil actualizado
        </div>
      )}
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-5">Datos personales</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { key: 'nombre', label: 'Nombre completo', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'telefono', label: 'Teléfono', type: 'tel' },
          { key: 'pais', label: 'País', type: 'text' },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">{label}</label>
            <input
              type={type}
              value={form[key] || ''}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
            />
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-[rgba(244,242,236,0.06)] mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-4">Cambiar contraseña</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Nueva contraseña</label>
            <input type="password" placeholder="••••••••"
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Confirmar</label>
            <input type="password" placeholder="••••••••"
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
          </div>
        </div>
      </div>
      <button type="submit"
        className="font-mono text-xs uppercase tracking-[0.14em] px-8 py-3.5 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors">
        Guardar cambios
      </button>
    </form>
  );
}

// ── Module Viewer ─────────────────────────────────────────────────
function ModuleViewer({ moduloId, onBack }) {
  const modulo = MODULOS_MOCK.find(m => m.id === moduloId);
  const [activeContentIdx, setActiveContentIdx] = useState(0);
  if (!modulo) return null;
  const contenidos = modulo.contenidos || [];
  const active = contenidos[activeContentIdx];

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex overflow-hidden">
      <aside className="hidden lg:flex flex-col w-72 bg-[#141419] border-r border-[rgba(244,242,236,0.08)] fixed top-0 bottom-0 left-0 overflow-y-auto">
        <div className="p-6 border-b border-[rgba(244,242,236,0.08)]">
          <button onClick={onBack} className="flex items-center gap-2 text-[#B8B4AA] hover:text-[#C7A36D] transition-colors text-sm mb-4">
            ← Volver
          </button>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C7A36D] mb-1">Módulo {MODULOS_MOCK.indexOf(modulo) + 1}</p>
          <h2 className="font-serif text-lg text-[#F4F2EC] leading-tight">{modulo.titulo}</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {contenidos.map((c, i) => (
            <button key={i} onClick={() => setActiveContentIdx(i)}
              className={`w-full text-left flex items-center gap-3 p-3 rounded mb-1 transition-colors ${
                i === activeContentIdx ? 'bg-[rgba(199,163,109,0.1)] text-[#C7A36D]' : 'text-[#B8B4AA] hover:text-[#F4F2EC] hover:bg-[rgba(244,242,236,0.03)]'
              }`}>
              <span className="font-mono text-[10px] w-5 opacity-60">{ContentIcon(c.tipo)}</span>
              <span className="text-sm">{c.titulo}</span>
            </button>
          ))}
          {contenidos.length === 0 && <p className="text-[#B8B4AA] text-sm px-2 py-4">Sin contenido aún.</p>}
        </nav>
      </aside>
      <main className="flex-1 lg:ml-72 overflow-y-auto" style={{ height: '100vh' }}>
        <div className="lg:hidden p-4 border-b border-[rgba(244,242,236,0.08)] flex items-center gap-3">
          <button onClick={onBack} className="text-[#B8B4AA] hover:text-[#C7A36D] transition-colors text-sm">← Volver</button>
          <span className="text-[#B8B4AA]">/</span>
          <span className="font-serif text-[#F4F2EC] truncate">{modulo.titulo}</span>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7A36D] mb-3">Módulo {MODULOS_MOCK.indexOf(modulo) + 1}</p>
            <h1 className="font-serif text-4xl text-[#F4F2EC] mb-4">{modulo.titulo}</h1>
            <p className="text-[#B8B4AA] leading-relaxed">{modulo.descripcion}</p>
          </div>
          {modulo.objetivos?.length > 0 && (
            <div className="mb-8 bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#C7A36D] mb-4">Objetivos</p>
              <ul className="space-y-2">
                {modulo.objetivos.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#B8B4AA] text-sm">
                    <span className="text-[#C7A36D] mt-0.5">·</span>{obj}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {contenidos.length > 0 && active && (
            <div className="mb-8 bg-[#141419] border border-[rgba(244,242,236,0.08)]">
              <div className="flex overflow-x-auto border-b border-[rgba(244,242,236,0.08)]">
                {contenidos.map((c, i) => (
                  <button key={i} onClick={() => setActiveContentIdx(i)}
                    className={`px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] whitespace-nowrap border-b-2 transition-colors ${
                      i === activeContentIdx ? 'border-[#C7A36D] text-[#C7A36D]' : 'border-transparent text-[#B8B4AA] hover:text-[#F4F2EC]'
                    }`}>
                    {ContentIcon(c.tipo)} {c.titulo}
                  </button>
                ))}
              </div>
              <div className="p-6"><ContentBlock content={active} /></div>
            </div>
          )}
          {modulo.ejercicio_titulo && (
            <div className="mb-8 border border-[rgba(199,163,109,0.2)] bg-[rgba(199,163,109,0.04)] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7A36D] mb-3">Ejercicio</p>
              <h3 className="font-serif text-xl text-[#F4F2EC] mb-3">{modulo.ejercicio_titulo}</h3>
              <p className="text-[#B8B4AA] text-sm leading-relaxed mb-4">{modulo.ejercicio_descripcion}</p>
              <div className="flex items-center gap-2 text-xs text-[#B8B4AA]">
                <Clock className="w-3.5 h-3.5" />
                <span>Fecha límite: {modulo.ejercicio_deadline}</span>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button className="font-mono text-xs uppercase tracking-[0.14em] px-6 py-3 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors" onClick={onBack}>
              Marcar como completado ✓
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function ContentIcon(tipo) {
  return { video: '▶', pdf: '📄', texto: '📝', zoom: '📹', imagen: '🖼' }[tipo] || '·';
}

function ContentBlock({ content }) {
  const { tipo, titulo, texto, url } = content;
  if (tipo === 'video') return (
    <div>
      {titulo && <h3 className="font-serif text-xl text-[#F4F2EC] mb-4">{titulo}</h3>}
      <div className="relative w-full aspect-video bg-black">
        <iframe src={url} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={titulo} />
      </div>
    </div>
  );
  if (tipo === 'texto') return (
    <div className="prose-dark">
      {titulo && <h2>{titulo}</h2>}
      {texto?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
  if (tipo === 'pdf') return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="w-16 h-16 bg-[rgba(199,163,109,0.1)] flex items-center justify-center text-3xl">📄</div>
      <p className="font-serif text-lg text-[#F4F2EC]">{titulo}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.14em] px-6 py-3 border border-[rgba(199,163,109,0.4)] text-[#C7A36D] hover:bg-[rgba(199,163,109,0.08)] transition-colors">Descargar PDF</a>
    </div>
  );
  if (tipo === 'zoom') return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center text-3xl">📹</div>
      <p className="font-serif text-lg text-[#F4F2EC]">{titulo}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.14em] px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors">Unirse a Zoom</a>
    </div>
  );
  if (tipo === 'imagen') return (
    <div>
      {titulo && <h3 className="font-serif text-xl text-[#F4F2EC] mb-4">{titulo}</h3>}
      <img src={url} alt={titulo} className="w-full rounded" />
    </div>
  );
  return <p className="text-[#B8B4AA]">Contenido no disponible.</p>;
}