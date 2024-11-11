import { z } from "zod";

const FormSignupSchema = z
  .object({
    firstName: z
      .string()
      .regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/)
      .min(1, { message: "First name must be filled" }),
    lastName: z
      .string()
      .regex(/\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/)
      .min(1, { message: "Last name must be filled" }),
    email: z
      .string()
      .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid e-mail format")
      .min(1, { message: "Email must be filled" }),
    username: z.string().min(2, { message: "Username must be filled" }),
    password: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase character, one number and one special character",
      )
      .min(2, { message: "Password must be filled" }),
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase character, one number and one special character",
      )
      .min(2, { message: "Confirm password must be filled" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export default FormSignupSchema;
