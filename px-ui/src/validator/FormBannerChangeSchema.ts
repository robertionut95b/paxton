import { z } from "zod";

export const FormBannerChangeSchema = z.object({
  photography: z.object({}),
  profileSlugUrl: z
    .string()
    .min(1, { message: "Profile slug url cannot be empty" }),
});
