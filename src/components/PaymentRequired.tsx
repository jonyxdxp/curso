import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCoursePrice } from '@/hooks/usePayments';
import * as paymentApi from '@/services/paymentApi';
import { useToast } from '@/hooks/use-toast';

const PaymentRequired: React.FC = () => {
  const { price, isLoading } = useCoursePrice();
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      const session = await paymentApi.createPaymentSession();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo iniciar el proceso de pago.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-[#C7A36D]/5 via-transparent to-[#C7A36D]/5 pointer-events-none" />
      
      <Card className="w-full max-w-md bg-[#141419] border-[rgba(244,242,236,0.08)] relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[rgba(199,163,109,0.15)] flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[#C7A36D]" />
          </div>
          <CardTitle className="text-2xl font-serif text-[#F4F2EC]">
            Acceso restringido
          </CardTitle>
          <CardDescription className="text-[#B8B4AA]">
            Completa el pago para acceder a todo el contenido del curso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-[#B8B4AA] mb-2">Precio del curso</p>
            <p className="text-4xl font-bold text-[#C7A36D]">
              {isLoading ? '...' : `$${price?.precio} ${price?.moneda}`}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-[#B8B4AA]">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-xs">✓</span>
              </div>
              Acceso a todos los módulos
            </div>
            <div className="flex items-center gap-3 text-sm text-[#B8B4AA]">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-xs">✓</span>
              </div>
              Material descargable
            </div>
            <div className="flex items-center gap-3 text-sm text-[#B8B4AA]">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-xs">✓</span>
              </div>
              Seguimiento de progreso
            </div>
            <div className="flex items-center gap-3 text-sm text-[#B8B4AA]">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-xs">✓</span>
              </div>
              Certificado de finalización
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            className="w-full bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D] font-medium py-6"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Realizar pago
          </Button>

          <div className="text-center">
            <Link to="/" className="text-sm text-[#C7A36D] hover:underline">
              Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRequired;
