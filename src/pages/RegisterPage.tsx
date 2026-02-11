import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const estudianteId = searchParams.get('estudianteId');
  const emailParam = searchParams.get('email');
  
  const { register, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: emailParam || '',
    password: '',
    confirmPassword: '',
    estudianteId: estudianteId || ''
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        estudianteId: formData.estudianteId
      });
      navigate('/dashboard');
    } catch (err) {
      // Error ya está manejado en el hook
    }
  };

  if (!estudianteId) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[#141419] border-[rgba(244,242,236,0.08)]">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-serif text-[#F4F2EC]">
              Enlace inválido
            </CardTitle>
            <CardDescription className="text-[#B8B4AA]">
              Este enlace de registro no es válido. Por favor, solicita acceso al curso primero.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D]">
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-[#C7A36D]/5 via-transparent to-[#C7A36D]/5 pointer-events-none" />
      
      <Card className="w-full max-w-md bg-[#141419] border-[rgba(244,242,236,0.08)] relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-[rgba(199,163,109,0.15)] flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-[#C7A36D]" />
          </div>
          <CardTitle className="text-2xl font-serif text-[#F4F2EC]">
            ¡Pago confirmado!
          </CardTitle>
          <CardDescription className="text-[#B8B4AA]">
            Crea tu cuenta para acceder al curso
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {(error || localError) && (
            <Alert className="mb-4 bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error || localError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-[#F4F2EC]">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B4AA]" />
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="pl-10 bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC] placeholder:text-[#B8B4AA]/50 focus:border-[#C7A36D]"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F4F2EC]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B4AA]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC] placeholder:text-[#B8B4AA]/50 focus:border-[#C7A36D]"
                  required
                  readOnly={!!emailParam}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#F4F2EC]">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B4AA]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC] placeholder:text-[#B8B4AA]/50 focus:border-[#C7A36D]"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8B4AA] hover:text-[#F4F2EC]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#F4F2EC]">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B4AA]" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 bg-[rgba(244,242,236,0.03)] border-[rgba(244,242,236,0.08)] text-[#F4F2EC] placeholder:text-[#B8B4AA]/50 focus:border-[#C7A36D]"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C7A36D] hover:bg-[#d4b07a] text-[#0B0B0D] font-medium"
            >
              {isLoading ? (
                'Creando cuenta...'
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#B8B4AA]">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-[#C7A36D] hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
