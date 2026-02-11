import React, { useState } from 'react';
import { Search, Filter, RefreshCcw, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentStats } from '@/hooks/usePayments';
import * as paymentApi from '@/services/paymentApi';
import { useEffect } from 'react';

interface Pago {
  id: string;
  nombre: string;
  email: string;
  monto: number;
  moneda: string;
  estado: string;
  fechaPago?: string;
  createdAt: string;
}

const PaymentsManager: React.FC = () => {
  const [payments, setPayments] = useState<Pago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<Pago | null>(null);
  const { stats } = usePaymentStats();

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await paymentApi.getAllPayments({ estado: estado || undefined });
      setPayments(data.pagos);
    } catch (error) {
      console.error('Error cargando pagos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [estado]);

  const handleRefund = async (id: string) => {
    if (!confirm('¿Estás seguro de procesar el reembolso?')) return;
    try {
      await paymentApi.processRefund(id);
      fetchPayments();
    } catch (error) {
      console.error('Error procesando reembolso:', error);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge className="bg-green-500/20 text-green-500">Completado</Badge>;
      case 'reembolsado':
        return <Badge className="bg-red-500/20 text-red-500">Reembolsado</Badge>;
      case 'fallido':
        return <Badge className="bg-red-500/20 text-red-500">Fallido</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pendiente</Badge>;
    }
  };

  const filteredPayments = payments.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F4F2EC]">${stats?.ingresosTotales?.toLocaleString() || 0}</p>
                <p className="text-xs text-[#B8B4AA]">Ingresos totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C7A36D]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#C7A36D]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F4F2EC]">{stats?.totalPagos || 0}</p>
                <p className="text-xs text-[#B8B4AA]">Total pagos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F4F2EC]">{stats?.pagosCompletados || 0}</p>
                <p className="text-xs text-[#B8B4AA]">Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F4F2EC]">{stats?.pagosPendientes || 0}</p>
                <p className="text-xs text-[#B8B4AA]">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-serif text-[#F4F2EC]">
              Historial de pagos
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
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="reembolsado">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchPayments} className="border-[rgba(244,242,236,0.15)]">
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-[#B8B4AA]">Cargando...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-[#B8B4AA]">No hay pagos</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(244,242,236,0.08)]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Estudiante</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Monto</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#B8B4AA]">Fecha</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#B8B4AA]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((pago) => (
                    <tr key={pago.id} className="border-b border-[rgba(244,242,236,0.05)] hover:bg-[rgba(244,242,236,0.02)]">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-[#F4F2EC]">{pago.nombre}</p>
                          <p className="text-sm text-[#B8B4AA]">{pago.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#F4F2EC]">
                        ${pago.monto} {pago.moneda}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(pago.estado)}</td>
                      <td className="py-3 px-4 text-[#B8B4AA]">
                        {pago.fechaPago 
                          ? new Date(pago.fechaPago).toLocaleDateString('es-ES')
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {pago.estado === 'completado' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRefund(pago.id)}
                            className="text-red-500"
                          >
                            Reembolsar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManager;
