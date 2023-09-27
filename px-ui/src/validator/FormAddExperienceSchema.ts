import { ExperienceInputSchema } from "@gql/generated";
import { z } from "zod";

const FormAddExperienceSchema = ExperienceInputSchema()
  .extend({
    id: z.coerce.number().nullable(),
    title: z
      .string()
      .min(3, { message: "Title must have at least 3 characters" })
      .max(100, { message: "Title must not have more than 100 characters" }),
    description: z
      .string()
      .min(5, { message: "Description must have at least 5 characters" })
      .max(1000, { message: "Description must have at most 1000 characters" }),
    contractType: z
      .string()
      .min(1, { message: "Contract type must be filled" }),
    organizationId: z.coerce
      .number()
      .min(1, { message: "Organization must be filled" }),
    city: z.string().min(1, { message: "Location must be filled" }),
    startDate: z.date().min(new Date(1900, 1, 1)),
    endDate: z.date().nullable(),
    activitySectorId: z.coerce
      .number()
      .min(1, { message: "Activity sector must be filled" }),
    userProfileSlugUrl: z
      .string()
      .min(1, { message: "Profile slug must be filled" }),
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

export default FormAddExperienceSchema;
