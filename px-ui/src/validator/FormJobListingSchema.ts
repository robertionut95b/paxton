import { ContractType } from "@gql/generated";
import { addDays } from "date-fns";
import { z } from "zod";

export const FormJobListingSchema = z
  .object({
    title: z.string().min(1, "Title must be filled"),
    description: z.string().min(1, "Description must be filled"),
    availableFrom: z.date().min(new Date()),
    availableTo: z.date().min(addDays(new Date(), 1)),
    location: z.string().min(1, "Location must be filled"),
    jobId: z.string().min(1, "Job must be filled"),
    numberOfVacancies: z
      .number()
      .min(1, "At least one vacancy spot is required"),
    contractType: z.nativeEnum(ContractType),
    organizationId: z.string().min(1, "Organization must be filled"),
    categoryId: z.string().min(1, "Category must be filled"),
  })
  .superRefine(({ availableFrom, availableTo }, ctx) => {
    if (availableTo && availableTo <= availableFrom) {
      ctx.addIssue({
        code: "invalid_date",
        message: "Ending date cannot be before starting date",
        path: ["availableTo"],
      });
    }
  });
