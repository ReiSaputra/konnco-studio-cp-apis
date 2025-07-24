import { getProductService } from "../services/product-service.js";

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
  } catch (error) {}
};

export { getProductController, getProductDetailController };
