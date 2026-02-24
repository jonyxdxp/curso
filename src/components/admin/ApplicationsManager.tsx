import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplications } from '@/hooks/useApplications';
import type { SolicitudAcceso } from '@/types';

const ApplicationsManager: React.FC = () => {
  const [search, setSearch] = useState('');
 const [estado, setEstado] = useState<string>('todos');
  const [selectedApplication, setSelectedApplication] = useState<SolicitudAcceso | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

 const { applications, isLoading, pagination, refetch, approveApplication, rejectApplication } = useApplications({
  search: search || undefined,
  estado: estado === 'todos' ? undefined : estado,  // Cambiado
  page: 1,
  limit: 20
});

  const handleApprove = async (id: string) => {
    try {
      await approveApplication(id);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error aprobando:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    try {
      await rejectApplication(selectedApplication.id, rejectReason);
      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error rechazando:', error);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <Badge className="bg-green-500/20 text-green-500">Aprobado</Badge>;
      case 'rechazado':
        return <Badge className="bg-red-500/20 text-red-500">Rechazado</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-serif text-[#F4F2EC]">
              Solicitudes de acceso
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B4AA]" />
                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64 bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                />
              </div>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger className="w-40 bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
  <SelectItem value="todos">Todos</SelectItem>
  <SelectItem value="pendiente">Pendiente</SelectItem>
  <SelectItem value="aprobado">Aprobado</SelectItem>
  <SelectItem value="rechazado">Rechazado</SelectItem>
</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-[#B8B4AA]">Cargando...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-[#B8B4AA]">No hay solicitudes</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(244,242,236,0.08)]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Estado</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#B8B4AA]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-[rgba(244,242,236,0.05)] hover:bg-[rgba(244,242,236,0.02)]">
                      <td className="py-3 px-4 text-[#F4F2EC]">{app.nombre}</td>
                      <td className="py-3 px-4 text-[#B8B4AA]">{app.email}</td>
                      <td className="py-3 px-4 text-[#B8B4AA]">
                        {new Date(app.fechaSolicitud).toLocaleDateString('es-ES')}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(app.estado)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedApplication(app)}
                            className="text-[#B8B4AA]"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {app.estado === 'pendiente' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app.id)}
                                className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setRejectDialogOpen(true);
                                }}
                                className="bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApplication && !rejectDialogOpen} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="bg-[#141419] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]">
          <DialogHeader>
            <DialogTitle className="font-serif">Detalle de solicitud</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#B8B4AA]">Nombre</p>
                <p className="text-[#F4F2EC]">{selectedApplication.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-[#B8B4AA]">Email</p>
                <p className="text-[#F4F2EC]">{selectedApplication.email}</p>
              </div>
              {selectedApplication.telefono && (
                <div>
                  <p className="text-sm text-[#B8B4AA]">Teléfono</p>
                  <p className="text-[#F4F2EC]">{selectedApplication.telefono}</p>
                </div>
              )}
              {selectedApplication.pais && (
                <div>
                  <p className="text-sm text-[#B8B4AA]">País</p>
                  <p className="text-[#F4F2EC]">{selectedApplication.pais}</p>
                </div>
              )}
              {selectedApplication.experiencia && (
                <div>
                  <p className="text-sm text-[#B8B4AA]">Experiencia</p>
                  <p className="text-[#F4F2EC]">{selectedApplication.experiencia}</p>
                </div>
              )}
              {selectedApplication.interes && (
                <div>
                  <p className="text-sm text-[#B8B4AA]">Interés</p>
                  <p className="text-[#F4F2EC]">{selectedApplication.interes}</p>
                </div>
              )}
              {selectedApplication.estado === 'rechazado' && selectedApplication.motivoRechazo && (
                <div>
                  <p className="text-sm text-[#B8B4AA]">Motivo del rechazo</p>
                  <p className="text-[#F4F2EC]">{selectedApplication.motivoRechazo}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedApplication?.estado === 'pendiente' && (
              <>
                <Button
                  onClick={() => handleApprove(selectedApplication.id)}
                  className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobar
                </Button>
                <Button
                  onClick={() => setRejectDialogOpen(true)}
                  className="bg-red-500/20 text-red-500 hover:bg-red-500/30"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-[#141419] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]">
          <DialogHeader>
            <DialogTitle className="font-serif">Rechazar solicitud</DialogTitle>
            <DialogDescription className="text-[#B8B4AA]">
              Opcionalmente, puedes indicar el motivo del rechazo.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo del rechazo..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="border-[rgba(244,242,236,0.15)]">
              Cancelar
            </Button>
            <Button onClick={handleReject} className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
              Rechazar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManager;
