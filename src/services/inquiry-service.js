import { prisma } from "../database.js";

const createInquiryService = async (name, email, subject, message) => {
  const createData = await prisma.inquiry.create({
    data: {
      senderName: name,
      email: email,
      subject: subject,
      message: message,
    },
    select: {
      id: true,
    },
  });

  return createData;
};

const getResponseInquiryService = async (inquiryId) => {
  const findData = await prisma.inquiry.findUnique({
    where: {
      id: inquiryId,
    },
    select: {
      senderName: true,
    },
  });

  return findData;
};

export { createInquiryService, getResponseInquiryService };
