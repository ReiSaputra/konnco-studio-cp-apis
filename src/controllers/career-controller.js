import { FileUploadError } from "../helpers/class/file-upload-error.js";
import { PropertyError } from "../helpers/class/property-error.js";
import { applicationIdSchema, careerApplicationSchema, careerIdSchema } from "../helpers/validations/career-validation.js";
import { validate } from "../helpers/validations/validate.js";

import { createApplicationService, getResponseApplicationService } from "../services/career-service.js";

const createCareerApplicationController = async (req, res, next) => {
  try {
    let { applicantName, email, phoneNumber, educationLevel, instituteName, skills, companyName, position, lengthOfService, message } = req.body;
    const file = req.file;
    const { careerId } = req.params;

    if (!applicantName) throw new PropertyError("Applicant's Name is required");
    if (!email) throw new PropertyError("Email is required");
    if (!phoneNumber) throw new PropertyError("Phone Number is required");
    if (!educationLevel) throw new PropertyError("Education Level is required");
    if (!instituteName) throw new PropertyError("Institute Name is required");
    if (!skills) throw new PropertyError("Skills is required");
    if (!message) throw new PropertyError("Message is required");
    if (!file) throw new FileUploadError("Either File is required or File Mime Type is not PDF");

    const academic = {
      educationLevel: educationLevel,
      instituteName: instituteName,
    };

    let industry;

    if (companyName || position || lengthOfService) {
      industry = {
        companyName: companyName,
        position: position,
        lengthOfService: lengthOfService,
      };
    } else {
      industry = undefined;
    }

    const skillsConvert = Array.isArray(skills) ? req.body.skills : [skills];

    const fileName = file.filename;

    validate(careerApplicationSchema, { applicantName, email, phoneNumber, academic, industry, fileName, message, skillsConvert });
    validate(careerIdSchema, careerId);

    if (companyName === undefined) {
      companyName = null;
    }
    if (position === undefined) {
      position = null;
    }
    if (lengthOfService === undefined) {
      lengthOfService = null;
    }

    const data = await createApplicationService(applicantName, email, phoneNumber, academic, companyName, position, lengthOfService, fileName, message, skillsConvert, careerId);

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

const getResponseApplicationController = async (req, res, next) => {
  try {
    const { careerId, applicationId } = req.params;

    if (!careerId) throw new PropertyError("Career id is required");
    if (!applicationId) throw new PropertyError("Application id is required");

    validate(careerIdSchema, careerId);
    validate(applicationIdSchema, applicationId);

    const data = await getResponseApplicationService(careerId, applicationId);

    return res.status(200).json({
      message: "Successfully get response application",
      data: {
        applicantName: data.applicantName,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { createCareerApplicationController, getResponseApplicationController };
