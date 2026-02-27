// Tipos de usuario
export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'profesor' | 'estudiante';
  avatarUrl?: string;
  estudiante?: EstudianteProfile;
  profesor?: ProfesorProfile;
}

export interface EstudianteProfile {
  id: string;
  estadoPago: 'no_pagado' | 'pagado' | 'cancelado';
  estadoAprobacion: 'pendiente' | 'aprobado' | 'rechazado';
  fechaPago?: string;
  fechaInscripcion?: string;
  progreso?: ProgresoModulo[];
}

export interface ProfesorProfile {
  id: string;
}

// Tipos de autenticación
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  estudianteId: string;
}

// Tipos de módulos
export interface Modulo {
  id: string;
  titulo: string;
  descripcion?: string;
  orden: number;
  duracion?: string;
  objetivos: string[];
  estado: 'borrador' | 'publicado' | 'programado';
  fechaPublicacion?: string;
  contenido: ContenidoModulo[];
  ejercicio?: Ejercicio;
  recursos: Recurso[];
  createdAt: string;
  updatedAt: string;
}

export interface ContenidoModulo {
  type: 'text' | 'quote' | 'video' | 'image';
  title?: string;
  body?: string;
  quote?: string;
  author?: string;
  url?: string;
}

export interface Ejercicio {
  title: string;
  description: string;
  deadline: string;
}

export interface Recurso {
  title: string;
  type: 'pdf' | 'libro' | 'video' | 'link';
  url?: string;
}

// Tipos de progreso
export interface ProgresoModulo {
  moduloId: string;
  titulo: string;
  orden: number;
  completudPorcentaje: number;
  fechaCompletado?: string;
  ultimaActividad?: string;
}

// Tipos de estudiante
export interface Estudiante {
  id: string;
  userId: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
  estado: 'activo' | 'inactivo';
  estadoPago: 'no_pagado' | 'pagado' | 'cancelado';
  estadoAprobacion: 'pendiente' | 'aprobado' | 'rechazado';
  fechaPago?: string;
  fechaInscripcion?: string;
  progresoPromedio: number;
}

export interface EstudianteDetail extends Estudiante {
  fechaAprobacion?: string;
  montoPagado?: number;
  metodoPago?: string;
  telefono?: string;
  pais?: string;
  experiencia?: string;
  interes?: string;
  fechaRegistro: string;
  progreso: ProgresoModulo[];
  pagos: Pago[];
}

// Tipos de solicitudes
export interface SolicitudAcceso {
  id: string;
  estudianteId?: string;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  experiencia?: string;
  interes?: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaSolicitud: string;
  fechaRevision?: string;
  motivoRechazo?: string;
}

// Tipos de pagos
export interface Pago {
  id: string;
  estudianteId: string;
  monto: number;
  moneda: string;
  proveedor: string;
  referenciaExterna: string;
  estado: 'pendiente' | 'completado' | 'fallido' | 'reembolsado';
  fechaPago?: string;
  createdAt: string;
}

// Tipos de dashboard
export interface DashboardEstudiante {
  perfil: {
    id: string;
    nombre: string;
    email: string;
    avatarUrl?: string;
    fechaInscripcion?: string;
  };
  estadisticas: {
    progresoGeneral: number;
    totalModulos: number;
    modulosCompletados: number;
    modulosEnProgreso: number;
    modulosNoIniciados: number;
  };
  modulos: ModuloConProgreso[];
  siguienteModulo?: ModuloConProgreso;
  recursos: Recurso[];
  mensajeBienvenida: {
    titulo: string;
    mensaje: string;
    imagenProfesor?: string;
  };
}

export interface ModuloConProgreso {
  id: string;
  titulo: string;
  descripcion?: string;
  orden: number;
  duracion?: string;
  badge: string;
  progreso: number;
  estado: 'no_iniciado' | 'en_progreso' | 'completado';
  fechaCompletado?: string;
  image: string;
}

export interface DashboardProfesor {
  estadisticas: {
    totalEstudiantes: number;
    estudiantesPagados: number;
    estudiantesPendientes: number;
    solicitudesPendientes: number;
    totalModulos: number;
    modulosPublicados: number;
    ingresosTotales: number;
  };
  estudiantesRecientes: EstudianteReciente[];
  solicitudesRecientes: SolicitudAcceso[];
  progresoPorModulo: ProgresoModuloStats[];
  configuracion?: ConfiguracionProfesor;
}

export interface EstudianteReciente {
  id: string;
  nombre: string;
  email: string;
  avatarUrl?: string;
  estadoPago: string;
  fechaInscripcion?: string;
}

export interface ProgresoModuloStats {
  moduloId: string;
  titulo: string;
  orden: number;
  promedioCompletud: number;
  estudiantesActivos: number;
}

export interface ConfiguracionProfesor {
  id: string;
  nombreCurso: string;
  descripcionCurso?: string;
  precioCurso: number;
  moneda: string;
  bioProfesor?: string;
  fotoProfesorUrl?: string;
  emailContacto?: string;
  whatsappNumero?: string;
  pais?: string;
  notificarEmail: boolean;
  notificarWhatsApp: boolean;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
