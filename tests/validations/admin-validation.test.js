import { describe, it } from "@jest/globals";
import { validate } from "../../src/helpers/validations/validate.js";
import { blogValidation } from "../../src/helpers/validations/blog-validation.js";

describe("When creating Admin Validation", () => {
  it("should be able to pass validation", async () => {
    const data = {
      title: "title",
      description: "description",
    };

    validate(blogValidation, data);
  });
});
