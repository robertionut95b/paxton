import { z } from "zod";

const FormResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(2, { message: "Password must be filled" })
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase character, one number and one special character"
      ),
    confirmPassword: z
      .string()
      .min(2, { message: "Password must be filled" })
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        "Password must contain at least one uppercase character, one number and one special character"
      ),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export default FormResetPasswordSchema;
