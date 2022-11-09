import { z } from "zod";

const FormUpdateProfileSchema = z.object({
  firstName: z
    .string()
    .min(5, "First name must contain more than 5 characters"),
  lastName: z.string().min(5, "Last name must contain more than 5 characters"),
  description: z
    .string()
    .min(10, "Description must contain more than 10 characters")
    .max(500, "Description must not exceed more than 500 characters"),
  city: z.string().min(3, "Location must contain more than 3 characters"),
  profileTitle: z
    .string()
    .min(5, "Profile title must contain more than 5 characters"),
  profileSlugUrl: z
    .string()
    .min(5, "Profile url must contain more than 5 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Invalid url format, it can only contain special characters as hyphens ('-')",
    }),
});

export default FormUpdateProfileSchema;
