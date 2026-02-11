import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Play, 
  Award,
  Download,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentDashboard } from '@/hooks/useDashboard';
import { ModuloConProgreso } from '@/types';

const StudentDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { dashboard, isLoading, error } = useStudentDashboard();

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

  const { perfil, estadisticas, modulos, siguienteModulo, recursos, mensajeBienvenida } = dashboard;

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      {/* Header */}
      <header className="bg-[#141419] border-b border-[rgba(244,242,236,0.08)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-serif text-xl text-[#F4F2EC]">
              Poética de la Mirada
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#B8B4AA] hidden sm:block">{perfil.nombre}</span>
              <Avatar className="w-8 h-8">
                <AvatarImage src={perfil.avatarUrl} />
                <AvatarFallback className="bg-[#C7A36D]/20 text-[#C7A36D]">
                  {perfil.nombre.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={logout} className="text-[#B8B4AA]">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8 bg-gradient-to-r from-[#C7A36D]/10 to-transparent border-[rgba(199,163,109,0.2)]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-20 h-20 border-2 border-[#C7A36D]">
                <AvatarImage src={mensajeBienvenida.imagenProfesor} />
                <AvatarFallback className="bg-[#C7A36D]/20 text-[#C7A36D] text-2xl">
                  P
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-serif text-[#F4F2EC] mb-2">
                  {mensajeBienvenida.titulo}
                </h1>
                <p className="text-[#B8B4AA]">{mensajeBienvenida.mensaje}</p>
              </div>
              {siguienteModulo && (
                <Link to={`/modulo/${siguienteModulo.orden}`}>
                  <Button className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar curso
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C7A36D]/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#C7A36D]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F4F2EC]">{estadisticas.progresoGeneral}%</p>
                  <p className="text-xs text-[#B8B4AA]">Progreso general</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F4F2EC]">{estadisticas.modulosCompletados}</p>
                  <p className="text-xs text-[#B8B4AA]">Módulos completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F4F2EC]">{estadisticas.modulosEnProgreso}</p>
                  <p className="text-xs text-[#B8B4AA]">En progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C7A36D]/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#C7A36D]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#F4F2EC]">{estadisticas.totalModulos}</p>
                  <p className="text-xs text-[#B8B4AA]">Total módulos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modules List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-serif text-[#F4F2EC] mb-4">Módulos del curso</h2>
            <div className="space-y-4">
              {modulos.map((modulo) => (
                <ModuleCard key={modulo.id} modulo={modulo} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
              <CardHeader>
                <CardTitle className="text-lg font-serif text-[#F4F2EC]">Tu progreso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#B8B4AA]">Completado</span>
                      <span className="text-[#F4F2EC]">{estadisticas.modulosCompletados}/{estadisticas.totalModulos}</span>
                    </div>
                    <Progress value={estadisticas.progresoGeneral} className="h-2 bg-[rgba(244,242,236,0.08)]" />
                  </div>
                  <div className="pt-4 border-t border-[rgba(244,242,236,0.08)]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#B8B4AA]">Inscripción</span>
                      <span className="text-[#F4F2EC]">
                        {perfil.fechaInscripcion 
                          ? new Date(perfil.fechaInscripcion).toLocaleDateString('es-ES')
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            {recursos.length > 0 && (
              <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
                <CardHeader>
                  <CardTitle className="text-lg font-serif text-[#F4F2EC]">Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recursos.slice(0, 5).map((recurso, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(244,242,236,0.03)] hover:bg-[rgba(244,242,236,0.05)] transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#C7A36D]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#F4F2EC] truncate">{recurso.title}</p>
                          <p className="text-xs text-[#B8B4AA] capitalize">{recurso.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ModuleCard: React.FC<{ modulo: ModuloConProgreso }> = ({ modulo }) => {
  const getStatusColor = () => {
    switch (modulo.estado) {
      case 'completado':
        return 'text-green-500';
      case 'en_progreso':
        return 'text-blue-500';
      default:
        return 'text-[#B8B4AA]';
    }
  };

  const getStatusText = () => {
    switch (modulo.estado) {
      case 'completado':
        return 'Completado';
      case 'en_progreso':
        return 'En progreso';
      default:
        return 'No iniciado';
    }
  };

  return (
    <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)] hover:border-[rgba(199,163,109,0.3)] transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div 
            className="w-24 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${modulo.image})` }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#C7A36D]">
                {modulo.badge}
              </span>
              <span className={`text-xs ${getStatusColor()}`}>• {getStatusText()}</span>
            </div>
            <h3 className="font-medium text-[#F4F2EC] mb-1 truncate">{modulo.titulo}</h3>
            <p className="text-sm text-[#B8B4AA] mb-3 line-clamp-1">{modulo.descripcion}</p>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress 
                  value={modulo.progreso} 
                  className="h-1.5 bg-[rgba(244,242,236,0.08)]" 
                />
              </div>
              <span className="text-sm text-[#B8B4AA]">{modulo.progreso}%</span>
              <Link to={`/modulo/${modulo.orden}`}>
                <Button 
                  size="sm" 
                  variant={modulo.estado === 'completado' ? 'outline' : 'default'}
                  className={modulo.estado === 'completado' 
                    ? 'border-[rgba(244,242,236,0.15)] text-[#B8B4AA]' 
                    : 'bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]'
                  }
                >
                  {modulo.estado === 'completado' ? 'Revisar' : 'Continuar'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDashboardPage;
