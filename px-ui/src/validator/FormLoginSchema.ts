import { z } from "zod";

const FormLoginSchema = z.object({
  username: z.string().min(2, { message: "Username must be filled" }),
  password: z.string().min(2, { message: "Password must be filled" }),
});

export default FormLoginSchema;
