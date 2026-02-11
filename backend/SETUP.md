# Setup Guide - Poética de la Mirada Backend

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Cuenta de Stripe (opcional, para pagos)
- Cuenta de email SMTP (opcional, para notificaciones)

## Instalación

### 1. Clonar y navegar al directorio del backend

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

Variables requeridas:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/poetica_db"
JWT_SECRET="tu-secret-key-super-segura"
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 4. Configurar base de datos

```bash
# Generar cliente Prisma
npm run db:generate

# Crear migraciones
npm run db:migrate

# (Opcional) Seed de datos iniciales
npm run db:seed
```

### 5. Iniciar servidor

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Configuración de Stripe (Opcional)

1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener API keys del dashboard
3. Configurar webhook endpoint: `https://tu-dominio.com/api/webhooks/stripe`
4. Agregar variables al `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Configuración de Email (Opcional)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

## Google Forms Integration

1. Crear formulario en Google Forms
2. Abrir Script Editor (Extensions > Apps Script)
3. Pegar el siguiente código:

```javascript
function onFormSubmit(e) {
  const response = e.response;
  const itemResponses = response.getItemResponses();
  
  const data = {
    nombre: itemResponses[0].getResponse(),
    email: itemResponses[1].getResponse(),
    telefono: itemResponses[2]?.getResponse(),
    pais: itemResponses[3]?.getResponse(),
    experiencia: itemResponses[4]?.getResponse(),
    interes: itemResponses[5]?.getResponse()
  };
  
  UrlFetchApp.fetch('https://tu-api.com/api/applications', {
    method: 'post',
    payload: JSON.stringify(data),
    contentType: 'application/json'
  });
}
```

4. Crear trigger: Click en reloj icon > Add Trigger
   - Choose function: onFormSubmit
   - Select event source: From form
   - Select event type: On form submit

## Primer Usuario (Profesor)

El seed crea automáticamente un profesor:
- Email: `profesor@poetica.com`
- Contraseña: `admin123`

Cambiar contraseña inmediatamente después del primer login.

## Despliegue

### Railway/Render/Heroku

1. Conectar repositorio
2. Configurar variables de entorno
3. Agregar PostgreSQL addon
4. Configurar build command: `npm run build`
5. Configurar start command: `npm start`

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### Error de conexión a PostgreSQL
- Verificar DATABASE_URL
- Asegurar que PostgreSQL esté corriendo
- Verificar permisos de usuario

### Error de Stripe webhook
- Verificar STRIPE_WEBHOOK_SECRET
- Asegurar que el endpoint sea público
- Verificar firma del webhook

### Emails no se envían
- Verificar configuración SMTP
- Revisar logs de errores
- Verificar spam folder
