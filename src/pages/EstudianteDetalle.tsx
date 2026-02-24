// @ts-nocheck
import { useState } from 'react';
import { createPageUrl } from '@/utils';
import { ArrowLeft, CheckCircle, Clock, BookOpen, DollarSign, Mail, Phone, MapPin, Calendar, XCircle, Award } from 'lucide-react';
import { MODULOS_MOCK, PROGRESO_MOCK, ESTUDIANTES_MOCK, PAGOS_MOCK } from '../components/shared/mockData';

function StatusBadge({ estado }) {
  const map = {
    pendiente: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    aprobado: 'bg-green-400/10 text-green-400 border-green-400/20',
    rechazado: 'bg-red-400/10 text-red-400 border-red-400/20',
    pagado: 'bg-green-400/10 text-green-400 border-green-400/20',
    no_pagado: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    cancelado: 'bg-red-400/10 text-red-400 border-red-400/20',
    completado: 'bg-green-400/10 text-green-400 border-green-400/20',
    publicado: 'bg-[rgba(199,163,109,0.15)] text-[#C7A36D] border-[rgba(199,163,109,0.3)]',
    borrador: 'bg-[rgba(244,242,236,0.05)] text-[#B8B4AA] border-[rgba(244,242,236,0.1)]',
    activo: 'bg-green-400/10 text-green-400 border-green-400/20',
    inactivo: 'bg-red-400/10 text-red-400 border-red-400/20',
  };
  const labels = {
    no_pagado: 'Sin pago', pendiente: 'Pendiente', aprobado: 'Aprobado',
    rechazado: 'Rechazado', pagado: 'Pagado', cancelado: 'Cancelado',
    completado: 'Completado', publicado: 'Publicado', borrador: 'Borrador',
    activo: 'Activo', inactivo: 'Inactivo',
  };
  return (
    <span className={`inline-block font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 border ${map[estado] || map.borrador}`}>
      {labels[estado] || estado}
    </span>
  );
}

