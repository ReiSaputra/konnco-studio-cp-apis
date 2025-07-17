import { inquirySchema } from "../helpers/validations/inquiry-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { createInquiryService } from "../services/inquiry-service.js";

const createInquiryController = async (req, res, next) => {
  try {
    const { senderName, email, subject, message } = req.body;

    validate(inquirySchema, { senderName, email, subject, message });

    const data = await createInquiryService(senderName, email, subject, message);

    return res.status(200).json({
      message: "Successfully created inquiry",
      data: {
        id: data.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { createInquiryController };
