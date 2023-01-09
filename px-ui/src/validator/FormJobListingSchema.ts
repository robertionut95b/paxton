import { JobListingInputSchema } from "@gql/generated";
import { addDays, startOfDay } from "date-fns";
import { z } from "zod";

export const FormJobListingSchema = JobListingInputSchema()
  .extend({
    availableFrom: z.date().min(new Date()),
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
