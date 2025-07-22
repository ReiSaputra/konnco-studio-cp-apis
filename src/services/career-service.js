import { prisma } from "../database.js";

const createApplicationService = async (applicantName, email, phoneNumber, academic, companyName, position, lengthOfService, fileName, message, skills, careerId) => {
  const { educationLevel, instituteName } = academic;

  // console.info("coba industry");
  // console.info(industry);

  // console.info("coba academic");
  // console.info(academic);

  // console.info("coba skills");
  // console.info(skills);

  const skillEach = skills.map((skill) => skill.trim()).join(", ");

  // console.info("coba skillEach");
  // console.info(skillEach);

  const findCareer = await prisma.career.findUnique({
    where: {
      id: Number(careerId),
    },
  });

  // console.info("coba findCareer");
  // console.info(findCareer);

  if (!findCareer) throw new Error("Career not found");

  // console.info("coba findCareer");
  // console.info(findCareer);

  const createData = await prisma.application.create({
    data: {
      applicantName: applicantName,
      email: email,
      phoneNumber: phoneNumber,
      educationType: educationLevel,
      instituteName: instituteName,
      companyName: companyName,
      position: position,
      lengthOfService: lengthOfService,
      file: fileName,
      letter: message,
      skills: skillEach,
      careerId: Number(careerId),
    },
    select: {
      id: true,
    },
  });

  if (!createData) throw new Error("Failed to create application");

  return createData;
};

export { createApplicationService };
