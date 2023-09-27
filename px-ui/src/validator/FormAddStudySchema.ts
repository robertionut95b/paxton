import { StudyInputSchema } from "@gql/generated";
import { z } from "zod";

const FormAddStudySchema = StudyInputSchema()
  .extend({
    id: z.number().nullable(),
    institution: z.coerce
      .number()
      .min(1, { message: "Institution must be filled" }),
    domainStudy: z.coerce.number().nullable(),
    degree: z.string().optional(),
    certification: z.coerce.number().nullable(),
    description: z
      .string()
      .max(1000, {
        message: "Description cannot have more than 1000 characters",
      })
      .optional(),
    startDate: z.date().min(new Date(1900, 1, 1)),
    endDate: z.date().nullable(),
    userProfileSlugUrl: z
      .string()
      .min(1, { message: "Url profile slug must be filled" }),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (endDate && endDate <= startDate) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Ending date cannot be before starting date",
        path: ["endDate"],
      });
    }
  });

export default FormAddStudySchema;
