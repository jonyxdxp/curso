# Poética de la Mirada - Plataforma de Curso

Sistema completo de gestión de cursos online con autenticación, pagos, dashboard de administración y seguimiento de progreso.

## Características

### Estudiantes
- Registro y login seguro con JWT
- Dashboard personal con progreso del curso
- Acceso a módulos con contenido multimedia
- Seguimiento de progreso por módulo
- Recursos descargables

### Profesor/Admin
- Dashboard con estadísticas en tiempo real
- Gestión de solicitudes de acceso (aprobar/rechazar)
- Gestión de estudiantes y pagos
- CRUD de módulos del curso
- Configuración de precios y Stripe
- Notificaciones por email

### Sistema de Pagos
- Integración con Stripe
- Webhooks para confirmación automática
- Reembolsos
- Historial de transacciones

## Tecnologías

### Frontend
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router
- Axios
- GSAP (animaciones)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe API
- Nodemailer

## Estructura del Proyecto

```
├── src/                          # Frontend React
│   ├── components/               # Componentes reutilizables
│   │   ├── admin/               # Componentes del panel admin
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   ├── ProtectedRoute.tsx   # Protección de rutas
│   │   └── PaymentRequired.tsx  # Página de pago requerido
│   ├── contexts/                # Contextos React
│   │   └── AuthContext.tsx      # Contexto de autenticación
│   ├── hooks/                   # Custom hooks
│   ├── pages/                   # Páginas principales
│   ├── services/                # Servicios de API
│   ├── types/                   # Tipos TypeScript
│   └── App.tsx                  # Componente principal
├── backend/                      # Backend Node.js
│   ├── src/
│   │   ├── controllers/         # Controladores
│   │   ├── middleware/          # Middlewares
│   │   ├── models/              # Modelos Prisma
│   │   ├── routes/              # Rutas API
│   │   ├── services/            # Servicios
│   │   └── utils/               # Utilidades
│   ├── prisma/
│   │   └── schema.prisma        # Schema de base de datos
│   └── package.json
└── package.json
```

## Instalación Rápida

### 1. Frontend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con VITE_API_URL

# Iniciar servidor de desarrollo
npm run dev
```

### 2. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con DATABASE_URL, JWT_SECRET, etc.

# Configurar base de datos
npm run db:generate
npm run db:migrate
npm run db:seed

# Iniciar servidor
npm run dev
```

## Variables de Entorno

### Frontend (.env)
```env
VITE_API_URL=https://curso-vaip.onrender.com/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/poetica_db"
JWT_SECRET="super-secret-key"
PORT=3001
FRONTEND_URL=http://localhost:5173

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_USER=email@gmail.com
SMTP_PASS=password
```

## Flujo de Usuario

### Estudiante Nuevo
1. Llega a landing page
2. Completa formulario de solicitud (Google Forms)
3. Profesor aprueba solicitud en dashboard
4. Estudiante recibe email con link de pago
5. Completa pago vía Stripe
6. Recibe email de confirmación con link para crear cuenta
7. Crea cuenta y accede al curso

### Estudiante Registrado
1. Login con email y contraseña
2. Ve dashboard con progreso
3. Navega por módulos
4. Marca lecciones como completadas
5. Sube ejercicios

### Profesor
1. Login como profesor
2. Dashboard con estadísticas
3. Gestiona solicitudes pendientes
4. Gestiona estudiantes
5. Crea/edita módulos
6. Configura precios y Stripe
7. Ve reportes de progreso

## API Endpoints

Ver [backend/API.md](backend/API.md) para documentación completa.

## Despliegue

### Frontend (Vercel/Netlify)
1. Conectar repositorio
2. Configurar variables de entorno
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Railway/Render)
1. Conectar repositorio
2. Configurar variables de entorno
3. Agregar PostgreSQL
4. Build: `npm run build`
5. Start: `npm start`

## Credenciales por Defecto

Después del seed, el profesor por defecto es:
- Email: `profesor@poetica.com`
- Contraseña: `admin123`

**IMPORTANTE:** Cambiar contraseña después del primer login.

## Contribuir

1. Fork el repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## Licencia

MIT License - ver LICENSE para detalles.

## Soporte

Para soporte, email: soporte@poetica-de-la-mirada.com
