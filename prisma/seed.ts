import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const full_name = 'admin';
  const rawPassword = 'Admin12345';

  const exists = await prisma.users.findUnique({ where: { email } });
  if (exists) {
    console.log('Admin déjà existant:', email);
    return;
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  const admin = await prisma.users.create({
    data: {
      full_name,
      email,
      password: passwordHash,
      role: UserRole.admin,
      phone_number: '1234567890',

    },
  });

  console.log('Admin créé:', { id: admin.id, email: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


