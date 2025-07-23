import { prisma } from "../database.js";

const getBlogService = async () => {
  const findDatas = await prisma.blog.findMany({
    where: {
      isVisible: true,
    },
    select: {
      title: true,
      content: true,
      photo: true,
      type: true,
      author: {
        select: { name: true },
      },
      slug: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return findDatas;
};

const getBlogDetailService = async (blogSlug) => {
  const findData = await prisma.blog.findUnique({
    where: { slug: blogSlug },
    select: {
      title: true,
      content: true,
      photo: true,
      type: true,
      author: {
        select: { name: true },
      },
      createdAt: true,
    },
  });

  return findData;
};

export { getBlogService, getBlogDetailService };
