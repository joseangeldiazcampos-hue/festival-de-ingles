/**
 * Prisma seed file
 * Run with: npx prisma db seed
 * Pre-loads grade groups, 7th & 8th Grade questions, and 9th to 11th Grade questions for the English Festival quiz.
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
    description: "English Communication Challenge!",
    order: 3,
  },
];

const questions7_8 = [
  {
    text: "You meet your friend before class. What do you say?",
    optionA: "Good morning!",
    optionB: "Good night!",
    optionC: "Goodbye!",
    correctOption: "A",
    level: "A1",
    type: "choice",
    order: 1,
  },
  {
    text: 'A new student says, "Hi! I\'m Diego." What do you say?',
    optionA: "Nice to meet you!",
    optionB: "See you tomorrow!",
    optionC: "You're welcome!",
    correctOption: "A",
    level: "A1",
    type: "choice",
    order: 2,
  },
  {
    text: "Complete the conversation.\n\nA: How are you today?\nB: ________",
    optionA: "I'm fine, thanks!",
    optionB: "My name is Laura.",
    optionC: "Good afternoon.",
    correctOption: "A",
    level: "A1",
    type: "choice",
    order: 3,
  },
  {
    text: 'Your teacher says, "Please open your book." What do you say?',
    optionA: "OK!",
    optionB: "Thank you very much.",
    optionC: "I'm twelve.",
    correctOption: "A",
    level: "A1",
    type: "choice",
    order: 4,
  },
  {
    text: "Complete the conversation.\n\nA: What's your favorite sport?\nB: ________",
    optionA: "I like soccer.",
    optionB: "At school.",
    optionC: "Every Monday.",
    correctOption: "A",
    level: "A1",
    type: "choice",
    order: 5,
  },
  {
    text: 'Your friend asks, "What time do you get up?"',
    optionA: "At 6:00 a.m.",
    optionB: "On Monday.",
    optionC: "In the classroom.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 6,
  },
  {
    text: "Complete the conversation.\n\nA: Would you like some juice?\nB: ________",
    optionA: "Yes, please.",
    optionB: "Good morning.",
    optionC: "I'm from Costa Rica.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 7,
  },
  {
    text: 'Your classmate says, "Thank you!"',
    optionA: "You're welcome!",
    optionB: "Excuse me.",
    optionC: "Good luck.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 8,
  },
  {
    text: "Complete the conversation.\n\nA: Where are you from?\nB: ________",
    optionA: "I'm from Costa Rica.",
    optionB: "I'm 15 years old.",
    optionC: "I like pizza.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 9,
  },
  {
    text: "You are leaving school. What do you say to your friends?",
    optionA: "See you tomorrow!",
    optionB: "Good morning!",
    optionC: "Nice to meet you!",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 10,
  },
  {
    text: "Final Challenge (Part 1): What's your favorite food? (Answer in a complete sentence, e.g. \"My favorite food is...\")",
    type: "open",
    level: "A2",
    isBonus: true,
    correctAnswer: "My favorite food is...",
    order: 11,
  },
  {
    text: "Final Challenge (Part 2): What's your favorite hobby? (Answer in a complete sentence, e.g. \"My favorite hobby is...\")",
    type: "open",
    level: "A2",
    isBonus: true,
    correctAnswer: "My favorite hobby is...",
    order: 12,
  },
];

const questions9_11 = [
  {
    text: "Emma: Hi! I'm Emma. It's my first day at this school.\nYou: ________",
    optionA: "Nice to meet you! I'm Daniel.",
    optionB: "See you yesterday.",
    optionC: "I don't like school.",
    optionD: "Thank you very much.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 1,
  },
  {
    text: "Your friend: Do you want to play soccer after school today?\nYou: ________",
    optionA: "Sure! What time should we meet?",
    optionB: "I play soccer yesterday.",
    optionC: "Because I like sports.",
    optionD: "At the supermarket.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 2,
  },
  {
    text: "Tourist: Excuse me, where's the bus stop?\nYou: ________",
    optionA: "It's next to the pharmacy.",
    optionB: "I go by bus every day.",
    optionC: "The bus is blue.",
    optionD: "Nice to meet you.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 3,
  },
  {
    text: "Friend: What do you usually do on weekends?\nYou: ________",
    optionA: "I usually watch movies and spend time with my family.",
    optionB: "Yesterday is Saturday.",
    optionC: "At my house.",
    optionD: "It's sunny.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 4,
  },
  {
    text: "Waiter: Are you ready to order?\nYou: ________",
    optionA: "Yes, I'd like a chicken sandwich, please.",
    optionB: "I eat lunch yesterday.",
    optionC: "You're welcome.",
    optionD: "Good afternoon.",
    correctOption: "A",
    level: "A2",
    type: "choice",
    order: 5,
  },
  {
    text: "Doctor: What's the matter?\nYou: ________",
    optionA: "I have a headache and a sore throat.",
    optionB: "I like hospitals.",
    optionC: "It's on Monday.",
    optionD: "Thank you.",
    correctOption: "A",
    level: "B1",
    type: "choice",
    order: 6,
  },
  {
    text: "Friend: What do you think about online classes?\nYou: ________",
    optionA: "I think they're useful because they're flexible.",
    optionB: "I go to school by bus.",
    optionC: "Last year.",
    optionD: "At home.",
    correctOption: "A",
    level: "B1",
    type: "choice",
    order: 7,
  },
  {
    text: "Teacher: Could you work with a partner for this activity?\nYou: ________",
    optionA: "Of course! Who should I work with?",
    optionB: "I finished yesterday.",
    optionC: "It's difficult because English.",
    optionD: "I'm fifteen.",
    correctOption: "A",
    level: "B1",
    type: "choice",
    order: 8,
  },
  {
    text: "Friend: I forgot my notebook. Can I borrow yours?\nYou: ________",
    optionA: "Sure! Just give it back after class.",
    optionB: "My notebook is blue.",
    optionC: "I forgot tomorrow.",
    optionD: "You're a notebook.",
    correctOption: "A",
    level: "B1",
    type: "choice",
    order: 9,
  },
  {
    text: "Friend: Thanks for helping me with my homework!\nYou: ________",
    optionA: "No problem! See you tomorrow.",
    optionB: "Good morning!",
    optionC: "I'm from Costa Rica.",
    optionD: "I like homework.",
    correctOption: "A",
    level: "B1",
    type: "choice",
    order: 10,
  },
  {
    text: "Bonus Challenge: Your classmate is new at school. Write ONE sentence to welcome them. (e.g. \"Welcome to our school! I hope you like it.\")",
    type: "open",
    level: "B1",
    isBonus: true,
    correctAnswer: "Welcome to our school! I hope you like it.",
    order: 11,
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

    if (group.slug === "7-8") {
      await prisma.question.deleteMany({ where: { gradeGroupId: created.id } });
      for (const q of questions7_8) {
        await prisma.question.create({
          data: {
            ...q,
            gradeGroupId: created.id,
          },
        });
      }
      console.log(`   📝 Added ${questions7_8.length} questions for 7th & 8th Grade!`);
    } else if (group.slug === "9-10-11") {
      await prisma.question.deleteMany({ where: { gradeGroupId: created.id } });
      for (const q of questions9_11) {
        await prisma.question.create({
          data: {
            ...q,
            gradeGroupId: created.id,
          },
        });
      }
      console.log(`   📝 Added ${questions9_11.length} questions for 9th to 11th Grade!`);
    }
  }

  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
