import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.career.createMany({
    data: [
      {
        title: 'Frontend Developer',
        description: 'Mengembangkan antarmuka pengguna berbasis React.',
        requirements: '• Pengalaman React\n• HTML/CSS/JS\n• Tailwind CSS',
        is_visible: true,
      },
      {
        title: 'Backend Engineer',
        description: 'Membangun RESTful API dengan Node.js dan Express.',
        requirements: '• Node.js\n• Express\n• Prisma ORM\n• MySQL',
        is_visible: true,
      },
      {
        title: 'UI/UX Designer',
        description: 'Mendesain pengalaman pengguna yang intuitif.',
        requirements: '• Figma\n• UX Research\n• Design System',
        is_visible: false,
      },
      {
        title: 'QA Tester',
        description: 'Melakukan pengujian manual dan otomatis.',
        requirements: '• Manual Testing\n• Automation Tools\n• Debugging Skill',
        is_visible: true,
      },
    ],
  });
  console.log('✅ Dummy careers inserted.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
