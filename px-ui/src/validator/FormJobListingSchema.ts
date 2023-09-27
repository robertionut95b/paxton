import { JobListingInputSchema } from "@gql/generated";
import { addDays, startOfDay } from "date-fns";
import { z } from "zod";

export const FormJobListingSchema = JobListingInputSchema()
  .extend({
    jobId: z.coerce.number().min(1),
    organizationId: z.coerce.number().min(1),
    recruiterId: z.coerce.number().min(1),
    availableFrom: z.date().min(startOfDay(new Date())),
    availableTo: z.date().min(addDays(new Date(), 1)),
  })
  .superRefine(({ availableFrom, availableTo }, ctx) => {
    if (availableTo && startOfDay(availableTo) <= startOfDay(availableFrom)) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Ending date cannot be before starting date",
        path: ["availableTo"],
      });
    }
  });
