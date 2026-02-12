import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@poetica.com';
  const plainPassword = 'Admin123!'; // Cambia esto
  const password = await bcrypt.hash(plainPassword, 10);

  try {
    const admin = await prisma.user.create({
      data: {
        email,
        nombre: 'Administrador',
        password,  // Cambiado de passwordHash a password
        rol: 'profesor',
        estado: 'activo',
      },
    });

    console.log('✅ Admin creado exitosamente:');
    console.log('Email:', email);
    console.log('Password:', plainPassword);
    console.log('ID:', admin.id);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('⚠️  El usuario ya existe');
    } else {
      console.error('❌ Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();