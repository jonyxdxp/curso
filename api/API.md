# API Documentation - Poética de la Mirada Backend

## Base URL
```
http://localhost:3001/api
```

## Autenticación

La API utiliza JWT tokens para autenticación. Incluye el token en el header:
```
Authorization: Bearer <token>
```

### Endpoints de Autenticación

#### POST /auth/login
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

#### POST /auth/register
Registrar usuario (solo estudiantes aprobados)
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña",
  "nombre": "Nombre Completo",
  "estudianteId": "uuid-del-estudiante"
}
```

#### GET /auth/profile
Obtener perfil del usuario autenticado

#### PUT /auth/profile
Actualizar perfil
```json
{
  "nombre": "Nuevo Nombre",
  "avatarUrl": "https://..."
}
```

## Estudiantes

#### GET /students
Listar estudiantes (profesor only)
Query params: `estado`, `search`, `page`, `limit`

#### GET /students/:id
Detalle de estudiante (profesor only)

#### GET /students/me/dashboard
Dashboard del estudiante actual

#### GET /students/me/progress
Progreso del estudiante actual

#### POST /students/me/progress/:moduloId
Actualizar progreso
```json
{
  "completudPorcentaje": 50
}
```

## Módulos

#### GET /modules
Listar módulos
Query params: `estado`

#### GET /modules/:id
Detalle de módulo

#### POST /modules
Crear módulo (profesor only)
```json
{
  "titulo": "Nombre del módulo",
  "descripcion": "Descripción",
  "duracion": "2 semanas",
  "objetivos": ["objetivo 1", "objetivo 2"],
  "estado": "borrador"
}
```

#### PUT /modules/:id
Actualizar módulo (profesor only)

#### DELETE /modules/:id
Eliminar módulo (profesor only)

#### POST /modules/:id/publish
Publicar módulo (profesor only)

## Solicitudes de Acceso

#### POST /applications
Crear solicitud (público)
```json
{
  "nombre": "Nombre",
  "email": "email@ejemplo.com",
  "telefono": "+1234567890",
  "pais": "País",
  "experiencia": "Experiencia previa",
  "interes": "Interés en el curso"
}
```

#### GET /applications
Listar solicitudes (profesor only)

#### POST /applications/:id/approve
Aprobar solicitud (profesor only)

#### POST /applications/:id/reject
Rechazar solicitud (profesor only)
```json
{
  "motivo": "Motivo del rechazo (opcional)"
}
```

## Pagos

#### POST /payments/create-session
Crear sesión de pago (estudiante only)

#### GET /payments/my-payments
Historial de pagos (estudiante only)

#### GET /payments/price
Precio del curso (público)

#### GET /payments
Listar pagos (profesor only)

#### POST /payments/refund/:id
Procesar reembolso (profesor only)

## Admin

#### GET /admin/dashboard
Resumen del dashboard (profesor only)

#### GET /admin/stats
Estadísticas detalladas (profesor only)

#### GET /admin/config
Configuración del profesor (profesor only)

#### PUT /admin/config
Actualizar configuración (profesor only)

#### POST /admin/stripe-keys
Configurar claves de Stripe (profesor only)

## Webhooks

#### POST /webhooks/stripe
Webhook de Stripe (raw body)

#### POST /webhooks/google-forms
Webhook de Google Forms

## Dashboard

#### GET /dashboard/student
Dashboard del estudiante

#### GET /dashboard/professor
Dashboard del profesor

#### GET /dashboard/activity
Actividad reciente
