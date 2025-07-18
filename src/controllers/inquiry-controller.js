import { inquirySchema } from "../helpers/validations/inquiry-validation.js";
import { validate } from "../helpers/validations/validate.js";

import { createInquiryService } from "../services/inquiry-service.js";
import { getResponseInquiryService } from "../services/inquiry-service.js";

const createInquiryController = async (req, res, next) => {
  try {
    const { senderName, email, subject, message } = req.body;

    if (!senderName) throw new Error("Sender name is required");
    if (!email) throw new Error("Email is required");
    if (!subject) throw new Error("Subject is required");
    if (!message) throw new Error("Message is required");

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

const getResponseInquiryController = async (req, res, next) => {
  try {
    const { inquiryId } = req.params;

    if (!inquiryId) throw new Error("Inquiry id is required");

    const data = await getResponseInquiryService(inquiryId);

    if (!data) throw new Error("Inquiry not found");

    return res.status(200).json({
      message: "Successfully get response inquiry",
      data: {
        senderName: data.senderName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { createInquiryController, getResponseInquiryController };
