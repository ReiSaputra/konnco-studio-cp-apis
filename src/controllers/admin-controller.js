import { PropertyError } from "../helpers/class/property-error.js";
import { authSchema } from "../helpers/validations/admin-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { loginAdminService } from "../services/admin-service.js";

const loginAdminController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new PropertyError("Email is required");
    if (!password) throw new PropertyError("Password is required");

    validate(authSchema, { email, password });

    const data = await loginAdminService(email, password);

    return res.status(200).json({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: data.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { loginAdminController };
