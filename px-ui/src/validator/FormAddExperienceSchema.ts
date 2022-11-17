import { z } from "zod";

const FormAddExperienceSchema = z.object({
  id: z.string().nullable(),
  title: z.string().min(3, { message: "Title must be filled" }),
  description: z
    .string()
    .min(5, { message: "Description must have at least 5 characters" })
    .max(500, { message: "Description must have at most 500 characters" }),
  contractType: z.string().min(1, { message: "Contract type must be filled" }),
  organizationId: z.string().min(1, { message: "Organization must be filled" }),
  city: z.string().min(1, { message: "Location must be filled" }),
  startDate: z.date().min(new Date(1900, 1, 1)),
  endDate: z.date().nullable(),
  activitySectorId: z
    .string()
    .min(1, { message: "Activity sector must be filled" }),
  userProfileSlugUrl: z
    .string()
    .min(1, { message: "Profile slug must be filled" }),
});
//   .superRefine(({ newPassword, confirmPassword }, ctx) => {
//     if (confirmPassword !== newPassword) {
//       ctx.addIssue({
//         code: "custom",
//         message: "The passwords did not match",
//       });
//     }
//   });

export default FormAddExperienceSchema;
