import { z } from "zod";

const FormUpdateProfileSchema = z.object({
  firstName: z
    .string()
    .min(5, "First name must contain more than 5 characters")
    .max(100, "First name should not be longer than 100 characters"),
  lastName: z
    .string()
    .min(5, "Last name must contain more than 5 characters")
    .max(100, "Last name should not be longer than 100  characters"),
  description: z
    .string()
    .min(10, "Description must contain more than 10 characters")
    .max(1000, "Description must not exceed more than 1000 characters"),
  city: z.string().min(1, "Location must be filled"),
  profileTitle: z
    .string()
    .min(5, "Profile title must contain more than 5 characters")
    .max(100, "Profile title must contain more than 100 characters"),
  profileSlugUrl: z
    .string()
    .min(5, "Profile URL must contain more than 5 characters")
    .max(100, "Profile URL must contain more than 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Invalid url format, it can only contain special characters such as hyphens",
    }),
});

export default FormUpdateProfileSchema;
