-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('profesor', 'estudiante');

-- CreateEnum
CREATE TYPE "UserEstado" AS ENUM ('activo', 'inactivo');

-- CreateEnum
CREATE TYPE "EstadoAprobacion" AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('no_pagado', 'pagado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- CreateEnum
CREATE TYPE "EstadoModulo" AS ENUM ('borrador', 'publicado');

-- CreateEnum
CREATE TYPE "EstadoPagoTransaccion" AS ENUM ('pendiente', 'completado', 'fallido', 'reembolsado');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nombre" TEXT NOT NULL,
    "avatar_url" TEXT,
    "rol" "UserRole" NOT NULL DEFAULT 'estudiante',
    "estado" "UserEstado" NOT NULL DEFAULT 'activo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "estado_aprobacion" "EstadoAprobacion" NOT NULL DEFAULT 'pendiente',
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'no_pagado',
    "fecha_aprobacion" TIMESTAMP(3),
    "fecha_pago" TIMESTAMP(3),
    "monto_pagado" DECIMAL(10,2),
    "metodo_pago" TEXT,
    "referencia_transaccion" TEXT,
    "telefono" TEXT,
    "pais" TEXT,
    "experiencia" TEXT,
    "interes" TEXT,
    "fecha_inscripcion" TIMESTAMP(3),

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profesores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permisos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ultimo_login" TIMESTAMP(3),

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_acceso" (
    "id" TEXT NOT NULL,
    "estudiante_id" TEXT,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "pais" TEXT,
    "experiencia" TEXT,
    "interes" TEXT,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'pendiente',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_revision" TIMESTAMP(3),
    "motivo_rechazo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_acceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "modulo_previo_id" TEXT,
    "contenido" JSONB,
    "estado" "EstadoModulo" NOT NULL DEFAULT 'borrador',
    "duracion" TEXT DEFAULT '2 semanas',
    "objetivos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ejercicio" JSONB,
    "recursos" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progreso_estudiante" (
    "id" TEXT NOT NULL,
    "estudiante_id" TEXT NOT NULL,
    "modulo_id" TEXT NOT NULL,
    "completud_porcentaje" INTEGER NOT NULL DEFAULT 0,
    "fecha_completado" TIMESTAMP(3),
    "ultima_actividad" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progreso_estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "estudiante_id" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "proveedor" TEXT NOT NULL,
    "referencia_externa" TEXT NOT NULL,
    "estado" "EstadoPagoTransaccion" NOT NULL DEFAULT 'pendiente',
    "fecha_pago" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_profesor" (
    "id" TEXT NOT NULL,
    "profesor_id" TEXT NOT NULL,
    "nombre_curso" TEXT NOT NULL,
    "descripcion_curso" TEXT,
    "precio_curso" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "bio_profesor" TEXT,
    "foto_profesor_url" TEXT,
    "email_contacto" TEXT,
    "whatsapp_numero" TEXT,
    "pais" TEXT,
    "stripe_secret_key" TEXT,
    "stripe_public_key" TEXT,
    "stripe_webhook_secret" TEXT,
    "email_notificaciones" TEXT,
    "notificar_whatsapp" BOOLEAN NOT NULL DEFAULT false,
    "notificar_email" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_profesor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_user_id_key" ON "estudiantes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_referencia_transaccion_key" ON "estudiantes"("referencia_transaccion");

-- CreateIndex
CREATE UNIQUE INDEX "profesores_user_id_key" ON "profesores"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_acceso_estudiante_id_key" ON "solicitudes_acceso"("estudiante_id");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_estudiante_estudiante_id_modulo_id_key" ON "progreso_estudiante"("estudiante_id", "modulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_profesor_profesor_id_key" ON "configuracion_profesor"("profesor_id");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesores" ADD CONSTRAINT "profesores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_acceso" ADD CONSTRAINT "solicitudes_acceso_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_estudiante" ADD CONSTRAINT "progreso_estudiante_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_estudiante" ADD CONSTRAINT "progreso_estudiante_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_profesor" ADD CONSTRAINT "configuracion_profesor_profesor_id_fkey" FOREIGN KEY ("profesor_id") REFERENCES "profesores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
