import { z } from "zod";

export const FormForgotPasswordSchema = z.object({
  email: z
    .string()
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid e-mail format")
    .min(1, { message: "Email must be filled" }),
});
