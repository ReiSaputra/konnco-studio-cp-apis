import { prisma } from "../../src/database.js";

const createJobApp = async () => {
  const admin = await prisma.admin.create({
    data: {
      email: "xl5d5@konnco.com",
      password: "dontknowityet",
      name: "Admin A",
      phoneNumber: "087823322523",
      role: "ADMIN",
      permissions: {
        create: {},
      },
    },
    select: {
      id: true,
    },
  });

  const careers = await prisma.career.createMany({
    data: [
      {
        title: "Software Developer (React)",
        description: "Description A",
        authorId: admin.id,
        requirements: "Requirement A, Requirement B, Requirement C",
        salary: "Rp. 1.000.000",
        tags: "Tag A, Tag B, Tag C",
        type: "WEB",
      },
      {
        title: "Software Developer (Vue)",
        description: "Description B",
        authorId: admin.id,
        requirements: "Requirement A, Requirement B, Requirement C",
        salary: "Rp. 2.000.000",
        tags: "Tag D, Tag E, Tag F",
        type: "WEB",
      },
      {
        title: "Software Developer (Angular)",
        description: "Description C",
        authorId: admin.id,
        requirements: "Requirement A, Requirement B, Requirement C",
        salary: "Rp. 3.000.000",
        tags: "Tag G, Tag H, Tag I",
        type: "WEB",
      },
    ],
  });

  const careersFind = await prisma.career.findMany({
    select: {
      id: true,
    },
  });

  console.info(careersFind);
  console.info(careersFind[0].id);

  await prisma.application.createMany({
    data: [
      {
        applicantName: "Fathurraihan Saputra",
        phoneNumber: "087843202123",
        email: "nemesis@konnco.com",
        educationType: "SMA",
        careerId: careersFind[0].id,
        instituteName: "SMAN 1 Cianjur",
        letter: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        skills: "HTML",
        file: "FORMULIR PERMOHONAN EMAIL.docx",
      },
      {
        applicantName: "Adit Simatupang",
        phoneNumber: "087843202123",
        email: "nemesis@konnco.com",
        educationType: "SMA",
        careerId: careersFind[0].id,
        instituteName: "SMAN 1 Cianjur",
        letter: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        skills: "HTML",
        file: "FORMULIR PERMOHONAN EMAIL.docx",
      },
      {
        applicantName: "Nidzhom Akmal",
        phoneNumber: "087843202123",
        email: "nemesis@konnco.com",
        educationType: "SMA",
        careerId: careersFind[1].id,
        instituteName: "SMAN 1 Cianjur",
        letter: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        skills: "HTML",
        file: "FORMULIR PERMOHONAN EMAIL.docx",
      },
      {
        applicantName: "Fuad Maulana",
        phoneNumber: "087843202123",
        email: "nemesis@konnco.com",
        educationType: "SMA",
        careerId: careersFind[0].id,
        instituteName: "SMAN 1 Cianjur",
        letter: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.",
        skills: "HTML",
        file: "FORMULIR PERMOHONAN EMAIL.docx",
      }
    ],
  });

  console.info(
    JSON.stringify(
      await prisma.career.findMany({
        where: {
          applications: {
            some: {
              applicantName: {
                contains: "ad",
              },
            },
          },
        },
        select: {
          title: true,
          applications: {
            select: {
              applicantName: true,
            },
          },
        },
      })
    )
  );
};

createJobApp();
