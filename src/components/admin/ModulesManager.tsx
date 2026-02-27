import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Eye, GripVertical, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useModules } from '@/hooks/useModules';
import * as moduleApi from '@/services/moduleApi';
import type { Modulo } from '@/types';

const ModulesManager: React.FC = () => {
  const { modules, isLoading, refetch } = useModules();
  const [editingModule, setEditingModule] = useState<Partial<Modulo> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);

  const minDateTime = new Date().toISOString().slice(0, 16);

  const handleCreate = () => {
    setEditingModule({
      titulo: '',
      descripcion: '',
      duracion: '2 semanas',
      objetivos: [],
      estado: 'borrador',
      contenido: [],
      recursos: [],
    });
    setScheduleMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (modulo: Modulo) => {
    setEditingModule({ ...modulo });
    setScheduleMode(modulo.estado === 'programado');
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingModule?.titulo) return;
    try {
      let dataToSave = { ...editingModule };

      if (scheduleMode && editingModule.scheduledPublishAt) {
        dataToSave.estado = 'programado';
      } else if (!scheduleMode) {
        dataToSave.scheduledPublishAt = undefined;
        if (dataToSave.estado === 'programado') dataToSave.estado = 'borrador';
      }

      if (editingModule.id) {
        await moduleApi.updateModule(editingModule.id, dataToSave);
      } else {
        await moduleApi.createModule(dataToSave);
      }

      setIsDialogOpen(false);
      setEditingModule(null);
      setScheduleMode(false);
      refetch();
    } catch (error) {
      console.error('Error guardando módulo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este módulo?')) return;
    try {
      await moduleApi.deleteModule(id);
      refetch();
    } catch (error) {
      console.error('Error eliminando módulo:', error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await moduleApi.duplicateModule(id);
      refetch();
    } catch (error) {
      console.error('Error duplicando módulo:', error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await moduleApi.publishModule(id);
      refetch();
    } catch (error) {
      console.error('Error publicando módulo:', error);
    }
  };

  const getEstadoBadge = (modulo: Modulo) => {
    if (modulo.estado === 'publicado')
      return <Badge className="bg-green-500/20 text-green-500">Publicado</Badge>;
    if (modulo.estado === 'programado')
      return <Badge className="bg-blue-500/20 text-blue-400"><Clock className="w-3 h-3 mr-1 inline" />Programado</Badge>;
    return <Badge className="bg-yellow-500/20 text-yellow-500">Borrador</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif text-[#F4F2EC]">
              Módulos del curso
            </CardTitle>
            <Button onClick={handleCreate} className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo módulo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-[#B8B4AA]">Cargando...</div>
          ) : modules.length === 0 ? (
            <div className="text-center py-8 text-[#B8B4AA]">No hay módulos</div>
          ) : (
            <div className="space-y-3">
              {modules.map((modulo, index) => (
                <div
                  key={modulo.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(244,242,236,0.03)] border border-[rgba(244,242,236,0.05)]"
                >
                  <div className="text-[#B8B4AA]">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#C7A36D]/10 flex items-center justify-center">
                    <span className="text-sm text-[#C7A36D]">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-[#F4F2EC]">{modulo.titulo}</h3>
                      {getEstadoBadge(modulo)}
                    </div>
                    <p className="text-sm text-[#B8B4AA] line-clamp-1">{modulo.descripcion}</p>
                    {modulo.estado === 'programado' && modulo.scheduledPublishAt && (
                      <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(modulo.scheduledPublishAt).toLocaleString('es-ES', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {modulo.estado === 'borrador' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePublish(modulo.id)}
                        className="text-green-500"
                        title="Publicar ahora"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(modulo)}
                      className="text-[#B8B4AA]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicate(modulo.id)}
                      className="text-[#B8B4AA]"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(modulo.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#141419] border-[rgba(244,242,236,0.08)] text-[#F4F2EC] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingModule?.id ? 'Editar módulo' : 'Nuevo módulo'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#F4F2EC]">Título</Label>
              <Input
                value={editingModule?.titulo || ''}
                onChange={(e) => setEditingModule({ ...editingModule, titulo: e.target.value })}
                className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
              />
            </div>
            <div>
              <Label className="text-[#F4F2EC]">Descripción</Label>
              <Textarea
                value={editingModule?.descripcion || ''}
                onChange={(e) => setEditingModule({ ...editingModule, descripcion: e.target.value })}
                className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-[#F4F2EC]">Duración</Label>
              <Input
                value={editingModule?.duracion || ''}
                onChange={(e) => setEditingModule({ ...editingModule, duracion: e.target.value })}
                className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
              />
            </div>

            {/* Sección de publicación */}
            <div className="border border-[rgba(244,242,236,0.08)] rounded-lg p-4 space-y-4 bg-[rgba(244,242,236,0.02)]">
              <p className="text-sm font-medium text-[#F4F2EC]">Publicación</p>

              {/* Publicar inmediatamente */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#F4F2EC] text-sm">Publicar inmediatamente</Label>
                  <p className="text-xs text-[#B8B4AA] mt-0.5">El módulo quedará visible al guardar</p>
                </div>
                <Switch
                  checked={!scheduleMode && editingModule?.estado === 'publicado'}
                  onCheckedChange={(checked) => {
                    setScheduleMode(false);
                    setEditingModule({
                      ...editingModule,
                      estado: checked ? 'publicado' : 'borrador',
                      scheduledPublishAt: undefined,
                    });
                  }}
                />
              </div>

              {/* Programar publicación */}
              <div className="border-t border-[rgba(244,242,236,0.06)] pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#F4F2EC] text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Programar publicación
                    </Label>
                    <p className="text-xs text-[#B8B4AA] mt-0.5">Elige fecha y hora para publicar automáticamente</p>
                  </div>
                  <Switch
                    checked={scheduleMode}
                    onCheckedChange={(checked) => {
                      setScheduleMode(checked);
                      if (checked) {
                        setEditingModule({ ...editingModule, estado: 'programado' });
                      } else {
                        setEditingModule({
                          ...editingModule,
                          estado: 'borrador',
                          scheduledPublishAt: undefined,
                        });
                      }
                    }}
                  />
                </div>

                {scheduleMode && (
                  <div className="mt-3">
                    <Label className="text-[#B8B4AA] text-xs">Fecha y hora de publicación</Label>
                    <Input
                      type="datetime-local"
                      min={minDateTime}
                      value={
                        editingModule?.scheduledPublishAt
                          ? new Date(editingModule.scheduledPublishAt).toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        setEditingModule({
                          ...editingModule,
                          scheduledPublishAt: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : undefined,
                        })
                      }
                      className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC] mt-1"
                    />
                    {editingModule?.scheduledPublishAt && (
                      <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Se publicará el{' '}
                        {new Date(editingModule.scheduledPublishAt).toLocaleString('es-ES', {
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-[rgba(244,242,236,0.15)]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!editingModule?.titulo || (scheduleMode && !editingModule?.scheduledPublishAt)}
              className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]"
            >
              {scheduleMode ? 'Programar publicación' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModulesManager;