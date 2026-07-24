/**
 * Prisma seed file
 * Run with: npx prisma db seed
 * Pre-loads grade groups and ALL questions (7-8, 9-11, Challenge B2) for the English Festival quiz.
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

const questionsChallengeB2 = [
  {
    text: "Friend: We've been studying all afternoon. What should we do now?",
    optionA: "Why don't we take a short break and grab a snack?",
    optionB: "We studied yesterday because exams.",
    optionC: "The library closes at six.",
    optionD: "I have many subjects.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 1,
  },
  {
    text: "Classmate: I thought we had to finish the project today.\n\nYou: ________",
    optionA: "Actually, the teacher extended the deadline until Friday.",
    optionB: "The project is difficult yesterday.",
    optionC: "I like working in groups.",
    optionD: "Friday is after Thursday.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 2,
  },
  {
    text: "Friend: Do you think social media has more advantages or disadvantages?",
    optionA: "I think it has both, but it depends on how people use it.",
    optionB: "Social media is on my phone.",
    optionC: "I downloaded an app yesterday.",
    optionD: "My favorite color is blue.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 3,
  },
  {
    text: "Your classmate looks stressed before a presentation.\n\nYou say:",
    optionA: "If you'd like, we can practice your presentation together.",
    optionB: "Presentations are difficult because English.",
    optionC: "I presented last month.",
    optionD: "Good luck yesterday.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 4,
  },
  {
    text: "Friend: I passed my driving test!",
    optionA: "That's fantastic! Congratulations! 🎉",
    optionB: "I drive every morning.",
    optionC: "My brother has a car.",
    optionD: "The driving test was yesterday.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 5,
  },
  {
    text: "Friend: I think homework should be banned.\n\nYou reply:",
    optionA: "I see your point, but I think some homework helps us learn.",
    optionB: "Homework is in my backpack.",
    optionC: "I always finish homework yesterday.",
    optionD: "Teachers give homework.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 6,
  },
  {
    text: "Teacher: Remember to include reliable sources in your report.\n\nYou aren't sure what \"reliable sources\" means.",
    optionA: "Could you explain what you mean by \"reliable sources\"?",
    optionB: "I finished the report yesterday.",
    optionC: "Sources are important because books.",
    optionD: "Thank you for the report.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 7,
  },
  {
    text: "Friend: What are you hoping to do after graduation?",
    optionA: "I'm considering studying environmental engineering because I enjoy science.",
    optionB: "I graduated next year.",
    optionC: "University is difficult yesterday.",
    optionD: "I like studying.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 8,
  },
  {
    text: "Friend: I didn't make the soccer team, and I'm really disappointed.",
    optionA: "I'm sorry to hear that. I'm sure another opportunity will come soon.",
    optionB: "Soccer has eleven players.",
    optionC: "I play soccer every weekend.",
    optionD: "The coach is at school.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 9,
  },
  {
    text: "Friend: Thanks for all your advice. It really helped.",
    optionA: "Anytime! Let me know how everything goes.",
    optionB: "Advice is important.",
    optionC: "You're helping yesterday.",
    optionD: "Goodbye because homework.",
    correctOption: "A",
    level: "B2",
    type: "choice",
    order: 10,
  },
  {
    text: "Bonus Challenge: Your friend is nervous about giving an English presentation tomorrow. Write 2–3 sentences encouraging them and giving one piece of advice. (e.g. \"You'll do great! Just speak slowly and take a deep breath...\")",
    type: "open",
    level: "B2",
    isBonus: true,
    correctAnswer: "You'll do great! Just speak slowly and take a deep breath...",
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
    } else if (group.slug === "challenge") {
      await prisma.question.deleteMany({ where: { gradeGroupId: created.id } });
      for (const q of questionsChallengeB2) {
        await prisma.question.create({
          data: {
            ...q,
            gradeGroupId: created.id,
          },
        });
      }
      console.log(`   📝 Added ${questionsChallengeB2.length} questions for Challenge B2!`);
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
