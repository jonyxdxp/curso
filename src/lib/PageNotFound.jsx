import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C7A36D] mb-4">404</p>
        <h1 className="font-serif text-4xl text-[#F4F2EC] mb-4">Página no encontrada</h1>
        <p className="text-[#B8B4AA] mb-8">El contenido que buscás no existe o fue movido.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[rgba(199,163,109,0.4)] text-[#C7A36D] font-mono text-xs uppercase tracking-[0.14em] hover:bg-[rgba(199,163,109,0.08)] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}