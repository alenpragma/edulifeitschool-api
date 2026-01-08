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

export const updateFormNoteController = asyncWrapper(async (req, res) => {
  await contactFormService.updateFormNote(Number(req.params.id), req.body);

  return successResponse(res, { message: "Form note updated!" });
});
