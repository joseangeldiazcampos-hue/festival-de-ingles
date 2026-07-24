/**
 * Prisma seed file
 * Run with: npx prisma db seed
 * Pre-loads 3 grade groups for the English Festival quiz.
 * Questions will be added later by the admin.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gradeGroups = [
  {
    name: "7th & 8th Grade",
    slug: "7-8",
    grades: "7,8",
    levels: "A1,A2",
    emoji: "📚",
    description: "English Speed Challenge!",
    order: 1,
  },
  {
    name: "9th to 11th Grade",
    slug: "9-10-11",
    grades: "9,10,11",
    levels: "A2,B1",
    emoji: "🎯",
    description: "English Speed Challenge!",
    order: 2,
  },
  {
    name: "Challenge B2",
    slug: "challenge",
    grades: "all",
    levels: "B2",
    emoji: "🏆",
    description: "English Speed Challenge!",
    order: 3,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const group of gradeGroups) {
    const created = await prisma.gradeGroup.upsert({
      where: { slug: group.slug },
      update: group,
      create: group,
    });

    console.log(`✅ Created grade group: ${created.name} (${created.levels})`);
  }

  console.log("\n✅ Seeding complete!");
  console.log("📝 Grade groups are ready. Add questions via admin panel or update this seed file.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
