import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  console.log('=== FESTIVAL DE INGLES - DATABASE & SYSTEM CHECK ===');
  try {
    const gradeGroups = await prisma.gradeGroup.findMany({
      include: {
        _count: {
          select: { questions: true, attempts: true }
        }
      }
    });

    console.log(`\n📚 Total Grade Groups: ${gradeGroups.length}`);
    for (const gg of gradeGroups) {
      console.log(`- [${gg.slug}] ${gg.name}: ${gg._count.questions} Preguntas | ${gg._count.attempts} Intentos | Activo: ${gg.isActive ? 'SI' : 'NO'}`);
    }

    const totalQuestions = await prisma.question.count();
    const totalAttempts = await prisma.attempt.count();

    console.log(`\n❓ Total de Preguntas registradas: ${totalQuestions}`);
    console.log(`📝 Total de Intentos/Respuestas registradas: ${totalAttempts}`);

    if (totalQuestions === 0) {
      console.warn('\n⚠️ ATENCIÓN: No hay preguntas en la base de datos. Se sugiere ejecutar el seed si se requiere.');
    } else {
      console.log('\n✅ ¡La base de datos (Neon PostgreSQL) está en línea, funcionando y con datos cargados correctamente!');
    }
  } catch (err) {
    console.error('\n❌ ERROR AL CONECTAR CON LA BASE DE DATOS:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
