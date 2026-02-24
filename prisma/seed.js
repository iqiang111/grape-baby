const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const baby = await prisma.baby.upsert({
    where: { id: "default-baby" },
    update: {
    },
    create: {
      id: "default-baby",
      name: "小葡萄",
      birthDate: new Date("2026-01-06"),
      gender: "女",
    },
  });
  console.log("Seeded baby:", baby.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
