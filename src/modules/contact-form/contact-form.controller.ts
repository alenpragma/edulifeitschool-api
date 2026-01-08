import * as contactFormService from "./contact-form.service";
import asyncWrapper from "../../utils/asyncWrapper";
import { successResponse } from "../../utils/response";

export const getPaginatedFormsController = asyncWrapper(async (req, res) => {
  const { data, meta } = await contactFormService.getPaginatedForms(req.query);

  return successResponse(res, {
    message: "Contact forms retrived successfully",
    data,
    meta,
  });
});
