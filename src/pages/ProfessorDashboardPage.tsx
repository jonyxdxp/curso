import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  UserCheck,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessorDashboard } from '@/hooks/useDashboard';
import { useApplicationStats } from '@/hooks/useApplications';
import { usePaymentStats } from '@/hooks/usePayments';

// Sub-components
import StudentsManager from '@/components/admin/StudentsManager';
import ApplicationsManager from '@/components/admin/ApplicationsManager';
import ModulesManager from '@/components/admin/ModulesManager';
import PaymentsManager from '@/components/admin/PaymentsManager';
import SettingsManager from '@/components/admin/SettingsManager';

const ProfessorDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { dashboard, isLoading, error } = useProfessorDashboard();
  const { stats: appStats } = useApplicationStats();
  const { stats: paymentStats } = usePaymentStats();

  const isActive = (path: string) => location.pathname.includes(path);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="text-[#C7A36D]">Cargando...</div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="text-red-400">Error cargando dashboard: {error}</div>
      </div>
    );
  }

  const { estadisticas, estudiantesRecientes, solicitudesRecientes, progresoPorModulo } = dashboard;

  const navItems = [
    { path: '/profesor', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profesor/solicitudes', icon: UserCheck, label: 'Solicitudes', badge: estadisticas.solicitudesPendientes },
    { path: '/profesor/estudiantes', icon: Users, label: 'Estudiantes' },
    { path: '/profesor/modulos', icon: BookOpen, label: 'Módulos' },
    { path: '/profesor/pagos', icon: CreditCard, label: 'Pagos' },
    { path: '/profesor/configuracion', icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141419] border-r border-[rgba(244,242,236,0.08)] fixed h-full">
        <div className="p-6">
          <Link to="/" className="font-serif text-xl text-[#F4F2EC]">
            Poética de la Mirada
          </Link>
          <p className="text-xs text-[#B8B4AA] mt-1">Panel de Administración</p>
        </div>

        <nav className="px-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive(item.path) && location.pathname === item.path
                  ? 'bg-[rgba(199,163,109,0.1)] text-[#C7A36D]'
                  : 'text-[#B8B4AA] hover:bg-[rgba(244,242,236,0.03)] hover:text-[#F4F2EC]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <Badge className="bg-[#C7A36D] text-[#0B0B0D] text-xs">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(244,242,236,0.08)]">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="bg-[#C7A36D]/20 text-[#C7A36D]">
                {user?.nombre?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#F4F2EC] truncate">{user?.nombre}</p>
              <p className="text-xs text-[#B8B4AA]">Profesor</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-[rgba(244,242,236,0.15)] text-[#B8B4AA]"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-[#141419] border-b border-[rgba(244,242,236,0.08)] sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-8">
            <h1 className="text-xl font-serif text-[#F4F2EC]">
              {navItems.find(item => location.pathname === item.path)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-[#B8B4AA] relative">
                <Bell className="w-5 h-5" />
                {estadisticas.solicitudesPendientes > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#C7A36D] rounded-full" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <DashboardOverview 
                  estadisticas={estadisticas}
                  estudiantesRecientes={estudiantesRecientes}
                  solicitudesRecientes={solicitudesRecientes}
                  progresoPorModulo={progresoPorModulo}
                  appStats={appStats}
                  paymentStats={paymentStats}
                />
              } 
            />
            <Route path="/solicitudes" element={<ApplicationsManager />} />
            <Route path="/estudiantes" element={<StudentsManager />} />
            <Route path="/modulos" element={<ModulesManager />} />
            <Route path="/pagos" element={<PaymentsManager />} />
            <Route path="/configuracion" element={<SettingsManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

interface DashboardOverviewProps {
  estadisticas: {
    totalEstudiantes: number;
    estudiantesPagados: number;
    estudiantesPendientes: number;
    solicitudesPendientes: number;
    totalModulos: number;
    modulosPublicados: number;
    ingresosTotales: number;
  };
  estudiantesRecientes: any[];
  solicitudesRecientes: any[];
  progresoPorModulo: any[];
  appStats: any;
  paymentStats: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  estadisticas,
  estudiantesRecientes,
  solicitudesRecientes,
  progresoPorModulo,
  appStats,
  paymentStats
}) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Estudiantes"
          value={estadisticas.totalEstudiantes}
          icon={Users}
          trend={`${estadisticas.estudiantesPagados} pagados`}
          trendUp={true}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${estadisticas.ingresosTotales.toLocaleString()}`}
          icon={DollarSign}
          trend={paymentStats ? `${paymentStats.pagosCompletados} pagos` : '0 pagos'}
          trendUp={true}
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={estadisticas.solicitudesPendientes}
          icon={UserCheck}
          trend={appStats ? `${appStats.total} total` : '0 total'}
          trendUp={estadisticas.solicitudesPendientes > 0}
        />
        <StatCard
          title="Módulos Publicados"
          value={`${estadisticas.modulosPublicados}/${estadisticas.totalModulos}`}
          icon={BookOpen}
          trend={`${estadisticas.totalModulos - estadisticas.modulosPublicados} en borrador`}
          trendUp={true}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Module Progress */}
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Progreso por módulo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progresoPorModulo.slice(0, 5).map((modulo) => (
                  <div key={modulo.moduloId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#F4F2EC]">{modulo.titulo}</span>
                      <span className="text-[#B8B4AA]">{modulo.promedioCompletud}%</span>
                    </div>
                    <Progress 
                      value={modulo.promedioCompletud} 
                      className="h-2 bg-[rgba(244,242,236,0.08)]" 
                    />
                    <p className="text-xs text-[#B8B4AA] mt-1">
                      {modulo.estudiantesActivos} estudiantes activos
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Estudiantes recientes
              </CardTitle>
              <Link to="/profesor/estudiantes">
                <Button variant="ghost" size="sm" className="text-[#C7A36D]">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {estudiantesRecientes.map((estudiante) => (
                  <div 
                    key={estudiante.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(244,242,236,0.03)]"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={estudiante.avatarUrl} />
                      <AvatarFallback className="bg-[#C7A36D]/20 text-[#C7A36D]">
                        {estudiante.nombre.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-[#F4F2EC]">{estudiante.nombre}</p>
                      <p className="text-xs text-[#B8B4AA]">{estudiante.email}</p>
                    </div>
                    <Badge 
                      className={estudiante.estadoPago === 'pagado' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-yellow-500/20 text-yellow-500'
                      }
                    >
                      {estudiante.estadoPago === 'pagado' ? 'Pagado' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Applications */}
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Solicitudes pendientes
              </CardTitle>
              {estadisticas.solicitudesPendientes > 0 && (
                <Badge className="bg-[#C7A36D] text-[#0B0B0D]">
                  {estadisticas.solicitudesPendientes}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {solicitudesRecientes.length === 0 ? (
                  <p className="text-sm text-[#B8B4AA] text-center py-4">
                    No hay solicitudes pendientes
                  </p>
                ) : (
                  solicitudesRecientes.map((solicitud) => (
                    <div 
                      key={solicitud.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(244,242,236,0.03)]"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#C7A36D]/10 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-[#C7A36D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#F4F2EC] truncate">{solicitud.nombre}</p>
                        <p className="text-xs text-[#B8B4AA] truncate">{solicitud.email}</p>
                      </div>
                      <Link to="/profesor/solicitudes">
                        <Button size="sm" variant="ghost" className="text-[#C7A36D]">
                          Revisar
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Acciones rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/profesor/solicitudes">
                  <Button variant="outline" className="w-full justify-start border-[rgba(244,242,236,0.15)] text-[#F4F2EC]">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Revisar solicitudes
                  </Button>
                </Link>
                <Link to="/profesor/modulos">
                  <Button variant="outline" className="w-full justify-start border-[rgba(244,242,236,0.15)] text-[#F4F2EC]">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Gestionar módulos
                  </Button>
                </Link>
                <Link to="/profesor/pagos">
                  <Button variant="outline" className="w-full justify-start border-[rgba(244,242,236,0.15)] text-[#F4F2EC]">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Ver pagos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp }) => (
  <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#B8B4AA] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[#F4F2EC]">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#C7A36D]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#C7A36D]" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1">
        <TrendingUp className={`w-4 h-4 ${trendUp ? 'text-green-500' : 'text-[#B8B4AA]'}`} />
        <span className="text-sm text-[#B8B4AA]">{trend}</span>
      </div>
    </CardContent>
  </Card>
);

export default ProfessorDashboardPage;
