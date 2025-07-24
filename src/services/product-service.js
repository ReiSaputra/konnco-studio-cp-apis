import { prisma } from "../database.js";

const getProductService = async () => {
  const findData = await prisma..findMany({});
};

export { getProductService };
