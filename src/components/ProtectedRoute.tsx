import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfessor?: boolean;
  requireStudent?: boolean;
  requirePayment?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireProfessor = false,
  requireStudent = false,
  requirePayment = false
}) => {
  const { isAuthenticated, isProfessor, isStudent, hasPaid, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="text-[#C7A36D]">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireProfessor && !isProfessor) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireStudent && !isStudent) {
    return <Navigate to="/profesor" replace />;
  }

  if (requirePayment && !hasPaid) {
    return <Navigate to="/pago-requerido" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
