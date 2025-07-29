import { productIdSchema } from "../helpers/validations/product-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { getProductDetailService, getProductService } from "../services/product-service.js";

const getProductController = async (req, res, next) => {
  try {
    const data = await getProductService();

    return res.status(200).json({
      message: "Successfully get products",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getProductDetailController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    validate(productIdSchema, productId);

    const data = await getProductDetailService(productId);

    return res.status(200).json({
      message: "Successfully get product detail",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export { getProductController, getProductDetailController };
