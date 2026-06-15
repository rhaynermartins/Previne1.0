import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.healthCheck.upsert({
    where: {
      id: "phase-2-seed",
    },
    update: {
      status: "ok",
      metadata: {
        phase: "2",
        source: "seed",
      },
      checkedAt: new Date(),
    },
    create: {
      id: "phase-2-seed",
      status: "ok",
      metadata: {
        phase: "2",
        source: "seed",
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
