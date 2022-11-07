import { z } from "zod";

const FormUpdateProfileSchema = z.object({
  firstName: z
    .string()
    .min(5, "First name must contain more than 5 characters"),
  lastName: z.string().min(5, "Last name must contain more than 5 characters"),
  description: z
    .string()
    .min(10, "Description must contain more than 10 characters"),
  location: z.string().min(5, "Location must contain more than 5 characters"),
  profileTitle: z
    .string()
    .min(5, "Profile title must contain more than 5 characters"),
});

export default FormUpdateProfileSchema;
