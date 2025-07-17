import { prisma } from "../database.js";

const createBlogService = async (title, description, authorId) => {
  try {
    const descriptionThumbnail = description.length >= 100 ? description.substring(0, 97) + "..." : description;
    const slug = title.split(" ").join("-").toLowerCase();

    const createData = await prisma.blog.create({
      data: {
        title: title,
        description: description,
        descriptionThumbnail: descriptionThumbnail,
        slug: slug,
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return createData;
  } catch (error) {
    return next(error);
  }
};

export { createBlogService };
