import { prisma } from "../database.js";

const getProductService = async () => {
  const findData = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      mainPhoto: true,
    },
    orderBy: {
      title: "desc",
    },
  });

  return findData;
};

const getProductDetailService = async (productId) => {
  const findData = await prisma.product.findMany({
    where: {
      id: parseInt(productId),
    },
    select: {
      title: true,
      description: true,
      mainPhoto: true,
      secondPhoto: true,
      thirdPhoto: true,
      mainFeature: true,
      advantage: true,
    },
  });

  return findData;
};

export { getProductService, getProductDetailService };
