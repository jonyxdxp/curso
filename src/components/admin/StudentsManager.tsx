import React, { useState } from 'react';
import { Search, Filter, Eye, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useStudents, useStudentDetail } from '@/hooks/useStudents';
import { EstudianteDetail } from '@/types';

const StudentsManager: React.FC = () => {
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const { students, isLoading, pagination } = useStudents({
    search: search || undefined,
    estado: estado || undefined,
    page: 1,
    limit: 20
  });

  const { student: selectedStudent } = useStudentDetail(selectedStudentId || '');

  const getStatusBadge = (estadoPago: string) => {
    switch (estadoPago) {
      case 'pagado':
        return <Badge className="bg-green-500/20 text-green-500">Pagado</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500/20 text-red-500">Cancelado</Badge>;
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
              Estudiantes
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
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                  <SelectItem value="no_pagado">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-[#B8B4AA]">Cargando...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-8 text-[#B8B4AA]">No hay estudiantes</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(244,242,236,0.08)]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Progreso</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#B8B4AA]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-[rgba(244,242,236,0.05)] hover:bg-[rgba(244,242,236,0.02)]">
                      <td className="py-3 px-4 text-[#F4F2EC]">{student.nombre}</td>
                      <td className="py-3 px-4 text-[#B8B4AA]">{student.email}</td>
                      <td className="py-3 px-4">{getStatusBadge(student.estadoPago)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={student.progresoPromedio} className="w-20 h-2 bg-[rgba(244,242,236,0.08)]" />
                          <span className="text-sm text-[#B8B4AA]">{student.progresoPromedio}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudentId(student.id)}
                          className="text-[#B8B4AA]"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-sm text-[#B8B4AA]">
            Mostrando {students.length} de {pagination.total} estudiantes
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudentId(null)}>
        <DialogContent className="bg-[#141419] border-[rgba(244,242,236,0.08)] text-[#F4F2EC] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Detalle del estudiante</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#B8B4AA]">Nombre</p>
                  <p className="text-[#F4F2EC]">{selectedStudent.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-[#B8B4AA]">Email</p>
                  <p className="text-[#F4F2EC]">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#B8B4AA]">Estado de pago</p>
                  <p className="text-[#F4F2EC]">{getStatusBadge(selectedStudent.estadoPago)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#B8B4AA]">Fecha de inscripción</p>
                  <p className="text-[#F4F2EC]">
                    {selectedStudent.fechaInscripcion 
                      ? new Date(selectedStudent.fechaInscripcion).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </p>
                </div>
                {selectedStudent.telefono && (
                  <div>
                    <p className="text-sm text-[#B8B4AA]">Teléfono</p>
                    <p className="text-[#F4F2EC]">{selectedStudent.telefono}</p>
                  </div>
                )}
                {selectedStudent.pais && (
                  <div>
                    <p className="text-sm text-[#B8B4AA]">País</p>
                    <p className="text-[#F4F2EC]">{selectedStudent.pais}</p>
                  </div>
                )}
              </div>

              {selectedStudent.progreso && selectedStudent.progreso.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-[#F4F2EC] mb-3">Progreso en módulos</h3>
                  <div className="space-y-3">
                    {selectedStudent.progreso.map((p) => (
                      <div key={p.moduloId}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#F4F2EC]">{p.titulo}</span>
                          <span className="text-[#B8B4AA]">{p.completudPorcentaje}%</span>
                        </div>
                        <Progress value={p.completudPorcentaje} className="h-2 bg-[rgba(244,242,236,0.08)]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedStudent.pagos && selectedStudent.pagos.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-[#F4F2EC] mb-3">Historial de pagos</h3>
                  <div className="space-y-2">
                    {selectedStudent.pagos.map((pago) => (
                      <div key={pago.id} className="flex justify-between p-3 rounded-lg bg-[rgba(244,242,236,0.03)]">
                        <div>
                          <p className="text-[#F4F2EC]">{pago.monto} {pago.moneda}</p>
                          <p className="text-sm text-[#B8B4AA]">{pago.proveedor}</p>
                        </div>
                        <Badge className={pago.estado === 'completado' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
                          {pago.estado}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsManager;
