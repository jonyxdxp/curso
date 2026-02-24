import { useState } from 'react';
import { createPageUrl } from '@/utils';
import ThemeToggle from '../components/shared/ThemeToggle';
import {
  LayoutDashboard, Users, BookOpen, CreditCard, UserCheck,
  Settings, LogOut, Bell, TrendingUp, DollarSign, Clock, CheckCircle,
  ChevronRight, Plus, Search, Filter, X, Eye, Check, XCircle,
  Edit, Trash2, Video, FileText, Link, AlignLeft, Image, ExternalLink, BarChart2
} from 'lucide-react';
import {
  MODULOS_MOCK, SOLICITUDES_MOCK, ESTUDIANTES_MOCK, PAGOS_MOCK, PROGRESO_MOCK, CONFIG_MOCK
} from '../components/shared/mockData';

const SECTIONS = [
  { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'solicitudes', icon: UserCheck, label: 'Solicitudes' },
  { id: 'estudiantes', icon: Users, label: 'Estudiantes' },
  { id: 'modulos', icon: BookOpen, label: 'Módulos' },
  { id: 'pagos', icon: CreditCard, label: 'Pagos' },
  { id: 'configuracion', icon: Settings, label: 'Configuración' },
];

export default function ProfessorDashboard() {
  const [section, setSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const pendientes = SOLICITUDES_MOCK.filter(s => s.estado === 'pendiente').length;
  const notifs = [
    { id: 1, text: `${pendientes} solicitudes pendientes de revisión`, time: "Ahora", unread: pendientes > 0 },
    { id: 2, text: "Ana López completó el módulo 2", time: "Hace 1 hora", unread: true },
    { id: 3, text: "Nuevo pago recibido de Roberto Vega", time: "Hace 2 días", unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#141419] border-r border-[rgba(244,242,236,0.08)] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-[rgba(244,242,236,0.08)]">
          <p className="font-serif text-lg text-[#F4F2EC]">Poética de la Mirada</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mt-1">Panel del Profesor</p>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => { setSection(s.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded mb-1 transition-colors ${
                section === s.id
                  ? 'bg-[rgba(199,163,109,0.1)] text-[#C7A36D]'
                  : 'text-[#B8B4AA] hover:bg-[rgba(244,242,236,0.03)] hover:text-[#F4F2EC]'
              }`}
            >
              <s.icon className="w-4 h-4" />
              <span className="flex-1 text-sm text-left">{s.label}</span>
              {s.id === 'solicitudes' && pendientes > 0 && (
                <span className="text-[10px] bg-[#C7A36D] text-[#0B0B0D] px-1.5 py-0.5 rounded font-mono">{pendientes}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[rgba(244,242,236,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(199,163,109,0.2)] flex items-center justify-center text-xs font-serif text-[#C7A36D]">
              {CONFIG_MOCK.nombre_profesor.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-[#F4F2EC]">{CONFIG_MOCK.nombre_profesor}</p>
              <p className="text-xs text-[#B8B4AA]">Profesor</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = createPageUrl('Landing')}
            className="w-full flex items-center justify-center gap-2 border border-[rgba(244,242,236,0.1)] text-[#B8B4AA] hover:text-[#F4F2EC] transition-colors text-xs py-2.5"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-[#141419] border-b border-[rgba(244,242,236,0.08)] sticky top-0 z-30 h-16 flex items-center px-6 gap-4">
          <button className="lg:hidden text-[#B8B4AA]" onClick={() => setSidebarOpen(true)}>
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <h1 className="font-serif text-xl text-[#F4F2EC] flex-1">
            {SECTIONS.find(s => s.id === section)?.label}
          </h1>
          <ThemeToggle />
          <div className="relative">
            <button onClick={() => setShowNotif(!showNotif)} className="relative text-[#B8B4AA] hover:text-[#F4F2EC] transition-colors p-1">
              <Bell className="w-5 h-5" />
              {pendientes > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-[#C7A36D] rounded-full" />}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#141419] border border-[rgba(244,242,236,0.12)] shadow-xl z-50">
                <div className="p-4 border-b border-[rgba(244,242,236,0.08)] flex justify-between items-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA]">Notificaciones</p>
                  <button onClick={() => setShowNotif(false)}><X className="w-4 h-4 text-[#B8B4AA]" /></button>
                </div>
                {notifs.map(n => (
                  <div key={n.id} className={`p-4 border-b border-[rgba(244,242,236,0.04)] flex gap-3 ${n.unread ? 'bg-[rgba(199,163,109,0.04)]' : ''}`}>
                    {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#C7A36D] mt-1.5 shrink-0" />}
                    <div className={n.unread ? '' : 'pl-4'}>
                      <p className="text-sm text-[#F4F2EC] mb-1">{n.text}</p>
                      <p className="text-xs text-[#B8B4AA]">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {section === 'overview' && <OverviewSection />}
          {section === 'solicitudes' && <SolicitudesSection />}
          {section === 'estudiantes' && <EstudiantesSection />}
          {section === 'modulos' && <ModulosSection />}
          {section === 'pagos' && <PagosSection />}
          {section === 'configuracion' && <ConfiguracionSection />}
        </div>
      </main>
    </div>
  );
}

// ── OVERVIEW ─────────────────────────────────────────────────────
function OverviewSection() {
  const totalIngresos = PAGOS_MOCK.filter(p => p.estado === 'completado').reduce((s, p) => s + p.monto, 0);
  const progresoPromedio = Math.round(PROGRESO_MOCK.reduce((s, p) => s + p.porcentaje, 0) / (PROGRESO_MOCK.length || 1));

  const stats = [
    { label: "Estudiantes activos", value: ESTUDIANTES_MOCK.filter(e => e.activo).length, icon: Users, color: "text-[#C7A36D]", bg: "bg-[rgba(199,163,109,0.1)]" },
    { label: "Ingresos totales", value: `$${totalIngresos}`, icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Solicitudes pendientes", value: SOLICITUDES_MOCK.filter(s => s.estado === 'pendiente').length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Módulos publicados", value: MODULOS_MOCK.filter(m => m.estado === 'publicado').length, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  // Progress per module
  const moduloProgreso = MODULOS_MOCK.slice(0, 5).map(m => {
    const registros = PROGRESO_MOCK.filter(p => p.modulo_id === m.id);
    const promedio = registros.length ? Math.round(registros.reduce((s, r) => s + r.porcentaje, 0) / registros.length) : 0;
    return { ...m, promedio };
  });

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
            <p className="text-xs text-[#B8B4AA]">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progreso por módulo */}
        <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA] mb-5">Progreso por módulo</p>
          <div className="space-y-4">
            {moduloProgreso.map((m, i) => (
              <div key={m.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#F4F2EC] text-xs">{String(i + 1).padStart(2, '0')} — {m.titulo}</span>
                  <span className="font-mono text-xs text-[#C7A36D]">{m.promedio}%</span>
                </div>
                <div className="h-1 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C7A36D] rounded-full" style={{ width: `${m.promedio}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas solicitudes */}
        <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA] mb-5">Últimas solicitudes</p>
          <div className="space-y-3">
            {SOLICITUDES_MOCK.slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[rgba(199,163,109,0.1)] flex items-center justify-center text-xs font-serif text-[#C7A36D]">
                  {s.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F4F2EC] truncate">{s.nombre}</p>
                  <p className="text-xs text-[#B8B4AA]">{s.pais}</p>
                </div>
                <StatusBadge estado={s.estado} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Estudiantes recientes */}
      <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B4AA] mb-5">Estudiantes en curso</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(244,242,236,0.06)]">
                {["Nombre", "País", "Estado pago", "Inscripción", "Progreso"].map(h => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] pb-3 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ESTUDIANTES_MOCK.map(e => {
                const progresoEst = PROGRESO_MOCK.filter(p => p.estudiante_id === e.id);
                const completados = progresoEst.filter(p => p.completado).length;
                return (
                  <tr key={e.id} className="border-b border-[rgba(244,242,236,0.04)] hover:bg-[rgba(244,242,236,0.02)] transition-colors">
                    <td className="py-3 pr-6 text-[#F4F2EC]">{e.nombre}</td>
                    <td className="py-3 pr-6 text-[#B8B4AA]">{e.pais}</td>
                    <td className="py-3 pr-6"><StatusBadge estado={e.estado_pago} /></td>
                    <td className="py-3 pr-6 text-[#B8B4AA] text-xs">{e.fecha_inscripcion}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C7A36D]" style={{ width: `${(completados / MODULOS_MOCK.length) * 100}%` }} />
                        </div>
                        <span className="text-xs text-[#B8B4AA]">{completados}/{MODULOS_MOCK.length}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── SOLICITUDES ────────────────────────────────────────────────────
function SolicitudesSection() {
  const [solicitudes, setSolicitudes] = useState(SOLICITUDES_MOCK);
  const [filter, setFilter] = useState('todas');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'todas' ? solicitudes : solicitudes.filter(s => s.estado === filter);

  const updateEstado = (id, estado) => setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado } : s));

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['todas', 'pendiente', 'aprobado', 'rechazado'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 border transition-colors ${
              filter === f
                ? 'border-[#C7A36D] text-[#C7A36D] bg-[rgba(199,163,109,0.08)]'
                : 'border-[rgba(244,242,236,0.1)] text-[#B8B4AA] hover:border-[rgba(244,242,236,0.2)]'
            }`}
          >
            {f} {f === 'todas' ? `(${solicitudes.length})` : `(${solicitudes.filter(s => s.estado === f).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(244,242,236,0.08)]">
                {["Nombre", "Email", "País", "Fecha", "Estado", "Acciones"].map(h => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-[rgba(244,242,236,0.04)] hover:bg-[rgba(244,242,236,0.02)] transition-colors">
                  <td className="px-5 py-4 text-[#F4F2EC]">{s.nombre}</td>
                  <td className="px-5 py-4 text-[#B8B4AA]">{s.email}</td>
                  <td className="px-5 py-4 text-[#B8B4AA]">{s.pais}</td>
                  <td className="px-5 py-4 text-[#B8B4AA] text-xs">{new Date(s.created_date).toLocaleDateString('es-AR')}</td>
                  <td className="px-5 py-4"><StatusBadge estado={s.estado} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(s)} className="p-1.5 text-[#B8B4AA] hover:text-[#C7A36D] transition-colors"><Eye className="w-4 h-4" /></button>
                      {s.estado === 'pendiente' && (
                        <>
                          <button onClick={() => updateEstado(s.id, 'aprobado')} className="p-1.5 text-[#B8B4AA] hover:text-green-400 transition-colors"><Check className="w-4 h-4" /></button>
                          <button onClick={() => updateEstado(s.id, 'rechazado')} className="p-1.5 text-[#B8B4AA] hover:text-red-400 transition-colors"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] border border-[rgba(244,242,236,0.12)] w-full max-w-lg p-8 relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#B8B4AA] hover:text-[#F4F2EC]"><X className="w-5 h-5" /></button>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C7A36D] mb-2">Solicitud</p>
            <h2 className="font-serif text-2xl text-[#F4F2EC] mb-6">{selected.nombre}</h2>
            <div className="space-y-3 mb-6 text-sm">
              {[["Email", selected.email], ["Teléfono", selected.telefono], ["País", selected.pais]].map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <span className="text-[#B8B4AA] w-24 shrink-0">{k}</span>
                  <span className="text-[#F4F2EC]">{v || '—'}</span>
                </div>
              ))}
              <div>
                <p className="text-[#B8B4AA] mb-1">Experiencia</p>
                <p className="text-[#F4F2EC] text-sm leading-relaxed">{selected.experiencia || '—'}</p>
              </div>
              <div>
                <p className="text-[#B8B4AA] mb-1">Interés</p>
                <p className="text-[#F4F2EC] text-sm leading-relaxed">{selected.interes || '—'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <StatusBadge estado={selected.estado} />
              {selected.estado === 'pendiente' && (
                <>
                  <button
                    onClick={() => { updateEstado(selected.id, 'aprobado'); setSelected(null); }}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >Aprobar</button>
                  <button
                    onClick={() => { updateEstado(selected.id, 'rechazado'); setSelected(null); }}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
                  >Rechazar</button>
                </>
              )}
              {selected.estado === 'aprobado' && !selected.link_pago_enviado && (
                <button
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors"
                >Enviar link de pago</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ESTUDIANTES ──────────────────────────────────────────────────
function EstudiantesSection() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [estudiantes, setEstudiantes] = useState(ESTUDIANTES_MOCK);

  const filtered = estudiantes.filter(e =>
    e.nombre.toLowerCase().includes(query.toLowerCase()) ||
    e.email.toLowerCase().includes(query.toLowerCase())
  );

  const toggleActivo = (id) => setEstudiantes(prev => prev.map(e => e.id === id ? { ...e, activo: !e.activo } : e));
  const updatePago = (id, estado) => setEstudiantes(prev => prev.map(e => e.id === id ? { ...e, estado_pago: estado } : e));

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B4AA]" />
        <input
          type="text"
          placeholder="Buscar estudiante..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#141419] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
        />
      </div>

      <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(244,242,236,0.08)]">
                {["Estudiante", "País", "Pago", "Inscripción", "Progreso", "Acciones"].map(h => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const progresoEst = PROGRESO_MOCK.filter(p => p.estudiante_id === e.id);
                const completados = progresoEst.filter(p => p.completado).length;
                const pct = Math.round((completados / MODULOS_MOCK.length) * 100);
                return (
                  <tr key={e.id} className={`border-b border-[rgba(244,242,236,0.04)] transition-colors ${e.activo ? 'hover:bg-[rgba(244,242,236,0.02)]' : 'opacity-50'}`}>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[#F4F2EC]">{e.nombre}</p>
                        <p className="text-xs text-[#B8B4AA]">{e.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#B8B4AA]">{e.pais}</td>
                    <td className="px-5 py-4"><StatusBadge estado={e.estado_pago} /></td>
                    <td className="px-5 py-4 text-xs text-[#B8B4AA]">{e.fecha_inscripcion}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C7A36D] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#B8B4AA]">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => window.location.href = createPageUrl(`EstudianteDetalle?id=${e.id}`)} className="p-1.5 text-[#B8B4AA] hover:text-[#C7A36D] transition-colors" title="Ver detalle">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleActivo(e.id)} className={`p-1.5 transition-colors ${e.activo ? 'text-[#B8B4AA] hover:text-yellow-400' : 'text-yellow-400 hover:text-[#B8B4AA]'}`} title={e.activo ? 'Desactivar' : 'Activar'}>
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] border border-[rgba(244,242,236,0.12)] w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#B8B4AA] hover:text-[#F4F2EC]"><X className="w-5 h-5" /></button>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C7A36D] mb-2">Estudiante</p>
            <h2 className="font-serif text-2xl text-[#F4F2EC] mb-6">{selected.nombre}</h2>

            {/* Info */}
            <div className="space-y-2 mb-6 text-sm">
              {[["Email", selected.email], ["Teléfono", selected.telefono || '—'], ["País", selected.pais], ["Inscripción", selected.fecha_inscripcion]].map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <span className="text-[#B8B4AA] w-24 shrink-0">{k}</span>
                  <span className="text-[#F4F2EC]">{v}</span>
                </div>
              ))}
              <div className="flex gap-4 items-center">
                <span className="text-[#B8B4AA] w-24 shrink-0">Estado</span>
                <StatusBadge estado={selected.activo ? 'publicado' : 'borrador'} />
              </div>
            </div>

            {/* Progress detail */}
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-3">Progreso por módulo</p>
              <div className="space-y-2">
                {MODULOS_MOCK.map((m, i) => {
                  const p = PROGRESO_MOCK.find(pr => pr.estudiante_id === selected.id && pr.modulo_id === m.id);
                  return (
                    <div key={m.id} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[#B8B4AA] w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-xs text-[#F4F2EC] flex-1 truncate">{m.titulo}</span>
                      <div className="w-16 h-1 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C7A36D]" style={{ width: `${p?.porcentaje || 0}%` }} />
                      </div>
                      <span className="text-[10px] text-[#B8B4AA] w-8 text-right">{p?.porcentaje || 0}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="border-t border-[rgba(244,242,236,0.08)] pt-5 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-3">Acciones</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { updatePago(selected.id, 'pagado'); setSelected(s => ({ ...s, estado_pago: 'pagado' })); }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30 transition-colors"
                >Marcar como pagado</button>
                <button
                  onClick={() => { updatePago(selected.id, 'no_pagado'); setSelected(s => ({ ...s, estado_pago: 'no_pagado' })); }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                >Sin pago</button>
                <button
                  onClick={() => { toggleActivo(selected.id); setSelected(s => ({ ...s, activo: !s.activo })); }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors"
                >{selected.activo ? 'Desactivar acceso' : 'Activar acceso'}</button>
              </div>
              <button className="w-full font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 border border-[rgba(199,163,109,0.4)] text-[#C7A36D] hover:bg-[rgba(199,163,109,0.08)] transition-colors">
                Enviar email al estudiante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MÓDULOS ──────────────────────────────────────────────────────
function ModulosSection() {
  const [modulos, setModulos] = useState(MODULOS_MOCK);
  const [editId, setEditId] = useState(null);
  const [creating, setCreating] = useState(false);

  if (creating || editId) {
    const modulo = editId ? modulos.find(m => m.id === editId) : null;
    return (
      <ModuloEditor
        modulo={modulo}
        onSave={(data) => {
          if (editId) {
            setModulos(prev => prev.map(m => m.id === editId ? { ...m, ...data } : m));
          } else {
            setModulos(prev => [...prev, { ...data, id: `mod-0${prev.length + 1}` }]);
          }
          setEditId(null);
          setCreating(false);
        }}
        onCancel={() => { setEditId(null); setCreating(false); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-[#B8B4AA] text-sm">{modulos.length} módulos en total</p>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] px-5 py-2.5 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo módulo
        </button>
      </div>
      <div className="space-y-3">
        {modulos.map((m, i) => (
          <div key={m.id} className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-5 flex items-center gap-5 hover:border-[rgba(244,242,236,0.15)] transition-colors">
            <div className="w-12 h-12 bg-[rgba(199,163,109,0.1)] flex items-center justify-center font-serif text-lg text-[#C7A36D] shrink-0">
              {String(i + 1).padStart(2, '0')}
            </div>
            <img src={m.imagen_url} alt="" className="hidden md:block w-16 h-12 object-cover opacity-70" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[#F4F2EC]">{m.titulo}</p>
              <p className="text-xs text-[#B8B4AA] mt-0.5 line-clamp-1">{m.descripcion}</p>
              <div className="flex gap-3 mt-1">
                <span className="text-[10px] font-mono text-[#B8B4AA]">{m.duracion}</span>
                <span className="text-[10px] font-mono text-[#B8B4AA]">· {(m.contenidos || []).length} contenidos</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge estado={m.estado} />
              <button onClick={() => setEditId(m.id)} className="p-1.5 text-[#B8B4AA] hover:text-[#C7A36D] transition-colors"><Edit className="w-4 h-4" /></button>
              <button className="p-1.5 text-[#B8B4AA] hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuloEditor({ modulo, onSave, onCancel }) {
  const [form, setForm] = useState(modulo || {
    titulo: '', descripcion: '', duracion: '2 semanas', estado: 'borrador',
    objetivos: [''], ejercicio_titulo: '', ejercicio_descripcion: '',
    ejercicio_deadline: '', contenidos: [],
  });

  const addObjetivo = () => setForm(f => ({ ...f, objetivos: [...(f.objetivos || []), ''] }));
  const updateObjetivo = (i, val) => setForm(f => { const o = [...(f.objetivos || [])]; o[i] = val; return { ...f, objetivos: o }; });
  const removeObjetivo = (i) => setForm(f => ({ ...f, objetivos: f.objetivos.filter((_, idx) => idx !== i) }));

  const addContenido = (tipo) => setForm(f => ({
    ...f, contenidos: [...(f.contenidos || []), { tipo, titulo: '', url: '', texto: '', orden: (f.contenidos || []).length + 1 }]
  }));
  const updateContenido = (i, key, val) => setForm(f => {
    const c = [...(f.contenidos || [])]; c[i] = { ...c[i], [key]: val }; return { ...f, contenidos: c };
  });
  const removeContenido = (i) => setForm(f => ({ ...f, contenidos: f.contenidos.filter((_, idx) => idx !== i) }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#C7A36D] mb-1">{modulo ? 'Editar' : 'Nuevo'} módulo</p>
          <h2 className="font-serif text-2xl text-[#F4F2EC]">{form.titulo || 'Sin título'}</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="font-mono text-xs uppercase tracking-[0.14em] px-5 py-2.5 border border-[rgba(244,242,236,0.1)] text-[#B8B4AA] hover:text-[#F4F2EC] transition-colors">Cancelar</button>
          <button onClick={() => onSave(form)} className="font-mono text-xs uppercase tracking-[0.14em] px-5 py-2.5 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors">Guardar</button>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Basic */}
        <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6 space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Información básica</p>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Título *</label>
            <input type="text" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Descripción</label>
            <textarea rows={3} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Duración</label>
              <input type="text" value={form.duracion} onChange={e => setForm({...form, duracion: e.target.value})}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Estado</label>
              <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors">
                <option value="borrador">Borrador</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA]">Objetivos</p>
            <button onClick={addObjetivo} className="text-[#C7A36D] hover:text-[#d4b07a] transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="space-y-2">
            {(form.objetivos || []).map((obj, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={obj} onChange={e => updateObjetivo(i, e.target.value)} placeholder={`Objetivo ${i + 1}`}
                  className="flex-1 bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
                <button onClick={() => removeObjetivo(i)} className="p-2.5 text-[#B8B4AA] hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Ejercicio */}
        <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6 space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Ejercicio</p>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Título</label>
            <input type="text" value={form.ejercicio_titulo || ''} onChange={e => setForm({...form, ejercicio_titulo: e.target.value})}
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Descripción</label>
            <textarea rows={3} value={form.ejercicio_descripcion || ''} onChange={e => setForm({...form, ejercicio_descripcion: e.target.value})}
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors resize-none" />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Fecha límite</label>
            <input type="text" value={form.ejercicio_deadline || ''} onChange={e => setForm({...form, ejercicio_deadline: e.target.value})}
              placeholder="ej: 20 de Octubre 2026"
              className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
          </div>
        </div>

        {/* Contenidos */}
        <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA]">Contenidos</p>
            <div className="flex gap-2">
              {[
                { tipo: 'video', icon: Video, label: 'Video' },
                { tipo: 'pdf', icon: FileText, label: 'PDF' },
                { tipo: 'texto', icon: AlignLeft, label: 'Texto' },
                { tipo: 'zoom', icon: Link, label: 'Zoom' },
                { tipo: 'imagen', icon: Image, label: 'Imagen' },
              ].map(({ tipo, icon: Icon, label }) => (
                <button key={tipo} onClick={() => addContenido(tipo)}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 border border-[rgba(244,242,236,0.1)] text-[#B8B4AA] hover:text-[#C7A36D] hover:border-[rgba(199,163,109,0.3)] transition-colors">
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {(form.contenidos || []).map((c, i) => (
              <div key={i} className="border border-[rgba(244,242,236,0.06)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#C7A36D]">{c.tipo}</span>
                  <button onClick={() => removeContenido(i)} className="text-[#B8B4AA] hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-2">
                  <input type="text" value={c.titulo} onChange={e => updateContenido(i, 'titulo', e.target.value)} placeholder="Título"
                    className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-3 py-2 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
                  {['video', 'pdf', 'zoom', 'imagen'].includes(c.tipo) && (
                    <input type="text" value={c.url} onChange={e => updateContenido(i, 'url', e.target.value)} placeholder="URL"
                      className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-3 py-2 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
                  )}
                  {c.tipo === 'texto' && (
                    <textarea rows={4} value={c.texto} onChange={e => updateContenido(i, 'texto', e.target.value)} placeholder="Contenido de texto..."
                      className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-3 py-2 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors resize-none" />
                  )}
                </div>
              </div>
            ))}
            {(form.contenidos || []).length === 0 && (
              <p className="text-center text-[#B8B4AA] text-sm py-6 border border-dashed border-[rgba(244,242,236,0.06)]">
                Agregá contenido usando los botones de arriba
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAGOS ────────────────────────────────────────────────────────
function PagosSection() {
  const total = PAGOS_MOCK.filter(p => p.estado === 'completado').reduce((s, p) => s + p.monto, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Ingresos totales", value: `$${total} USD`, icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
          { label: "Pagos completados", value: PAGOS_MOCK.filter(p => p.estado === 'completado').length, icon: CheckCircle, color: "text-[#C7A36D]", bg: "bg-[rgba(199,163,109,0.1)]" },
          { label: "Pendientes de pago", value: ESTUDIANTES_MOCK.filter(e => e.estado_pago === 'no_pagado').length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-[#B8B4AA]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(244,242,236,0.08)]">
                {["Estudiante", "Monto", "Proveedor", "Referencia", "Estado", "Fecha"].map(h => (
                  <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] px-5 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAGOS_MOCK.map(p => (
                <tr key={p.id} className="border-b border-[rgba(244,242,236,0.04)] hover:bg-[rgba(244,242,236,0.02)] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-[#F4F2EC]">{p.estudiante_nombre}</p>
                    <p className="text-xs text-[#B8B4AA]">{p.estudiante_email}</p>
                  </td>
                  <td className="px-5 py-4 text-green-400 font-mono">${p.monto} {p.moneda}</td>
                  <td className="px-5 py-4 text-[#B8B4AA]">{p.proveedor}</td>
                  <td className="px-5 py-4 text-[#B8B4AA] font-mono text-xs">{p.referencia_externa}</td>
                  <td className="px-5 py-4"><StatusBadge estado={p.estado} /></td>
                  <td className="px-5 py-4 text-[#B8B4AA] text-xs">{p.fecha_pago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── CONFIGURACIÓN ────────────────────────────────────────────────
function ConfiguracionSection() {
  const [config, setConfig] = useState(CONFIG_MOCK);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      {saved && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          ✓ Configuración guardada correctamente
        </div>
      )}

      {[
        {
          title: "Información del curso",
          fields: [
            { key: "nombre_curso", label: "Nombre del curso", type: "text" },
            { key: "descripcion_curso", label: "Descripción", type: "textarea" },
            { key: "precio_curso", label: "Precio (USD)", type: "number" },
            { key: "cupos_totales", label: "Cupos totales", type: "number" },
            { key: "fecha_inicio", label: "Fecha de inicio", type: "text" },
          ]
        },
        {
          title: "Perfil del profesor",
          fields: [
            { key: "nombre_profesor", label: "Nombre", type: "text" },
            { key: "bio_profesor", label: "Bio", type: "textarea" },
            { key: "email_contacto", label: "Email de contacto", type: "email" },
            { key: "whatsapp_numero", label: "WhatsApp", type: "text" },
            { key: "instagram_url", label: "Instagram URL", type: "url" },
          ]
        },
        {
          title: "Links importantes",
          fields: [
            { key: "link_formulario", label: "Link del formulario Google", type: "url" },
            { key: "link_pago", label: "Link de pago (Stripe/MP)", type: "url" },
          ]
        },
      ].map(({ title, fields }) => (
        <div key={title} className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-5">{title}</p>
          <div className="space-y-4">
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">{label}</label>
                {type === 'textarea' ? (
                  <textarea rows={3} value={config[key] || ''} onChange={e => setConfig({ ...config, [key]: e.target.value })}
                    className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors resize-none" />
                ) : (
                  <input type={type} value={config[key] || ''} onChange={e => setConfig({ ...config, [key]: e.target.value })}
                    className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={save}
        className="font-mono text-xs uppercase tracking-[0.14em] px-8 py-3.5 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors"
      >
        Guardar cambios
      </button>
    </div>
  );
}

// ── SHARED ───────────────────────────────────────────────────────
function StatusBadge({ estado }) {
  const map = {
    pendiente: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    aprobado: 'bg-green-400/10 text-green-400 border-green-400/20',
    rechazado: 'bg-red-400/10 text-red-400 border-red-400/20',
    pagado: 'bg-green-400/10 text-green-400 border-green-400/20',
    no_pagado: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    cancelado: 'bg-red-400/10 text-red-400 border-red-400/20',
    completado: 'bg-green-400/10 text-green-400 border-green-400/20',
    fallido: 'bg-red-400/10 text-red-400 border-red-400/20',
    publicado: 'bg-[rgba(199,163,109,0.15)] text-[#C7A36D] border-[rgba(199,163,109,0.3)]',
    borrador: 'bg-[rgba(244,242,236,0.05)] text-[#B8B4AA] border-[rgba(244,242,236,0.1)]',
  };
  const labels = {
    no_pagado: 'Sin pago', pendiente: 'Pendiente', aprobado: 'Aprobado',
    rechazado: 'Rechazado', pagado: 'Pagado', cancelado: 'Cancelado',
    completado: 'Completado', fallido: 'Fallido', publicado: 'Publicado', borrador: 'Borrador',
  };
  return (
    <span className={`inline-block font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 border ${map[estado] || map.borrador}`}>
      {labels[estado] || estado}
    </span>
  );
}