import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin";
  const hashedPassword = await bcrypt.hash(password, 5);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: hashedPassword,
      role: "ADMIN",
      name: "Admin",
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
