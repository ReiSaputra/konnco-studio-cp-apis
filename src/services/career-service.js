import { prisma } from "../database.js";

const createApplicationService = async (applicantName, email, phoneNumber, academic, industry, fileName, message, skillEach, careerId) => {
  const { educationLevel, instituteName } = academic;
  const { companyName, position, lengthOfService } = industry;

  const skills = skillEach.join(", ");

  const findCareer = await prisma.career.findUnique({
    where: {
      id: careerId,
    },
  });

  //   If not found return error

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
      skills: skills,
      careerId: careerId,
    },
  });

  return createData;
};

export { createApplicationService };
