const createCareerController = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { careerId } = req.params;

    if (!title) throw new Error("Title is required");
    if (!description) throw new Error("Description is required");

    validate(careerSchema, { title, description });
  } catch (error) {
    next(error);
  }
};
