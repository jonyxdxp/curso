import React, { useState, useEffect } from 'react';
import { Save, CreditCard, Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as adminApi from '@/services/adminApi';
import * as paymentApi from '@/services/paymentApi';
import { useToast } from '@/hooks/use-toast';

const SettingsManager: React.FC = () => {
  const [config, setConfig] = useState({
    nombreCurso: 'Poética de la Mirada',
    descripcionCurso: '',
    precioCurso: 100,
    moneda: 'USD',
    bioProfesor: '',
    emailContacto: '',
    whatsappNumero: '',
    notificarEmail: true,
    notificarWhatsApp: false
  });
  const [stripeKeys, setStripeKeys] = useState({
    stripeSecretKey: '',
    stripePublicKey: '',
    stripeWebhookSecret: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await adminApi.getConfig();
        if (data.configuracion) {
          setConfig(prev => ({ ...prev, ...data.configuracion }));
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
      }
    };
    loadConfig();
  }, []);

  const handleSaveGeneral = async () => {
    setIsLoading(true);
    try {
      await adminApi.updateConfig(config);
      toast({
        title: 'Configuración guardada',
        description: 'Los cambios se han guardado exitosamente.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStripe = async () => {
    setIsLoading(true);
    try {
      await adminApi.setStripeKeys(stripeKeys);
      toast({
        title: 'Claves de Stripe guardadas',
        description: 'Las claves se han configurado exitosamente.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las claves.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceUpdate = async () => {
    setIsLoading(true);
    try {
      await paymentApi.setCoursePrice(config.precioCurso, config.moneda);
      toast({
        title: 'Precio actualizado',
        description: `El precio del curso es ahora $${config.precioCurso} ${config.moneda}.`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el precio.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#141419] border border-[rgba(244,242,236,0.08)]">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#C7A36D] data-[state=active]:text-[#0B0B0D]">
            General
          </TabsTrigger>
          <TabsTrigger value="pagos" className="data-[state=active]:bg-[#C7A36D] data-[state=active]:text-[#0B0B0D]">
            Pagos
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="data-[state=active]:bg-[#C7A36D] data-[state=active]:text-[#0B0B0D]">
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Configuración general
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#F4F2EC]">Nombre del curso</Label>
                <Input
                  value={config.nombreCurso}
                  onChange={(e) => setConfig({ ...config, nombreCurso: e.target.value })}
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                />
              </div>
              <div>
                <Label className="text-[#F4F2EC]">Descripción del curso</Label>
                <Textarea
                  value={config.descripcionCurso}
                  onChange={(e) => setConfig({ ...config, descripcionCurso: e.target.value })}
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-[#F4F2EC]">Biografía del profesor</Label>
                <Textarea
                  value={config.bioProfesor}
                  onChange={(e) => setConfig({ ...config, bioProfesor: e.target.value })}
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleSaveGeneral} 
                disabled={isLoading}
                className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos" className="mt-6 space-y-6">
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Precio del curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#F4F2EC]">Precio</Label>
                  <Input
                    type="number"
                    value={config.precioCurso}
                    onChange={(e) => setConfig({ ...config, precioCurso: parseFloat(e.target.value) })}
                    className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                  />
                </div>
                <div>
                  <Label className="text-[#F4F2EC]">Moneda</Label>
                  <Input
                    value={config.moneda}
                    onChange={(e) => setConfig({ ...config, moneda: e.target.value })}
                    className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                  />
                </div>
              </div>
              <Button 
                onClick={handlePriceUpdate} 
                disabled={isLoading}
                className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Actualizar precio
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Configuración de Stripe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#F4F2EC]">Secret Key</Label>
                <Input
                  type="password"
                  value={stripeKeys.stripeSecretKey}
                  onChange={(e) => setStripeKeys({ ...stripeKeys, stripeSecretKey: e.target.value })}
                  placeholder="sk_test_..."
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                />
              </div>
              <div>
                <Label className="text-[#F4F2EC]">Public Key</Label>
                <Input
                  value={stripeKeys.stripePublicKey}
                  onChange={(e) => setStripeKeys({ ...stripeKeys, stripePublicKey: e.target.value })}
                  placeholder="pk_test_..."
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                />
              </div>
              <div>
                <Label className="text-[#F4F2EC]">Webhook Secret</Label>
                <Input
                  type="password"
                  value={stripeKeys.stripeWebhookSecret}
                  onChange={(e) => setStripeKeys({ ...stripeKeys, stripeWebhookSecret: e.target.value })}
                  placeholder="whsec_..."
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                />
              </div>
              <Button 
                onClick={handleSaveStripe} 
                disabled={isLoading}
                className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar claves
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="mt-6">
          <Card className="bg-[#141419] border-[rgba(244,242,236,0.08)]">
            <CardHeader>
              <CardTitle className="text-lg font-serif text-[#F4F2EC]">
                Configuración de notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[#F4F2EC]">Email de contacto</Label>
                <Input
                  type="email"
                  value={config.emailContacto}
                  onChange={(e) => setConfig({ ...config, emailContacto: e.target.value })}
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                />
              </div>
              <div>
                <Label className="text-[#F4F2EC]">Número de WhatsApp</Label>
                <Input
                  value={config.whatsappNumero}
                  onChange={(e) => setConfig({ ...config, whatsappNumero: e.target.value })}
                  placeholder="+1234567890"
                  className="bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC]"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#B8B4AA]" />
                  <div>
                    <p className="text-[#F4F2EC]">Notificaciones por email</p>
                    <p className="text-sm text-[#B8B4AA]">Recibir notificaciones de nuevas solicitudes</p>
                  </div>
                </div>
                <Switch
                  checked={config.notificarEmail}
                  onCheckedChange={(checked) => setConfig({ ...config, notificarEmail: checked })}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#B8B4AA]" />
                  <div>
                    <p className="text-[#F4F2EC]">Notificaciones por WhatsApp</p>
                    <p className="text-sm text-[#B8B4AA]">Recibir notificaciones por WhatsApp</p>
                  </div>
                </div>
                <Switch
                  checked={config.notificarWhatsApp}
                  onCheckedChange={(checked) => setConfig({ ...config, notificarWhatsApp: checked })}
                />
              </div>
              <Button 
                onClick={handleSaveGeneral} 
                disabled={isLoading}
                className="bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManager;
