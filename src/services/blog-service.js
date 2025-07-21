import { prisma } from "../database.js";

const createBlogService = async (title, description, authorId, photoPath) => {
  const descriptionThumbnail =
    description.length >= 100 ? description.substring(0, 97) + "..." : description;

  const slug = title.split(" ").join("-").toLowerCase();

  const createData = await prisma.blog.create({
    data: {
      title,
      description,
      descriptionThumbnail,
      slug,
      authorId,
      photo: photoPath,
    },
    select: {
      id: true,
      title: true,
    },
  });

  return createData;
};

const getBlogService = async () => {
  const blogs = await prisma.blog.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return blogs;
};

const getBlogDetailService = async (blogId) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return blog;
};

export { createBlogService, getBlogService, getBlogDetailService };
