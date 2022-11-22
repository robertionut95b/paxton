import { z } from "zod";

const FormAddStudySchema = z
  .object({
    id: z.string().nullable(),
    institution: z.string().min(1, { message: "Institution must be filled" }),
    domainStudy: z.string().nullable(),
    degree: z.string().optional(),
    certification: z.string().nullable(),
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
