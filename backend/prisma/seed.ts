import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@tekna.com' },
    update: {},
    create: {
      email: 'admin@tekna.com',
      password,
    },
  });

  await prisma.task.deleteMany({
    where: { userId: user.id }
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Primeira tarefa',
        description: 'Criada via seed',
        dueDate: new Date(),
        completed: false,
        userId: user.id,
      },
      {
        title: 'Tarefa secundária',
        description: 'Exemplo de uso - via seed',
        dueDate: new Date(),
        completed: true,
        userId: user.id,
      },
    ],
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
