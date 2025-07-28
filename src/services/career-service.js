import { prisma } from "../database.js";

const getCareerService = async () => {
  const findDatas = await prisma.career.findMany({
    where: {
      isVisible: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      tags: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return findDatas;
};

const getCareerDetailService = async (careerId) => {
  const data = await prisma.career.findUnique({
    where: {
      id: parseInt(careerId),
    },
    select: {
      title: true,
      salary: true,
      description: true,
      requirements: true,
      linkedInInfo: true,
      jobStreetInfo: true,
      glintsInfo: true,
    },
  });

  if (!data) throw new Error("Career not found");

  return data;
};

const createApplicationService = async (applicantName, email, phoneNumber, academic, companyName, position, lengthOfService, fileName, message, skills, careerId) => {
  const { educationLevel, instituteName } = academic;

  const skillEach = skills.map((skill) => skill.trim()).join(", ");

  const findCareer = await prisma.career.findUnique({
    where: {
      id: Number(careerId),
    },
  });

  if (!findCareer) throw new Error("Career not found");

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

const getResponseApplicationService = async (careerId, applicationId) => {
  const findCareer = await prisma.application.findUnique({
    where: {
      id: applicationId,
      careerId: Number(careerId),
    },
    select: {
      applicantName: true,
    },
  });

  if (!findCareer) throw new Error("Application not found");

  return findCareer;
};

export { getCareerService, getCareerDetailService, createApplicationService, getResponseApplicationService };
