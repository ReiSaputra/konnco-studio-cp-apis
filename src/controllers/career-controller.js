import { careerApplicationSchema } from "../helpers/validations/career-validation.js";
import { validate } from "../helpers/validations/validate.js";

const createCareerApplicationController = async (req, res, next) => {
  try {
    const { applicantName, email, phoneNumber, educationLevel, instituteName, skills, companyName, position, lengthOfService, message } = req.body;
    const file = req.file;
    const { careerId } = req.params;

    if (!applicantName) throw new Error("Applicant's Name is required");
    if (!email) throw new Error("Email is required");
    if (!phoneNumber) throw new Error("Phone Number is required");
    if (!educationLevel) throw new Error("Education Level is required");
    if (!instituteName) throw new Error("Institute Name is required");
    if (!skills) throw new Error("Skills is required");
    if (!message) throw new Error("Message is required");
    if (!file) throw new Error("File is required");
    if (!careerId) throw new Error("Career id is required");

    const academic = {
      educationLevel: educationLevel,
      instituteName: instituteName,
    };

    let industry;

    if (companyName || position || lengthOfService) {
      industry = {
        companyName: companyName || undefined,
        position: position || undefined,
        lengthOfService: lengthOfService || undefined,
      };
    } else {
      industry = undefined;
    }

    validate(careerApplicationSchema, { applicantName, email, phoneNumber, academic, industry, file, message });

    // const data = await createApplicationService(applicantName, email, phoneNumber, academic, message);

    return res.status(200).json({
      message: "Successfully created career application",
      data: {
        id: data.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { createCareerApplicationController };
