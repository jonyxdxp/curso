const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@poetica.com' }
  });

  if (user) {
    const profesor = await prisma.profesor.create({
      data: {
        userId: user.id,
        biografia: 'Administrador del sistema',
        especialidad: 'Administración'
      }
    });
    
    console.log('✅ Profesor creado:', profesor);
  } else {
    console.log('❌ Usuario no encontrado');
  }
  
  await prisma.$disconnect();
})();