export default function EstudianteDetalle() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'est-01';

  const [estudiantes, setEstudiantes] = useState(ESTUDIANTES_MOCK);
  const estudiante = estudiantes.find(e => e.id === id);

  if (!estudiante) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#B8B4AA] mb-4">Estudiante no encontrado.</p>
          <button onClick={() => window.location.href = createPageUrl('ProfessorDashboard')}
            className="font-mono text-xs uppercase tracking-[0.14em] text-[#C7A36D] hover:underline">
            ← Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  const progresoEst = PROGRESO_MOCK.filter(p => p.estudiante_id === id);
  const completados = progresoEst.filter(p => p.completado).length;
  const totalPct = Math.round((completados / MODULOS_MOCK.length) * 100);
  const pagosEst = PAGOS_MOCK.filter(p => p.estudiante_email === estudiante.email);
  const totalPagado = pagosEst.reduce((s, p) => s + p.monto, 0);

  const updatePago = (estado) => setEstudiantes(prev => prev.map(e => e.id === id ? { ...e, estado_pago: estado } : e));
  const toggleActivo = () => setEstudiantes(prev => prev.map(e => e.id === id ? { ...e, activo: !e.activo } : e));

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      {/* Header */}
      <header className="bg-[#141419] border-b border-[rgba(244,242,236,0.08)] sticky top-0 z-30 h-16 flex items-center px-6 lg:px-8 gap-4">
        <button
          onClick={() => window.location.href = createPageUrl('ProfessorDashboard')}
          className="flex items-center gap-2 text-[#B8B4AA] hover:text-[#C7A36D] transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver al dashboard</span>
        </button>
        <div className="w-px h-5 bg-[rgba(244,242,236,0.1)]" />
        <p className="font-serif text-lg text-[#F4F2EC]">{estudiante.nombre}</p>
        <div className="ml-auto flex items-center gap-3">
          <StatusBadge estado={estudiante.activo ? 'activo' : 'inactivo'} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-10 space-y-8">
        {/* Top section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Info card */}
          <div className="lg:col-span-1 bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[rgba(199,163,109,0.15)] flex items-center justify-center font-serif text-2xl text-[#C7A36D]">
                {estudiante.nombre.charAt(0)}
              </div>
              <div>
                <p className="font-serif text-lg text-[#F4F2EC]">{estudiante.nombre}</p>
                <p className="text-xs text-[#B8B4AA]">Estudiante</p>
              </div>
            </div>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center gap-3 text-[#B8B4AA]">
                <Mail className="w-4 h-4 text-[#C7A36D] shrink-0" />
                <span className="truncate">{estudiante.email}</span>
              </div>
              {estudiante.telefono && (
                <div className="flex items-center gap-3 text-[#B8B4AA]">
                  <Phone className="w-4 h-4 text-[#C7A36D] shrink-0" />
                  <span>{estudiante.telefono}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-[#B8B4AA]">
                <MapPin className="w-4 h-4 text-[#C7A36D] shrink-0" />
                <span>{estudiante.pais}</span>
              </div>
              <div className="flex items-center gap-3 text-[#B8B4AA]">
                <Calendar className="w-4 h-4 text-[#C7A36D] shrink-0" />
                <span>Inscripto el {estudiante.fecha_inscripcion}</span>
              </div>
            </div>
            <div className="border-t border-[rgba(244,242,236,0.06)] pt-5 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-3">Acciones</p>
              <button
                onClick={() => updatePago('pagado')}
                className="w-full font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 bg-green-600/20 border border-green-600/40 text-green-400 hover:bg-green-600/30 transition-colors text-left"
              >✓ Marcar como pagado</button>
              <button
                onClick={() => updatePago('no_pagado')}
                className="w-full font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors text-left"
              >⊘ Quitar estado de pago</button>
              <button
                onClick={toggleActivo}
                className="w-full font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors text-left"
              >{estudiante.activo ? '✕ Desactivar acceso' : '✓ Activar acceso'}</button>
              <a
                href={`mailto:${estudiante.email}`}
                className="w-full inline-block font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2.5 border border-[rgba(199,163,109,0.3)] text-[#C7A36D] hover:bg-[rgba(199,163,109,0.08)] transition-colors"
              >✉ Enviar email</a>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, label: "Progreso general", value: `${totalPct}%`, color: "text-[#C7A36D]", bg: "bg-[rgba(199,163,109,0.1)]" },
                { icon: CheckCircle, label: "Módulos completados", value: `${completados} / ${MODULOS_MOCK.length}`, color: "text-green-400", bg: "bg-green-400/10" },
                { icon: DollarSign, label: "Total pagado", value: totalPagado ? `$${totalPagado} USD` : '—', color: "text-green-400", bg: "bg-green-400/10" },
                { icon: BookOpen, label: "Estado de pago", value: estudiante.estado_pago === 'pagado' ? 'Pagado' : 'Sin pago', color: estudiante.estado_pago === 'pagado' ? "text-green-400" : "text-yellow-400", bg: estudiante.estado_pago === 'pagado' ? "bg-green-400/10" : "bg-yellow-400/10" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-[#B8B4AA]">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall progress bar */}
            <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA]">Progreso del curso</span>
                <span className="font-mono text-xs text-[#C7A36D]">{totalPct}%</span>
              </div>
              <div className="h-2 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
                <div className="h-full bg-[#C7A36D] rounded-full transition-all duration-700" style={{ width: `${totalPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Module progress detail */}
        <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-6">Progreso por módulo</p>
          <div className="space-y-4">
            {MODULOS_MOCK.map((m, i) => {
              const p = progresoEst.find(pr => pr.modulo_id === m.id);
              const pct = p?.porcentaje || 0;
              const done = p?.completado || false;
              return (
                <div key={m.id} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-mono ${
                    done ? 'bg-[rgba(199,163,109,0.15)] border-[rgba(199,163,109,0.4)] text-[#C7A36D]' : 'border-[rgba(244,242,236,0.1)] text-[#B8B4AA]'
                  }`}>
                    {done ? '✓' : String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-[#F4F2EC] truncate pr-4">{m.titulo}</span>
                      <span className={`text-xs font-mono shrink-0 ${done ? 'text-[#C7A36D]' : 'text-[#B8B4AA]'}`}>{pct}%</span>
                    </div>
                    <div className="h-1 bg-[rgba(244,242,236,0.06)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${done ? 'bg-[#C7A36D]' : 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {p?.ultima_actividad && (
                    <span className="hidden md:block text-[10px] text-[#B8B4AA] shrink-0 w-24 text-right">
                      {p.ultima_actividad}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment history */}
        {pagosEst.length > 0 && (
          <div className="bg-[#141419] border border-[rgba(244,242,236,0.08)] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-5">Historial de pagos</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(244,242,236,0.06)]">
                  {["Monto", "Proveedor", "Referencia", "Estado", "Fecha"].map(h => (
                    <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagosEst.map(p => (
                  <tr key={p.id} className="border-b border-[rgba(244,242,236,0.04)]">
                    <td className="py-3 pr-6 text-green-400 font-mono">${p.monto} {p.moneda}</td>
                    <td className="py-3 pr-6 text-[#B8B4AA]">{p.proveedor}</td>
                    <td className="py-3 pr-6 font-mono text-[10px] text-[#B8B4AA]">{p.referencia_externa}</td>
                    <td className="py-3 pr-6"><StatusBadge estado={p.estado} /></td>
                    <td className="py-3 text-[#B8B4AA] text-xs">{p.fecha_pago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}