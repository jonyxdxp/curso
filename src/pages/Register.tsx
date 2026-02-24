import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Register() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', telefono: '', pais: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Without token, show unauthorized
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-red-500/30 bg-red-500/10 rounded-full">
            <span className="text-red-400 text-2xl">✕</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-400 mb-3">Acceso denegado</p>
          <h1 className="font-serif text-3xl text-[#F4F2EC] mb-4">Sin permiso</h1>
          <p className="text-[#B8B4AA] mb-8 leading-relaxed">
            Para registrarte necesitás un enlace válido enviado por el profesor. Si ya realizaste el pago y no recibiste el enlace, escribinos.
          </p>
          <a
            href="mailto:hola@poeticadelamirada.com"
            className="inline-block font-mono text-xs uppercase tracking-[0.14em] px-6 py-3 border border-[rgba(199,163,109,0.4)] text-[#C7A36D] hover:bg-[rgba(199,163,109,0.08)] transition-colors"
          >
            Contactar al profesor
          </a>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[rgba(199,163,109,0.3)] bg-[rgba(199,163,109,0.1)] rounded-full">
            <span className="text-[#C7A36D] text-2xl">✓</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7A36D] mb-3">¡Listo!</p>
          <h1 className="font-serif text-3xl text-[#F4F2EC] mb-4">Cuenta creada</h1>
          <p className="text-[#B8B4AA] mb-8">Ya podés ingresar con tus datos.</p>
          <Link
            to={createPageUrl('Login')}
            className="inline-block font-mono text-xs uppercase tracking-[0.14em] px-8 py-4 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex flex-col justify-center py-12 px-4">
      <div className="max-w-lg mx-auto w-full">
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7A36D] mb-3">Registro</p>
          <h1 className="font-serif text-4xl text-[#F4F2EC] mb-2">Crear cuenta</h1>
          <p className="text-[#B8B4AA] text-sm">Completá tus datos para acceder al curso.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-[#141419] border border-[rgba(244,242,236,0.08)] p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Nombre completo *</label>
              <input
                type="text" required
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Email *</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Contraseña *</label>
              <input
                type="password" required minLength={8}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Confirmar *</label>
              <input
                type="password" required
                value={form.confirmar}
                onChange={e => setForm({ ...form, confirmar: e.target.value })}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">Teléfono</label>
              <input
                type="tel"
                value={form.telefono}
                onChange={e => setForm({ ...form, telefono: e.target.value })}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#B8B4AA] mb-2">País</label>
              <input
                type="text"
                value={form.pais}
                onChange={e => setForm({ ...form, pais: e.target.value })}
                className="w-full bg-[#0B0B0D] border border-[rgba(244,242,236,0.1)] text-[#F4F2EC] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A36D] transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full font-mono text-xs uppercase tracking-[0.14em] px-6 py-4 bg-[#C7A36D] text-[#0B0B0D] hover:bg-[#d4b07a] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}