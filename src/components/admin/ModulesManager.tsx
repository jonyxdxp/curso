import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Eye, EyeOff, GripVertical, Calendar } from 'lucide-react';
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

  const handleCreate = () => {
    setEditingModule({
      titulo: '',
      descripcion: '',
      duracion: '2 semanas',
      objetivos: [],
      estado: 'borrador',
      contenido: [],
      recursos: []
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (modulo: Modulo) => {
    setEditingModule({ ...modulo });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingModule?.titulo) return;

    try {
      if (editingModule.id) {
        await moduleApi.updateModule(editingModule.id, editingModule);
      } else {
        await moduleApi.createModule(editingModule);
      }
      setIsDialogOpen(false);
      setEditingModule(null);
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[#F4F2EC]">{modulo.titulo}</h3>
                      <Badge className={
                        modulo.estado === 'publicado' ? 'bg-green-500/20 text-green-500' :
                        modulo.estado === 'programado' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }>
                        {modulo.estado === 'publicado' ? 'Publicado' : 
                         modulo.estado === 'programado' ? 'Programado' : 'Borrador'}
                      </Badge>
                      {modulo.estado === 'programado' && modulo.fechaPublicacion && (
                        <span className="text-xs text-[#B8B4AA] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(modulo.fechaPublicacion).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#B8B4AA] line-clamp-1">{modulo.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {modulo.estado === 'borrador' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePublish(modulo.id)}
                        className="text-green-500"
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
            <div className="space-y-3 pt-2 border-t border-[rgba(244,242,236,0.08)]">
              <Label className="text-[#F4F2EC] font-medium">Estado de publicación</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  type="button"
                  variant={editingModule?.estado === 'borrador' ? 'default' : 'outline'}
                  onClick={() => setEditingModule({ ...editingModule, estado: 'borrador' })}
                  className={editingModule?.estado === 'borrador' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/30' : 'border-[rgba(244,242,236,0.1)]'}
                >
                  Borrador
                </Button>
                <Button
                  type="button"
                  variant={editingModule?.estado === 'publicado' ? 'default' : 'outline'}
                  onClick={() => setEditingModule({ ...editingModule, estado: 'publicado' })}
                  className={editingModule?.estado === 'publicado' ? 'bg-green-500/20 text-green-500 border-green-500/50 hover:bg-green-500/30' : 'border-[rgba(244,242,236,0.1)]'}
                >
                  Publicado
                </Button>
                <Button
                  type="button"
                  variant={editingModule?.estado === 'programado' ? 'default' : 'outline'}
                  onClick={() => setEditingModule({ ...editingModule, estado: 'programado' })}
                  className={editingModule?.estado === 'programado' ? 'bg-blue-500/20 text-blue-500 border-blue-500/50 hover:bg-blue-500/30' : 'border-[rgba(244,242,236,0.1)]'}
                >
                  Programado
                </Button>
              </div>
            </div>

            {editingModule?.estado === 'programado' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-[#F4F2EC]">Fecha de publicación</Label>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    value={editingModule?.fechaPublicacion ? new Date(editingModule.fechaPublicacion).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingModule({ ...editingModule, fechaPublicacion: e.target.value })}
                    className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                  />
                </div>
                <p className="text-xs text-[#B8B4AA]">
                  El módulo se publicará automáticamente para los estudiantes en la fecha y hora seleccionada.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[rgba(244,242,236,0.15)]">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModulesManager;
